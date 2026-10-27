package com.esin.data.remote

import android.content.Context
import android.util.Log
import com.esin.R
import com.esin.data.local.TrackDao
import com.esin.data.local.TrackEntity
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.delay
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.booleanOrNull
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AudiusRepository @Inject constructor(
    private val api: AudiusApi,
    private val dao: TrackDao,
    @ApplicationContext private val context: Context,
) {
    private suspend fun <T> withRetry(block: suspend () -> T): T {
        for (attempt in 0..3) {
            try { return block() } catch (e: CancellationException) { throw e } catch (e: HttpException) {
                if ((e.code() != 429 && e.code() !in 500..599) || attempt == 3) throw e
                val wait = 2_000L shl attempt
                Log.w("Audius", "HTTP ${e.code()}; retry ${attempt + 1}/3 in ${wait}ms")
                delay(wait)
            }
        }
        throw IOException("Audius request failed")
    }
    private fun AudiusTrack.allowed(): Boolean {
        if (isStreamable == false || isStreamGated == true || hasStreamAccess == false) return false
        if (streamConditions != null && streamConditions !is JsonNull) return false
        val obj = runCatching { access?.jsonObject }.getOrNull()
        if (obj?.get("stream")?.let { runCatching { it.jsonPrimitive.booleanOrNull }.getOrNull() } == false) return false
        if (obj?.get("is_locked")?.let { runCatching { it.jsonPrimitive.booleanOrNull }.getOrNull() } == true) return false
        return true
    }
    private fun AudiusTrack.entity(): TrackEntity? {
        val safeId = id?.takeIf { it.matches(Regex("[A-Za-z0-9_-]{1,128}")) } ?: return null
        if (!allowed()) return null
        val image = listOf(artwork?.large, artwork?.medium, artwork?.small).firstOrNull { it?.toHttpUrlOrNull()?.isHttps == true }
        return TrackEntity(safeId, title?.takeIf { it.isNotBlank() } ?: context.getString(R.string.unknown_title),
            user?.name?.takeIf { it.isNotBlank() } ?: user?.handle?.takeIf { it.isNotBlank() } ?: context.getString(R.string.unknown_artist),
            user?.id?.takeIf { it.isNotBlank() }, image, genre?.takeIf { it.isNotBlank() }, duration, permalink)
    }
    private suspend fun cache(items: List<AudiusTrack>): List<TrackEntity> {
        val tracks = items.mapNotNull { it.entity() }.distinctBy { it.audiusId }
        dao.cache(tracks)
        return tracks.map { dao.get(it.audiusId) ?: it }
    }
    suspend fun trending(): List<TrackEntity> = cache(withRetry { api.trending().data.orEmpty() })
    suspend fun search(query: String): List<TrackEntity> = cache(withRetry { api.search(query).data.orEmpty() })
    suspend fun detail(id: String): TrackEntity? {
        dao.get(id)?.let { return it }
        val track = withRetry { api.track(id).data } ?: return null
        return cache(listOf(track)).firstOrNull()
    }
    suspend fun streamUrl(id: String): String {
        require(id.matches(Regex("[A-Za-z0-9_-]{1,128}")))
        val url = withRetry { api.stream(id).data }?.toHttpUrlOrNull()
        if (url == null || !url.isHttps) throw IOException("Invalid stream URL")
        return url.toString()
    }
}
