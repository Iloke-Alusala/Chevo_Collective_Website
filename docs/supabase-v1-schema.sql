create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  event_type text not null check (event_type in ('Workshop', 'Social', 'Talk')),
  organizer_name text not null default 'Chevo',
  date_label text not null,
  time_label text not null,
  location_text text not null,
  google_maps_value text,
  capacity_label text,
  capacity_status text not null default 'high' check (capacity_status in ('high', 'medium')),
  image_url text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'past')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.events.google_maps_value is
'Stores either a full Google Maps URL, a coordinate pair, or a search query string.';

create unique index if not exists events_one_featured_per_status_idx
on public.events (status)
where is_featured = true;

create index if not exists events_status_sort_order_idx
on public.events (status, sort_order, created_at desc);

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
    (degree_option = 'Other' and coalesce(nullif(trim(degree_other), ''), '') <> '')
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
