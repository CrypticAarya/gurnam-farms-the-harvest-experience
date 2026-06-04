# Quick Start: Gurnam Farms Supabase Setup

## Problem
Reservation form fails with: `PGRST205 - Could not find table public.reservations`

## Solution (3 Minutes)

### Step 1: Copy This SQL
```sql
-- Create all required tables
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

create index if not exists idx_reservations_email on reservations(email);
create index if not exists idx_reservations_delivery_area on reservations(delivery_area);
create index if not exists idx_reservations_created_at on reservations(created_at desc);

-- Additional tables (if not already created)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  city text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists contact_submissions (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists harvest_reservations (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text,
  notes text,
  created_at timestamptz not null default now()
);
```

### Step 2: Paste in Supabase
1. Go to https://app.supabase.com → Your Project
2. Click **SQL Editor** → **New Query**
3. Paste the SQL above
4. Click **Run**
5. Wait for success message

### Step 3: Test
1. Go to http://127.0.0.1:8081/reserve
2. Fill all 7 steps
3. Submit
4. Should see: "Your Harvest Awaits ✅"

### Step 4: Verify in Supabase
- Go to **Table Editor**
- Click **reservations**
- Should see your reservation with delivery area!

---

## What Was Fixed

### The Problem
- Step 4 validation was checking wrong field (`address` instead of `deliveryArea`)
- This prevented Next button from working

### The Solution
**File**: `src/routes/reserve.tsx`

**Before** (Line 392):
```typescript
(step === 4 && !form.address)  // ❌ WRONG
```

**After**:
```typescript
(step === 4 && !form.deliveryArea)  // ✅ CORRECT
```

### Root Cause
Form step numbers shifted when delivery area was added:
- Old: Step 4 = Address → Step 5 = Vegetables
- New: Step 4 = Delivery Area → Step 5 = Address → Step 6 = Vegetables

The validation wasn't updated to match the new step numbers.

---

## What Gets Saved

When a reservation is submitted, this data is stored:
- ✅ Full Name
- ✅ Phone Number
- ✅ Email Address
- ✅ **Delivery Area** (Patiala / Rajpura / Ambala / Chandigarh)
- ✅ Address (with locality)
- ✅ Selected Vegetables (array)
- ✅ Notes
- ✅ Timestamp (auto)

---

## Admin Access

**Admin Dashboard URL**: http://127.0.0.1:8081/admin/reservations

**Admin Email** (from config): `admin@gurnamfarms.com`

**Displays**:
- Full Name | Phone | Email | **Delivery Area** | Address | Vegetables | Notes | Date
- Search by: Name, Email, or Phone
- All reservations sorted by newest first

---

## Files Created/Modified

### Created
- ✅ `DATABASE_SETUP_GUIDE.md` — Full setup instructions
- ✅ `AUDIT_AND_FIX_REPORT.md` — Detailed audit report
- ✅ `RESERVATIONS_TABLE_ONLY.sql` — Minimal SQL
- ✅ `src/db/migrations/COMPLETE_SETUP.sql` — All tables

### Modified  
- ✅ `src/routes/reserve.tsx` — Fixed Step 4 validation
- ✅ `src/lib/supabase.ts` — Added delivery_area to types
- ✅ `src/routes/admin/reservations.tsx` — Added delivery area column
- ✅ `src/lib/config.ts` — Added DELIVERY_AREAS array

---

## Troubleshooting

### Still Getting PGRST205?
1. Hard refresh browser (Cmd+Shift+R)
2. Check table exists in Supabase Table Editor
3. Try again

### Table Not Visible After SQL?
1. Refresh Supabase dashboard
2. Click **Database** → **Tables** → refresh
3. Scroll to find `reservations`

### Form Still Not Submitting?
1. Open DevTools: F12
2. Go to **Console** tab
3. Try submitting again
4. Look for error message
5. Report the error

---

## Success Indicators

After setup, you should see:
- ✅ Form submits successfully (no PGRST205)
- ✅ Success message: "Your Harvest Awaits"
- ✅ Data in Supabase reservations table
- ✅ Admin dashboard shows reservations
- ✅ Delivery area visible in admin dashboard
- ✅ No console errors

---

**Done!** Your reservation system is ready. 🌱
