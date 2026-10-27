package com.esin.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.QueueMusic
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.esin.R
import com.esin.data.local.TrackEntity
import com.esin.ui.theme.Muted
import java.io.File

fun TrackEntity.available(online: Boolean): Boolean = online || localPath?.let { File(it).isFile } == true

@Composable
fun Cover(track: TrackEntity, size: Dp, modifier: Modifier = Modifier) {
    Box(modifier.size(size).clip(RoundedCornerShape(8.dp)).background(MaterialTheme.colorScheme.surface), contentAlignment = Alignment.Center) {
        Icon(Icons.Default.QueueMusic, contentDescription = null, tint = Muted.copy(alpha = .5f), modifier = Modifier.size(size / 3))
        AsyncImage(model = track.artworkUrl, contentDescription = stringResource(R.string.artwork_description, track.title),
            contentScale = ContentScale.Crop, modifier = Modifier.fillMaxSize())
    }
}
@Composable
fun TrackRow(track: TrackEntity, online: Boolean, onClick: () -> Unit, actionIcon: ImageVector? = null,
    actionDescription: String? = null, onAction: (() -> Unit)? = null, actionTint: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface,
    subtitle: String? = null, selectionMode: Boolean = false) {
    val available = selectionMode || track.available(online)
    Row(Modifier.fillMaxWidth().alpha(if (available) 1f else .42f)
        .clickable(enabled = available, onClick = onClick).padding(horizontal = 16.dp, vertical = 7.dp),
        verticalAlignment = Alignment.CenterVertically) {
        Cover(track, 54.dp)
        Spacer(Modifier.width(14.dp))
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.Center) {
            Text(track.title, style = MaterialTheme.typography.titleMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Spacer(Modifier.height(3.dp))
            Text(subtitle ?: track.artistName, style = MaterialTheme.typography.bodySmall, color = Muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        if (actionIcon != null && onAction != null) IconButton(onClick = onAction, modifier = Modifier.size(48.dp)) {
            Icon(actionIcon, contentDescription = actionDescription, tint = actionTint)
        }
    }
}
@Composable fun LoadingState(modifier: Modifier = Modifier) {
    Box(modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(modifier = Modifier.size(28.dp), strokeWidth = 2.dp)
    }
}
@Composable fun EmptyState(message: String, action: String? = null, onAction: (() -> Unit)? = null, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxWidth().padding(horizontal = 28.dp, vertical = 36.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(message, color = Muted, style = MaterialTheme.typography.bodyMedium, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        if (action != null && onAction != null) { Spacer(Modifier.height(16.dp)); Button(onClick = onAction) { Text(action) } }
    }
}
