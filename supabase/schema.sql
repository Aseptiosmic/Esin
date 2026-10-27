-- Enable anonymous sign-in in Supabase Dashboard before deploying.
drop table if exists public.users cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 32),
  track_ids text[] not null default '{}',
  artist_ids text[] not null default '{}',
  genre_counts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint max_tracks check (cardinality(track_ids) <= 200),
  constraint max_artists check (cardinality(artist_ids) <= 200)
);

alter table public.profiles enable row level security;
create policy "own_select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own_update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own_delete" on public.profiles for delete to authenticated using (auth.uid() = id);
create index profiles_updated_at_idx on public.profiles(updated_at desc);

create or replace function public.find_twins(my_tracks text[], my_artists text[], lim int default 5)
returns table (nickname text, common_tracks text[], common_artist_count int, genre_counts jsonb, score int)
language sql
stable
security definer
set search_path = public
as $$
  with c as (
    select p.nickname, p.genre_counts,
      array(select unnest(p.track_ids) intersect select unnest(coalesce(my_tracks, '{}'))) as ct,
      cardinality(array(select unnest(p.artist_ids) intersect select unnest(coalesce(my_artists, '{}')))) as ca
    from public.profiles p
    where auth.uid() is not null and p.id <> auth.uid()
    order by p.updated_at desc
    limit 100
  )
  select nickname, ct, ca, genre_counts, (cardinality(ct) * 10 + ca * 5)::int as score
  from c
  order by score desc
  limit least(greatest(coalesce(lim, 5), 0), 20);
$$;

revoke all on function public.find_twins(text[], text[], int) from public, anon;
grant execute on function public.find_twins(text[], text[], int) to authenticated;
