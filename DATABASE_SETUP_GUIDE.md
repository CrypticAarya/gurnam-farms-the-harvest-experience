# Gurnam Farms — Supabase Database Setup Guide

## Issue
Error: `PGRST205 - Could not find table public.reservations`

**Cause**: The reservations table and other required tables haven't been created in Supabase yet.

---

## Solution: Complete Database Setup

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run the Complete Setup SQL

Copy and paste **ALL** of the following SQL into the editor and click **Run**:

```sql
-- ============================================================================
-- GURNAM FARMS DATABASE SETUP - RUN THIS COMPLETE SCRIPT
-- ============================================================================

-- 1. Create profiles table (for auth user management)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  city text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policy: users can read own profile
create policy if not exists "profiles: users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Policy: admins can read all profiles
create policy if not exists "profiles: admins can read all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Index for profiles
create index if not exists idx_profiles_email on profiles(email);

-- ============================================================================
-- 2. Create RESERVATIONS table (NEW - Weekly Harvest Bookings)
-- ============================================================================
create table if not exists reservations (
  id bigserial primary key,
  full_name text not null,
  phone_number text not null,
  email text not null,
  delivery_area text not null default 'Patiala',
  address text not null,
  selected_vegetables text[] not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes for efficient queries
create index if not exists idx_reservations_email on reservations(email);
create index if not exists idx_reservations_delivery_area on reservations(delivery_area);
create index if not exists idx_reservations_created_at on reservations(created_at desc);

-- ============================================================================
-- 3. Create newsletter_subscribers table (Optional - for future use)
-- ============================================================================
create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers(email);

-- ============================================================================
-- 4. Create contact_submissions table (For contact form)
-- ============================================================================
create table if not exists contact_submissions (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_submissions_email on contact_submissions(email);
create index if not exists idx_contact_submissions_created_at on contact_submissions(created_at desc);

-- ============================================================================
-- 5. Create harvest_reservations table (LEGACY - backward compatibility)
-- ============================================================================
create table if not exists harvest_reservations (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_harvest_reservations_email on harvest_reservations(email);

-- ============================================================================
-- END OF SETUP
-- ============================================================================
```

### Step 3: Verify Tables Created
After running the SQL, verify by:
1. In Supabase, go to **Database** → **Tables**
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `reservations` (NEW - this is the critical one)
   - ✅ `newsletter_subscribers`
   - ✅ `contact_submissions`
   - ✅ `harvest_reservations`

---

## Database Schema Details

### `reservations` Table (NEW)
This is the main table for weekly harvest booking:

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | bigserial | Yes | Auto-incrementing primary key |
| `full_name` | text | Yes | Customer's full name |
| `phone_number` | text | Yes | Contact phone number |
| `email` | text | Yes | Contact email |
| `delivery_area` | text | Yes | One of: Patiala, Rajpura, Ambala, Chandigarh |
| `address` | text | Yes | Full delivery address |
| `selected_vegetables` | text[] | Yes | Array of selected vegetables |
| `notes` | text | No | Optional special requests |
| `created_at` | timestamptz | Auto | Timestamp of submission |

**Example Data:**
```json
{
  "full_name": "John Doe",
  "phone_number": "+91 98765 43210",
  "email": "john@example.com",
  "delivery_area": "Ambala",
  "address": "Model Town — Flat 5, Green Park Complex",
  "selected_vegetables": ["Cauliflower", "Carrot", "Spinach"],
  "notes": "Deliver on Sundays preferred"
}
```

---

## Code Audit Results

### ✅ Verified Functions
1. **submitReservation()** — Correctly inserts into `reservations` table
   - Location: `src/lib/supabase.ts` line 231
   - Sends all fields: full_name, phone_number, email, delivery_area, address, selected_vegetables, notes

2. **fetchReservations()** — Correctly reads from `reservations` table
   - Location: `src/lib/supabase.ts` line 238
   - Admin dashboard uses this to display all reservations

3. **Reserve Form** — Correctly builds submission data
   - Location: `src/routes/reserve.tsx`
   - Collects all required fields in 7 steps
   - Step 4: Delivery Area (Patiala, Rajpura, Ambala, Chandigarh)
   - Validates all fields before submission

### ✅ Verified Types
- `ReservationInsert` includes: full_name, phone_number, email, delivery_area, address, selected_vegetables, notes
- `ReservationRow` extends ReservationInsert with: id, created_at

### ✅ Admin Dashboard
- Location: `src/routes/admin/reservations.tsx`
- Displays columns: Full Name, Phone, Email, **Delivery Area**, Address, Vegetables, Notes, Date
- Filters by name/email/phone

---

## Testing After Setup

### 1. Test Form Submission
1. Go to http://127.0.0.1:8081/reserve
2. Fill out all 7 steps:
   - Step 1: Full Name
   - Step 2: Phone Number
   - Step 3: Email
   - Step 4: **Delivery Area** ← NEW
   - Step 5: Delivery Address
   - Step 6: Select Vegetables
   - Step 7: Notes
3. Click "Complete Reservation"
4. Should see success message: "Your Harvest Awaits"

### 2. Verify Data in Supabase
1. Go to Supabase → **Table Editor**
2. Click **reservations**
3. Should see new row with all data including delivery_area

### 3. Test Admin Dashboard
1. Log in with admin email from config: `admin@gurnamfarms.com`
2. Go to http://127.0.0.1:8081/admin/reservations
3. Should see reservation with all columns including **Delivery Area**

---

## Troubleshooting

### Still Getting PGRST205?
**Solution**: 
1. Clear browser cache (Cmd+Shift+R on Mac)
2. Wait 5 seconds for Supabase to finish indexing
3. Try form submission again

### Table Not Visible After SQL Run?
**Solution**:
1. Refresh the Supabase dashboard
2. Go to **Database** → **Tables** → refresh page
3. Scroll down to find `reservations` table

### Form Still Not Submitting?
**Solution**:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Check for error messages
4. Look for "Supabase Error" logs
5. Report the error message

---

## Files Modified/Created

### Database Migrations
- ✅ `src/db/migrations/001_create_profiles_and_rls.sql`
- ✅ `src/db/migrations/002_create_reservations_table.sql`
- ✅ `src/db/migrations/003_add_delivery_area_to_reservations.sql`
- ✅ `src/db/migrations/COMPLETE_SETUP.sql` (NEW - comprehensive setup)

### Code Files
- ✅ `src/lib/supabase.ts` — ReservationInsert/Row types, submitReservation, fetchReservations
- ✅ `src/routes/reserve.tsx` — 7-step form with delivery area field
- ✅ `src/routes/admin/reservations.tsx` — Admin dashboard with delivery area column
- ✅ `src/lib/config.ts` — DELIVERY_AREAS array

---

## Success Indicators

After running the SQL and testing, you should see:

✅ No PGRST205 errors
✅ Form submissions go through
✅ Data appears in Supabase reservations table
✅ Admin dashboard shows all reservations
✅ Delivery area column visible in admin dashboard
✅ Console logs show successful submissions

---

## Need Help?

If you encounter issues:
1. Check the **Console tab** in browser DevTools for error messages
2. Verify all tables exist in Supabase Table Editor
3. Check that the SQL ran without errors in Supabase
4. Ensure environment variables are set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
