package com.esin.ui.twins

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.esin.R
import com.esin.data.repo.TwinMatch
import com.esin.ui.components.EmptyState
import com.esin.ui.components.LoadingState
import com.esin.ui.components.TrackRow
import com.esin.ui.home.HomeViewModel
import com.esin.ui.theme.Muted
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TwinsScreen(home: HomeViewModel, modifier: Modifier = Modifier, viewModel: TwinsViewModel = hiltViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val online by home.network.online.collectAsStateWithLifecycle()
    val common by viewModel.common.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var selected by remember { mutableStateOf<TwinMatch?>(null) }
    PullToRefreshBox(isRefreshing = state.loading, onRefresh = viewModel::refresh, modifier = modifier.fillMaxSize()) {
        LazyColumn(Modifier.fillMaxSize()) {
            item {
                Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 12.dp, top = 24.dp, bottom = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(stringResource(R.string.twins_title), style = MaterialTheme.typography.headlineMedium)
                        Text(stringResource(R.string.twins_subtitle), color = Muted, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(top = 8.dp))
                    }
                    IconButton(onClick = viewModel::refresh) { Icon(Icons.Default.Refresh, stringResource(R.string.refresh)) }
                }
            }
            when {
                state.loading && state.matches.isEmpty() -> item { LoadingState() }
                state.error -> item { EmptyState(stringResource(R.string.connection_error), stringResource(R.string.retry), viewModel::refresh) }
                state.matches.isEmpty() -> item {
                    val message = stringResource(R.string.share_message)
                    EmptyState(stringResource(R.string.no_twins), stringResource(R.string.share), {
                        val intent = Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, message)
                        context.startActivity(Intent.createChooser(intent, context.getString(R.string.share)))
                    })
                }
                else -> items(state.matches) { twin -> TwinCard(twin) { selected = twin; viewModel.open(twin) } }
            }
        }
    }
    selected?.let { twin ->
        AlertDialog(onDismissRequest = { selected = null }, title = { Text(twin.nickname) },
            text = {
                Column {
                    Text(stringResource(R.string.common_tracks), style = MaterialTheme.typography.titleMedium)
                    when {
                        common.loading -> LoadingState()
                        common.error -> EmptyState(stringResource(R.string.connection_error), stringResource(R.string.retry), { viewModel.open(twin) })
                        common.tracks.isEmpty() -> Text(stringResource(R.string.no_common_tracks), color = Muted, modifier = Modifier.padding(top = 12.dp))
                        else -> androidx.compose.foundation.lazy.LazyColumn(Modifier.heightIn(max = 320.dp)) {
                            items(common.tracks, key = { it.audiusId }) { track ->
                                TrackRow(track, online, onClick = {
                                    home.play(common.tracks, common.tracks.indexOf(track)); selected = null
                                })
                            }
                        }
                    }
                }
            }, confirmButton = { TextButton(onClick = { selected = null }) { Text(stringResource(R.string.close)) } })
    }
}
@Composable private fun TwinCard(twin: TwinMatch, onClick: () -> Unit) {
    val colors = listOf(Color(0xFF656D5A), Color(0xFF6D5B65), Color(0xFF546B70), Color(0xFF71644F), Color(0xFF5D5F78))
    val color = colors[(twin.nickname.hashCode().toLong().let { kotlin.math.abs(it) } % colors.size).toInt()]
    Row(Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 6.dp).clip(RoundedCornerShape(12.dp))
        .background(MaterialTheme.colorScheme.surface).clickable(onClick = onClick).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(54.dp).clip(CircleShape).background(color), contentAlignment = Alignment.Center) {
            Text(twin.nickname.trim().firstOrNull()?.toString()?.uppercase(Locale.forLanguageTag("tr")) ?: "?", fontWeight = FontWeight.SemiBold)
        }
        Spacer(Modifier.width(14.dp))
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(twin.nickname, style = MaterialTheme.typography.titleMedium)
            if (twin.genreFallback) Text(stringResource(R.string.genre_similarity), color = Muted, style = MaterialTheme.typography.bodySmall)
            twin.commonTracks.take(2).forEach { track -> Text("${track.title} · ${track.artistName}", color = Muted, style = MaterialTheme.typography.bodySmall, maxLines = 1) }
        }
        Text(stringResource(R.string.twin_percent, twin.percent), style = MaterialTheme.typography.labelLarge)
    }
}
