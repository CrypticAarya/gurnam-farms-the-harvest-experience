-- QUICK REFERENCE: Reservations Table Setup Only
-- If you only want to create the reservations table (and it already has profiles, contact_submissions, etc.)

-- Create reservations table
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

-- Create indexes for performance
create index if not exists idx_reservations_email on reservations(email);
create index if not exists idx_reservations_delivery_area on reservations(delivery_area);
create index if not exists idx_reservations_created_at on reservations(created_at desc);

-- Verify table created
select * from reservations limit 1;
