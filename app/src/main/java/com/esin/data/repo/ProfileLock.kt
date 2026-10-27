package com.esin.data.repo

import kotlinx.coroutines.sync.Mutex
import javax.inject.Inject
import javax.inject.Singleton

@Singleton class ProfileLock @Inject constructor() { val mutex = Mutex() }
