-- ============================================================================
-- 005_security_hardening.sql
-- Phase 4A: Security Hardening
-- 
-- This migration:
-- 1. Creates app.is_admin(uid uuid) as a SECURITY DEFINER function
-- 2. Replaces all RLS subqueries with calls to app.is_admin()
-- 3. Ensures all functions are marked SECURITY DEFINER
-- 4. Verifies customer/admin access restrictions
-- ============================================================================

-- ============================================================================
-- 1. CREATE app.is_admin() SECURITY DEFINER FUNCTION
-- ============================================================================
-- This function checks if a user has admin role.
-- Runs with elevated privileges (SECURITY DEFINER) to prevent RLS bypass.
CREATE OR REPLACE FUNCTION app.is_admin(uid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = uid LIMIT 1) = 'admin';
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION app.is_admin(uuid) TO anon, authenticated;

-- ============================================================================
-- 2. UPDATE PROFILES RLS POLICIES (Replace subqueries with app.is_admin())
-- ============================================================================

-- Drop existing admin policies for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Create new admin policies using app.is_admin()
CREATE POLICY "Admins can view all profiles (hardened)"
  ON public.profiles
  FOR SELECT
  USING (app.is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile (hardened)"
  ON public.profiles
  FOR UPDATE
  USING (app.is_admin(auth.uid()));

-- ============================================================================
-- 3. UPDATE RESERVATIONS RLS POLICIES (Replace subqueries with app.is_admin())
-- ============================================================================

-- Drop existing admin policy for reservations
DROP POLICY IF EXISTS "Admins can manage reservations" ON public.reservations;

-- Create new admin policy using app.is_admin()
CREATE POLICY "Admins can manage reservations (hardened)"
  ON public.reservations
  FOR ALL
  USING (app.is_admin(auth.uid()));

-- ============================================================================
-- 4. UPDATE RESERVATION_PROGRESS RLS POLICIES (Replace subqueries with app.is_admin())
-- ============================================================================

-- Drop existing admin policy for reservation_progress
DROP POLICY IF EXISTS "Admins can manage reservation progress" ON public.reservation_progress;

-- Create new admin policy using app.is_admin()
CREATE POLICY "Admins can manage reservation progress (hardened)"
  ON public.reservation_progress
  FOR ALL
  USING (app.is_admin(auth.uid()));

-- ============================================================================
-- 5. ENSURE TRIGGER FUNCTIONS ARE SECURITY DEFINER
-- ============================================================================

-- Update handle_new_user() to be SECURITY DEFINER (if not already)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN new.email = 'sarthakghoderao@gmail.com' THEN 'admin'
      ELSE 'customer'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- handle_reservation_created() is already SECURITY DEFINER
-- but let's ensure it's correctly defined
CREATE OR REPLACE FUNCTION public.handle_reservation_created()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.reservation_progress (reservation_id, reservation_received)
  VALUES (NEW.id, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 6. VERIFICATION QUERIES (Run these to test security)
-- ============================================================================
-- These queries verify that RLS policies are working correctly:
--
-- AS CUSTOMER (auth.uid() = their_id):
-- - Can view only their own profile
-- - Can view only their own reservations
-- - Can view only their own reservation progress
-- - Cannot view other customers' data
--
-- AS ADMIN:
-- - Can view all profiles
-- - Can view all reservations
-- - Can view all reservation progress
-- - Can update any record
--
-- TESTING STEPS (from Supabase dashboard):
--
-- 1. Login as a customer user and run:
--    SELECT * FROM public.profiles;
--    -- Should return only their own profile
--
--    SELECT * FROM public.reservations;
--    -- Should return only their own reservations
--
--    SELECT * FROM public.reservation_progress;
--    -- Should return only progress for their reservations
--
-- 2. Login as an admin user and run:
--    SELECT * FROM public.profiles;
--    -- Should return ALL profiles
--
--    SELECT * FROM public.reservations;
--    -- Should return ALL reservations
--
--    SELECT * FROM public.reservation_progress;
--    -- Should return ALL progress records
--
-- 3. Test app.is_admin() function directly:
--    SELECT app.is_admin(auth.uid());
--    -- Should return true if logged in as admin, false otherwise

-- ============================================================================
-- 7. SUMMARY OF CHANGES
-- ============================================================================
-- ✓ Created app.is_admin(uid uuid) SECURITY DEFINER function
-- ✓ Replaced all RLS subqueries with app.is_admin() calls
-- ✓ Ensured all trigger functions are SECURITY DEFINER
-- ✓ Added execute permissions for anon and authenticated roles
-- ✓ Removed hardcoded email checks from profiles table
--   (Email check remains in handle_new_user() trigger for backward compatibility,
--    but can be removed if all admins are assigned via role = 'admin')
--
-- NEXT STEPS:
-- 1. Execute this migration in Supabase SQL Editor
-- 2. Run verification queries to test customer/admin access
-- 3. Test customer signup and admin login flows
-- 4. Proceed to Phase 4B (Database Hardening)
-- ============================================================================
