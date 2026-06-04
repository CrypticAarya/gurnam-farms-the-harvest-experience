-- 002_reservations_table.sql
-- Create reservations table used by the application

CREATE TABLE IF NOT EXISTS public.reservations (
  id bigserial PRIMARY KEY,
  profile_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  delivery_area text NOT NULL,
  address text NOT NULL,
  selected_vegetables text[] NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservations_profile_id ON public.reservations(profile_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at DESC);
