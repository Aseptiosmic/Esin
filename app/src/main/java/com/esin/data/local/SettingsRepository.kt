package com.esin.data.local

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.esin.R
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.esinDataStore by preferencesDataStore(name = "esin_settings")
data class AppSettings(
    val onboardingCompleted: Boolean = false,
    val pendingSync: Boolean = false,
    val syncRevision: Long = 0,
    val lastVersionJson: String? = null,
    val nickname: String = "",
    val autoDownload: Boolean = true,
    val wifiOnly: Boolean = false,
    val notificationExplained: Boolean = false,
    val updateDownloadId: Long = -1,
    val updateUrl: String = "",
    val updateSha: String = "",
)

@Singleton
class SettingsRepository @Inject constructor(@ApplicationContext private val context: Context) {
    private object Keys {
        val completed = booleanPreferencesKey("onboarding_completed")
        val pending = booleanPreferencesKey("pending_sync")
        val revision = longPreferencesKey("sync_revision")
        val version = stringPreferencesKey("last_version_json")
        val nickname = stringPreferencesKey("nickname")
        val auto = booleanPreferencesKey("auto_download")
        val wifi = booleanPreferencesKey("wifi_only")
        val notification = booleanPreferencesKey("notification_explained")
        val updateId = longPreferencesKey("update_download_id")
        val updateUrl = stringPreferencesKey("update_url")
        val updateSha = stringPreferencesKey("update_sha256")
    }
    val settings: Flow<AppSettings> = context.esinDataStore.data.map { p ->
        AppSettings(p[Keys.completed] ?: false, p[Keys.pending] ?: false, p[Keys.revision] ?: 0,
            p[Keys.version], p[Keys.nickname] ?: "", p[Keys.auto] ?: true, p[Keys.wifi] ?: false,
            p[Keys.notification] ?: false, p[Keys.updateId] ?: -1, p[Keys.updateUrl] ?: "", p[Keys.updateSha] ?: "")
    }
    suspend fun current() = settings.first()
    suspend fun setCompleted(value: Boolean) { context.esinDataStore.edit { it[Keys.completed] = value } }
    suspend fun setVersion(json: String) { context.esinDataStore.edit { it[Keys.version] = json } }
    suspend fun setAutoDownload(value: Boolean) { context.esinDataStore.edit { it[Keys.auto] = value } }
    suspend fun setWifiOnly(value: Boolean) { context.esinDataStore.edit { it[Keys.wifi] = value } }
    suspend fun setUpdateDownload(id: Long, url: String, sha: String) { context.esinDataStore.edit {
        it[Keys.updateId] = id; it[Keys.updateUrl] = url; it[Keys.updateSha] = sha
    } }
    suspend fun clearUpdateDownload() { context.esinDataStore.edit {
        it.remove(Keys.updateId); it.remove(Keys.updateUrl); it.remove(Keys.updateSha)
    } }
    suspend fun setNotificationExplained() { context.esinDataStore.edit { it[Keys.notification] = true } }
    suspend fun setNickname(value: String) { context.esinDataStore.edit { it[Keys.nickname] = value } }
    suspend fun ensureNickname(): String {
        context.esinDataStore.edit {
            if (it[Keys.nickname].isNullOrBlank()) it[Keys.nickname] = "${context.getString(R.string.nickname_prefix)} ${kotlin.random.Random.nextInt(1000, 10000)}"
        }
        return current().nickname
    }
    suspend fun markPending() { context.esinDataStore.edit {
        it[Keys.pending] = true
        it[Keys.revision] = (it[Keys.revision] ?: 0) + 1
    } }
    suspend fun clearPendingIfRevision(revision: Long) { context.esinDataStore.edit {
        if ((it[Keys.revision] ?: 0) == revision) it[Keys.pending] = false
    } }
}
