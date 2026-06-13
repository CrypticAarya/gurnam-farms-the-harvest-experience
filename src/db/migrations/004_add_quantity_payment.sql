-- Migration: 004_add_quantity_payment_to_reservations.sql
-- Description: Adds quantity and payment_status to the reservations table
-- Safely applies without affecting existing data.

ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';

-- Optional: Create an index on payment_status for faster filtering
CREATE INDEX IF NOT EXISTS idx_reservations_payment_status ON reservations(payment_status);
