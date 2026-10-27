import type {Track} from '../api/audius';import {downloadTrack} from './downloads';
const queued=new Map<string,Track>();const activeIds=new Set<string>();let active=0;const maximum=2;
export function queueDownload(track:Track){if(activeIds.has(track.id)||queued.has(track.id))return;queued.set(track.id,track);drain();}
function drain(){while(active<maximum&&queued.size){const [id,track]=queued.entries().next().value as [string,Track];queued.delete(id);active++;activeIds.add(id);downloadTrack(track).catch(error=>console.warn('Download failed',error)).finally(()=>{active--;activeIds.delete(id);drain();});}}
