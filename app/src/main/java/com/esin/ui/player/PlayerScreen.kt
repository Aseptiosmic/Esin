package com.esin.ui.player

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.RepeatOne
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.media3.common.Player
import coil.compose.AsyncImage
import com.esin.R
import com.esin.data.local.TrackEntity
import com.esin.ui.components.Cover
import com.esin.ui.components.EmptyState
import com.esin.ui.components.LoadingState
import com.esin.ui.components.available
import com.esin.ui.home.HomeViewModel
import com.esin.ui.theme.Muted
import com.esin.util.PermissionHandler
import java.io.File
import java.util.Locale

private fun formatTime(ms: Long): String {
    val seconds = (ms / 1000).coerceAtLeast(0)
    return String.format(Locale.ROOT, "%d:%02d", seconds / 60, seconds % 60)
}
@Composable
fun PlayerScreen(viewModel: HomeViewModel, modifier: Modifier = Modifier) {
    val playback by viewModel.player.state.collectAsStateWithLifecycle()
    val current by viewModel.currentTrack.collectAsStateWithLifecycle()
    val liked by viewModel.liked.collectAsStateWithLifecycle()
    val trends by viewModel.trends.collectAsStateWithLifecycle()
    val online by viewModel.network.online.collectAsStateWithLifecycle()
    val downloading by viewModel.downloads.active.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val owner = LocalLifecycleOwner.current
    var notificationsGranted by remember { mutableStateOf(PermissionHandler.notificationsGranted(context)) }
    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event -> if (event == Lifecycle.Event.ON_RESUME) notificationsGranted = PermissionHandler.notificationsGranted(context) }
        owner.lifecycle.addObserver(observer)
        onDispose { owner.lifecycle.removeObserver(observer) }
    }
    LazyColumn(modifier.fillMaxSize(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Text(stringResource(R.string.player), style = MaterialTheme.typography.headlineMedium, modifier = Modifier.padding(start = 20.dp, top = 24.dp, bottom = 4.dp))
            if (!notificationsGranted) {
                Row(Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 8.dp).clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surface).padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(stringResource(R.string.notification_disabled), style = MaterialTheme.typography.bodySmall, color = Muted, modifier = Modifier.weight(1f))
                    TextButton(onClick = { context.startActivity(PermissionHandler.notificationSettings(context)) }) { Text(stringResource(R.string.go_to_settings)) }
                }
            }
        }
        if (playback.trackId == null) {
            item { Text(stringResource(R.string.for_you), style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) }
            item { TrackShelf(liked, online) { viewModel.play(liked, it) } }
            item { Text(stringResource(R.string.trending), style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) }
            item {
                when {
                    trends.loading -> LoadingState()
                    trends.error -> EmptyState(stringResource(if (online) R.string.connection_error else R.string.internet_required), stringResource(R.string.retry), viewModel::refreshTrends)
                    trends.tracks.isEmpty() -> EmptyState(stringResource(R.string.no_results))
                    else -> TrackShelf(trends.tracks, online) { viewModel.play(trends.tracks, it) }
                }
            }
        } else {
            val track = current ?: TrackEntity(playback.trackId!!, playback.title, playback.artist, null, playback.artwork, null, null, null)
            item {
                Column(Modifier.fillMaxWidth().padding(horizontal = 24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(Modifier.fillMaxWidth().aspectRatio(1f).clip(RoundedCornerShape(12.dp)).background(MaterialTheme.colorScheme.surface), contentAlignment = Alignment.Center) {
                        AsyncImage(model = track.artworkUrl, contentDescription = stringResource(R.string.artwork_description, track.title),
                            contentScale = ContentScale.Crop, modifier = Modifier.fillMaxSize())
                    }
                    Spacer(Modifier.height(24.dp))
                    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text(track.title, style = MaterialTheme.typography.titleLarge, maxLines = 2, overflow = TextOverflow.Ellipsis)
                            Text(track.artistName, color = Muted, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(top = 5.dp))
                        }
                        IconButton(onClick = { viewModel.toggleLike(track.audiusId) }) {
                            Icon(if (track.liked) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                stringResource(if (track.liked) R.string.unlike else R.string.like))
                        }
                        val isDownloaded = track.localPath?.let { File(it).isFile } == true
                        IconButton(onClick = { if (!isDownloaded) viewModel.download(track.audiusId) }, enabled = track.audiusId !in downloading) {
                            if (track.audiusId in downloading) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp)
                            else Icon(if (isDownloaded) Icons.Default.CheckCircle else Icons.Default.Download,
                                stringResource(if (isDownloaded) R.string.downloaded else R.string.download))
                        }
                    }
                    val seekDescription = stringResource(R.string.seek)
                    Slider(value = if (playback.durationMs > 0) (playback.positionMs.toFloat() / playback.durationMs).coerceIn(0f, 1f) else 0f,
                        onValueChange = { viewModel.player.seek((playback.durationMs * it).toLong()) },
                        modifier = Modifier.fillMaxWidth().semantics { contentDescription = seekDescription })
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(formatTime(playback.positionMs), style = MaterialTheme.typography.bodySmall, color = Muted)
                        Text(formatTime(playback.durationMs), style = MaterialTheme.typography.bodySmall, color = Muted)
                    }
                    Row(Modifier.fillMaxWidth().padding(vertical = 18.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = viewModel.player::shuffle) { Icon(Icons.Default.Shuffle, stringResource(R.string.shuffle), tint = if (playback.shuffle) MaterialTheme.colorScheme.primary else Muted) }
                        IconButton(onClick = viewModel.player::previous) { Icon(Icons.Default.SkipPrevious, stringResource(R.string.previous), Modifier.size(32.dp)) }
                        IconButton(onClick = viewModel.player::toggle, modifier = Modifier.size(64.dp).background(MaterialTheme.colorScheme.primary, CircleShape)) {
                            Icon(if (playback.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                stringResource(if (playback.isPlaying) R.string.pause else R.string.play), Modifier.size(36.dp), tint = MaterialTheme.colorScheme.onPrimary)
                        }
                        IconButton(onClick = viewModel.player::next) { Icon(Icons.Default.SkipNext, stringResource(R.string.next), Modifier.size(32.dp)) }
                        IconButton(onClick = viewModel.player::repeat) {
                            val label = when (playback.repeatMode) { Player.REPEAT_MODE_ALL -> R.string.repeat_all; Player.REPEAT_MODE_ONE -> R.string.repeat_one; else -> R.string.repeat_off }
                            Icon(if (playback.repeatMode == Player.REPEAT_MODE_ONE) Icons.Default.RepeatOne else Icons.Default.Repeat,
                                stringResource(label), tint = if (playback.repeatMode == Player.REPEAT_MODE_OFF) Muted else MaterialTheme.colorScheme.primary)
                        }
                    }
                    TextButton(onClick = {
                        val permalink = track.permalink.orEmpty()
                        val uri = when {
                            permalink.startsWith("/") && !permalink.startsWith("//") -> Uri.parse("https://audius.co$permalink")
                            else -> Uri.parse(permalink).takeIf { it.scheme == "https" && (it.host == "audius.co" || it.host == "www.audius.co") }
                        } ?: Uri.parse("https://audius.co")
                        runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, uri)) }
                    }) { Icon(Icons.Default.OpenInNew, contentDescription = null, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)); Text(stringResource(R.string.open_audius)) }
                }
            }
        }
    }
}
@Composable private fun TrackShelf(tracks: List<TrackEntity>, online: Boolean, onPlay: (Int) -> Unit) {
    if (tracks.isEmpty()) { EmptyState(stringResource(R.string.empty_likes)); return }
    LazyRow(horizontalArrangement = Arrangement.spacedBy(14.dp), contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 20.dp)) {
        itemsIndexed(tracks, key = { _, item -> item.audiusId }) { index, track ->
            val available = track.available(online)
            Column(Modifier.width(142.dp).alpha(if (available) 1f else .42f).clickable(enabled = available) { onPlay(index) }) {
                Cover(track, 142.dp)
                Text(track.title, style = MaterialTheme.typography.labelLarge, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 8.dp))
                Text(track.artistName, color = Muted, style = MaterialTheme.typography.bodySmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
        }
    }
}
