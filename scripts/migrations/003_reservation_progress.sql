-- 003_reservation_progress.sql
-- Create reservation_progress table and trigger to auto-create progress on reservation insert

CREATE TABLE IF NOT EXISTS public.reservation_progress (
  id bigserial PRIMARY KEY,
  reservation_id bigint NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  reservation_received boolean NOT NULL DEFAULT true,
  farm_preparation boolean NOT NULL DEFAULT false,
  harvest_ready boolean NOT NULL DEFAULT false,
  harvested boolean NOT NULL DEFAULT false,
  week_1_delivered boolean NOT NULL DEFAULT false,
  week_2_delivered boolean NOT NULL DEFAULT false,
  week_3_delivered boolean NOT NULL DEFAULT false,
  week_4_delivered boolean NOT NULL DEFAULT false,
  week_5_delivered boolean NOT NULL DEFAULT false,
  week_6_delivered boolean NOT NULL DEFAULT false,
  week_7_delivered boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by reservation_id
CREATE INDEX IF NOT EXISTS idx_reservation_progress_reservation_id ON public.reservation_progress(reservation_id);

-- Function to create a progress row when a reservation is inserted
CREATE OR REPLACE FUNCTION public.handle_reservation_created()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.reservation_progress (reservation_id, reservation_received)
  VALUES (NEW.id, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_reservation_created ON public.reservations;

-- Create trigger on reservations AFTER INSERT
CREATE TRIGGER on_reservation_created
AFTER INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.handle_reservation_created();

-- RLS policies will be added separately in 004_rls_policies.sql
