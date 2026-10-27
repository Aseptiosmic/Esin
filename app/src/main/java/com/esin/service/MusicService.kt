package com.esin.service

import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.datasource.DefaultDataSource
import androidx.media3.datasource.ResolvingDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.exoplayer.upstream.DefaultLoadErrorHandlingPolicy
import androidx.media3.session.CommandButton
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionResult
import com.esin.MainActivity
import com.esin.R
import com.esin.data.local.TrackDao
import com.esin.data.remote.AudiusRepository
import com.esin.player.DownloadManagerEsin
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.io.File
import java.io.IOException
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject

@AndroidEntryPoint
@OptIn(UnstableApi::class)
class MusicService : MediaSessionService() {
    @Inject lateinit var dao: TrackDao
    @Inject lateinit var audius: AudiusRepository
    @Inject lateinit var downloads: DownloadManagerEsin
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val streamUrls = ConcurrentHashMap<String, String>()
    private var retryItemId: String? = null // accessed on the player/main thread
    private var retriedCurrentItem = false
    private var consecutiveFailures = 0
    private lateinit var player: ExoPlayer
    private var session: MediaSession? = null
    private val closeCommand = SessionCommand("com.esin.CLOSE", Bundle.EMPTY)

    override fun onCreate() {
        super.onCreate()
        val resolver = ResolvingDataSource.Resolver { spec ->
            if (spec.uri.scheme != "esin") spec else {
                val id = spec.uri.lastPathSegment ?: throw IOException("Missing track id")
                if (!id.matches(Regex("[A-Za-z0-9_-]{1,128}"))) throw IOException("Invalid track id")
                val uri = try {
                    runBlocking(Dispatchers.IO) {
                        val track = dao.get(id) ?: throw IOException("Track not cached")
                        val file = track.localPath?.let(::File)
                        if (file?.isFile == true) Uri.fromFile(file)
                        else {
                            if (track.localPath != null) dao.setLocalPath(id, null)
                            val url = streamUrls[id] ?: audius.streamUrl(id).also { streamUrls[id] = it }
                            downloads.enqueue(id, url)
                            Uri.parse(url)
                        }
                    }
                } catch (e: Exception) { throw IOException("Cannot resolve track", e) }
                spec.withUri(uri)
            }
        }
        val sourceFactory = DefaultMediaSourceFactory(ResolvingDataSource.Factory(DefaultDataSource.Factory(this), resolver))
            .setLoadErrorHandlingPolicy(DefaultLoadErrorHandlingPolicy(0))
        player = ExoPlayer.Builder(this).setMediaSourceFactory(sourceFactory).build().apply {
            setAudioAttributes(AudioAttributes.Builder().setContentType(C.AUDIO_CONTENT_TYPE_MUSIC).setUsage(C.USAGE_MEDIA).build(), true)
            setHandleAudioBecomingNoisy(true)
            setWakeMode(C.WAKE_MODE_NETWORK)
            addListener(object : Player.Listener {
                override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
                    val id = mediaItem?.mediaId
                    if (id != retryItemId || reason == Player.MEDIA_ITEM_TRANSITION_REASON_REPEAT) {
                        retryItemId = id
                        retriedCurrentItem = false
                    }
                    if (id != null) scope.launch { dao.setLastPlayed(id, System.currentTimeMillis()) }
                }
                override fun onPlaybackStateChanged(playbackState: Int) {
                    if (playbackState == Player.STATE_READY) consecutiveFailures = 0
                }
                override fun onPlayerError(error: PlaybackException) {
                    val id = currentMediaItem?.mediaId ?: return
                    if (retryItemId != id) { retryItemId = id; retriedCurrentItem = false }
                    if (!retriedCurrentItem) {
                        retriedCurrentItem = true
                        // Drop the old signed URL. Preparing resolves it once more.
                        streamUrls.remove(id)
                        val index = currentMediaItemIndex
                        val position = currentPosition.coerceAtLeast(0L)
                        prepare()
                        seekTo(index, position)
                        playWhenReady = true
                    } else {
                        Toast.makeText(this@MusicService, R.string.playback_error, Toast.LENGTH_SHORT).show()
                        consecutiveFailures++
                        if (mediaItemCount > 1 && consecutiveFailures < mediaItemCount && hasNextMediaItem() && nextMediaItemIndex != currentMediaItemIndex) {
                            seekToNextMediaItem(); prepare(); play()
                        } else { stop(); clearMediaItems() }
                    }
                }
            })
        }
        val activity = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        val closeButton = CommandButton.Builder(CommandButton.ICON_UNDEFINED)
            .setCustomIconResId(android.R.drawable.ic_menu_close_clear_cancel)
            .setDisplayName(getString(R.string.close)).setSessionCommand(closeCommand).build()
        session = MediaSession.Builder(this, player)
            .setSessionActivity(activity)
            .setMediaButtonPreferences(listOf(closeButton))
            .setCallback(object : MediaSession.Callback {
                override fun onConnect(session: MediaSession, controller: MediaSession.ControllerInfo): MediaSession.ConnectionResult {
                    val commands = MediaSession.ConnectionResult.DEFAULT_SESSION_COMMANDS.buildUpon().add(closeCommand).build()
                    return MediaSession.ConnectionResult.AcceptedResultBuilder(session).setAvailableSessionCommands(commands).build()
                }
                override fun onCustomCommand(session: MediaSession, controller: MediaSession.ControllerInfo,
                    customCommand: SessionCommand, args: Bundle): ListenableFuture<SessionResult> {
                    return if (customCommand.customAction == closeCommand.customAction) {
                        player.stop(); player.clearMediaItems(); stopSelf()
                        Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
                    } else Futures.immediateFuture(SessionResult(SessionResult.RESULT_ERROR_NOT_SUPPORTED))
                }
            }).build()
    }
    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? = session
    override fun onTaskRemoved(rootIntent: Intent?) {
        if (!player.playWhenReady || player.playbackState == Player.STATE_ENDED || player.playbackState == Player.STATE_IDLE) stopSelf()
    }
    override fun onDestroy() {
        session?.release(); session = null
        if (::player.isInitialized) player.release()
        scope.cancel()
        super.onDestroy()
    }
}
