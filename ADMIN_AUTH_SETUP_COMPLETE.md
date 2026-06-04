# Automatic Profile Sync - Complete Setup Guide

## 📋 Executive Summary

The automatic profile sync system creates user profiles when they sign up. Here's how it works:

```
User Signs Up
    ↓
Frontend: signUpCustomer({ email, password })
    ↓
Backend: Supabase auth.signUp()
    ↓
User created in auth.users
    ↓
Supabase Trigger: on_auth_user_created
    ↓
Function: handle_new_user()
    ├─ Extract email from new user
    ├─ Check if email === 'sarthakghoderao@gmail.com'
    └─ Create profile with appropriate role
        ├─ admin (if special email)
        └─ customer (for all others)
    ↓
Frontend redirects to:
├─ /admin (if admin)
└─ / (if customer)
```

---

## ✅ Implementation Status

| Component | Status | Details |
|-----------|--------|---------|
| Signup Route | ✅ Complete | Enhanced with error handling and loading states |
| signUpCustomer Function | ✅ Complete | Simplified to use Supabase trigger |
| Supabase Setup | ✅ Ready | SQL script provided (not yet executed) |
| Admin Routes | ✅ Complete | All routes use isAdmin() with role check |
| Build | ✅ Passing | No TypeScript errors |

---

## 🚀 REQUIRED SUPABASE SETUP

### You MUST run this SQL in Supabase to make automatic profile sync work:

**Steps:**
1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy entire contents of `PROFILE_SYNC_SETUP.sql`
5. Click **Run** button
6. Check output for errors (look for ✓ checkmarks)

### What the SQL does:

✅ Creates profiles table with columns:
- id (uuid, references auth.users.id)
- email (text, unique)
- role (text: 'admin' or 'customer')
- name, phone, city (optional fields)
- created_at, updated_at (timestamps)

✅ Adds RLS policies:
- Users can view their own profile
- Admins can view all profiles
- Only trigger can insert profiles

✅ Creates trigger function:
- `handle_new_user()` - fires when user signs up
- Automatically creates profile row
- Sets role='admin' if email='sarthakghoderao@gmail.com'
- Sets role='customer' for all other emails

✅ Creates trigger:
- `on_auth_user_created` - fires AFTER INSERT on auth.users
- Ensures profile is created immediately after signup

✅ Creates indexes for performance

---

## 🔍 VERIFY SUPABASE SETUP

After running the SQL, verify everything is working:

### Check 1: Trigger Exists
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```
Expected result: 1 row with trigger_name='on_auth_user_created'

### Check 2: Table Structure
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```
Expected columns: id, email, name, phone, city, role, created_at, updated_at

### Check 3: RLS Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
```
Expected: rowsecurity = true

### Check 4: Indexes Created
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'profiles';
```
Expected: Should see idx_profiles_email, idx_profiles_role, idx_profiles_created_at

---

## 🎯 CODE CHANGES MADE

### 1. Simplified signUpCustomer Function
**File**: `src/lib/supabase.ts`

```typescript
export async function signUpCustomer({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throwSupabaseError(error);
  }

  // Profile will be created automatically by Supabase trigger
}
```

**Why simplified?**
- Avoids race conditions with auth.users not yet created
- Relies on Supabase trigger (guaranteed to work)
- Trigger has access to determine role based on email

### 2. Enhanced Signup Form
**File**: `src/routes/signup.tsx`

**New Features:**
- ✅ Email validation
- ✅ Password length validation (minimum 6 chars)
- ✅ Better error messages
- ✅ Loading spinner during signup
- ✅ Success state with checkmark
- ✅ Disabled inputs during loading
- ✅ Styled message boxes (error/success)
- ✅ Auto-redirect based on role
- ✅ Added "Log in" link

**Example User Flow:**
```
1. User enters email + password
2. Clicks "Sign up"
3. Button shows "Creating account..." with spinner
4. Admin email → redirects to /admin dashboard
5. Other email → redirects to home page /
6. Errors show specific helpful messages
```

### 3. All Admin Routes Use isAdmin()
**Files Updated:**
- ✅ src/routes/admin/index.tsx
- ✅ src/routes/admin/reservations.tsx
- ✅ src/routes/admin/customers.tsx
- ✅ src/routes/admin/subscribers.tsx
- ✅ src/routes/admin/enquiries.tsx

**Pattern:**
```typescript
beforeLoad: async () => {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId || !(await isAdmin(userId))) {
    throw redirect({ to: "/" });
  }
}
```

---

## 🧪 TESTING FLOW

### Prerequisites
1. ✅ Run PROFILE_SYNC_SETUP.sql in Supabase
2. ✅ Verify all checks above pass
3. ✅ Start dev server: `npm run dev`

### Test 1: Admin Signup

**Step 1: Sign up with admin email**
```
URL: http://localhost:8086/signup
Email: sarthakghoderao@gmail.com
Password: YourPassword123
Click: Sign up
```

**Expected:**
- Loading spinner appears
- Message: "Your account has been created! You have admin access..."
- Auto-redirects to /admin dashboard
- Dashboard loads successfully

**Verify in Supabase SQL:**
```sql
SELECT id, email, role FROM public.profiles 
WHERE email = 'sarthakghoderao@gmail.com';
```
Expected: One row with `role = 'admin'`

**Verify admin access:**
- ✅ Can view /admin dashboard
- ✅ Can view /admin/reservations
- ✅ Can view /admin/customers
- ✅ Can view /admin/subscribers

---

### Test 2: Customer Signup

**Step 1: Sign up with different email**
```
URL: http://localhost:8086/signup
Email: john@example.com
Password: YourPassword123
Click: Sign up
```

**Expected:**
- Loading spinner appears
- Message: "Your account has been created. Please check your email for confirmation."
- Auto-redirects to home page /
- Home page loads normally

**Verify in Supabase SQL:**
```sql
SELECT id, email, role FROM public.profiles 
WHERE email = 'john@example.com';
```
Expected: One row with `role = 'customer'`

**Verify no admin access:**
- ❌ /admin redirects to /
- ❌ /admin/reservations redirects to /
- ❌ /admin/customers redirects to /
- ❌ /admin/subscribers redirects to /

---

### Test 3: Admin Login → Dashboard

**Step 1: Login as admin**
```
URL: http://localhost:8086/admin/login
Email: sarthakghoderao@gmail.com
Password: [same password from signup]
Click: Sign in
```

**Expected:**
- Admin dashboard loads
- Shows statistics and recent activity
- Navigation works to other admin pages

**Step 2: Try to access with customer account**
```
URL: http://localhost:8086/admin
Logged in as: customer account
```

**Expected:**
- System checks: userId + profile.role === 'admin'
- Check fails (role = 'customer')
- Redirects to / (home page)

---

### Test 4: Error Handling

**Test 4a: Invalid email format**
```
Email: "notanemail"
Password: Test123
```
Expected error or prevention: Email validation fails

**Test 4b: Short password**
```
Email: valid@email.com
Password: "123"
```
Expected: Show "At least 6 characters" message

**Test 4c: Duplicate email**
```
Email: sarthakghoderao@gmail.com (already used)
Password: NewPassword123
```
Expected error: "This email is already registered..."

---

## 📊 DATABASE QUERIES FOR MONITORING

### View all users and their roles
```sql
SELECT 
  u.id,
  u.email,
  p.role,
  u.created_at as signup_date,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
```

### Count users by role
```sql
SELECT 
  role,
  COUNT(*) as count
FROM public.profiles
GROUP BY role;
```

### Check for profile creation delays
```sql
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN p.id IS NULL THEN 'MISSING PROFILE ⚠️'
    ELSE 'OK'
  END as status,
  (p.created_at - u.created_at) as sync_delay
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL OR (p.created_at - u.created_at) > interval '1 minute'
ORDER BY u.created_at DESC
LIMIT 20;
```

---

## 🔐 SECURITY NOTES

✅ **Profile creation is secure because:**
- Trigger runs with database privileges
- Frontend cannot bypass trigger
- RLS policies prevent unauthorized access
- Admin role determined by database config

⚠️ **Monitor these:**
- Track who has admin=true role
- Audit profile.role changes
- Regular review of admin users

### To promote customer to admin (via SQL):
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'someuser@example.com';
```

### To revoke admin access:
```sql
UPDATE public.profiles 
SET role = 'customer' 
WHERE email = 'admin@example.com';
```

---

## 🐛 TROUBLESHOOTING

### Issue: Profiles table doesn't exist
**Solution:** Re-run PROFILE_SYNC_SETUP.sql

### Issue: Trigger doesn't fire
**Symptoms:** 
- User created in auth.users
- No row in profiles table

**Solutions:**
```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- If missing, re-run: CREATE TRIGGER on_auth_user_created...

-- Check trigger function
SELECT proname, prosecdef FROM pg_proc WHERE proname = 'handle_new_user';

-- Test trigger function manually
SELECT handle_new_user() from (
  SELECT '550e8400-e29b-41d4-a716-446655440000'::uuid as id, 
         'test@example.com' as email
) new;
```

### Issue: Admin cannot access dashboard
**Symptoms:**
- Login succeeds
- /admin redirects to /

**Diagnosis:**
```sql
-- Check profile role
SELECT id, email, role FROM public.profiles 
WHERE email = 'sarthakghoderao@gmail.com';

-- If role is not 'admin', fix it:
UPDATE public.profiles SET role = 'admin'
WHERE email = 'sarthakghoderao@gmail.com';

-- Verify isAdmin() function can read it
SELECT * FROM public.profiles WHERE role = 'admin';
```

### Issue: Duplicate email signup
**Symptoms:**
- Can't sign up with existing email
- Error from Supabase auth

**This is correct behavior!**
Supabase auth prevents duplicate emails automatically.

---

## 📁 FILES CREATED/MODIFIED

### New Files:
- ✅ `PROFILE_SYNC_SETUP.sql` - SQL for Supabase setup
- ✅ `PROFILE_SYNC_IMPLEMENTATION.md` - Original implementation docs
- ✅ `ADMIN_AUTH_SETUP_COMPLETE.md` - This file

### Modified Files:
- ✅ `src/lib/supabase.ts` - Simplified signUpCustomer()
- ✅ `src/routes/signup.tsx` - Enhanced UI and error handling
- ✅ `src/routes/admin/*.tsx` - All use isAdmin() with role check

---

## ✨ KEY FEATURES

✅ Automatic profile creation on signup  
✅ Role assigned based on email address  
✅ Admin access control via role  
✅ Customer and admin user types supported  
✅ Error handling with user-friendly messages  
✅ Loading and success states  
✅ Auto-redirect based on role  
✅ Supabase RLS for data security  
✅ Performance indexes  
✅ Audit trail support (email, role, timestamps)  

---

## 🎬 QUICK START CHECKLIST

- [ ] Run `PROFILE_SYNC_SETUP.sql` in Supabase SQL Editor
- [ ] Verify all 4 checks above pass
- [ ] Run `npm run build` (verify no errors)
- [ ] Start dev server: `npm run dev`
- [ ] Test admin signup → login → dashboard
- [ ] Test customer signup → restricted access
- [ ] Test error handling (invalid email, short password)
- [ ] Check console for any warnings/errors
- [ ] Monitor profiles table in Supabase for new signups

---

## 🚀 YOU'RE READY!

Once the SQL setup is complete, the automatic profile sync system is fully operational.

New signups will automatically:
1. ✅ Create auth.users entry
2. ✅ Create profiles entry via trigger
3. ✅ Assign correct role (admin or customer)
4. ✅ Redirect to appropriate dashboard
5. ✅ Enforce access control on admin routes

**Questions?** Check the troubleshooting section or review the SQL script comments.
