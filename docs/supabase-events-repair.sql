create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  event_type text not null default 'Workshop',
  organizer_name text not null default 'Chevo',
  event_datetime timestamptz not null default (now() + interval '7 days'),
  date_label text not null default 'TBD',
  time_label text not null default 'TBD',
  location_text text not null default 'TBD',
  google_maps_value text,
  capacity_label text,
  capacity_status text not null default 'high',
  image_url text not null default 'https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events
  add column if not exists organizer_name text default 'Chevo',
  add column if not exists event_datetime timestamptz default (now() + interval '7 days'),
  add column if not exists date_label text default 'TBD',
  add column if not exists time_label text default 'TBD',
  add column if not exists location_text text default 'TBD',
  add column if not exists google_maps_value text,
  add column if not exists capacity_label text,
  add column if not exists capacity_status text default 'high',
  add column if not exists image_url text default 'https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808',
  add column if not exists is_featured boolean default false,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.events
set
  slug = lower(regexp_replace(coalesce(nullif(trim(slug), ''), 'event-' || substr(id::text, 1, 8)), '[^a-z0-9]+', '-', 'g')),
  title = coalesce(nullif(trim(title), ''), 'Untitled Event'),
  description = coalesce(nullif(trim(description), ''), 'Event details coming soon.'),
  event_type = case lower(coalesce(event_type, 'workshop'))
    when 'social' then 'Social'
    when 'talk' then 'Talk'
    when 'talks' then 'Talk'
    else 'Workshop'
  end,
  organizer_name = coalesce(nullif(trim(organizer_name), ''), 'Chevo'),
  event_datetime = coalesce(event_datetime, now() + interval '7 days'),
  date_label = coalesce(nullif(trim(date_label), ''), 'TBD'),
  time_label = coalesce(nullif(trim(time_label), ''), 'TBD'),
  location_text = coalesce(nullif(trim(location_text), ''), 'TBD'),
  capacity_status = case lower(coalesce(capacity_status, 'high'))
    when 'medium' then 'medium'
    else 'high'
  end,
  image_url = coalesce(
    nullif(trim(image_url), ''),
    'https://api.builder.io/api/v1/image/assets/TEMP/001baf8a787375c9a0faa49d89b6dab5fbf00d29?width=808'
  ),
  is_featured = coalesce(is_featured, false),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.events
  alter column slug set not null,
  alter column title set not null,
  alter column description set not null,
  alter column event_type set not null,
  alter column organizer_name set not null,
  alter column event_datetime set not null,
  alter column date_label set not null,
  alter column time_label set not null,
  alter column location_text set not null,
  alter column capacity_status set not null,
  alter column image_url set not null,
  alter column is_featured set not null,
  alter column created_at set not null,
  alter column updated_at set not null;

alter table public.events
  alter column organizer_name set default 'Chevo',
  alter column capacity_status set default 'high',
  alter column is_featured set default false,
  alter column created_at set default now(),
  alter column updated_at set default now();

create unique index if not exists events_slug_unique_idx
on public.events (slug);

create index if not exists events_datetime_idx
on public.events (event_datetime desc);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'events_slug_format_check'
      and conrelid = 'public.events'::regclass
  ) then
    alter table public.events
      add constraint events_slug_format_check
      check (slug ~ '^[a-z0-9-]+$');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'events_event_type_check'
      and conrelid = 'public.events'::regclass
  ) then
    alter table public.events
      add constraint events_event_type_check
      check (event_type in ('Workshop', 'Social', 'Talk'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'events_capacity_status_check'
      and conrelid = 'public.events'::regclass
  ) then
    alter table public.events
      add constraint events_capacity_status_check
      check (capacity_status in ('high', 'medium'));
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;

create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create or replace function public.check_single_featured()
returns trigger
language plpgsql
as $$
begin
  if new.is_featured = true then
    if exists (
      select 1
      from public.events
      where is_featured = true
        and (event_datetime > now()) = (new.event_datetime > now())
        and id <> new.id
    ) then
      raise exception 'Only one event can be featured per category (upcoming/past)';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists events_check_single_featured on public.events;

create trigger events_check_single_featured
before insert or update on public.events
for each row
execute function public.check_single_featured();
