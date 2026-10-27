package com.esin.util

import android.content.Context
import android.os.Build
import com.esin.data.local.SettingsRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class VersionManifest(
    @SerialName("latest_version_code") val latestVersionCode: Long,
    @SerialName("latest_version_name") val latestVersionName: String,
    @SerialName("min_version_code") val minVersionCode: Long,
    @SerialName("force_update") val forceUpdate: Boolean,
    @SerialName("apk_url") val apkUrl: String,
    @SerialName("apk_sha256") val apkSha256: String,
    val changelog: String = "",
)
data class UpdateDecision(val manifest: VersionManifest, val required: Boolean)

@Singleton
class VersionChecker @Inject constructor(
    @ApplicationContext private val context: Context,
    private val settings: SettingsRepository,
    http: OkHttpClient,
    private val json: Json,
) {
    private val client = http.newBuilder().callTimeout(5, TimeUnit.SECONDS).build()
    private fun parse(raw: String?): VersionManifest? = try {
        val v = json.decodeFromString<VersionManifest>(raw ?: "")
        val url = v.apkUrl.toHttpUrlOrNull()
        v.takeIf { raw != null && raw.length <= 65_536 && it.latestVersionCode > 0 && it.minVersionCode > 0 &&
            it.latestVersionCode >= it.minVersionCode && it.latestVersionName.isNotBlank() &&
            url?.isHttps == true && url.host == "esin.vercel.app" && url.encodedPath == "/app-release.apk" &&
            url.query == null && url.fragment == null }
    } catch (_: Exception) { null }
    @Suppress("DEPRECATION")
    fun currentVersionCode(): Long {
        val info = context.packageManager.getPackageInfo(context.packageName, 0)
        return if (Build.VERSION.SDK_INT >= 28) info.longVersionCode else info.versionCode.toLong()
    }
    suspend fun check(): UpdateDecision? = withContext(Dispatchers.IO) {
        val cached = settings.current().lastVersionJson
        val fetched = try {
            val request = Request.Builder().url("https://esin.vercel.app/version.json").header("Cache-Control", "no-cache").build()
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) null else response.body?.string()?.takeIf { parse(it) != null }
            }
        } catch (_: Exception) { null }
        if (fetched != null) settings.setVersion(fetched)
        val manifest = parse(fetched ?: cached) ?: return@withContext null
        val current = currentVersionCode()
        val required = UpdatePolicy.required(current, manifest.minVersionCode, manifest.latestVersionCode, manifest.forceUpdate)
        if (required || UpdatePolicy.available(current, manifest.latestVersionCode)) UpdateDecision(manifest, required) else null
    }
}
