-- 004_rls_policies.sql
-- Row Level Security policies for reservations and reservation_progress

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_progress ENABLE ROW LEVEL SECURITY;

-- Policies for reservations:
-- Customers can SELECT/INSERT/UPDATE their own reservations (profile_id = auth.uid())
CREATE POLICY "Users can select own reservations"
  ON public.reservations
  FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert reservations with own profile"
  ON public.reservations
  FOR INSERT
  WITH CHECK (profile_id = auth.uid() OR profile_id IS NULL);

CREATE POLICY "Users can update own reservations"
  ON public.reservations
  FOR UPDATE
  USING (profile_id = auth.uid());

-- Admins can SELECT/UPDATE all reservations (check role in profiles)
CREATE POLICY "Admins can manage reservations"
  ON public.reservations
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Policies for reservation_progress:
CREATE POLICY "Users can select their reservation progress"
  ON public.reservation_progress
  FOR SELECT
  USING ((SELECT profile_id FROM public.reservations WHERE id = reservation_id) = auth.uid());

CREATE POLICY "Users can update their reservation progress"
  ON public.reservation_progress
  FOR UPDATE
  USING ((SELECT profile_id FROM public.reservations WHERE id = reservation_id) = auth.uid());

CREATE POLICY "Admins can manage reservation progress"
  ON public.reservation_progress
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
