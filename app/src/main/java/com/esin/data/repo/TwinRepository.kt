package com.esin.data.repo

import android.util.Log
import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackDao
import com.esin.data.local.TrackEntity
import com.esin.data.remote.AudiusRepository
import com.esin.data.remote.SupabaseClientProvider
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.status.SessionStatus
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.rpc
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withTimeout
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.intOrNull
import kotlinx.serialization.json.jsonPrimitive
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Serializable private data class Profile(
    val id: String, val nickname: String,
    @SerialName("track_ids") val trackIds: List<String>,
    @SerialName("artist_ids") val artistIds: List<String>,
    @SerialName("genre_counts") val genreCounts: Map<String, Int>,
)
@Serializable private data class TwinArguments(
    @SerialName("my_tracks") val tracks: List<String>,
    @SerialName("my_artists") val artists: List<String>, val lim: Int = 5,
)
@Serializable private data class TwinRow(
    val nickname: String,
    @SerialName("common_tracks") val commonTracks: List<String> = emptyList(),
    @SerialName("common_artist_count") val commonArtistCount: Int = 0,
    @SerialName("genre_counts") val genreCounts: JsonObject = JsonObject(emptyMap()),
    val score: Int = 0,
)
data class TwinMatch(val nickname: String, val percent: Int, val genreFallback: Boolean,
    val commonTracks: List<TrackEntity>, val commonTrackIds: List<String>)

@Singleton
class TwinRepository @Inject constructor(
    private val provider: SupabaseClientProvider,
    private val settings: SettingsRepository,
    private val dao: TrackDao,
    private val audius: AudiusRepository,
    private val profileLock: ProfileLock,
) {
    private val authMutex = Mutex()
    private fun genres(tracks: List<TrackEntity>) = tracks.mapNotNull { it.genre?.trim()?.takeIf(String::isNotEmpty) }
        .groupingBy { it }.eachCount()
    private fun artists(tracks: List<TrackEntity>) = tracks.mapNotNull { it.artistId?.takeIf(String::isNotBlank) }.distinct().take(200)
    suspend fun ensureSession(): String = authMutex.withLock {
        val client = provider.client ?: throw IOException("Supabase is not configured")
        client.auth.awaitInitialization()
        when (client.auth.sessionStatus.value) {
            is SessionStatus.NotAuthenticated -> client.auth.signInAnonymously()
            is SessionStatus.RefreshFailure -> throw IOException("Session refresh will retry")
            else -> Unit
        }
        client.auth.currentUserOrNull()?.id ?: throw IOException("Session unavailable")
    }
    // A shared lock prevents local edits from racing a successful remote upsert.
    suspend fun syncPending(): Boolean = profileLock.mutex.withLock {
        val state = settings.current()
        if (!state.pendingSync) return@withLock true
        try {
            withTimeout(12_000) {
                val userId = ensureSession()
                val tracks = dao.liked().take(200)
                val name = settings.ensureNickname()
                val profile = Profile(userId, name, tracks.map { it.audiusId }, artists(tracks), genres(tracks))
                (provider.client ?: throw IOException("Supabase unavailable")).from("profiles").upsert(profile)
                settings.clearPendingIfRevision(state.syncRevision)
            }
            true
        } catch (e: CancellationException) {
            // Timeout is a retryable failure; other cancellation must propagate.
            if (e is kotlinx.coroutines.TimeoutCancellationException) false else throw e
        } catch (e: Exception) {
            Log.w("EsinSync", "Profile synchronization deferred: ${e.javaClass.simpleName}")
            false
        }
    }
    suspend fun findTwins(): List<TwinMatch> {
        if (settings.current().pendingSync && !syncPending()) throw IOException("Profile sync pending")
        ensureSession()
        val tracks = dao.liked().take(200)
        val artistIds = artists(tracks)
        val client = provider.client ?: throw IOException("Supabase unavailable")
        val rows = client.postgrest.rpc("find_twins", TwinArguments(tracks.map { it.audiusId }, artistIds)).decodeList<TwinRow>()
        val fallback = rows.isNotEmpty() && rows.all { it.score <= 0 }
        val mine = genres(tracks)
        fun counts(row: TwinRow): Map<String, Int> = row.genreCounts.mapNotNull { (k, v) ->
            val n = runCatching { v.jsonPrimitive.intOrNull }.getOrNull()
            if (n != null && n > 0) k to n.coerceAtMost(200) else null
        }.toMap()
        val corpus = listOf(mine) + rows.map(::counts)
        return coroutineScope {
            rows.map { row -> async {
                val percent = if (fallback) Similarity.genrePercent(mine, counts(row), corpus)
                    else Similarity.scorePercent(row.score, tracks.size, artistIds.size)
                val ids = row.commonTracks.filter { it.matches(Regex("[A-Za-z0-9_-]{1,128}")) }.distinct()
                // Cards show at most two names. Resolve the rest only when opened.
                val resolved = resolveSharedTracks(ids.take(2), requireAny = false)
                TwinMatch(row.nickname, percent, fallback, resolved, ids)
            } }.awaitAll().sortedByDescending { it.percent }
        }
    }
    suspend fun resolveSharedTracks(ids: List<String>, requireAny: Boolean = true): List<TrackEntity> = coroutineScope {
        val permits = Semaphore(4)
        val result = ids.distinct().take(200).map { id -> async {
            permits.withPermit {
                try { audius.detail(id) } catch (e: CancellationException) { throw e } catch (_: Exception) { null }
            }
        } }.awaitAll().filterNotNull()
        if (requireAny && ids.isNotEmpty() && result.isEmpty()) throw IOException("Common tracks unavailable")
        result
    }

}
