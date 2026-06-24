-- ============================================================================
-- Migration: Add OAuth fields to profiles table
-- ============================================================================
-- Run this in psql or Supabase SQL editor
-- ============================================================================

-- 1. Add avatar_url and auth_provider columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS auth_provider text;

-- 2. Update the signup trigger to extract data from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Determine role based on email, and insert full_name, avatar_url, auth_provider
  INSERT INTO public.profiles (id, email, role, name, avatar_url, auth_provider)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN new.email = 'sarthakghoderao@gmail.com' THEN 'admin'
      ELSE 'customer'
    END,
    -- Google Auth passes name in full_name
    new.raw_user_meta_data->>'full_name',
    -- Google Auth passes avatar in avatar_url
    new.raw_user_meta_data->>'avatar_url',
    -- Supabase identifies provider in raw_app_meta_data
    new.raw_app_meta_data->>'provider'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- End of migration
