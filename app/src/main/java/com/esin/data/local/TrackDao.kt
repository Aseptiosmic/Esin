package com.esin.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

@Dao
interface TrackDao {
    @Query("SELECT * FROM tracks WHERE liked = 1 ORDER BY liked_at DESC, title COLLATE NOCASE")
    fun observeLiked(): Flow<List<TrackEntity>>
    @Query("SELECT * FROM tracks WHERE local_path IS NOT NULL ORDER BY title COLLATE NOCASE")
    fun observeDownloaded(): Flow<List<TrackEntity>>
    @Query("SELECT * FROM liked_artists ORDER BY name COLLATE NOCASE")
    fun observeArtists(): Flow<List<LikedArtistEntity>>
    @Query("SELECT * FROM tracks WHERE liked = 1 ORDER BY liked_at DESC, title COLLATE NOCASE")
    suspend fun liked(): List<TrackEntity>
    @Query("SELECT * FROM tracks WHERE local_path IS NOT NULL")
    suspend fun downloaded(): List<TrackEntity>
    @Query("SELECT * FROM tracks WHERE audius_id = :id LIMIT 1")
    fun observeTrack(id: String): Flow<TrackEntity?>
    @Query("SELECT * FROM tracks WHERE audius_id = :id LIMIT 1")
    suspend fun get(id: String): TrackEntity?
    @Query("SELECT * FROM tracks WHERE audius_id IN (:ids)")
    suspend fun getMany(ids: List<String>): List<TrackEntity>
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun put(track: TrackEntity)
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun putArtists(artists: List<LikedArtistEntity>)
    @Query("DELETE FROM liked_artists") suspend fun clearArtists()
    @Query("UPDATE tracks SET liked = 0, liked_at = NULL WHERE liked = 1") suspend fun clearLikes()
    @Query("UPDATE tracks SET liked = :liked, liked_at = :at WHERE audius_id = :id")
    suspend fun setLiked(id: String, liked: Boolean, at: Long?)
    @Query("UPDATE tracks SET local_path = :path WHERE audius_id = :id")
    suspend fun setLocalPath(id: String, path: String?)
    @Query("UPDATE tracks SET last_played_at = :at WHERE audius_id = :id")
    suspend fun setLastPlayed(id: String, at: Long)

    // Remote metadata never overwrites likes, files, or playback history.
    @Transaction
    suspend fun cache(tracks: List<TrackEntity>) {
        tracks.forEach { incoming ->
            val old = get(incoming.audiusId)
            put(if (old == null) incoming else incoming.copy(
                liked = old.liked, likedAt = old.likedAt, localPath = old.localPath,
                lastPlayedAt = old.lastPlayedAt,
            ))
        }
    }

    @Transaction
    suspend fun replaceSelections(ids: List<String>): Boolean {
        val unique = ids.distinct()
        if (unique.size !in 10..200) return false
        val existing = getMany(unique)
        if (existing.size != unique.size) return false
        clearLikes()
        val now = System.currentTimeMillis()
        unique.forEachIndexed { index, id -> setLiked(id, true, now - index) }
        rebuildArtists()
        return true
    }

    // Returns false if this would violate the ten-song invariant or the profile cap.
    @Transaction
    suspend fun toggleLike(id: String): Boolean {
        val track = get(id) ?: return false
        val count = liked().size
        if ((track.liked && count <= 10) || (!track.liked && count >= 200)) return false
        setLiked(id, !track.liked, if (track.liked) null else System.currentTimeMillis())
        rebuildArtists()
        return true
    }

    @Transaction
    suspend fun rebuildArtists() {
        val artists = liked().mapNotNull { track ->
            track.artistId?.takeIf { it.isNotBlank() }?.let { LikedArtistEntity(it, track.artistName) }
        }.distinctBy { it.artistId }
        clearArtists()
        if (artists.isNotEmpty()) putArtists(artists)
    }
}
