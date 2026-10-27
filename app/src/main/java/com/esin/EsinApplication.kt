package com.esin

import android.app.Application
import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackDao
import com.esin.data.repo.TwinRepository
import com.esin.player.DownloadManagerEsin
import com.esin.util.NetworkMonitor
import com.esin.worker.SyncScheduler
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltAndroidApp
class EsinApplication : Application() {
    @Inject lateinit var settings: SettingsRepository
    @Inject lateinit var dao: TrackDao
    @Inject lateinit var twins: TwinRepository
    @Inject lateinit var downloads: DownloadManagerEsin
    @Inject lateinit var scheduler: SyncScheduler
    @Inject lateinit var network: NetworkMonitor
    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    override fun onCreate() {
        super.onCreate()
        appScope.launch {
            // No download may start until interrupted .part files have been removed.
            downloads.cleanParts()
            settings.ensureNickname()
            if (settings.current().pendingSync) scheduler.schedule()
            network.connection.collectLatest { connection ->
                if (connection.online) {
                    val prefs = settings.current()
                    if (prefs.pendingSync) scheduler.schedule()
                    // Also attempt initial anonymous sign-in when an offline install comes online.
                    appScope.launch { runCatching { twins.ensureSession() } }
                    if (prefs.autoDownload && (!prefs.wifiOnly || connection.wifi)) {
                        dao.liked().forEach { downloads.enqueue(it.audiusId, favouriteAutoDownload = true) }
                    }
                }
            }
        }
    }
}
