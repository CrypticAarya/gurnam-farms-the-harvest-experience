-- ============================================================================
-- Migration 007: Fix contact_submissions RLS policies + add status column
-- ============================================================================
-- The existing policy requires profile_id = auth.uid() for INSERT.
-- We replace it with a policy that allows any authenticated user to insert,
-- and admins to read/update all rows.
-- ============================================================================

-- 1. Drop the overly restrictive existing policies (from migration 001)
DROP POLICY IF EXISTS "Contact: owners only" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact: admins" ON public.contact_submissions;

-- 2. Add required columns (status and profile_id)
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'Contacted', 'Closed'));

-- 3. Allow any authenticated user to INSERT a contact submission
CREATE POLICY "contact_submissions: authenticated users can insert"
  ON public.contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Allow users to read their own submissions (matched by profile_id)
CREATE POLICY "contact_submissions: owners can read own"
  ON public.contact_submissions
  FOR SELECT
  USING (profile_id = auth.uid());

-- 5. Allow admins to read ALL contact submissions
CREATE POLICY "contact_submissions: admins can read all"
  ON public.contact_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 6. Allow admins to UPDATE status on contact submissions
CREATE POLICY "contact_submissions: admins can update status"
  ON public.contact_submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (true);

-- Done
