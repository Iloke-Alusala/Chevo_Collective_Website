create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  description text not null,
  event_type text not null check (event_type in ('Workshop', 'Social', 'Talk')),
  organizer_name text not null default 'Chevo',
  event_datetime timestamptz not null,
  date_label text not null,
  time_label text not null,
  location_text text not null,
  google_maps_value text,
  capacity_label text,
  capacity_status text not null default 'high' check (capacity_status in ('high', 'medium')),
  image_url text not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.events.google_maps_value is
'Stores either a full Google Maps URL, a coordinate pair, or a search query string.';

comment on column public.events.event_datetime is
'Machine-readable event time. Use event_datetime > now() to derive upcoming/past status. date_label and time_label are for display only.';

create index if not exists events_datetime_idx
on public.events (event_datetime desc);

create table if not exists public.rsvp_records (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email citext not null,
  degree_option text not null check (
    degree_option in (
      'Mechatronics Engineering',
      'Electrical and Computer Engineering',
      'Electrical Engineering',
      'Mech and Mechatronics Engineering',
      'Civil Engineering',
      'Mechanical Engineering',
      'Chemical Engineering',
      'Architecture, Planning & Geomatics',
      'Humanities Faculty',
      'Computer Science',
      'Commerce Faculty',
      'Health Sciences Faculty',
      'Law Faculty',
      'Science Faculty',
      'Other'
    )
  ),
  degree_other text,
  created_at timestamptz not null default now(),
  constraint rsvp_records_event_email_unique unique (event_id, email),
  constraint rsvp_records_other_degree_required check (
    (degree_option <> 'Other' and coalesce(nullif(trim(degree_other), ''), '') = '')
    or
    (degree_option = 'Other' and coalesce(nullif(trim(degree_other), ''), '') <> ''
      and length(trim(degree_other)) < 100)
  )
);

create index if not exists rsvp_records_event_created_at_idx
on public.rsvp_records (event_id, created_at desc);

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
      select 1 from public.events
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
