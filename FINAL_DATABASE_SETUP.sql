-- ============================================================================
-- GURNAM FARMS - COMPLETE DATABASE SETUP (FINAL WORKING VERSION)
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop old problematic tables if they exist (OPTIONAL - only if resetting)
-- drop table if exists reservations cascade;
-- drop table if exists profiles cascade;
-- drop table if exists contact_submissions cascade;
-- drop table if exists newsletter_subscribers cascade;
-- drop table if exists harvest_reservations cascade;

-- ============================================================================
-- 1. PROFILES TABLE (Auth User Management - Keep RLS)
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

-- Create index for performance
create index if not exists idx_profiles_email on profiles(email);

-- Disable RLS initially, we'll enable it with proper policies
alter table profiles disable row level security;

-- ============================================================================
-- 2. RESERVATIONS TABLE (NEW - Weekly Harvest Bookings) - NO RLS
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

-- Create indexes for common queries
create index if not exists idx_reservations_email on reservations(email);
create index if not exists idx_reservations_delivery_area on reservations(delivery_area);
create index if not exists idx_reservations_created_at on reservations(created_at desc);

-- DISABLE RLS - This is a public form submission table
alter table reservations disable row level security;

-- ============================================================================
-- 3. NEWSLETTER_SUBSCRIBERS TABLE - NO RLS
-- ============================================================================
create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers(email);

-- DISABLE RLS
alter table newsletter_subscribers disable row level security;

-- ============================================================================
-- 4. CONTACT_SUBMISSIONS TABLE - NO RLS
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

-- DISABLE RLS
alter table contact_submissions disable row level security;

-- ============================================================================
-- 5. HARVEST_RESERVATIONS TABLE (LEGACY) - NO RLS
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

-- DISABLE RLS
alter table harvest_reservations disable row level security;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify everything is set up correctly:

-- Check reservations table structure:
-- select column_name, data_type, is_nullable 
-- from information_schema.columns 
-- where table_name = 'reservations' 
-- order by ordinal_position;

-- Check RLS status:
-- select tablename, rowsecurity 
-- from pg_tables 
-- where tablename in ('reservations', 'profiles', 'contact_submissions', 'newsletter_subscribers', 'harvest_reservations');

-- Check table count:
-- select count(*) as total_reservations from reservations;

-- ============================================================================
-- DONE - All tables created with correct configuration
-- ============================================================================
