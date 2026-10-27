package com.esin.ui.library

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.esin.R
import com.esin.ui.home.HomeViewModel
import com.esin.ui.theme.Muted

@Composable fun SettingsScreen(onBack: () -> Unit, onEdit: () -> Unit, viewModel: HomeViewModel = hiltViewModel()) {
    val settings by viewModel.settings.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var name by rememberSaveable { mutableStateOf("") }
    var initialLoaded by rememberSaveable { mutableStateOf(false) }
    var confirmClear by remember { mutableStateOf(false) }
    LaunchedEffect(settings.nickname) { if (!initialLoaded && settings.nickname.isNotBlank()) { name = settings.nickname; initialLoaded = true } }
    val version = remember { runCatching { context.packageManager.getPackageInfo(context.packageName, 0).versionName }.getOrNull().orEmpty() }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp)) {
        Row(Modifier.fillMaxWidth().padding(top = 16.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.back)) }
            Text(stringResource(R.string.settings), style = MaterialTheme.typography.headlineMedium, modifier = Modifier.padding(start = 4.dp))
        }
        OutlinedTextField(value = name, onValueChange = { if (it.length <= 40) name = it }, singleLine = true,
            label = { Text(stringResource(R.string.nickname)) }, isError = name.isBlank(), modifier = Modifier.fillMaxWidth().padding(top = 24.dp))
        if (name.isBlank()) Text(stringResource(R.string.nickname_invalid), color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        Button(onClick = { viewModel.setNickname(name.trim()) }, enabled = name.isNotBlank() && name.trim() != settings.nickname,
            modifier = Modifier.padding(top = 12.dp)) { Text(stringResource(R.string.save)) }
        HorizontalDivider(Modifier.padding(vertical = 20.dp))
        SettingsLink(stringResource(R.string.edit_selections), onEdit)
        val autoLabel = stringResource(R.string.auto_download)
        Row(Modifier.fillMaxWidth().padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(autoLabel, Modifier.weight(1f)); Switch(checked = settings.autoDownload, onCheckedChange = viewModel::setAuto,
                modifier = Modifier.semantics { contentDescription = autoLabel })
        }
        val wifiLabel = stringResource(R.string.wifi_only)
        Row(Modifier.fillMaxWidth().padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(wifiLabel, Modifier.weight(1f)); Switch(checked = settings.wifiOnly, onCheckedChange = viewModel::setWifi,
                enabled = settings.autoDownload, modifier = Modifier.semantics { contentDescription = wifiLabel })
        }
        SettingsLink(stringResource(R.string.clear_downloads)) { confirmClear = true }
        HorizontalDivider(Modifier.padding(vertical = 20.dp))
        Text(stringResource(R.string.about), style = MaterialTheme.typography.titleMedium)
        Text(stringResource(R.string.powered_by_audius), color = Muted, modifier = Modifier.padding(top = 16.dp))
        Text(stringResource(R.string.version, version), color = Muted, modifier = Modifier.padding(vertical = 12.dp))
    }
    if (confirmClear) ConfirmDelete(onCancel = { confirmClear = false }, onConfirm = { viewModel.deleteAll(); confirmClear = false })
}
@Composable private fun SettingsLink(title: String, onClick: () -> Unit) {
    Text(title, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 16.dp))
}
