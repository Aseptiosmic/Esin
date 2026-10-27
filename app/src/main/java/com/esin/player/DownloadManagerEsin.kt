package com.esin.player

import android.content.Context
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import com.esin.R
import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackDao
import com.esin.data.remote.AudiusRepository
import com.esin.util.NetworkMonitor
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.IOException
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.coroutineContext

@Singleton
class DownloadManagerEsin @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dao: TrackDao,
    private val audius: AudiusRepository,
    private val settings: SettingsRepository,
    private val network: NetworkMonitor,
    private val http: OkHttpClient,
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val permits = Semaphore(2)
    private val startupCleanupDone = CompletableDeferred<Unit>()
    private val jobs = ConcurrentHashMap<String, Job>()
    private val downloading = MutableStateFlow<Set<String>>(emptySet())
    val active = downloading.asStateFlow()
    private val stateLock = Any()
    private class WifiOnlyException : Exception()
    private fun updateActive(id: String, add: Boolean) { synchronized(stateLock) {
        downloading.value = if (add) downloading.value + id else downloading.value - id
    } }
    private fun valid(id: String) = id.matches(Regex("[A-Za-z0-9_-]{1,128}"))
    private fun directory(): File = File(context.getExternalFilesDir(Environment.DIRECTORY_MUSIC)
        ?: throw IOException("External files directory unavailable"), "esin").apply {
        if (!exists() && !mkdirs()) throw IOException("Cannot create music directory")
    }
    suspend fun cleanParts() = withContext(Dispatchers.IO) {
        runCatching { directory().listFiles()?.filter { it.name.endsWith(".part") }?.forEach { it.delete() } }
        startupCleanupDone.complete(Unit)
        Unit
    }
    // Playback caching is independent of the favourite-only Wi-Fi setting.
    fun enqueue(id: String, resolvedUrl: String? = null, favouriteAutoDownload: Boolean = false) {
        if (!valid(id)) return
        synchronized(jobs) {
            if (jobs[id]?.isActive == true) return
            val job = scope.launch(start = CoroutineStart.LAZY) {
                try {
                    startupCleanupDone.await()
                    if (favouriteAutoDownload) {
                        val prefs = settings.current()
                        if (!prefs.autoDownload || (prefs.wifiOnly && !network.isWifi())) return@launch
                    }
                    permits.withPermit {
                        if (favouriteAutoDownload) {
                            val prefs = settings.current()
                            if (!prefs.autoDownload || (prefs.wifiOnly && !network.isWifi())) return@withPermit
                        }
                        if (dao.get(id)?.localPath?.let { File(it).isFile } == true) return@withPermit
                        updateActive(id, true)
                        download(id, resolvedUrl ?: audius.streamUrl(id), favouriteAutoDownload)
                    }
                } catch (e: CancellationException) { throw e }
                catch (_: WifiOnlyException) { /* Resume on the next Wi-Fi transition. */ }
                catch (e: IOException) {
                    Log.w("EsinDownload", "Download failed for $id", e)
                    Handler(Looper.getMainLooper()).post { Toast.makeText(context, R.string.storage_full, Toast.LENGTH_SHORT).show() }
                } catch (e: Exception) { Log.w("EsinDownload", "Download failed for $id", e) }
                finally {
                    updateActive(id, false)
                    val currentJob = coroutineContext[Job]
                    synchronized(jobs) { if (jobs[id] === currentJob) jobs.remove(id) }
                }
            }
            jobs[id] = job
            job.start()
        }
    }
    private suspend fun download(id: String, url: String, favouriteAutoDownload: Boolean) {
        val dir = directory()
        val part = File(dir, "$id.mp3.part")
        val complete = File(dir, "$id.mp3")
        try {
            http.newCall(Request.Builder().url(url).build()).execute().use { response ->
                if (!response.isSuccessful) throw IOException("HTTP ${response.code}")
                val body = response.body ?: throw IOException("Empty response")
                val expected = body.contentLength()
                var total = 0L
                var nextPolicyCheck = 0L
                body.byteStream().use { input ->
                    part.outputStream().buffered().use { output ->
                        val buffer = ByteArray(64 * 1024)
                        while (true) {
                            coroutineContext.ensureActive()
                            if (favouriteAutoDownload && total >= nextPolicyCheck) {
                                val prefs = settings.current()
                                if (prefs.wifiOnly && !network.isWifi()) throw WifiOnlyException()
                                nextPolicyCheck = total + 512 * 1024
                            }
                            val count = input.read(buffer)
                            if (count == -1) break
                            output.write(buffer, 0, count)
                            total += count
                        }
                    }
                }
                if (total == 0L || (expected >= 0 && total != expected)) throw IOException("Incomplete download")
                coroutineContext.ensureActive()
                if (complete.exists() && !complete.delete()) throw IOException("Cannot replace old file")
                if (!part.renameTo(complete)) throw IOException("Cannot finish download")
                dao.setLocalPath(id, complete.absolutePath)
            }
        } catch (e: Exception) {
            part.delete()
            throw e
        }
    }
    suspend fun delete(id: String) = withContext(Dispatchers.IO) {
        val job = synchronized(jobs) { jobs.remove(id) }
        job?.cancelAndJoin()
        // Never delete an arbitrary path even if a database is corrupted.
        val dir = runCatching { directory() }.getOrNull()
        if (valid(id) && dir != null) {
            File(dir, "$id.mp3").delete()
            File(dir, "$id.mp3.part").delete()
        }
        dao.setLocalPath(id, null)
    }
    suspend fun deleteAll() {
        val ids = (dao.downloaded().map { it.audiusId } + jobs.keys).distinct()
        ids.forEach { delete(it) }
    }
}
