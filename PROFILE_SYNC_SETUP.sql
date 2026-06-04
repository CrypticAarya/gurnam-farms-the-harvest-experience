-- ============================================================================
-- AUTOMATIC PROFILE SYNC SETUP
-- ============================================================================
-- This SQL sets up automatic profile creation when new users sign up.
-- Execute these queries in the Supabase SQL Editor.
-- ============================================================================

-- 1. Create profiles table (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  name text,
  phone text,
  city text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add RLS policies to profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Only service role can insert (trigger will do this)
CREATE POLICY "Only service role can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (false);

-- ============================================================================
-- 2. Create function to handle new user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Determine role based on email
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

-- ============================================================================
-- 3. Create trigger on auth.users for new signups
-- ============================================================================
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. Verify trigger is working
-- ============================================================================
-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================================================
-- 5. Add indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- ============================================================================
-- 6. Verify profiles table structure
-- ============================================================================
-- Run this to verify columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- 7. Check existing profiles
-- ============================================================================
-- View all profiles
SELECT id, email, role, created_at FROM public.profiles ORDER BY created_at DESC LIMIT 10;

-- Check if any admins exist
SELECT id, email, role FROM public.profiles WHERE role = 'admin';

-- ============================================================================
-- 8. Manual profile creation (if needed)
-- ============================================================================
-- Use this if you need to manually create a profile for an existing auth user
-- Replace 'USER_ID' with actual user ID and 'EMAIL' with actual email
-- INSERT INTO public.profiles (id, email, role)
-- VALUES ('USER_ID', 'EMAIL', 'customer')
-- ON CONFLICT (id) DO UPDATE SET role = 'customer';

-- To manually promote a user to admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'user@example.com';

-- ============================================================================
-- TESTING THE SETUP
-- ============================================================================
-- 1. Go to your app and sign up with a new account
-- 2. Profile should be automatically created with role='customer'
-- 3. If email is 'sarthakghoderao@gmail.com', role should be 'admin'
-- 4. Go to /admin/login and login with admin account
-- 5. Admin dashboard should load successfully
-- 6. Try logging in with non-admin account and accessing /admin/
-- 7. Should redirect to home page (/)

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
-- Q: Profile not created after signup?
-- A: Check if trigger exists and auth user was created:
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.profiles;
-- If trigger missing, run: CREATE TRIGGER on_auth_user_created...

-- Q: Getting "permission denied" errors?
-- A: Check RLS policies are correct:
SELECT * FROM information_schema.role_table_grants WHERE table_name = 'profiles';

-- Q: Need to check trigger function?
-- A: View the function:
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- ============================================================================
