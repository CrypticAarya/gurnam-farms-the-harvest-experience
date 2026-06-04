# Complete Admin Routes & Authentication Guide

## 📋 Quick Summary

| Item | Value |
|------|-------|
| **Admin Login URL** | `http://127.0.0.1:8081/admin/login` |
| **Admin Dashboard URL** | `http://127.0.0.1:8081/admin/` |
| **Admin Email(s)** | `admin@gurnamfarms.com` |
| **Config File** | `src/lib/config.ts` |
| **Auth File** | `src/lib/supabase.ts` |
| **Auth Type** | Email/Password (Supabase JWT) |

---

## 1️⃣ ADMIN LOGIN URL

### URL: `http://127.0.0.1:8081/admin/login`

**File**: `src/routes/admin/login.tsx`

**What It Does:**
- Public page (no authentication required to visit)
- Users enter email and password
- Authenticates against Supabase Auth
- On success: Redirects to `/admin/` dashboard
- On failure: Shows error message

**Features:**
- Email input field
- Password input field
- Sign in button
- Error message display
- "Signing in..." loading state

**Example:**
```
Email: admin@gurnamfarms.com
Password: [your-password]
Click "Sign in"
↓
Authenticated? YES → Redirects to /admin/
Authenticated? NO → Shows error message
```

---

## 2️⃣ ADMIN DASHBOARD URL

### URL: `http://127.0.0.1:8081/admin/`

**File**: `src/routes/admin/index.tsx`

**What It Does:**
- Main admin dashboard
- Shows summary statistics
- Displays key metrics

**Authentication Guard:**
```typescript
beforeLoad: async () => {
  const session = await getSession();
  const email = session?.user?.email;

  if (!email || !isAdminEmail(email)) {
    throw redirect({ to: "/" });  // Redirect to homepage if not admin
  }
}
```

**If you try to access without being admin:**
- ❌ Automatically redirects to homepage (`/`)
- ❌ Session lost? Redirects to login

**Display:**
```
┌─────────────────────────────────────────┐
│      Admin Dashboard                    │
├─────────────────────────────────────────┤
│                                         │
│ [Total Contact Enquiries] [123]         │
│ [Total Harvest Reservations] [456]      │
│ [Newsletter Subscribers] [789]          │
│ [Recent Activity] [List]                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3️⃣ AUTHENTICATION LOGIC

### How Admin Authentication Works

```
Step 1: User visits /admin/login
        ↓
Step 2: Enters email & password
        ↓
Step 3: signInAdmin(email, password) called
        ↓
Step 4: Supabase verifies credentials
        ├─ Valid? → JWT token issued ✅
        └─ Invalid? → Error returned ❌
        ↓
Step 5: Session stored in browser
        ↓
Step 6: User redirected to /admin/
        ↓
Step 7: beforeLoad guard checks:
        ├─ Is session active?
        ├─ Is email in ADMIN_EMAILS?
        └─ Both YES? → Allow access ✅
           Either NO? → Redirect to / ❌
```

### Authentication Functions in `src/lib/supabase.ts`

```typescript
// Sign in as admin
export async function signInAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  if (error) throwSupabaseError(error);
}

// Sign out
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throwSupabaseError(error);
}

// Check if email is admin
export function isAdminEmail(email?: string | null) {
  return !!email && ADMIN_EMAILS.includes(email);
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throwSupabaseError(error);
  return data.session;
}
```

---

## 4️⃣ ADMIN EMAILS

### File: `src/lib/config.ts`

```typescript
export const ADMIN_EMAILS = [
  "admin@gurnamfarms.com",
];
```

### Currently Authorized Admins:
- ✅ `admin@gurnamfarms.com`

### Can this user access admin routes?

| Email | Has Auth Account | In ADMIN_EMAILS | Can Access? |
|-------|------------------|-----------------|-----------|
| admin@gurnamfarms.com | ✅ | ✅ | ✅ YES |
| other@email.com | ✅ | ❌ | ❌ NO |
| newadmin@email.com | ✅ | ❌ | ❌ NO |
| random@example.com | ❌ | ❌ | ❌ NO |

---

## 5️⃣ ADMIN ROLE CHECK FILE

### Primary File: `src/lib/supabase.ts`

**Function**: `isAdminEmail()`

**Location**: Line 112-113

**Code**:
```typescript
export function isAdminEmail(email?: string | null) {
  return !!email && ADMIN_EMAILS.includes(email);
}
```

**How it works:**
1. Takes email as input
2. Checks if email exists
3. Checks if email is in ADMIN_EMAILS array
4. Returns true/false

**Used in all admin routes:**
- `/admin/` (dashboard)
- `/admin/reservations`
- `/admin/customers`
- `/admin/subscribers`

**Pattern in all routes:**
```typescript
export const Route = createFileRoute("/admin/reservations")({
  beforeLoad: async () => {
    const session = await getSession();
    const email = session?.user?.email;

    if (!email || !isAdminEmail(email)) {
      throw redirect({ to: "/" });  // ← Kicks out if not admin
    }
  },
  // ... rest of route
});
```

---

## 6️⃣ HOW TO PROMOTE A USER TO ADMIN

### 🚀 **Method 1: Edit Config File (Easiest)**

**File**: `src/lib/config.ts`

**Current:**
```typescript
export const ADMIN_EMAILS = [
  "admin@gurnamfarms.com",
];
```

**To add another admin:**
```typescript
export const ADMIN_EMAILS = [
  "admin@gurnamfarms.com",
  "newadmin@example.com",        ← Add here
];
```

**Then:**
1. Save file
2. Run `npm run build`
3. Deploy
4. New user can log in at `/admin/login`

---

### Method 2: Database Role Column (Alternative)

**Note**: Currently NOT implemented. The app uses email-based checking only.

If you wanted database-level roles:

```typescript
// In profiles table:
// 1. Add column: role text (default 'customer')
// 2. Create function to check database role

export async function getUserRole(userId?: string) {
  const profile = await getProfile(userId);
  return profile?.role ?? null;
}

// Then in routes, check database instead of config
```

**Status**: ❌ Not currently used
**Current System**: ✅ Email-based in config

---

## 📍 ALL ADMIN ROUTES IMPLEMENTED

### **1. Admin Login Page**
- **URL**: `/admin/login`
- **File**: `src/routes/admin/login.tsx`
- **Auth**: Public (no guard)
- **Purpose**: Email/password authentication
- **Redirects to**: `/admin/` on success

---

### **2. Admin Dashboard**
- **URL**: `/admin/` or `/admin/index.tsx`
- **File**: `src/routes/admin/index.tsx`
- **Auth**: ✅ Guarded (requires isAdminEmail)
- **Purpose**: Summary statistics
- **Shows**: Counts, recent activity

---

### **3. Reservations Manager**
- **URL**: `/admin/reservations`
- **File**: `src/routes/admin/reservations.tsx`
- **Auth**: ✅ Guarded (requires isAdminEmail)
- **Purpose**: View all customer reservations
- **Features**:
  - Table with all reservations
  - Search by name, email, phone
  - Sorted by newest first
  - Shows columns: Name | Phone | Email | Delivery Area | Address | Vegetables | Notes | Date

---

### **4. Contact Submissions / Customers**
- **URL**: `/admin/customers`
- **File**: `src/routes/admin/customers.tsx`
- **Auth**: ✅ Guarded (requires isAdminEmail)
- **Purpose**: View contact form submissions
- **Features**:
  - Table of all contact submissions
  - Search functionality
  - Name, email, phone, city, message display

---

### **5. Newsletter Subscribers**
- **URL**: `/admin/subscribers`
- **File**: `src/routes/admin/subscribers.tsx`
- **Auth**: ✅ Guarded (requires isAdminEmail)
- **Purpose**: View newsletter subscriber list
- **Features**:
  - List of all subscribers
  - Search by email
  - Subscription date tracking

---

### **6. Enquiries (Legacy)**
- **URL**: `/admin/enquiries`
- **File**: `src/routes/admin/enquiries.tsx`
- **Auth**: ✅ Guarded (uses profile role check)
- **Purpose**: View contact enquiries
- **Note**: Uses different auth method (profile.role)

---

## 🔒 SECURITY FEATURES

### Frontend Protection
- ✅ `beforeLoad` guards on all routes
- ✅ Automatic redirect if not authenticated
- ✅ Email verification against ADMIN_EMAILS
- ✅ Session validation

### Backend Protection (Supabase)
- ✅ JWT tokens required
- ✅ User authentication via email/password
- ✅ Row Level Security on tables
- ✅ Session timeout (default: 24 hours)

### No Direct Database Admin Bypass
- ✅ Can't access admin routes without email in config
- ✅ Can't fake JWT tokens
- ✅ Session required at all times

---

## 📋 ROUTE HIERARCHY

```
/admin/login
  ├─ Public page
  ├─ No authentication required
  └─ Redirects to / if already logged in

/admin/
  ├─ Dashboard (summary)
  ├─ Requires: isAdminEmail ✅
  └─ Shows: Counts, activity

/admin/reservations
  ├─ All reservations table
  ├─ Requires: isAdminEmail ✅
  └─ Features: Search, sort, filter

/admin/customers
  ├─ Contact submissions
  ├─ Requires: isAdminEmail ✅
  └─ Features: Search, view details

/admin/subscribers
  ├─ Newsletter list
  ├─ Requires: isAdminEmail ✅
  └─ Features: Search, tracking

/admin/enquiries
  ├─ Enquiries list
  ├─ Requires: profile.role === 'admin' ✅
  └─ Features: View messages
```

---

## ⚠️ AUTHENTICATION INCONSISTENCIES FOUND

### Issue: Two Different Auth Methods

**Most Routes** (✅ Recommended):
```typescript
if (!email || !isAdminEmail(email)) {
  throw redirect({ to: "/" });
}
```
Uses: Email-based checking from config

**Enquiries Route** (❌ Different):
```typescript
const profile = await getProfile(userId);
if (!profile || profile.role !== "admin") {
  throw redirect({ to: "/" });
}
```
Uses: Database profile role checking

### Recommendation:
- Standardize all routes to use `isAdminEmail` method
- Keep `/admin/enquiries` consistent with others

---

## 🔧 TO STANDARDIZE ALL ROUTES

Replace in `/admin/enquiries.tsx`:

```typescript
// BEFORE (inconsistent):
beforeLoad: async () => {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) throw redirect({ to: "/admin/login" });
  const profile = await getProfile(userId);
  if (!profile || profile.role !== "admin") throw redirect({ to: "/" });
}

// AFTER (consistent):
beforeLoad: async () => {
  const session = await getSession();
  const email = session?.user?.email;
  if (!email || !isAdminEmail(email)) {
    throw redirect({ to: "/" });
  }
}
```

---

## 📝 QUICK REFERENCE TABLE

| Route | URL | File | Guard | Purpose |
|-------|-----|------|-------|---------|
| Login | `/admin/login` | `login.tsx` | ❌ None | Authenticate |
| Dashboard | `/admin/` | `index.tsx` | ✅ Email | Stats |
| Reservations | `/admin/reservations` | `reservations.tsx` | ✅ Email | View bookings |
| Customers | `/admin/customers` | `customers.tsx` | ✅ Email | View contacts |
| Subscribers | `/admin/subscribers` | `subscribers.tsx` | ✅ Email | View emails |
| Enquiries | `/admin/enquiries` | `enquiries.tsx` | ✅ Role | View messages |

---

## 🎯 TYPICAL ADMIN WORKFLOW

```
1. Admin visits http://127.0.0.1:8081/admin/login
   ↓
2. Enters: admin@gurnamfarms.com + password
   ↓
3. Clicks "Sign in"
   ↓
4. Supabase verifies credentials
   ↓
5. JWT token issued, stored in browser
   ↓
6. Redirected to http://127.0.0.1:8081/admin/
   ↓
7. Dashboard loads with statistics
   ↓
8. Admin can navigate to:
   ├─ /admin/reservations → View all bookings
   ├─ /admin/customers → View contact forms
   ├─ /admin/subscribers → View email list
   └─ /admin/enquiries → View messages
   ↓
9. Click "Sign out" to logout
```

---

## ✅ ANSWERS TO YOUR QUESTIONS

### Q1: Admin login URL?
**A**: `http://127.0.0.1:8081/admin/login`

### Q2: Admin dashboard URL?
**A**: `http://127.0.0.1:8081/admin/` (requires login first)

### Q3: Authentication logic?
**A**: Email/password via Supabase Auth (JWT tokens)

### Q4: Which emails are admins?
**A**: Only `admin@gurnamfarms.com` (defined in `src/lib/config.ts`)

### Q5: File with admin role check?
**A**: `src/lib/supabase.ts` line 112-113 (`isAdminEmail()` function)

### Q6: How to promote user to admin?
**A**: Add email to `ADMIN_EMAILS` array in `src/lib/config.ts`

---

## 🚀 NEXT STEPS

1. **To add new admin**: Edit `ADMIN_EMAILS` in `src/lib/config.ts`
2. **To standardize routes**: Update `/admin/enquiries.tsx` to use `isAdminEmail`
3. **To add more admin pages**: Create in `/src/routes/admin/` with same guard pattern
4. **To test**: Login at `/admin/login` with authorized email

---

**ALL ADMIN ROUTES DOCUMENTED ✅**
