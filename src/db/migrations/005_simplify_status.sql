-- Migration: 005_simplify_status.sql
-- Description: Switches from payment_status to a manual workflow status, drops the complex reservation_progress table, and links profile_id.

-- 1. Add new simple manual status column and link profile_id safely
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES auth.users(id);

-- 2. Drop the payment_status field as per new requirements
ALTER TABLE reservations 
DROP COLUMN IF EXISTS payment_status;

-- 3. Drop the legacy/complex reservation_progress table
DROP TABLE IF EXISTS reservation_progress CASCADE;

-- Optional: Create an index on the new status for faster filtering on the admin dashboard
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
