import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated;
create schema auth; create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
grant usage on schema auth to authenticated, anon;
grant execute on function auth.uid() to authenticated, anon;
insert into auth.users values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222');
`);
await db.exec(await readFile(new URL('../schema.sql', import.meta.url), 'utf8'));
await db.exec(`set role authenticated; set request.jwt.claim.sub='11111111-1111-1111-1111-111111111111';
insert into public.profiles(id,nickname,track_ids,artist_ids,genre_counts) values ('11111111-1111-1111-1111-111111111111','A',array['x','y'],array['artist'], '{"Jazz":2}');
set request.jwt.claim.sub='22222222-2222-2222-2222-222222222222';
insert into public.profiles(id,nickname,track_ids,artist_ids,genre_counts) values ('22222222-2222-2222-2222-222222222222','B',array['x','z'],array['artist'], '{"Jazz":1}');`);
const own = await db.query('select id, nickname from public.profiles');
assert.equal(own.rows.length, 1); assert.equal(own.rows[0].nickname, 'B');
const twins = await db.query("select * from public.find_twins(array['x','z'],array['artist'],5)");
assert.equal(twins.rows.length,1); assert.equal(twins.rows[0].nickname,'A'); assert.equal(twins.rows[0].score,15); assert.deepEqual(twins.rows[0].common_tracks,['x']);
const probing = await db.query("select * from public.find_twins(array['y'],array['artist'],5)");
assert.equal(probing.rows.length,0);
let blocked = false;
try { const result=await db.query("update public.profiles set nickname='attacker' where id='11111111-1111-1111-1111-111111111111' returning id"); assert.equal(result.rows.length,0); blocked=true; } catch { blocked=true; }
assert.ok(blocked);
await db.exec('reset role; set role anon;');
let denied=false; try { await db.query("select * from public.find_twins(array['x'],array['artist'],5)"); } catch { denied=true; }
assert.ok(denied, 'anonymous RPC must be denied');
console.log('SQL/RLS/RPC checks passed');
await db.close();
