package com.esin.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LibraryMusic
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PeopleAlt
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.esin.R
import com.esin.data.local.TrackEntity
import com.esin.ui.components.Cover
import com.esin.ui.library.LibraryScreen
import com.esin.ui.library.SettingsScreen
import com.esin.ui.onboarding.OnboardingScreen
import com.esin.ui.player.PlayerScreen
import com.esin.ui.theme.Muted
import com.esin.ui.twins.TwinsScreen

@Composable fun HomeNavigation() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = "home") {
        composable("home") { HomeScreen(onSettings = { nav.navigate("settings") }) }
        composable("settings") { SettingsScreen(onBack = { nav.popBackStack() }, onEdit = { nav.navigate("edit") }) }
        composable("edit") { OnboardingScreen(edit = true, onEditDone = { nav.popBackStack() }) }
    }
}
@Composable
fun HomeScreen(onSettings: () -> Unit, viewModel: HomeViewModel = hiltViewModel()) {
    var tab by rememberSaveable { mutableIntStateOf(0) }
    val player by viewModel.player.state.collectAsStateWithLifecycle()
    val track by viewModel.currentTrack.collectAsStateWithLifecycle()
    val snack = remember { SnackbarHostState() }
    val context = LocalContext.current
    LaunchedEffect(viewModel) { viewModel.events.collect { snack.showSnackbar(context.getString(it)) } }
    val labels = listOf(R.string.player, R.string.twins, R.string.library)
    val icons = listOf(Icons.Default.GraphicEq, Icons.Default.PeopleAlt, Icons.Default.LibraryMusic)
    Scaffold(snackbarHost = { SnackbarHost(snack) }, bottomBar = {
        Column {
            if (tab != 0 && player.trackId != null) {
                val mini = track ?: TrackEntity(player.trackId!!, player.title, player.artist, null, player.artwork, null, null, null)
                Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp).clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surface).clickable { tab = 0 }.padding(start = 8.dp, top = 6.dp, bottom = 6.dp),
                    verticalAlignment = Alignment.CenterVertically) {
                    Cover(mini, 44.dp)
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(player.title, style = MaterialTheme.typography.labelLarge, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Text(player.artist, style = MaterialTheme.typography.bodySmall, color = Muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                    IconButton(onClick = viewModel.player::toggle) {
                        Icon(if (player.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = stringResource(if (player.isPlaying) R.string.pause else R.string.play))
                    }
                }
            }
            NavigationBar(containerColor = MaterialTheme.colorScheme.background) {
                labels.forEachIndexed { index, label ->
                    NavigationBarItem(selected = tab == index, onClick = { tab = index },
                        icon = { Icon(icons[index], contentDescription = null) }, label = { Text(stringResource(label)) })
                }
            }
        }
    }) { inner ->
        when (tab) {
            0 -> PlayerScreen(viewModel, Modifier.padding(inner))
            1 -> TwinsScreen(viewModel, Modifier.padding(inner))
            else -> LibraryScreen(viewModel, onSettings, Modifier.padding(inner))
        }
    }
}
