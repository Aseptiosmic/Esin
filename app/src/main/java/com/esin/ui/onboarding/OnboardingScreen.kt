package com.esin.ui.onboarding

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.esin.R
import com.esin.ui.components.EmptyState
import com.esin.ui.components.LoadingState
import com.esin.ui.components.TrackRow
import com.esin.ui.theme.Muted

@Composable
fun OnboardingScreen(edit: Boolean = false, onEditDone: () -> Unit = {}, viewModel: OnboardingViewModel = hiltViewModel()) {
    val selected by viewModel.selected.collectAsStateWithLifecycle()
    val initialized by viewModel.initialized.collectAsStateWithLifecycle()
    val query by viewModel.query.collectAsStateWithLifecycle()
    val selectedTracks by viewModel.selectedTracks.collectAsStateWithLifecycle()
    val trends by viewModel.trends.collectAsStateWithLifecycle()
    val results by viewModel.results.collectAsStateWithLifecycle()
    val saving by viewModel.saving.collectAsStateWithLifecycle()
    val done by viewModel.done.collectAsStateWithLifecycle()
    val online by viewModel.network.online.collectAsStateWithLifecycle()
    var tab by rememberSaveable { mutableIntStateOf(0) }
    val snack = remember { SnackbarHostState() }
    val context = LocalContext.current
    LaunchedEffect(edit) { viewModel.initialize(edit) }
    LaunchedEffect(viewModel) { viewModel.events.collect { snack.showSnackbar(context.getString(it)) } }
    LaunchedEffect(done) { if (done && edit) onEditDone() }
    Scaffold(snackbarHost = { SnackbarHost(snack) }, bottomBar = {
        Column(Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 16.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(if (edit) stringResource(R.string.selected_edit_count, selected.size) else stringResource(R.string.selected_count, selected.size),
                    style = MaterialTheme.typography.labelLarge)
            }
            Spacer(Modifier.padding(6.dp))
            Button(onClick = { viewModel.finish(edit) }, modifier = Modifier.fillMaxWidth(),
                enabled = initialized && !saving && (if (edit) selected.size >= 10 else selected.size == 10)) {
                Text(if (saving) stringResource(R.string.saving) else stringResource(if (edit) R.string.save else R.string.find_twins), Modifier.padding(5.dp))
            }
        }
    }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            if (edit) IconButton(onClick = onEditDone) { Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.back)) }
            Text(stringResource(if (edit) R.string.edit_selections else R.string.onboarding_title),
                style = MaterialTheme.typography.headlineMedium, modifier = Modifier.padding(start = 20.dp, end = 20.dp, top = if (edit) 0.dp else 28.dp))
            Text(stringResource(R.string.onboarding_subtitle), color = Muted, style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp))
            TabRow(selectedTabIndex = tab, containerColor = MaterialTheme.colorScheme.background) {
                (if (edit) listOf(R.string.trending, R.string.search, R.string.selected_tracks) else listOf(R.string.trending, R.string.search)).forEachIndexed { index, label ->
                    Tab(selected = tab == index, onClick = { tab = index }, text = { Text(stringResource(label)) })
                }
            }
            if (tab == 1) OutlinedTextField(value = query, onValueChange = viewModel::setQuery, singleLine = true,
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                label = { Text(stringResource(R.string.search_hint)) }, modifier = Modifier.fillMaxWidth().padding(16.dp))
            val state = when (tab) { 0 -> trends; 1 -> results; else -> TrackListState(tracks = selectedTracks) }
            when {
                state.loading -> LoadingState()
                !online && tab != 2 && state.tracks.isEmpty() -> EmptyState(stringResource(R.string.internet_required), stringResource(R.string.retry), {
                    if (tab == 0) viewModel.refreshTrending() else viewModel.retrySearch()
                })
                state.error -> EmptyState(stringResource(R.string.connection_error), stringResource(R.string.retry), {
                    if (tab == 0) viewModel.refreshTrending() else viewModel.retrySearch()
                })
                tab == 1 && query.trim().length < 2 -> EmptyState(stringResource(R.string.search_prompt))
                state.tracks.isEmpty() -> EmptyState(stringResource(R.string.no_results))
                else -> LazyColumn(Modifier.weight(1f)) {
                    items(state.tracks, key = { it.audiusId }) { track ->
                        val isSelected = track.audiusId in selected
                        TrackRow(track, online, onClick = { viewModel.toggle(track.audiusId, edit) },
                            actionIcon = if (isSelected) Icons.Default.Check else Icons.Default.Add,
                            actionDescription = stringResource(if (isSelected) R.string.selected_remove else R.string.selected_add),
                            onAction = { viewModel.toggle(track.audiusId, edit) }, selectionMode = true)
                    }
                }
            }
        }
    }
}
