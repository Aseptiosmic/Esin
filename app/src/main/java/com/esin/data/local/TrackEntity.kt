package com.esin.data.local

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tracks")
data class TrackEntity(
    @PrimaryKey @ColumnInfo(name = "audius_id") val audiusId: String,
    val title: String,
    @ColumnInfo(name = "artist_name") val artistName: String,
    @ColumnInfo(name = "artist_id") val artistId: String?,
    @ColumnInfo(name = "artwork_url") val artworkUrl: String?,
    val genre: String?,
    @ColumnInfo(name = "duration_sec") val durationSec: Int?,
    val permalink: String?,
    val liked: Boolean = false,
    @ColumnInfo(name = "liked_at") val likedAt: Long? = null,
    @ColumnInfo(name = "local_path") val localPath: String? = null,
    @ColumnInfo(name = "last_played_at") val lastPlayedAt: Long? = null,
)

@Entity(tableName = "liked_artists")
data class LikedArtistEntity(@PrimaryKey @ColumnInfo(name = "artist_id") val artistId: String, val name: String)
