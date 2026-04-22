-- Phase 2 (UX Core): AD detail persistence
-- Tables:
-- - ad_saved: user saves ADs
-- - ad_reviewed: user marks ADs as reviewed
-- - ad_notes: user notes per AD

-- Enable required extension for UUID generation if needed (usually enabled by default on Supabase)
-- create extension if not exists "pgcrypto";

create table if not exists public.ad_saved (
  user_id uuid not null references auth.users(id) on delete cascade,
  ad_number text not null,
  source text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, ad_number)
);

create table if not exists public.ad_reviewed (
  user_id uuid not null references auth.users(id) on delete cascade,
  ad_number text not null,
  source text not null,
  reviewed_at timestamptz not null default now(),
  primary key (user_id, ad_number)
);

create table if not exists public.ad_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ad_number text not null,
  source text not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ad_notes_user_ad_idx
  on public.ad_notes (user_id, ad_number);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ad_notes_updated_at on public.ad_notes;
create trigger trg_ad_notes_updated_at
before update on public.ad_notes
for each row execute function public.set_updated_at();

-- RLS
alter table public.ad_saved enable row level security;
alter table public.ad_reviewed enable row level security;
alter table public.ad_notes enable row level security;

-- Policies: users can only access their own rows
drop policy if exists "ad_saved_select_own" on public.ad_saved;
create policy "ad_saved_select_own" on public.ad_saved
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "ad_saved_insert_own" on public.ad_saved;
create policy "ad_saved_insert_own" on public.ad_saved
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "ad_saved_delete_own" on public.ad_saved;
create policy "ad_saved_delete_own" on public.ad_saved
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists "ad_reviewed_select_own" on public.ad_reviewed;
create policy "ad_reviewed_select_own" on public.ad_reviewed
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "ad_reviewed_upsert_own" on public.ad_reviewed;
create policy "ad_reviewed_upsert_own" on public.ad_reviewed
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "ad_reviewed_delete_own" on public.ad_reviewed;
create policy "ad_reviewed_delete_own" on public.ad_reviewed
for delete to authenticated
using (auth.uid() = user_id);

drop policy if exists "ad_notes_select_own" on public.ad_notes;
create policy "ad_notes_select_own" on public.ad_notes
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "ad_notes_insert_own" on public.ad_notes;
create policy "ad_notes_insert_own" on public.ad_notes
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "ad_notes_update_own" on public.ad_notes;
create policy "ad_notes_update_own" on public.ad_notes
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "ad_notes_delete_own" on public.ad_notes;
create policy "ad_notes_delete_own" on public.ad_notes
for delete to authenticated
using (auth.uid() = user_id);

