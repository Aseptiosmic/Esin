import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';
const kv=new MMKV({id:'esinfy-auth'});
const storage={getItem:(key:string)=>kv.getString(key)??null,setItem:(key:string,value:string)=>{kv.set(key,value);},removeItem:(key:string)=>{kv.delete(key);}};
const url=process.env.EXPO_PUBLIC_SUPABASE_URL??'';const anon=process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY??'';
export const supabase=createClient(url||'https://placeholder.supabase.co',anon||'placeholder-anon-key',{auth:{storage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
export async function ensureAnonymousSession(){if(!url||!anon) return null;const {data}=await supabase.auth.getSession();if(data.session)return data.session;const {data:created,error}=await supabase.auth.signInAnonymously();if(error)throw error;return created.session;}
