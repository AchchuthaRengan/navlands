revoke all on function public.record_ai_call(
  text,
  text,
  text,
  text,
  integer,
  integer,
  integer,
  integer,
  boolean,
  uuid,
  jsonb,
  jsonb,
  text
) from public, anon, authenticated;

grant execute on function public.record_ai_call(
  text,
  text,
  text,
  text,
  integer,
  integer,
  integer,
  integer,
  boolean,
  uuid,
  jsonb,
  jsonb,
  text
) to service_role;

alter table public.resume_parses
  drop constraint if exists resume_parses_parse_status_check;

alter table public.resume_parses
  add constraint resume_parses_parse_status_check
  check (parse_status in ('pending', 'processing', 'done', 'error'));

create index if not exists resume_parses_parse_status_idx
  on public.resume_parses (parse_status);
