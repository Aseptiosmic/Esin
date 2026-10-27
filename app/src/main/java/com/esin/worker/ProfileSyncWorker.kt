package com.esin.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.esin.data.repo.TwinRepository
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CancellationException

@EntryPoint
@InstallIn(SingletonComponent::class)
interface SyncWorkerEntryPoint { fun twins(): TwinRepository }

class ProfileSyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result = try {
        val repo = EntryPointAccessors.fromApplication(applicationContext, SyncWorkerEntryPoint::class.java).twins()
        if (repo.syncPending()) Result.success() else Result.retry()
    } catch (e: CancellationException) { throw e } catch (_: Exception) { Result.retry() }
}
