import {MMKV} from 'react-native-mmkv';
import {ensureAnonymousSession,supabase} from './supabase';
import {usePlayerStore} from '../player/playerStore';
import {getLikedTracks} from '../db/repository';
const kv=new MMKV({id:'esinfy-state'});let timer:ReturnType<typeof setTimeout>|undefined;
export async function syncProfile(){const selected=usePlayerStore.getState().selected;if(selected.length<10)return;try{const session=await ensureAnonymousSession();if(!session)throw new Error('Supabase configuration missing');const liked=await getLikedTracks();const tracks=[...new Map([...selected,...liked].map(t=>[t.id,t])).values()].slice(0,200);const genres:Record<string,number>={};tracks.forEach(t=>{if(t.genre)genres[t.genre]=(genres[t.genre]??0)+1});const artists=[...new Set(tracks.map(t=>t.artistId).filter(Boolean))].slice(0,200);const {error}=await supabase.from('profiles').upsert({id:session.user.id,nickname:usePlayerStore.getState().nickname,track_ids:tracks.map(t=>t.id),artist_ids:artists,genre_counts:genres,updated_at:new Date().toISOString()});if(error)throw error;kv.set('pending_sync',false);}catch(error){console.warn('Profile sync deferred',error);kv.set('pending_sync',true);}}
export function scheduleProfileSync(){if(timer)clearTimeout(timer);timer=setTimeout(()=>{void syncProfile()},5000);}
export async function retryPendingProfileSync(){if(kv.getBoolean('pending_sync'))await syncProfile();}
