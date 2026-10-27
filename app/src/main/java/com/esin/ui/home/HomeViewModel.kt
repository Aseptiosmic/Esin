package com.esin.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.esin.R
import com.esin.data.local.AppSettings
import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackEntity
import com.esin.data.repo.TrackRepository
import com.esin.player.DownloadManagerEsin
import com.esin.player.PlayerManager
import com.esin.ui.onboarding.TrackListState
import com.esin.util.NetworkMonitor
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val tracks: TrackRepository,
    val player: PlayerManager,
    val downloads: DownloadManagerEsin,
    val network: NetworkMonitor,
    private val prefs: SettingsRepository,
) : ViewModel() {
    val liked = tracks.liked.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val downloaded = tracks.downloaded.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val artists = tracks.artists.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    val settings = prefs.settings.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AppSettings())
    val currentTrack = player.state.flatMapLatest { state ->
        state.trackId?.let { tracks.dao.observeTrack(it) } ?: flowOf(null)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)
    private val mutableTrends = MutableStateFlow(TrackListState(loading = true))
    val trends = mutableTrends.asStateFlow()
    private val mutableEvents = MutableSharedFlow<Int>(extraBufferCapacity = 4)
    val events = mutableEvents.asSharedFlow()
    init { refreshTrends() }
    fun refreshTrends() = viewModelScope.launch {
        mutableTrends.value = TrackListState(loading = true)
        try { mutableTrends.value = TrackListState(tracks = tracks.audius.trending()) }
        catch (e: CancellationException) { throw e } catch (_: Exception) { mutableTrends.value = TrackListState(error = true) }
    }
    fun play(tracks: List<TrackEntity>, index: Int = 0) = player.playQueue(tracks, index)
    fun toggleLike(id: String) = viewModelScope.launch {
        if (!tracks.toggleLike(id)) mutableEvents.emit(R.string.selection_minimum)
    }
    fun download(id: String) = downloads.enqueue(id)
    fun deleteDownload(id: String) = viewModelScope.launch { downloads.delete(id) }
    fun deleteAll() = viewModelScope.launch { downloads.deleteAll() }
    fun setAuto(value: Boolean) = viewModelScope.launch {
        prefs.setAutoDownload(value)
        if (value) tracks.dao.liked().forEach { downloads.enqueue(it.audiusId, favouriteAutoDownload = true) }
    }
    fun setWifi(value: Boolean) = viewModelScope.launch {
        prefs.setWifiOnly(value)
        if (!value) tracks.dao.liked().forEach { downloads.enqueue(it.audiusId, favouriteAutoDownload = true) }
    }
    fun setNickname(name: String) = viewModelScope.launch { tracks.setNickname(name) }
}
