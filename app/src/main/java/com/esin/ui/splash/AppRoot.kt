package com.esin.ui.splash

import android.Manifest
import android.app.Activity
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.DialogProperties
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.esin.R
import com.esin.ui.home.HomeNavigation
import com.esin.ui.onboarding.OnboardingScreen
import com.esin.util.InstallState
import com.esin.util.PermissionHandler

@Composable
fun AppRoot(viewModel: AppViewModel = hiltViewModel()) {
    val context = LocalContext.current
    val gate by viewModel.gate.collectAsStateWithLifecycle()
    val checking by viewModel.checking.collectAsStateWithLifecycle()
    val update by viewModel.update.collectAsStateWithLifecycle()
    val installState by viewModel.installer.state.collectAsStateWithLifecycle()
    var permissionDenied by remember { mutableStateOf(false) }
    val installPermission = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) {
        if (viewModel.installer.canInstall()) { permissionDenied = false; viewModel.install() }
        else permissionDenied = true
    }
    val notificationPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { }

    when {
        checking || gate == null -> SplashScreen()
        update != null -> {
            SplashScreen()
            val decision = update!!
            AlertDialog(onDismissRequest = { if (!decision.required) viewModel.dismissOptionalUpdate() },
                properties = DialogProperties(dismissOnBackPress = !decision.required, dismissOnClickOutside = !decision.required),
                title = { Text(stringResource(if (decision.required) R.string.update_required else R.string.update_optional)) },
                text = { Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(stringResource(R.string.update_body, decision.manifest.latestVersionName))
                    if (decision.manifest.changelog.isNotBlank()) Text(decision.manifest.changelog)
                    when (val state = installState) {
                        is InstallState.Downloading -> {
                            Text(if (state.percent == null) stringResource(R.string.update_preparing) else stringResource(R.string.update_downloading, state.percent))
                            if (state.percent == null) LinearProgressIndicator() else LinearProgressIndicator(progress = { state.percent / 100f })
                        }
                        is InstallState.Error -> Text(stringResource(R.string.update_error), color = MaterialTheme.colorScheme.error)
                        else -> Unit
                    }
                    if (permissionDenied) Text(stringResource(R.string.permission_denied), color = MaterialTheme.colorScheme.error)
                } },
                confirmButton = { TextButton(enabled = installState !is InstallState.Downloading, onClick = {
                    if (viewModel.installer.canInstall()) viewModel.install()
                    else installPermission.launch(PermissionHandler.installSettings(context))
                }) { Text(stringResource(R.string.update)) } },
                dismissButton = { TextButton(onClick = {
                    if (decision.required) (context as? Activity)?.finishAndRemoveTask() else viewModel.dismissOptionalUpdate()
                }) { Text(stringResource(if (decision.required) R.string.exit else R.string.later)) } })
        }
        Build.VERSION.SDK_INT >= 33 && gate?.notificationExplained == false && !PermissionHandler.notificationsGranted(context) -> {
            SplashScreen()
            AlertDialog(onDismissRequest = { viewModel.explainedNotifications() },
                title = { Text(stringResource(R.string.notification_title)) },
                text = { Text(stringResource(R.string.notification_body)) },
                confirmButton = { TextButton(onClick = {
                    viewModel.explainedNotifications()
                    if (Build.VERSION.SDK_INT >= 33) notificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
                }) { Text(stringResource(R.string.continue_action)) } },
                dismissButton = { TextButton(onClick = viewModel::explainedNotifications) { Text(stringResource(R.string.later)) } })
        }
        gate?.onboardingCompleted == true -> HomeNavigation()
        else -> OnboardingScreen()
    }
}
@Composable private fun SplashScreen() {
    Column(Modifier.fillMaxSize(), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
        Image(painterResource(R.drawable.ic_wave), contentDescription = stringResource(R.string.app_name), modifier = Modifier.size(96.dp))
        Text(stringResource(R.string.app_name), style = MaterialTheme.typography.headlineMedium)
        Text(stringResource(R.string.slogan), style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(top = 8.dp, bottom = 28.dp))
        CircularProgressIndicator(modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
    }
}
