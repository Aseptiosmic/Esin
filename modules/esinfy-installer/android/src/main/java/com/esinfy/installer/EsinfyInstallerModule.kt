package com.esinfy.installer

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class EsinfyInstallerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EsinfyInstaller")

    Function("getVersionCode") {
      val context = requireNotNull(appContext.reactContext)
      val info = context.packageManager.getPackageInfo(context.packageName, 0)
      if (Build.VERSION.SDK_INT >= 28) info.longVersionCode else info.versionCode.toLong()
    }

    Function("canRequestPackageInstalls") {
      val context = appContext.reactContext
      context != null && (Build.VERSION.SDK_INT < 26 || context.packageManager.canRequestPackageInstalls())
    }

    Function("openUnknownSourcesSettings") {
      val context = requireNotNull(appContext.currentActivity)
      val intent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:${context.packageName}"))
      context.startActivity(intent)
    }

    Function("installApk") { path: String ->
      val context = requireNotNull(appContext.currentActivity)
      val file = File(path)
      require(file.exists()) { "APK file not found" }
      val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
      val intent = Intent(Intent.ACTION_VIEW)
        .setDataAndType(uri, "application/vnd.android.package-archive")
        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
    }
  }
}
