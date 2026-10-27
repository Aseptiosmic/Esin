package com.esin.data.repo

import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackDao
import com.esin.data.remote.AudiusRepository
import com.esin.player.DownloadManagerEsin
import com.esin.worker.SyncScheduler
import kotlinx.coroutines.sync.withLock
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TrackRepository @Inject constructor(
    val dao: TrackDao,
    val audius: AudiusRepository,
    private val settings: SettingsRepository,
    private val lock: ProfileLock,
    private val scheduler: SyncScheduler,
    private val downloads: DownloadManagerEsin,
) {
    val liked = dao.observeLiked()
    val downloaded = dao.observeDownloaded()
    val artists = dao.observeArtists()

    suspend fun saveSelections(ids: List<String>): Boolean = lock.mutex.withLock {
        // Mark first: after process death startup will always retry the latest Room state.
        settings.markPending()
        val saved = dao.replaceSelections(ids)
        if (saved) dao.liked().forEach { downloads.enqueue(it.audiusId, favouriteAutoDownload = true) }
        scheduler.schedule(5)
        saved
    }
    suspend fun toggleLike(id: String): Boolean = lock.mutex.withLock {
        settings.markPending()
        val changed = dao.toggleLike(id)
        scheduler.schedule(5)
        if (changed && dao.get(id)?.liked == true) downloads.enqueue(id, favouriteAutoDownload = true)
        changed
    }
    suspend fun setNickname(name: String) = lock.mutex.withLock {
        settings.markPending()
        settings.setNickname(name)
        scheduler.schedule(5)
    }
}
