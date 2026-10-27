import NetInfo from '@react-native-community/netinfo';import {MMKV} from 'react-native-mmkv';import {getLikedTracks} from '../db/repository';import {queueDownload} from './downloadManager';
const kv=new MMKV({id:'esinfy-state'});
async function networkAllows(){const network=await NetInfo.fetch();return Boolean(network.isConnected)&&(!kv.getBoolean('wifi_only')||network.type==='wifi');}
export async function queueCurrentDownload(track:import('../api/audius').Track){if(await networkAllows())queueDownload(track);}
export async function queueAutoDownloads(){if(kv.getBoolean('auto_download')===false||!(await networkAllows()))return;const liked=await getLikedTracks();for(const t of liked)if(!t.local_path)queueDownload(t);}
