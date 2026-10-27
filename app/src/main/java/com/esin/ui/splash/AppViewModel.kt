package com.esin.ui.splash

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.esin.data.local.SettingsRepository
import com.esin.data.local.TrackDao
import com.esin.util.ApkInstaller
import com.esin.util.UpdateDecision
import com.esin.util.VersionChecker
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LaunchGate(val onboardingCompleted: Boolean, val notificationExplained: Boolean)
@HiltViewModel
class AppViewModel @Inject constructor(
    private val settings: SettingsRepository,
    dao: TrackDao,
    private val checker: VersionChecker,
    val installer: ApkInstaller,
) : ViewModel() {
    val gate = combine(settings.settings, dao.observeLiked()) { prefs, liked ->
        LaunchGate(prefs.onboardingCompleted && liked.size >= 10, prefs.notificationExplained)
    }.stateIn(viewModelScope, SharingStarted.Eagerly, null)
    val checking = MutableStateFlow(true)
    val update = MutableStateFlow<UpdateDecision?>(null)
    init { viewModelScope.launch {
        try { update.value = checker.check() } finally { checking.value = false }
    } }
    fun dismissOptionalUpdate() { if (update.value?.required == false) update.value = null }
    fun explainedNotifications() { viewModelScope.launch { settings.setNotificationExplained() } }
    fun install() { update.value?.let { decision -> viewModelScope.launch { installer.downloadAndInstall(decision.manifest) } } }
}
