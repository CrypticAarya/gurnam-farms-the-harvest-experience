-- Migration: Create reservations table for simplified farm harvest reservations model
-- Run this in Supabase SQL editor after 001_create_profiles_and_rls.sql

create table if not exists reservations (
  id bigserial primary key,
  full_name text not null,
  phone_number text not null,
  email text not null,
  address text not null,
  selected_vegetables text[] not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_reservations_email on reservations(email);
create index if not exists idx_reservations_created_at on reservations(created_at desc);

-- Note: This table has no RLS as it's for public form submissions
-- Admin access is controlled via authentication and route guards
