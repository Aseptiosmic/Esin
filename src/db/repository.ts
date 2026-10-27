import * as SQLite from 'expo-sqlite';
import type { Track } from '../api/audius';

export type StoredTrack = Track & { liked?: boolean; local_path?: string | null; liked_at?: number | null; last_played_at?: number | null };
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
export async function database() {
  if (!dbPromise) dbPromise = (async () => {
    const db = await SQLite.openDatabaseAsync('esinfy.db');
    await db.execAsync(`PRAGMA journal_mode = WAL; PRAGMA user_version = 1;
      CREATE TABLE IF NOT EXISTS tracks (audius_id TEXT PRIMARY KEY, title TEXT, artist_name TEXT, artist_id TEXT, artwork_url TEXT, genre TEXT, duration_sec INTEGER, permalink TEXT, liked INTEGER NOT NULL DEFAULT 0, liked_at INTEGER, local_path TEXT, last_played_at INTEGER);
      CREATE TABLE IF NOT EXISTS liked_artists (artist_id TEXT PRIMARY KEY, name TEXT NOT NULL);`);
    return db;
  })();
  return dbPromise;
}
export async function cacheTracks(tracks: Track[]) { const db = await database(); for (const t of tracks) await db.runAsync('INSERT INTO tracks(audius_id,title,artist_name,artist_id,artwork_url,genre,duration_sec,permalink) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(audius_id) DO UPDATE SET title=excluded.title, artist_name=excluded.artist_name, artwork_url=excluded.artwork_url', t.id,t.title,t.artistName,t.artistId,t.artwork,t.genre,t.duration,t.permalink); }
export async function getTrack(id: string): Promise<StoredTrack | null> { const db=await database(); const row=await db.getFirstAsync<any>('SELECT * FROM tracks WHERE audius_id=?',id); return row ? {id:row.audius_id,title:row.title,artistName:row.artist_name,artistId:row.artist_id,artwork:row.artwork_url,genre:row.genre,duration:row.duration_sec,permalink:row.permalink,streamable:true,liked:!!row.liked,local_path:row.local_path} : null; }
function fromRows(rows:any[]):StoredTrack[]{return rows.map((r:any)=>({id:r.audius_id,title:r.title,artistName:r.artist_name,artistId:r.artist_id,artwork:r.artwork_url,genre:r.genre,duration:r.duration_sec,permalink:r.permalink,streamable:true,liked:!!r.liked,local_path:r.local_path}));}
export async function getLikedTracks(): Promise<StoredTrack[]> { const db=await database(); const rows=await db.getAllAsync<any>('SELECT * FROM tracks WHERE liked=1 ORDER BY liked_at DESC'); return fromRows(rows); }
export async function getDownloadedTracks(): Promise<StoredTrack[]> { const db=await database(); const rows=await db.getAllAsync<any>('SELECT * FROM tracks WHERE local_path IS NOT NULL ORDER BY last_played_at DESC'); return fromRows(rows); }
export async function clearDownloads(){const db=await database();const rows=await db.getAllAsync<any>('SELECT audius_id,local_path FROM tracks WHERE local_path IS NOT NULL');const fs=await import('expo-file-system/legacy');for(const row of rows)if(row.local_path)await fs.deleteAsync(row.local_path,{idempotent:true}).catch(()=>{});await db.runAsync('UPDATE tracks SET local_path=NULL WHERE local_path IS NOT NULL');}
export async function setLiked(t: Track, liked: boolean) { await cacheTracks([t]); const db=await database(); await db.runAsync('UPDATE tracks SET liked=?, liked_at=? WHERE audius_id=?',liked?1:0,liked?Date.now():null,t.id); if(t.artistId) await db.runAsync('INSERT OR IGNORE INTO liked_artists(artist_id,name) VALUES(?,?)',t.artistId,t.artistName); const {scheduleProfileSync}=await import('../api/profileSync'); scheduleProfileSync(); if(liked){const {queueAutoDownloads}=await import('../player/autoDownloads');void queueAutoDownloads();} }
export async function setLocalPath(id:string,path:string|null) { const db=await database(); await db.runAsync('UPDATE tracks SET local_path=? WHERE audius_id=?',path,id); }
export async function getCachedTrack(id:string) { return getTrack(id); }
