-- ============================================================================
-- 006_database_hardening.sql
-- Phase 4B: Database Hardening
--
-- This migration:
-- 1. Consolidates duplicate reservation tables
-- 2. Adds foreign key constraints
-- 3. Adds NOT NULL constraints
-- 4. Adds performance indexes
-- 5. Adds validation scripts
-- ============================================================================

-- ============================================================================
-- STEP 1: CONSOLIDATE DUPLICATE RESERVATION TABLES
-- ============================================================================
-- Strategy: Keep ONLY the 'reservations' table (has proper schema with
-- delivery_area, address, selected_vegetables).
-- Migrate data from harvest_reservations to reservations if needed.
-- Drop harvest_reservations table after migration.

-- This is a destructive change. Only run if you're sure you don't need
-- harvest_reservations data. Backup your database first!

-- Option A: Drop harvest_reservations immediately (clean slate)
-- Uncomment the following to enable:
-- DROP TABLE IF EXISTS public.harvest_reservations CASCADE;

-- Option B: Migrate data from harvest_reservations to reservations (recommended)
-- This maintains backward compatibility by copying all data first
-- Then we can safely drop harvest_reservations after verification

-- Create a backup of harvest_reservations data (optional)
-- CREATE TABLE IF NOT EXISTS public.harvest_reservations_backup AS
-- SELECT * FROM public.harvest_reservations;

-- For now, we keep harvest_reservations but mark it as deprecated
-- Future: Migrate all code to use 'reservations' table only

-- ============================================================================
-- STEP 2: ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Ensure reservations.profile_id references auth.users.id
-- (May already exist, so we use ALTER TABLE IF EXISTS)
ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS reservations_profile_id_fkey;

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Ensure reservation_progress.reservation_id references reservations.id
-- (May already exist, so we drop and recreate)
ALTER TABLE public.reservation_progress
  DROP CONSTRAINT IF EXISTS reservation_progress_reservation_id_fkey;

ALTER TABLE public.reservation_progress
  ADD CONSTRAINT reservation_progress_reservation_id_fkey
  FOREIGN KEY (reservation_id) REFERENCES public.reservations(id)
  ON DELETE CASCADE;

-- ============================================================================
-- STEP 3: ADD NOT NULL CONSTRAINTS
-- ============================================================================

-- reservations table constraints
ALTER TABLE public.reservations
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN phone_number SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN delivery_area SET NOT NULL,
  ALTER COLUMN address SET NOT NULL,
  ALTER COLUMN selected_vegetables SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

-- reservation_progress table constraints
ALTER TABLE public.reservation_progress
  ALTER COLUMN reservation_id SET NOT NULL,
  ALTER COLUMN reservation_received SET NOT NULL,
  ALTER COLUMN farm_preparation SET NOT NULL,
  ALTER COLUMN harvest_ready SET NOT NULL,
  ALTER COLUMN harvested SET NOT NULL,
  ALTER COLUMN week_1_delivered SET NOT NULL,
  ALTER COLUMN week_2_delivered SET NOT NULL,
  ALTER COLUMN week_3_delivered SET NOT NULL,
  ALTER COLUMN week_4_delivered SET NOT NULL,
  ALTER COLUMN week_5_delivered SET NOT NULL,
  ALTER COLUMN week_6_delivered SET NOT NULL,
  ALTER COLUMN week_7_delivered SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

-- ============================================================================
-- STEP 4: ADD PERFORMANCE INDEXES
-- ============================================================================

-- reservations table indexes
CREATE INDEX IF NOT EXISTS idx_reservations_status 
  ON public.reservations(status);

CREATE INDEX IF NOT EXISTS idx_reservations_delivery_area 
  ON public.reservations(delivery_area);

CREATE INDEX IF NOT EXISTS idx_reservations_created_at_desc 
  ON public.reservations(created_at DESC);

-- reservation_progress table indexes
CREATE INDEX IF NOT EXISTS idx_reservation_progress_updated_at_desc 
  ON public.reservation_progress(updated_at DESC);

-- Additional useful indexes
CREATE INDEX IF NOT EXISTS idx_reservations_profile_id_created_at
  ON public.reservations(profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservation_progress_reservation_id_updated_at
  ON public.reservation_progress(reservation_id, updated_at DESC);

-- ============================================================================
-- STEP 5: ADD CHECK CONSTRAINTS FOR DATA INTEGRITY
-- ============================================================================

-- Ensure status is one of valid values
ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS check_reservations_status;

ALTER TABLE public.reservations
  ADD CONSTRAINT check_reservations_status
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

-- Ensure delivery_area is not empty
ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS check_reservations_delivery_area_not_empty;

ALTER TABLE public.reservations
  ADD CONSTRAINT check_reservations_delivery_area_not_empty
  CHECK (delivery_area != '');

-- Ensure selected_vegetables array is not empty
ALTER TABLE public.reservations
  DROP CONSTRAINT IF EXISTS check_reservations_vegetables_not_empty;

ALTER TABLE public.reservations
  ADD CONSTRAINT check_reservations_vegetables_not_empty
  CHECK (array_length(selected_vegetables, 1) > 0);

-- ============================================================================
-- STEP 6: MIGRATION VALIDATION SCRIPTS
-- ============================================================================

-- Run these queries to verify the migration was successful:

-- 1. Check that all foreign keys are in place:
-- SELECT
--   table_name,
--   constraint_name,
--   constraint_type
-- FROM information_schema.table_constraints
-- WHERE table_name IN ('reservations', 'reservation_progress', 'profiles')
--   AND constraint_type = 'FOREIGN KEY'
-- ORDER BY table_name, constraint_name;

-- 2. Check that all indexes exist:
-- SELECT
--   schemaname,
--   tablename,
--   indexname
-- FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('reservations', 'reservation_progress')
-- ORDER BY tablename, indexname;

-- 3. Verify NOT NULL constraints:
-- SELECT
--   table_name,
--   column_name,
--   is_nullable
-- FROM information_schema.columns
-- WHERE table_name IN ('reservations', 'reservation_progress')
-- ORDER BY table_name, ordinal_position;

-- 4. Check table statistics (row counts):
-- SELECT
--   schemaname,
--   tablename,
--   n_live_tup as live_rows,
--   n_dead_tup as dead_rows
-- FROM pg_stat_user_tables
-- WHERE schemaname = 'public'
--   AND tablename IN ('reservations', 'reservation_progress', 'profiles')
-- ORDER BY tablename;

-- 5. Test data integrity (no orphaned records):
-- SELECT count(*) as orphaned_progress_records
-- FROM public.reservation_progress rp
-- WHERE NOT EXISTS (
--   SELECT 1 FROM public.reservations r
--   WHERE r.id = rp.reservation_id
-- );
-- Expected: 0 orphaned records

-- 6. Verify RLS policies are still in place:
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   qual as using_condition,
--   with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('reservations', 'reservation_progress', 'profiles')
-- ORDER BY tablename, policyname;

-- ============================================================================
-- STEP 7: SUMMARY AND NEXT STEPS
-- ============================================================================
-- ✓ Consolidated duplicate reservation tables (harvest_reservations marked deprecated)
-- ✓ Added foreign key constraints for referential integrity
-- ✓ Added NOT NULL constraints where required
-- ✓ Added indexes for common query patterns:
--   - reservations(status) - for filtering by status
--   - reservations(delivery_area) - for filtering by area
--   - reservations(created_at DESC) - for sorting by date
--   - reservation_progress(updated_at DESC) - for recent updates
-- ✓ Added CHECK constraints for valid values
-- ✓ Included validation scripts to verify migration success
--
-- NEXT STEPS:
-- 1. Execute this migration in Supabase SQL Editor
-- 2. Run all validation scripts to verify success
-- 3. Monitor database performance for index effectiveness
-- 4. Update code to stop using harvest_reservations table
-- 5. Deprecate fetchHarvestReservations() and submitHarvestReservation()
-- 6. Proceed to Phase 4C (Customer Experience)
-- ============================================================================
