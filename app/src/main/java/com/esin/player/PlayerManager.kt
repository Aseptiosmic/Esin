package com.esin.player

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.esin.data.local.TrackEntity
import com.esin.service.MusicService
import com.esin.util.NetworkMonitor
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.guava.await
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

data class PlaybackState(
    val trackId: String? = null, val title: String = "", val artist: String = "", val artwork: String? = null,
    val isPlaying: Boolean = false, val positionMs: Long = 0, val durationMs: Long = 0,
    val shuffle: Boolean = false, val repeatMode: Int = Player.REPEAT_MODE_OFF,
)

@Singleton
@OptIn(UnstableApi::class)
class PlayerManager @Inject constructor(@ApplicationContext context: Context, private val network: NetworkMonitor) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val future = MediaController.Builder(context, SessionToken(context, ComponentName(context, MusicService::class.java))).buildAsync()
    private var controller: MediaController? = null
    private val mutableState = MutableStateFlow(PlaybackState())
    val state = mutableState.asStateFlow()
    init {
        scope.launch {
            try {
                controller = future.await().also { it.addListener(object : Player.Listener {
                    override fun onEvents(player: Player, events: Player.Events) { update(player) }
                }) }
                while (true) { controller?.let(::update); delay(500) }
            } catch (_: Exception) { /* Service may be unavailable; playback requests can retry on next launch. */ }
        }
    }
    private fun update(p: Player) {
        val item = p.currentMediaItem
        val metadata = item?.mediaMetadata
        mutableState.value = PlaybackState(item?.mediaId, metadata?.title?.toString().orEmpty(),
            metadata?.artist?.toString().orEmpty(), metadata?.artworkUri?.toString(), p.isPlaying,
            p.currentPosition.coerceAtLeast(0), p.duration.takeIf { it > 0 } ?: 0, p.shuffleModeEnabled, p.repeatMode)
    }
    fun playQueue(tracks: List<TrackEntity>, index: Int = 0) {
        val wanted = tracks.getOrNull(index)?.audiusId ?: return
        scope.launch {
            val playable = tracks.filter { network.isOnline() || it.localPath?.let { path -> File(path).isFile } == true }
            val start = playable.indexOfFirst { it.audiusId == wanted }
            if (start < 0) return@launch
            val c = runCatching { controller ?: future.await().also { controller = it } }.getOrNull() ?: return@launch
            val items = playable.map { track ->
                val metadata = MediaMetadata.Builder().setTitle(track.title).setArtist(track.artistName)
                    .setArtworkUri(track.artworkUrl?.let(Uri::parse)).build()
                MediaItem.Builder().setMediaId(track.audiusId).setUri("esin://track/${track.audiusId}").setMediaMetadata(metadata).build()
            }
            c.setMediaItems(items, start, 0L); c.prepare(); c.play()
        }
    }
    fun toggle() { controller?.let { if (it.isPlaying) it.pause() else it.play() } }
    fun previous() { controller?.seekToPreviousMediaItem() }
    fun next() { controller?.seekToNextMediaItem() }
    fun seek(position: Long) { controller?.seekTo(position.coerceAtLeast(0)) }
    fun shuffle() { controller?.let { it.shuffleModeEnabled = !it.shuffleModeEnabled } }
    fun repeat() { controller?.let { it.repeatMode = when (it.repeatMode) {
        Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
        Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
        else -> Player.REPEAT_MODE_OFF
    } } }
}
