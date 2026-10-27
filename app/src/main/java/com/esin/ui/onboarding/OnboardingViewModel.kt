package com.esin.ui.onboarding

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.esin.R
import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackEntity
import com.esin.data.repo.TrackRepository
import com.esin.data.repo.TwinRepository
import com.esin.util.NetworkMonitor
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeoutOrNull
import javax.inject.Inject

data class TrackListState(val loading: Boolean = false, val tracks: List<TrackEntity> = emptyList(), val error: Boolean = false)

@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val saved: SavedStateHandle,
    private val tracks: TrackRepository,
    private val settings: SettingsRepository,
    private val twins: TwinRepository,
    val network: NetworkMonitor,
) : ViewModel() {
    val selected = saved.getStateFlow("selected_ids", arrayListOf<String>())
    val initialized = saved.getStateFlow("initialized", false)
    val query = saved.getStateFlow("query", "")
    val selectedTracks = selected.flatMapLatest { ids ->
        flow {
            val entries = if (ids.isEmpty()) emptyList() else tracks.dao.getMany(ids)
            val byId = entries.associateBy { it.audiusId }
            emit(ids.mapNotNull { byId[it] })
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    private val mutableTrends = MutableStateFlow(TrackListState(loading = true))
    val trends = mutableTrends.asStateFlow()
    private val mutableSaving = MutableStateFlow(false)
    val saving = mutableSaving.asStateFlow()
    private val mutableDone = MutableStateFlow(false)
    val done = mutableDone.asStateFlow()
    private val eventsMutable = MutableSharedFlow<Int>(extraBufferCapacity = 4)
    val events = eventsMutable.asSharedFlow()
    private val searchRetry = MutableStateFlow(0)
    val results = combine(query.debounce(400).distinctUntilChanged(), searchRetry) { term, _ -> term }.flatMapLatest { term ->
        flow {
            val cleaned = term.trim()
            if (cleaned.length < 2) { emit(TrackListState()); return@flow }
            emit(TrackListState(loading = true))
            try { emit(TrackListState(tracks = tracks.audius.search(cleaned))) }
            catch (e: CancellationException) { throw e } catch (_: Exception) { emit(TrackListState(error = true)) }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), TrackListState())

    init { refreshTrending() }
    fun initialize(edit: Boolean) {
        if (initialized.value) return
        if (edit) viewModelScope.launch {
            val ids = tracks.dao.liked().map { it.audiusId }
            saved["selected_ids"] = ArrayList(ids)
            saved["initialized"] = true
        } else saved["initialized"] = true
    }
    fun setQuery(value: String) { saved["query"] = value }
    fun retrySearch() { searchRetry.value += 1 }
    fun refreshTrending() = viewModelScope.launch {
        mutableTrends.value = TrackListState(loading = true)
        try { mutableTrends.value = TrackListState(tracks = tracks.audius.trending()) }
        catch (e: CancellationException) { throw e } catch (_: Exception) { mutableTrends.value = TrackListState(error = true) }
    }
    fun toggle(id: String, edit: Boolean) {
        if (!initialized.value) return
        val ids = selected.value.toMutableList()
        if (id in ids) ids.remove(id) else {
            if (ids.size >= (if (edit) 200 else 10)) {
                eventsMutable.tryEmit(if (edit) R.string.selection_maximum else R.string.selection_limit); return
            }
            ids.add(id)
        }
        saved["selected_ids"] = ArrayList(ids)
    }
    fun finish(edit: Boolean) {
        val ids = selected.value.toList()
        if (!initialized.value || (if (edit) ids.size < 10 else ids.size != 10) || mutableSaving.value) return
        viewModelScope.launch {
            mutableSaving.value = true
            try {
                if (!tracks.saveSelections(ids)) { eventsMutable.emit(R.string.connection_error); return@launch }
                // The local transaction is authoritative. Network failure never blocks onboarding.
                withTimeoutOrNull(4_000) { twins.syncPending() }
                if (!edit) settings.setCompleted(true)
                mutableDone.value = true
            } catch (e: CancellationException) { throw e }
            catch (_: Exception) { eventsMutable.emit(R.string.connection_error) }
            finally { mutableSaving.value = false }
        }
    }
}
