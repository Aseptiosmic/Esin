package com.esin.ui.library

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.esin.R
import com.esin.ui.components.EmptyState
import com.esin.ui.components.TrackRow
import com.esin.ui.home.HomeViewModel
import com.esin.ui.theme.Muted
import java.io.File

@Composable
fun LibraryScreen(viewModel: HomeViewModel, onSettings: () -> Unit, modifier: Modifier = Modifier) {
    val liked by viewModel.liked.collectAsStateWithLifecycle()
    val downloaded by viewModel.downloaded.collectAsStateWithLifecycle()
    val artists by viewModel.artists.collectAsStateWithLifecycle()
    val online by viewModel.network.online.collectAsStateWithLifecycle()
    var confirmClear by remember { mutableStateOf(false) }
    LazyColumn(modifier.fillMaxSize()) {
        item {
            Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 12.dp, top = 24.dp, bottom = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(stringResource(R.string.library), style = MaterialTheme.typography.headlineMedium, modifier = Modifier.weight(1f))
                IconButton(onClick = onSettings) { Icon(Icons.Default.Settings, stringResource(R.string.settings)) }
            }
        }
        item { SectionHeading(stringResource(R.string.liked_tracks)) }
        if (liked.isEmpty()) item { EmptyState(stringResource(R.string.empty_likes)) }
        else items(liked, key = { "liked-${it.audiusId}" }) { track ->
            TrackRow(track, online, onClick = { viewModel.play(liked, liked.indexOf(track)) },
                actionIcon = Icons.Default.Favorite, actionDescription = stringResource(R.string.unlike), onAction = { viewModel.toggleLike(track.audiusId) })
        }
        item { SectionHeading(stringResource(R.string.downloads), if (downloaded.isNotEmpty()) stringResource(R.string.delete_all) else null) { confirmClear = true } }
        if (downloaded.isEmpty()) item { EmptyState(stringResource(R.string.empty_downloads)) }
        else items(downloaded, key = { "download-${it.audiusId}" }) { track ->
            val size = track.localPath?.let { File(it).length() } ?: 0L
            TrackRow(track, online, onClick = { viewModel.play(downloaded, downloaded.indexOf(track)) },
                actionIcon = Icons.Default.DeleteOutline, actionDescription = stringResource(R.string.delete_download),
                onAction = { viewModel.deleteDownload(track.audiusId) },
                subtitle = "${track.artistName} · ${stringResource(R.string.size_mb, size / (1024f * 1024f))}")
        }
        item { SectionHeading(stringResource(R.string.artists)) }
        if (artists.isEmpty()) item { EmptyState(stringResource(R.string.empty_artists)) }
        else items(artists, key = { "artist-${it.artistId}" }) { artist ->
            Row(Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 16.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Icon(Icons.Default.Person, contentDescription = null, tint = Muted)
                Text(artist.name, style = MaterialTheme.typography.bodyLarge)
            }
        }
    }
    if (confirmClear) ConfirmDelete(onCancel = { confirmClear = false }, onConfirm = { viewModel.deleteAll(); confirmClear = false })
}
@Composable private fun SectionHeading(title: String, action: String? = null, onAction: () -> Unit = {}) {
    Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 12.dp, top = 18.dp, bottom = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(title, style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
        if (action != null) TextButton(onClick = onAction) { Text(action) }
    }
}
@Composable internal fun ConfirmDelete(onCancel: () -> Unit, onConfirm: () -> Unit) {
    AlertDialog(onDismissRequest = onCancel, title = { Text(stringResource(R.string.delete_all_title)) },
        text = { Text(stringResource(R.string.delete_all_body)) },
        confirmButton = { TextButton(onClick = onConfirm) { Text(stringResource(R.string.delete)) } },
        dismissButton = { TextButton(onClick = onCancel) { Text(stringResource(R.string.cancel)) } })
}
