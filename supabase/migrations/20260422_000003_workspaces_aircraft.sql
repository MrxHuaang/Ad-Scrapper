-- Phase 3 (Premium): Workspaces (single-user) + Aircraft registry

-- Workspaces (1 per user for now)
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My workspace',
  created_at timestamptz not null default now()
);

-- Enforce single-user workspace per owner (can be relaxed later)
create unique index if not exists workspaces_owner_unique
  on public.workspaces (owner_user_id);

-- Aircraft registry
create table if not exists public.aircraft (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  registration text not null,
  make text not null default '',
  model text not null default '',
  serial text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists aircraft_workspace_idx
  on public.aircraft (workspace_id);

create unique index if not exists aircraft_workspace_registration_unique
  on public.aircraft (workspace_id, registration);

-- RLS
alter table public.workspaces enable row level security;
alter table public.aircraft enable row level security;

-- Workspaces policies (owner only)
drop policy if exists "workspaces_select_own" on public.workspaces;
create policy "workspaces_select_own" on public.workspaces
for select to authenticated
using (auth.uid() = owner_user_id);

drop policy if exists "workspaces_insert_own" on public.workspaces;
create policy "workspaces_insert_own" on public.workspaces
for insert to authenticated
with check (auth.uid() = owner_user_id);

drop policy if exists "workspaces_update_own" on public.workspaces;
create policy "workspaces_update_own" on public.workspaces
for update to authenticated
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists "workspaces_delete_own" on public.workspaces;
create policy "workspaces_delete_own" on public.workspaces
for delete to authenticated
using (auth.uid() = owner_user_id);

-- Aircraft policies (must belong to a workspace owned by user)
drop policy if exists "aircraft_select_own_workspace" on public.aircraft;
create policy "aircraft_select_own_workspace" on public.aircraft
for select to authenticated
using (
  exists (
    select 1
    from public.workspaces w
    where w.id = aircraft.workspace_id
      and w.owner_user_id = auth.uid()
  )
);

drop policy if exists "aircraft_insert_own_workspace" on public.aircraft;
create policy "aircraft_insert_own_workspace" on public.aircraft
for insert to authenticated
with check (
  exists (
    select 1
    from public.workspaces w
    where w.id = aircraft.workspace_id
      and w.owner_user_id = auth.uid()
  )
);

drop policy if exists "aircraft_update_own_workspace" on public.aircraft;
create policy "aircraft_update_own_workspace" on public.aircraft
for update to authenticated
using (
  exists (
    select 1
    from public.workspaces w
    where w.id = aircraft.workspace_id
      and w.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces w
    where w.id = aircraft.workspace_id
      and w.owner_user_id = auth.uid()
  )
);

drop policy if exists "aircraft_delete_own_workspace" on public.aircraft;
create policy "aircraft_delete_own_workspace" on public.aircraft
for delete to authenticated
using (
  exists (
    select 1
    from public.workspaces w
    where w.id = aircraft.workspace_id
      and w.owner_user_id = auth.uid()
  )
);

