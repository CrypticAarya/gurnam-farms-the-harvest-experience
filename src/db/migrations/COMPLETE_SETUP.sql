-- COMPLETE GURNAM FARMS DATABASE SETUP
-- Run these migrations in order in Supabase SQL editor

-- ============================================================================
-- STEP 1: Create profiles table (linked to auth.users)
-- ============================================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  city text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Allow users to read their own profile
create policy "profiles: users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow admins to read all profiles
create policy "profiles: admins can read all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Indexes
create index if not exists idx_profiles_email on profiles(email);

-- ============================================================================
-- STEP 2: Create reservations table (new weekly harvest booking model)
-- ============================================================================
create table if not exists reservations (
  id bigserial primary key,
  full_name text not null,
  phone_number text not null,
  email text not null,
  delivery_area text not null default 'Patiala',
  address text not null,
  selected_vegetables text[] not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_reservations_email on reservations(email);
create index if not exists idx_reservations_delivery_area on reservations(delivery_area);
create index if not exists idx_reservations_created_at on reservations(created_at desc);

-- No RLS needed - public form submissions, admin access controlled via route guards

-- ============================================================================
-- STEP 3: Create newsletter_subscribers table (optional - for future use)
-- ============================================================================
create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers(email);

-- ============================================================================
-- STEP 4: Create contact_submissions table (for contact form)
-- ============================================================================
create table if not exists contact_submissions (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_submissions_email on contact_submissions(email);
create index if not exists idx_contact_submissions_created_at on contact_submissions(created_at desc);

-- ============================================================================
-- STEP 5: Create harvest_reservations table (LEGACY - for backward compatibility)
-- ============================================================================
create table if not exists harvest_reservations (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_harvest_reservations_email on harvest_reservations(email);

-- ============================================================================
-- DONE
-- ============================================================================
-- All tables created successfully
-- Run any ALTER TABLE statements below if needed (e.g., adding columns)
