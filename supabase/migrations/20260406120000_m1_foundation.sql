create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'source_label'
  ) then
    create type public.source_label as enum (
      'ai_suggested',
      'human_backed',
      'hybrid'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  date_of_birth date,
  headline text,
  persona text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.paths (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  summary text not null default '',
  source_label public.source_label not null default 'ai_suggested',
  status text not null default 'draft',
  is_public boolean not null default false,
  generation_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.path_nodes (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  node_kind text not null,
  title text not null,
  summary text not null default '',
  timeline_months integer,
  sort_order integer not null default 0,
  source_label public.source_label not null default 'ai_suggested',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint path_nodes_timeline_months_check
    check (timeline_months is null or timeline_months >= 0)
);

create table if not exists public.node_edges (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  from_node_id uuid not null references public.path_nodes(id) on delete cascade,
  to_node_id uuid not null references public.path_nodes(id) on delete cascade,
  edge_kind text not null default 'next',
  rationale text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  constraint node_edges_unique unique (path_id, from_node_id, to_node_id)
);

create table if not exists public.proof_items (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  node_id uuid references public.path_nodes(id) on delete cascade,
  title text not null,
  summary text not null default '',
  url text,
  source_type text not null default 'article',
  source_label public.source_label not null default 'human_backed',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id uuid references public.paths(id) on delete cascade,
  proof_item_id uuid references public.proof_items(id) on delete cascade,
  value smallint not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint votes_value_check check (value in (-1, 1)),
  constraint votes_target_check
    check (((path_id is not null)::integer + (proof_item_id is not null)::integer) = 1)
);

create unique index if not exists votes_user_path_unique
  on public.votes (user_id, path_id)
  where path_id is not null;

create unique index if not exists votes_user_proof_unique
  on public.votes (user_id, proof_item_id)
  where proof_item_id is not null;

create table if not exists public.mentor_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id uuid not null references public.paths(id) on delete cascade,
  note text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint mentor_interests_unique unique (user_id, path_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_call_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  operation text not null,
  provider text not null,
  provider_mode text not null,
  status text not null,
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  error_message text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens integer not null default 0,
  latency_ms integer,
  cache_hit boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint ai_call_log_input_tokens_check check (input_tokens >= 0),
  constraint ai_call_log_output_tokens_check check (output_tokens >= 0),
  constraint ai_call_log_total_tokens_check check (total_tokens >= 0)
);

create table if not exists public.ai_daily_budget (
  id uuid primary key default gen_random_uuid(),
  budget_date date not null,
  provider text not null,
  request_count integer not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  total_tokens bigint not null default 0,
  soft_limit_tokens bigint,
  hard_limit_tokens bigint,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint ai_daily_budget_unique unique (budget_date, provider),
  constraint ai_daily_budget_request_count_check check (request_count >= 0)
);

create table if not exists public.whatif_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text not null unique,
  owner_user_id uuid references auth.users(id) on delete cascade,
  path_id uuid references public.paths(id) on delete cascade,
  scenario_hash text not null,
  response_payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.parent_dashboard_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feature_flags (
  key text primary key,
  description text not null default '',
  is_enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_flags (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id text not null,
  reason text not null,
  notes text not null default '',
  status text not null default 'open',
  resolved_by_user_id uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.resume_parses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_filename text,
  source_mime_type text,
  source_size_bytes bigint,
  parse_status text not null default 'pending',
  raw_text text not null default '',
  parsed_payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint resume_parses_source_size_bytes_check
    check (source_size_bytes is null or source_size_bytes >= 0)
);

create index if not exists paths_owner_user_id_idx on public.paths (owner_user_id);
create index if not exists paths_is_public_idx on public.paths (is_public);
create index if not exists path_nodes_path_id_idx on public.path_nodes (path_id);
create index if not exists node_edges_path_id_idx on public.node_edges (path_id);
create index if not exists proof_items_path_id_idx on public.proof_items (path_id);
create index if not exists mentor_interests_path_id_idx on public.mentor_interests (path_id);
create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists ai_call_log_user_id_idx on public.ai_call_log (user_id);
create index if not exists ai_call_log_created_at_idx on public.ai_call_log (created_at desc);
create index if not exists ai_daily_budget_date_idx on public.ai_daily_budget (budget_date desc);
create index if not exists whatif_cache_expires_at_idx on public.whatif_cache (expires_at);
create index if not exists parent_dashboard_cache_expires_at_idx on public.parent_dashboard_cache (expires_at);
create index if not exists content_flags_status_idx on public.content_flags (status);
create index if not exists resume_parses_user_id_idx on public.resume_parses (user_id);

create or replace function public.can_read_path(path_uuid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.paths
    where id = path_uuid
      and (
        owner_user_id = auth.uid()
        or is_public = true
      )
  );
$$;

create or replace function public.can_write_path(path_uuid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.paths
    where id = path_uuid
      and owner_user_id = auth.uid()
  );
$$;

create or replace function public.record_ai_call(
  p_operation text,
  p_provider text,
  p_provider_mode text,
  p_status text,
  p_input_tokens integer default 0,
  p_output_tokens integer default 0,
  p_total_tokens integer default 0,
  p_latency_ms integer default null,
  p_cache_hit boolean default false,
  p_user_id uuid default auth.uid(),
  p_request_payload jsonb default '{}'::jsonb,
  p_response_payload jsonb default '{}'::jsonb,
  p_error_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  call_id uuid := gen_random_uuid();
begin
  insert into public.ai_call_log (
    id,
    user_id,
    operation,
    provider,
    provider_mode,
    status,
    request_payload,
    response_payload,
    error_message,
    input_tokens,
    output_tokens,
    total_tokens,
    latency_ms,
    cache_hit
  )
  values (
    call_id,
    p_user_id,
    p_operation,
    p_provider,
    p_provider_mode,
    p_status,
    p_request_payload,
    p_response_payload,
    p_error_message,
    greatest(coalesce(p_input_tokens, 0), 0),
    greatest(coalesce(p_output_tokens, 0), 0),
    greatest(coalesce(p_total_tokens, 0), 0),
    p_latency_ms,
    coalesce(p_cache_hit, false)
  );

  insert into public.ai_daily_budget (
    budget_date,
    provider,
    request_count,
    input_tokens,
    output_tokens,
    total_tokens
  )
  values (
    current_date,
    p_provider,
    1,
    greatest(coalesce(p_input_tokens, 0), 0),
    greatest(coalesce(p_output_tokens, 0), 0),
    greatest(coalesce(p_total_tokens, 0), 0)
  )
  on conflict (budget_date, provider)
  do update set
    request_count = public.ai_daily_budget.request_count + 1,
    input_tokens = public.ai_daily_budget.input_tokens + greatest(coalesce(p_input_tokens, 0), 0),
    output_tokens = public.ai_daily_budget.output_tokens + greatest(coalesce(p_output_tokens, 0), 0),
    total_tokens = public.ai_daily_budget.total_tokens + greatest(coalesce(p_total_tokens, 0), 0),
    updated_at = timezone('utc', now());

  return call_id;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists paths_set_updated_at on public.paths;
create trigger paths_set_updated_at
before update on public.paths
for each row execute function public.set_updated_at();

drop trigger if exists path_nodes_set_updated_at on public.path_nodes;
create trigger path_nodes_set_updated_at
before update on public.path_nodes
for each row execute function public.set_updated_at();

drop trigger if exists proof_items_set_updated_at on public.proof_items;
create trigger proof_items_set_updated_at
before update on public.proof_items
for each row execute function public.set_updated_at();

drop trigger if exists votes_set_updated_at on public.votes;
create trigger votes_set_updated_at
before update on public.votes
for each row execute function public.set_updated_at();

drop trigger if exists mentor_interests_set_updated_at on public.mentor_interests;
create trigger mentor_interests_set_updated_at
before update on public.mentor_interests
for each row execute function public.set_updated_at();

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
before update on public.notifications
for each row execute function public.set_updated_at();

drop trigger if exists ai_daily_budget_set_updated_at on public.ai_daily_budget;
create trigger ai_daily_budget_set_updated_at
before update on public.ai_daily_budget
for each row execute function public.set_updated_at();

drop trigger if exists whatif_cache_set_updated_at on public.whatif_cache;
create trigger whatif_cache_set_updated_at
before update on public.whatif_cache
for each row execute function public.set_updated_at();

drop trigger if exists parent_dashboard_cache_set_updated_at on public.parent_dashboard_cache;
create trigger parent_dashboard_cache_set_updated_at
before update on public.parent_dashboard_cache
for each row execute function public.set_updated_at();

drop trigger if exists feature_flags_set_updated_at on public.feature_flags;
create trigger feature_flags_set_updated_at
before update on public.feature_flags
for each row execute function public.set_updated_at();

drop trigger if exists content_flags_set_updated_at on public.content_flags;
create trigger content_flags_set_updated_at
before update on public.content_flags
for each row execute function public.set_updated_at();

drop trigger if exists resume_parses_set_updated_at on public.resume_parses;
create trigger resume_parses_set_updated_at
before update on public.resume_parses
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.paths enable row level security;
alter table public.path_nodes enable row level security;
alter table public.node_edges enable row level security;
alter table public.proof_items enable row level security;
alter table public.votes enable row level security;
alter table public.mentor_interests enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_call_log enable row level security;
alter table public.ai_daily_budget enable row level security;
alter table public.whatif_cache enable row level security;
alter table public.parent_dashboard_cache enable row level security;
alter table public.feature_flags enable row level security;
alter table public.content_flags enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.resume_parses enable row level security;

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self
on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists paths_select_owner_or_public on public.paths;
create policy paths_select_owner_or_public
on public.paths
for select
using (owner_user_id = auth.uid() or is_public = true);

drop policy if exists paths_insert_owner on public.paths;
create policy paths_insert_owner
on public.paths
for insert
with check (owner_user_id = auth.uid());

drop policy if exists paths_update_owner on public.paths;
create policy paths_update_owner
on public.paths
for update
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

drop policy if exists paths_delete_owner on public.paths;
create policy paths_delete_owner
on public.paths
for delete
using (owner_user_id = auth.uid());

drop policy if exists path_nodes_select_visible_path on public.path_nodes;
create policy path_nodes_select_visible_path
on public.path_nodes
for select
using (public.can_read_path(path_id));

drop policy if exists path_nodes_insert_owner on public.path_nodes;
create policy path_nodes_insert_owner
on public.path_nodes
for insert
with check (public.can_write_path(path_id));

drop policy if exists path_nodes_update_owner on public.path_nodes;
create policy path_nodes_update_owner
on public.path_nodes
for update
using (public.can_write_path(path_id))
with check (public.can_write_path(path_id));

drop policy if exists path_nodes_delete_owner on public.path_nodes;
create policy path_nodes_delete_owner
on public.path_nodes
for delete
using (public.can_write_path(path_id));

drop policy if exists node_edges_select_visible_path on public.node_edges;
create policy node_edges_select_visible_path
on public.node_edges
for select
using (public.can_read_path(path_id));

drop policy if exists node_edges_insert_owner on public.node_edges;
create policy node_edges_insert_owner
on public.node_edges
for insert
with check (public.can_write_path(path_id));

drop policy if exists node_edges_update_owner on public.node_edges;
create policy node_edges_update_owner
on public.node_edges
for update
using (public.can_write_path(path_id))
with check (public.can_write_path(path_id));

drop policy if exists node_edges_delete_owner on public.node_edges;
create policy node_edges_delete_owner
on public.node_edges
for delete
using (public.can_write_path(path_id));

drop policy if exists proof_items_select_visible_path on public.proof_items;
create policy proof_items_select_visible_path
on public.proof_items
for select
using (public.can_read_path(path_id));

drop policy if exists proof_items_insert_owner on public.proof_items;
create policy proof_items_insert_owner
on public.proof_items
for insert
with check (public.can_write_path(path_id));

drop policy if exists proof_items_update_owner on public.proof_items;
create policy proof_items_update_owner
on public.proof_items
for update
using (public.can_write_path(path_id))
with check (public.can_write_path(path_id));

drop policy if exists proof_items_delete_owner on public.proof_items;
create policy proof_items_delete_owner
on public.proof_items
for delete
using (public.can_write_path(path_id));

drop policy if exists votes_select_self on public.votes;
create policy votes_select_self
on public.votes
for select
using (auth.uid() = user_id);

drop policy if exists votes_insert_self on public.votes;
create policy votes_insert_self
on public.votes
for insert
with check (auth.uid() = user_id);

drop policy if exists votes_update_self on public.votes;
create policy votes_update_self
on public.votes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists votes_delete_self on public.votes;
create policy votes_delete_self
on public.votes
for delete
using (auth.uid() = user_id);

drop policy if exists mentor_interests_select_owner_or_path_owner on public.mentor_interests;
create policy mentor_interests_select_owner_or_path_owner
on public.mentor_interests
for select
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.paths
    where id = mentor_interests.path_id
      and owner_user_id = auth.uid()
  )
);

drop policy if exists mentor_interests_insert_self on public.mentor_interests;
create policy mentor_interests_insert_self
on public.mentor_interests
for insert
with check (auth.uid() = user_id);

drop policy if exists mentor_interests_update_self on public.mentor_interests;
create policy mentor_interests_update_self
on public.mentor_interests
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists mentor_interests_delete_self on public.mentor_interests;
create policy mentor_interests_delete_self
on public.mentor_interests
for delete
using (auth.uid() = user_id);

drop policy if exists notifications_select_self on public.notifications;
create policy notifications_select_self
on public.notifications
for select
using (auth.uid() = user_id);

drop policy if exists notifications_insert_self on public.notifications;
create policy notifications_insert_self
on public.notifications
for insert
with check (auth.uid() = user_id);

drop policy if exists notifications_update_self on public.notifications;
create policy notifications_update_self
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists ai_call_log_select_self on public.ai_call_log;
create policy ai_call_log_select_self
on public.ai_call_log
for select
using (auth.uid() = user_id);

drop policy if exists whatif_cache_select_self on public.whatif_cache;
create policy whatif_cache_select_self
on public.whatif_cache
for select
using (auth.uid() = owner_user_id);

drop policy if exists whatif_cache_insert_self on public.whatif_cache;
create policy whatif_cache_insert_self
on public.whatif_cache
for insert
with check (auth.uid() = owner_user_id);

drop policy if exists whatif_cache_update_self on public.whatif_cache;
create policy whatif_cache_update_self
on public.whatif_cache
for update
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists parent_dashboard_cache_select_self on public.parent_dashboard_cache;
create policy parent_dashboard_cache_select_self
on public.parent_dashboard_cache
for select
using (auth.uid() = user_id);

drop policy if exists parent_dashboard_cache_insert_self on public.parent_dashboard_cache;
create policy parent_dashboard_cache_insert_self
on public.parent_dashboard_cache
for insert
with check (auth.uid() = user_id);

drop policy if exists parent_dashboard_cache_update_self on public.parent_dashboard_cache;
create policy parent_dashboard_cache_update_self
on public.parent_dashboard_cache
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists feature_flags_select_all on public.feature_flags;
create policy feature_flags_select_all
on public.feature_flags
for select
using (true);

drop policy if exists content_flags_insert_self on public.content_flags;
create policy content_flags_insert_self
on public.content_flags
for insert
with check (auth.uid() = reporter_user_id);

drop policy if exists resume_parses_select_self on public.resume_parses;
create policy resume_parses_select_self
on public.resume_parses
for select
using (auth.uid() = user_id);

drop policy if exists resume_parses_insert_self on public.resume_parses;
create policy resume_parses_insert_self
on public.resume_parses
for insert
with check (auth.uid() = user_id);

drop policy if exists resume_parses_update_self on public.resume_parses;
create policy resume_parses_update_self
on public.resume_parses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
