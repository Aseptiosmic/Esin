import {MMKV} from 'react-native-mmkv';import Constants from 'expo-constants';import {requireNativeModule} from 'expo';
const kv=new MMKV({id:'esinfy-state'});const Installer=requireNativeModule<{getVersionCode:()=>number}>('EsinfyInstaller');async function currentVersionCode(){try{return await Installer.getVersionCode()}catch{return Number(Constants.expoConfig?.android?.versionCode??1)}}
export type VersionManifest={latest_version_code:number;latest_version_name:string;min_version_code:number;force_update:boolean;apk_url:string;apk_sha256:string;changelog:string};
export async function versionGate(){
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),5000);
    const res=await fetch('https://esinfy.vercel.app/version.json',{cache:'no-store',signal:controller.signal});clearTimeout(timer);
    if(!res.ok)throw new Error('Version service unavailable');
    const manifest=await res.json() as VersionManifest;kv.set('last_version_json',JSON.stringify(manifest));
const current=await currentVersionCode();
    return {manifest,required:current<manifest.min_version_code||(current<manifest.latest_version_code&&manifest.force_update),recommended:current<manifest.latest_version_code&&!manifest.force_update};
  }catch{
    const cached=kv.getString('last_version_json');if(!cached)return {manifest:null,required:false,recommended:false};
    try{const manifest=JSON.parse(cached) as VersionManifest;const current=await currentVersionCode();return {manifest,required:current<manifest.min_version_code||(current<manifest.latest_version_code&&manifest.force_update),recommended:current<manifest.latest_version_code&&!manifest.force_update};}
    catch{return {manifest:null,required:false,recommended:false};}
  }
}
