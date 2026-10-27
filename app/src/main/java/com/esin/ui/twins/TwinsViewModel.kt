package com.esin.ui.twins

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.esin.data.local.TrackEntity
import com.esin.data.repo.TwinMatch
import com.esin.data.repo.TwinRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TwinsState(val loading: Boolean = true, val matches: List<TwinMatch> = emptyList(), val error: Boolean = false)
data class CommonTracksState(val loading: Boolean = false, val tracks: List<TrackEntity> = emptyList(), val error: Boolean = false)
@HiltViewModel
class TwinsViewModel @Inject constructor(private val twins: TwinRepository) : ViewModel() {
    private val mutable = MutableStateFlow(TwinsState())
    val state = mutable.asStateFlow()
    private val commonMutable = MutableStateFlow(CommonTracksState())
    val common = commonMutable.asStateFlow()
    private var refreshJob: Job? = null
    private var commonJob: Job? = null
    init { refresh() }
    fun refresh() {
        refreshJob?.cancel()
        refreshJob = viewModelScope.launch {
            mutable.value = mutable.value.copy(loading = true, error = false)
            try { mutable.value = TwinsState(loading = false, matches = twins.findTwins()) }
            catch (e: CancellationException) { throw e } catch (_: Exception) { mutable.value = TwinsState(loading = false, error = true) }
        }
    }
    fun open(twin: TwinMatch) {
        commonJob?.cancel()
        commonJob = viewModelScope.launch {
            commonMutable.value = CommonTracksState(loading = true, tracks = twin.commonTracks)
            try { commonMutable.value = CommonTracksState(tracks = twins.resolveSharedTracks(twin.commonTrackIds)) }
            catch (e: CancellationException) { throw e } catch (_: Exception) { commonMutable.value = CommonTracksState(error = true) }
        }
    }
}
