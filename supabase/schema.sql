-- DİKKAT: Bu başlangıç şeması eski users/profiles tablolarını ve verilerini SİLER.
-- Yalnızca yeni bir projede veya yedeğinizi aldıktan sonra, SQL Editor'da bir kez çalıştırın.
-- Dashboard > Authentication > Providers: Allow anonymous sign-ins seçeneğini açın.
begin;
drop table if exists public.users cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  track_ids text[] not null default '{}',
  artist_ids text[] not null default '{}',
  genre_counts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint max_tracks check (cardinality(track_ids) <= 200),
  constraint max_artists check (cardinality(artist_ids) <= 200),
  constraint valid_nickname check (char_length(trim(nickname)) between 1 and 40),
  constraint valid_genres check (jsonb_typeof(genre_counts) = 'object' and pg_column_size(genre_counts) <= 16384)
);
alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon;
grant select, insert, update, delete on public.profiles to authenticated;
create policy "own_select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own_update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own_delete" on public.profiles for delete to authenticated using (auth.uid() = id);

-- İstemci zamanı ile sıralamanın değiştirilmesini önle.
create or replace function public.profiles_set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.profiles_set_updated_at();

-- security definer ham satır döndürmez. Parametreler kaydedilmiş kendi listenin
-- alt kümesi olmalı: aksi halde rastgele ID'lerle başkalarının şarkıları taranabilir.
create or replace function public.find_twins(my_tracks text[], my_artists text[], lim int default 5)
returns table (nickname text, common_tracks text[], common_artist_count int, genre_counts jsonb, score int)
language sql security definer set search_path = public as $$
  with me as (
    select p.id from public.profiles p
    where p.id = auth.uid()
      and coalesce(my_tracks, '{}'::text[]) <@ p.track_ids
      and coalesce(my_artists, '{}'::text[]) <@ p.artist_ids
      and cardinality(coalesce(my_tracks, '{}'::text[])) <= 200
      and cardinality(coalesce(my_artists, '{}'::text[])) <= 200
  ), c as (
    select p.nickname, p.genre_counts,
      array(select unnest(p.track_ids) intersect select unnest(coalesce(my_tracks, '{}'::text[]))) as ct,
      cardinality(array(select unnest(p.artist_ids) intersect select unnest(coalesce(my_artists, '{}'::text[])))) as ca
    from public.profiles p cross join me
    where p.id <> me.id
    order by p.updated_at desc
    limit 100
  )
  select c.nickname, c.ct, c.ca, c.genre_counts, (cardinality(c.ct) * 10 + c.ca * 5)::int as score
  from c order by score desc, c.nickname
  limit greatest(0, least(coalesce(lim, 5), 20));
$$;
revoke all on function public.find_twins(text[], text[], int) from public, anon;
grant execute on function public.find_twins(text[], text[], int) to authenticated;
commit;
