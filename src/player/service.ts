import TrackPlayer, { Event,State } from 'react-native-track-player';import {usePlayerStore} from './playerStore';
export async function PlaybackService(){
  TrackPlayer.addEventListener(Event.RemotePlay,()=>TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause,()=>TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext,()=>TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious,()=>TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteStop,()=>TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek,e=>TrackPlayer.seekTo(e.position));
  TrackPlayer.addEventListener(Event.PlaybackState,e=>usePlayerStore.getState().setPlaying(e.state===State.Playing));
  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged,async()=>{const active=await TrackPlayer.getActiveTrack();if(!active?.id)return;const track=usePlayerStore.getState().queue.find(t=>t.id===String(active.id));if(track)usePlayerStore.getState().setCurrent(track);});
}
