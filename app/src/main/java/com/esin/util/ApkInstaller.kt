package com.esin.util

import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.os.Environment
import androidx.core.content.FileProvider
import com.esin.R
import com.esin.data.local.SettingsRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import kotlinx.coroutines.sync.Mutex
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import java.io.File
import java.io.IOException
import java.security.MessageDigest
import javax.inject.Inject
import javax.inject.Singleton

sealed interface InstallState {
    data object Idle : InstallState
    data class Downloading(val percent: Int?) : InstallState
    data object Installing : InstallState
    data object Error : InstallState
}

@Singleton
class ApkInstaller @Inject constructor(@ApplicationContext private val context: Context, private val settings: SettingsRepository) {
    private val manager = context.getSystemService(DownloadManager::class.java)
    private val installMutex = Mutex()
    private val mutableState = MutableStateFlow<InstallState>(InstallState.Idle)
    val state = mutableState.asStateFlow()
    fun canInstall() = context.packageManager.canRequestPackageInstalls()
    private fun Cursor.long(column: String) = getLong(getColumnIndexOrThrow(column))
    suspend fun downloadAndInstall(manifest: VersionManifest) {
        if (!installMutex.tryLock()) return
        try { withContext(Dispatchers.IO) {
        var id = -1L
        var file: File? = null
        try {
            val url = manifest.apkUrl.toHttpUrlOrNull()
            require(url?.isHttps == true && url.host == "esin.vercel.app" && url.encodedPath == "/app-release.apk" && url.query == null)
            require(manifest.apkSha256.matches(Regex("[a-fA-F0-9]{64}")))
            if (!canInstall()) throw IOException("Install permission missing")
            val dir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: throw IOException("Downloads unavailable")
            val targetFile = File(dir, "esin-update.apk")
            file = targetFile
            val old = settings.current()
            if (old.updateDownloadId >= 0 && old.updateUrl == manifest.apkUrl && old.updateSha.equals(manifest.apkSha256, true)) {
                id = old.updateDownloadId
            } else {
                if (old.updateDownloadId >= 0) manager.remove(old.updateDownloadId)
                settings.clearUpdateDownload()
                if (targetFile.exists() && !targetFile.delete()) throw IOException("Cannot replace update")
                val request = DownloadManager.Request(Uri.parse(manifest.apkUrl))
                    .setTitle(context.getString(R.string.app_name))
                    .setDescription(context.getString(R.string.update_preparing))
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                    .setDestinationInExternalFilesDir(context, Environment.DIRECTORY_DOWNLOADS, "esin-update.apk")
                id = manager.enqueue(request)
                settings.setUpdateDownload(id, manifest.apkUrl, manifest.apkSha256)
            }
            mutableState.value = InstallState.Downloading(null)
            var finished = false
            while (!finished) {
                manager.query(DownloadManager.Query().setFilterById(id)).use { cursor ->
                    if (cursor == null || !cursor.moveToFirst()) throw IOException("Download not found")
                    when (cursor.long(DownloadManager.COLUMN_STATUS).toInt()) {
                        DownloadManager.STATUS_SUCCESSFUL -> finished = true
                        DownloadManager.STATUS_FAILED -> throw IOException("Download failed")
                        else -> {
                            val total = cursor.long(DownloadManager.COLUMN_TOTAL_SIZE_BYTES)
                            val current = cursor.long(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR)
                            mutableState.value = InstallState.Downloading(if (total > 0) ((current.coerceAtLeast(0) * 100 / total).toInt().coerceIn(0, 100)) else null)
                        }
                    }
                }
                if (!finished) delay(400)
            }
            val digest = MessageDigest.getInstance("SHA-256")
            targetFile.inputStream().buffered().use { input ->
                val buffer = ByteArray(64 * 1024)
                while (true) { val n = input.read(buffer); if (n < 0) break; digest.update(buffer, 0, n) }
            }
            val actual = digest.digest().joinToString("") { "%02x".format(it.toInt() and 0xff) }
            if (!MessageDigest.isEqual(actual.toByteArray(), manifest.apkSha256.lowercase().toByteArray())) throw IOException("SHA-256 mismatch")
            val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", targetFile)
            val intent = Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
            withContext(Dispatchers.Main) { context.startActivity(intent) }
            mutableState.value = InstallState.Installing
            // Keep the ID and verified file so a cancelled system installer can be reopened.
        } catch (e: CancellationException) { throw e }
        catch (_: Exception) {
            if (id >= 0) manager.remove(id)
            file?.delete()
            settings.clearUpdateDownload()
            mutableState.value = InstallState.Error
        }
        } } finally { installMutex.unlock() }
    }
}
