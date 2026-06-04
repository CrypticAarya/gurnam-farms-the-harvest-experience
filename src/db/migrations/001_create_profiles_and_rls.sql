-- Migration: create profiles table, add profile_id to reservations and enquiries, enable RLS
-- Run this in psql or Supabase SQL editor

-- 1) Create `profiles` table linked to auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  city text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

-- 2) Add profile_id to harvest_reservations and contact_submissions
alter table if exists harvest_reservations
  add column if not exists profile_id uuid references profiles(id);

alter table if exists contact_submissions
  add column if not exists profile_id uuid references profiles(id);

-- 3) Enable Row Level Security on tables that should be owner-scoped
alter table if exists harvest_reservations enable row level security;
alter table if exists contact_submissions enable row level security;

-- 4) Policy: owners can insert/select/update/delete their own rows
create policy if not exists "Reservations: owners only" on harvest_reservations
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy if not exists "Contact: owners only" on contact_submissions
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- 5) Policy: admins can bypass ownership - check role in profiles table
create policy if not exists "Reservations: admins" on harvest_reservations
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy if not exists "Contact: admins" on contact_submissions
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 6) Make sure newsletter_subscribers stays public (no RLS)

-- 7) Indexes for performance
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_reservations_profile_id on harvest_reservations(profile_id);
create index if not exists idx_contacts_profile_id on contact_submissions(profile_id);

-- End
