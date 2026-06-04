# Automatic Profile Sync Implementation

## ✅ What's Been Done

### 1. Updated signUpCustomer Function
- **File**: `src/lib/supabase.ts`
- **Change**: Modified signup logic to automatically set role based on email
- **Logic**: 
  - If email = 'sarthakghoderao@gmail.com' → role = 'admin'
  - Otherwise → role = 'customer'

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

  const userId = data.data?.user?.id ?? data.user?.id ?? null;
  if (userId) {
    // Check if this email should be an admin
    const role = email === "sarthakghoderao@gmail.com" ? "admin" : "customer";
    await upsertProfile({ id: userId, email, role });
  }
}
```

### 2. Enhanced Signup Route
- **File**: `src/routes/signup.tsx`
- **Changes**:
  - ✅ Input validation (email, password length)
  - ✅ Better error handling with specific error messages
  - ✅ Improved loading state UI with spinner
  - ✅ Success state with checkmark
  - ✅ Styled message boxes (error red, success green)
  - ✅ Disabled inputs during loading/success
  - ✅ Auto-redirect after success (admin → /admin, customer → /)
  - ✅ Added "Log in" link
  - ✅ Password requirements text

### 3. Created Supabase Setup
- **File**: `PROFILE_SYNC_SETUP.sql`
- **Includes**:
  - Profiles table definition
  - RLS policies for security
  - Trigger function `handle_new_user()`
  - Trigger for automatic profile creation on auth.users insert
  - Performance indexes
  - Verification and troubleshooting queries

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Run the SQL Setup
1. Go to **Supabase Dashboard** → Your Project → **SQL Editor**
2. Create a new query and paste the contents of `PROFILE_SYNC_SETUP.sql`
3. Click **Run** to execute all setup queries
4. Check the output for any errors

### Step 2: Verify the Setup
In Supabase SQL Editor, run these verification queries:

```sql
-- Check if trigger exists
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check profiles table structure
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'profiles' ORDER BY ordinal_position;

-- Check existing profiles
SELECT id, email, role, created_at FROM public.profiles;
```

Expected results:
- ✅ `on_auth_user_created` trigger exists
- ✅ Profiles table has columns: id, email, name, phone, city, role, created_at
- ✅ Any existing profiles are listed

---

## 🧪 TESTING THE FLOW

### Test 1: Admin Signup and Login

**Step 1: Sign up as admin**
1. Go to http://127.0.0.1:8081/signup
2. Enter email: `sarthakghoderao@gmail.com`
3. Enter password: (any password, 6+ characters)
4. Click "Sign up"
5. Should show success message and redirect to `/admin` dashboard

**Step 2: Verify admin profile was created**
In Supabase SQL Editor:
```sql
SELECT id, email, role FROM public.profiles 
WHERE email = 'sarthakghoderao@gmail.com';
```
Expected: One row with `role = 'admin'`

**Step 3: Login to admin dashboard**
1. Go to http://127.0.0.1:8081/admin/login
2. Enter email: `sarthakghoderao@gmail.com`
3. Enter password: (same password from signup)
4. Click "Sign in"
5. Should load admin dashboard with statistics

**Step 4: Verify admin access**
- ✅ Should see "Admin Dashboard" heading
- ✅ Should see reservation counts, subscriber counts, etc.
- ✅ Navigation to other admin routes should work
- ✅ Try `/admin/reservations`, `/admin/customers`, `/admin/subscribers`

---

### Test 2: Customer Signup and Login

**Step 1: Sign up as customer**
1. Go to http://127.0.0.1:8081/signup
2. Enter email: `customer@example.com` (or any email except admin email)
3. Enter password: (any password, 6+ characters)
4. Click "Sign up"
5. Should show success message and redirect to home page (`/`)

**Step 2: Verify customer profile was created**
In Supabase SQL Editor:
```sql
SELECT id, email, role FROM public.profiles 
WHERE email = 'customer@example.com';
```
Expected: One row with `role = 'customer'`

**Step 3: Try accessing admin routes**
1. Go to http://127.0.0.1:8081/admin
2. System should redirect to home page `/`
3. Try `/admin/reservations` - should also redirect to `/`

**Step 4: Verify no admin access**
- ✅ Cannot access `/admin` → redirects to `/`
- ✅ Cannot access `/admin/reservations` → redirects to `/`
- ✅ Cannot access `/admin/customers` → redirects to `/`
- ✅ Cannot access `/admin/subscribers` → redirects to `/`

---

### Test 3: Error Handling

**Test 3a: Invalid Email**
1. Go to http://127.0.0.1:8081/signup
2. Enter invalid email: `notanemail`
3. Click "Sign up"
4. Should show error: "Please enter a valid email address"

**Test 3b: Short Password**
1. Go to http://127.0.0.1:8081/signup
2. Enter email: `test@example.com`
3. Enter password: `123` (less than 6 characters)
4. Should disable button and show: "At least 6 characters"
5. Or click submit and get error: "Password must be at least 6 characters"

**Test 3c: Duplicate Email**
1. Sign up with `test@example.com`
2. Try signing up again with the same email
3. Should show error: "This email is already registered. Try logging in instead."

---

### Test 4: Database Integrity

**Check profile creation**
```sql
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM public.profiles;
-- Should be equal or profiles ≤ users
```

**Check role distribution**
```sql
SELECT role, COUNT(*) FROM public.profiles GROUP BY role;
-- Should show: admin count and customer count
```

**Check trigger is working**
```sql
-- New signup should appear in profiles immediately
SELECT id, email, role, created_at FROM public.profiles 
ORDER BY created_at DESC LIMIT 1;
```

---

## 🔍 TROUBLESHOOTING

### Issue: Profile not created after signup

**Symptoms**: 
- Signup succeeds
- Profile table is empty

**Solutions**:
1. Check if trigger exists:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```
   If not found, re-run `PROFILE_SYNC_SETUP.sql`

2. Check if auth.users row was created:
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;
   ```

3. Check trigger function:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

4. Check RLS policies aren't blocking:
   ```sql
   SELECT * FROM information_schema.role_table_grants 
   WHERE table_name = 'profiles';
   ```

---

### Issue: Admin cannot access dashboard

**Symptoms**:
- Login succeeds
- `/admin` page redirects to `/`

**Solutions**:
1. Verify profile role is 'admin':
   ```sql
   SELECT id, email, role FROM public.profiles 
   WHERE email = 'sarthakghoderao@gmail.com';
   ```
   If not 'admin', run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'sarthakghoderao@gmail.com';
   ```

2. Check browser console for errors (DevTools → Console tab)

3. Clear browser cache and cookies, then try again

4. Verify isAdmin() function is being called:
   In browser DevTools → Network tab, check `/admin/` request

---

### Issue: Customer can access admin dashboard

**Symptoms**:
- Customer logged in
- Can access `/admin` routes

**Solutions**:
1. Check profile role:
   ```sql
   SELECT id, email, role FROM public.profiles 
   WHERE email = 'customer@example.com';
   ```

2. Should be 'customer', if not:
   ```sql
   UPDATE public.profiles 
   SET role = 'customer' 
   WHERE email = 'customer@example.com';
   ```

3. Clear browser session and login again

---

## 📊 ARCHITECTURE OVERVIEW

```
User Signs Up
    ↓
signUpCustomer({ email, password })
    ↓
├─ Create auth user via supabase.auth.signUp()
├─ Extract userId from auth response
└─ Call upsertProfile({ id: userId, email, role })
    ↓
Profile Created in Database
    ↓
├─ Trigger fires: on_auth_user_created
├─ Function: handle_new_user()
└─ Role assigned based on email
    ↓
User redirected to:
├─ /admin (if admin)
└─ / (if customer)
```

---

## 🔐 SECURITY NOTES

✅ **What's Secure**:
- Profiles table has RLS policies enabled
- Users can only view their own profile
- Only admins can view all profiles
- Admin email is hardcoded in function (can be updated via SQL)
- Passwords never stored in profiles

⚠️ **What to Monitor**:
- Keep track of who has 'admin' role in database
- Regularly audit profiles for unexpected admin roles
- Consider audit logging for role changes

🔄 **Future Improvements**:
- Add UI for admin management (promote/demote users)
- Add audit logging table for role changes
- Support multiple admin emails (array in function)

---

## 📋 FILES MODIFIED

| File | Changes |
|------|---------|
| `src/lib/supabase.ts` | Updated signUpCustomer() to set role based on email |
| `src/routes/signup.tsx` | Enhanced with validation, error handling, loading states |
| `PROFILE_SYNC_SETUP.sql` | New: SQL setup for profiles table and trigger |
| `ROLE_BASED_ADMIN_AUTH.md` | Existing: Updated with new signup flow |

---

## ✨ FEATURES IMPLEMENTED

✅ Automatic profile creation on signup  
✅ Role assignment based on email (admin if sarthakghoderao@gmail.com)  
✅ Input validation (email, password length)  
✅ Comprehensive error handling  
✅ Improved loading and success states  
✅ Auto-redirect based on role  
✅ Supabase trigger for backup profile creation  
✅ RLS policies for data security  
✅ Performance indexes  
✅ Admin and customer routes protected  

---

## 🚀 NEXT STEPS

1. **Run the SQL setup** in Supabase SQL Editor
2. **Start dev server**: `npm run dev`
3. **Test signup flow** for both admin and customer
4. **Verify admin dashboard** loads for admin
5. **Verify access denied** for customer on admin routes
6. **Monitor for errors** in browser console

---

**Status**: ✅ Implementation Complete

Once you've run the SQL setup, the automatic profile sync will be fully operational!
