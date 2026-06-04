# COPY THIS SQL AND PASTE INTO SUPABASE

## 🚀 Quick Setup - Copy/Paste This SQL into Supabase SQL Editor

**Steps:**
1. Go to https://app.supabase.com → Your Project
2. Click **SQL Editor** → **New Query**
3. **Copy entire SQL below** (from `create table` to `alter table harvest_reservations...`)
4. **Paste into editor**
5. Click **RUN**
6. Wait for "Success!" message
7. **Done!** ✅

---

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  city text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);
create index if not exists idx_profiles_email on profiles(email);
alter table profiles disable row level security;

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
alter table reservations disable row level security;

create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);
create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers(email);
alter table newsletter_subscribers disable row level security;

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
alter table contact_submissions disable row level security;

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
alter table harvest_reservations disable row level security;
```

---

## After Running SQL:

### ✅ Test the Form

1. Go to: http://127.0.0.1:8081/reserve
2. Fill all 7 steps
3. Click "Complete Reservation"
4. Should see: **"Your Harvest Awaits ✅"**

### ✅ Verify Data

1. Go to Supabase → **Table Editor**
2. Click **reservations**
3. Should see your submission with all data

### ✅ Check Admin

1. Go to: http://127.0.0.1:8081/admin/reservations
2. Log in with: `admin@gurnamfarms.com`
3. Should see your reservation in the table

---

**That's it! Your reservation system is now working.** 🌱
