-- Add delivery_area column to reservations table
alter table reservations add column delivery_area text not null default 'Patiala';

-- Create index for delivery area queries
create index if not exists idx_reservations_delivery_area on reservations(delivery_area);
