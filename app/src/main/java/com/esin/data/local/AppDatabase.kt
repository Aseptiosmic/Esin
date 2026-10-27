package com.esin.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [TrackEntity::class, LikedArtistEntity::class], version = 1, exportSchema = true)
abstract class AppDatabase : RoomDatabase() {
    abstract fun trackDao(): TrackDao
}
