# Gurnam Farms - Architecture Documentation

**Project**: Gurnam Farms - The Harvest Experience  
**Version**: 1.0 (Production-Ready)  
**Last Updated**: Phase 4 Complete  
**Status**: 🟢 Production-Grade Platform

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Authentication & Authorization](#authentication--authorization)
5. [Reservation System](#reservation-system)
6. [Admin Dashboard](#admin-dashboard)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Environment Configuration](#environment-configuration)
10. [Deployment Guide](#deployment-guide)
11. [Monitoring & Observability](#monitoring--observability)
12. [Troubleshooting](#troubleshooting)
13. [Future Roadmap](#future-roadmap)

---

## System Overview

### What is Gurnam Farms?

Gurnam Farms is a **SaaS-grade farm-to-home delivery platform** that enables customers to:
- Browse and reserve weekly organic harvest boxes
- Track their order from farm preparation to delivery
- View profile and reservation history
- Receive confirmation emails

Administrators can:
- Monitor all reservations and customers
- Update harvest progress and delivery status
- View engagement metrics
- Manage customer inquiries

### Key Features

- ✅ **Secure Authentication** (Supabase Auth)
- ✅ **Role-Based Access Control** (Admin/Customer)
- ✅ **Real-Time Progress Tracking** (11-step harvest journey)
- ✅ **Automated Email Confirmations** (Resend)
- ✅ **Admin Dashboard** (Metrics & management)
- ✅ **Error Tracking** (Sentry)
- ✅ **Row-Level Security** (Database-enforced)
- ✅ **Production-Grade Performance** (Optimized bundle)

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| TanStack Router | 1.x | File-based routing |
| TanStack Query | 5.x | Data fetching & caching |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Vite | 7.x | Build tool |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| TanStack Start | 1.x | Full-stack framework |
| Node.js | 18+ | Runtime |
| Supabase | Latest | Database & Auth |
| PostgreSQL | 14+ | Database |

### Third-Party Services
| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Auth, Database, RLS | ✅ Required |
| Resend | Email delivery | ✅ Optional |
| Sentry | Error tracking | ✅ Optional |

---

## Project Structure

```
gurnam-farms-the-harvest-experience/
│
├── src/
│   ├── routes/                          # TanStack Router pages
│   │   ├── __root.tsx                   # Root layout (initializes Sentry)
│   │   ├── index.tsx                    # Home page
│   │   ├── signup.tsx                   # Customer signup
│   │   ├── login.tsx                    # Login page
│   │   ├── reserve.tsx                  # Reservation form
│   │   │
│   │   ├── dashboard/
│   │   │   ├── index.tsx                # Customer dashboard (progress view)
│   │   │   └── reservations.tsx         # Reservation history
│   │   │
│   │   └── admin/
│   │       ├── index.tsx                # Admin dashboard (metrics)
│   │       ├── reservations.tsx         # Admin reservation management
│   │       ├── customers.tsx            # Customer list
│   │       ├── subscribers.tsx          # Newsletter subscribers
│   │       └── enquiries.tsx            # Contact form submissions
│   │
│   ├── components/
│   │   ├── site/                        # Page-level components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Story.tsx
│   │   │   ├── Gallery.tsx
│   │   │   └── ...
│   │   │
│   │   └── ui/                          # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client & helpers
│   │   ├── config.ts                    # Business configuration
│   │   ├── logger.ts                    # PII-safe structured logging
│   │   ├── error-page.ts                # Error rendering
│   │   ├── sentry.ts                    # Sentry integration
│   │   │
│   │   ├── api/
│   │   │   ├── email.functions.ts       # Server function: send emails
│   │   │   └── example.functions.ts     # Server function example
│   │   │
│   │   └── config.server.ts             # Server-side config
│   │
│   ├── services/
│   │   └── email/
│   │       └── emailService.ts          # Email service abstraction
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx               # Mobile detection hook
│   │
│   ├── start.ts                         # Server middleware
│   ├── server.ts                        # Server entry point
│   ├── router.tsx                       # Router configuration
│   └── styles.css                       # Global styles
│
├── public/
│   └── robots.txt
│
├── scripts/
│   └── migrations/
│       ├── 005_security_hardening.sql  # Phase 4A security
│       └── 006_database_hardening.sql  # Phase 4B hardening
│
├── PHASE_4A_SECURITY_AUDIT.md          # Security implementation
├── PHASE_4B_DATABASE_HARDENING.md      # Database hardening
├── PHASE_4C_CUSTOMER_EXPERIENCE.md     # Dashboard UX polish (implied)
├── PHASE_4D_ADMIN_DASHBOARD.md         # Admin metrics
├── PHASE_4E_EMAIL_SYSTEM.md            # Email integration
├── PHASE_4F_PERFORMANCE.md             # Optimizations
├── PHASE_4G_OBSERVABILITY.md           # Error tracking
├── PHASE_4H_TESTING_CHECKLIST.md       # QA testing
│
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── vite.config.ts                       # Vite config
└── eslint.config.js                    # ESLint config
```

---

## Authentication & Authorization

### Auth Flow (Signup/Login)

```
User (Browser)
  ↓
  Customer: POST /api/auth/signup
    → Supabase: Create auth.users entry
    → Supabase: Trigger creates public.profiles with role='customer'
    → RLS: Only user can access their profile
    → Redirect: /dashboard
  
  ↓
  
  Customer: POST /api/auth/login
    → Supabase: Authenticate email/password
    → Get JWT token
    → Store session (localStorage/secure)
    → Redirect: /dashboard
```

### Authorization (Role-Based)

```
Routes:
├─ / (Public)
├─ /signup (Public)
├─ /login (Public)
├─ /reserve (Protected: Customer only)
├─ /dashboard/* (Protected: Customer only)
└─ /admin/* (Protected: Admin only)
    └─ Verified via isAdmin(userId) function
```

### Role Definition

```sql
-- In auth.users: None (auth layer)
-- In profiles: role VARCHAR IN ('admin', 'customer')

-- Admin Check
CREATE FUNCTION app.is_admin(uid uuid) RETURNS boolean AS
  SELECT profile.role = 'admin'
  FROM public.profiles AS profile
  WHERE profile.id = uid
SECURITY DEFINER;
```

---

## Reservation System

### Reservation Lifecycle

```
Customer Fills Form
  ↓
  [Full Name, Email, Phone, Delivery Area, Address, Vegetables, Notes]
  ↓
  Validation
  ├─ All required fields present
  ├─ Valid email format
  ├─ At least 1 vegetable selected
  └─ Non-empty delivery area
  ↓
  submitReservation()
  ├─ Insert into reservations table
  ├─ Trigger: Creates reservation_progress (all flags = false)
  └─ Async: Send confirmation email (best-effort)
  ↓
  Success → /dashboard
  Error → Show error message, stay on form
```

### Progress Tracking (11 Steps)

```
Step 0:  Reservation Received      (customer confirms order)
Step 1:  Farm Preparation          (picking vegetables)
Step 2:  Harvest Ready             (vegetables harvested)
Step 3:  Harvested                 (ready for delivery)
Step 4:  Week 1 Delivered          (week 1 of 7 delivered)
Step 5:  Week 2 Delivered          (week 2 of 7 delivered)
Step 6:  Week 3 Delivered
Step 7:  Week 4 Delivered
Step 8:  Week 5 Delivered
Step 9:  Week 6 Delivered
Step 10: Week 7 Delivered          (complete)
```

### Admin Can Update Progress

```
Admin Views: /admin/reservations
  ↓
  Click Reservation
  ↓
  Update Progress Checkboxes
  ↓
  Database: UPDATE reservation_progress
  ├─ timestamp: updated_at
  └─ flags: true
  ↓
  Customer Dashboard: Auto-updates (polls every 10s)
```

---

## Admin Dashboard

### Metrics Displayed

| Metric | Query | Purpose |
|--------|-------|---------|
| Total Customers | COUNT DISTINCT(profile_id) FROM reservations | Market reach |
| Total Reservations | COUNT(*) FROM reservations | Business volume |
| Pending | COUNT(*) FROM reservations WHERE status='pending' | Work queue |
| Active Deliveries | COUNT(*) WHERE status IN ('pending', 'confirmed') | Fulfillment workload |
| Completed | COUNT(*) WHERE status='completed' | Success rate |

### Admin Capabilities

- ✅ View all reservations (no privacy restrictions)
- ✅ Search by customer name
- ✅ Filter by status/area
- ✅ Update individual reservation status
- ✅ Update harvest progress
- ✅ View customer list
- ✅ View subscriber list
- ✅ View contact form submissions
- ✅ Access recent activity feed

---

## Database Schema

### Core Tables

#### auth.users (Supabase)
```sql
id (uuid, PK)
email (text, UNIQUE)
encrypted_password (text)
...Supabase fields...
```

#### profiles
```sql
id (uuid, PK, FK → auth.users)
email (text)
name (text)
phone (text)
city (text)
role (text) CHECK IN ('admin', 'customer')
created_at (timestamptz)
updated_at (timestamptz)
```

#### reservations
```sql
id (bigint, PK, AUTO INCREMENT)
profile_id (uuid, FK → auth.users, ON DELETE SET NULL)
full_name (text, NOT NULL)
phone_number (text, NOT NULL)
email (text, NOT NULL)
delivery_area (text, NOT NULL) CHECK (delivery_area != '')
address (text, NOT NULL)
selected_vegetables (text[], NOT NULL) CHECK (array_length > 0)
notes (text)
status (text, NOT NULL) CHECK IN ('pending', 'confirmed', 'completed', 'cancelled')
created_at (timestamptz)

Indexes:
- idx_reservations_status
- idx_reservations_delivery_area
- idx_reservations_created_at_desc
- idx_reservations_profile_id_created_at
```

#### reservation_progress
```sql
id (bigint, PK)
reservation_id (bigint, FK → reservations, ON DELETE CASCADE)
reservation_received (boolean, NOT NULL, DEFAULT false)
farm_preparation (boolean, NOT NULL, DEFAULT false)
harvest_ready (boolean, NOT NULL, DEFAULT false)
harvested (boolean, NOT NULL, DEFAULT false)
week_1_delivered (boolean, NOT NULL, DEFAULT false)
week_2_delivered (boolean, NOT NULL, DEFAULT false)
week_3_delivered (boolean, NOT NULL, DEFAULT false)
week_4_delivered (boolean, NOT NULL, DEFAULT false)
week_5_delivered (boolean, NOT NULL, DEFAULT false)
week_6_delivered (boolean, NOT NULL, DEFAULT false)
week_7_delivered (boolean, NOT NULL, DEFAULT false)
updated_at (timestamptz, NOT NULL, DEFAULT now())

Indexes:
- idx_reservation_progress_updated_at_desc
- idx_reservation_progress_reservation_id_updated_at
```

#### contact_submissions
```sql
id (bigint, PK)
name (text)
email (text)
message (text)
created_at (timestamptz)
```

#### newsletter_subscribers
```sql
id (bigint, PK)
email (text, UNIQUE)
created_at (timestamptz)
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session
```

### Customer Reservations
```
POST   /api/reservations              # Submit reservation
GET    /api/reservations              # Get user's reservations
GET    /api/reservations/:id/progress # Get progress for reservation
PUT    /api/reservations/:id/progress # Update progress (admin only)
```

### Admin APIs
```
GET    /api/admin/reservations        # Get all reservations (admin only)
GET    /api/admin/customers           # Get all customers (admin only)
GET    /api/admin/metrics             # Get dashboard metrics (admin only)
GET    /api/admin/recent-activity     # Get activity feed (admin only)
```

### Server Functions (TanStack Start)
```
POST   /api/sendReservationConfirmationEmail  # Server function for email
```

---

## Environment Configuration

### Required Variables (Supabase)

```bash
# .env.local or platform environment variables

# Supabase (Required)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Email (Optional - Resend)
RESEND_API_KEY=re_xxxxxxxxx_key

# Error Tracking (Optional - Sentry)
VITE_SENTRY_DSN=https://key@sentry.io/project

# Business Config (in code)
# See src/lib/config.ts for business details
```

### Environment Variable Validation

```typescript
// At startup, app verifies:
if (!VITE_SUPABASE_URL) throw Error("Missing SUPABASE_URL");
if (!VITE_SUPABASE_ANON_KEY) throw Error("Missing SUPABASE_ANON_KEY");

// Optional (graceful degradation):
if (!VITE_SENTRY_DSN) console.warn("Sentry disabled");
if (!RESEND_API_KEY) console.warn("Email disabled");
```

---

## Deployment Guide

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- (Optional) Resend account
- (Optional) Sentry account

### Local Development

```bash
# 1. Clone & Install
git clone <repo>
cd gurnam-farms-the-harvest-experience
npm install

# 2. Configure Environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Database Setup (one-time)
# - Create Supabase project
# - Run migrations/005_security_hardening.sql in SQL editor
# - Run migrations/006_database_hardening.sql in SQL editor

# 4. Start Development Server
npm run dev
# Open http://localhost:5173

# 5. Test Application
# Navigate through flows in manual QA checklist
```

### Production Deployment

#### Step 1: Prepare Production Database
```sql
-- In Supabase SQL Editor, run:
-- 1. scripts/migrations/005_security_hardening.sql
-- 2. scripts/migrations/006_database_hardening.sql

-- Verify with queries at bottom of each migration
```

#### Step 2: Configure Environment (Platform-Specific)

**Vercel**:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add RESEND_API_KEY (optional)
vercel env add VITE_SENTRY_DSN (optional)
```

**Other Platforms**: Use platform's secret manager

#### Step 3: Build & Deploy
```bash
# Verify build succeeds
npm run build
# npm run build:dev for development mode

# Deploy using platform CLI
# Vercel: vercel --prod
# Others: Deploy dist/ folder
```

#### Step 4: Post-Deployment Verification
```
□ Admin dashboard loads (/admin)
□ Customer can signup (/signup)
□ Customer can make reservation (/reserve)
□ Admin can see reservations
□ Progress updates work
□ Email sends (if configured)
□ Sentry tracks errors (if configured)
```

---

## Monitoring & Observability

### Error Tracking (Sentry)

```typescript
import { captureException, addBreadcrumb } from "@/lib/sentry";

// Automatic Tracking:
try {
  await submitReservation(data);
} catch (error) {
  // Automatically captured by Sentry
  captureException(error, { operation: "submitReservation" });
}

// Manual Tracking:
addBreadcrumb("User started reservation", { step: "form_open" });
```

### Structured Logging

```typescript
import { logger } from "@/lib/logger";

// Automatic PII masking
logger.info("Reservation created", {
  email: "user@example.com",  // Masked → us***@example.com
  reservationId: 123,
});

// Output: [TIMESTAMP] INFO [Reservation created] {email: 'us***@example.com', ...}
```

### Performance Monitoring

```typescript
// Sentry Performance Tracking (automatic):
// - Page load time
// - API response times
// - React component renders
// - Network requests

// View in Sentry Dashboard → Performance
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find profile" on signup
**Cause**: Supabase trigger not executing  
**Solution**:
```sql
-- Manually create profile trigger in Supabase
CREATE TRIGGER on auth.users
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- See scripts/migrations/005_security_hardening.sql
```

#### 2. "Email not sending"
**Cause**: RESEND_API_KEY not configured  
**Solution**:
```bash
# Check environment variable is set
echo $RESEND_API_KEY

# Get API key from https://resend.com/api-keys
# Set in platform environment variables
```

#### 3. "Admin dashboard shows 0 metrics"
**Cause**: Migration 006 not executed  
**Solution**:
```sql
-- Run in Supabase SQL Editor:
-- scripts/migrations/006_database_hardening.sql
```

#### 4. "RLS policy error when fetching data"
**Cause**: RLS policy missing or incorrectly configured  
**Solution**:
```sql
-- Check RLS policies are enabled:
-- Supabase Dashboard → SQL Editor → Run RLS validation
-- See PHASE_4A_SECURITY_AUDIT.md for validation
```

#### 5. "Build fails with TypeScript errors"
**Cause**: Missing dependencies or type mismatches  
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Type check
npx tsc --noEmit

# Clear cache
rm -rf dist/ .vite/
npm run build
```

---

## Future Roadmap

### Phase 5: Advanced Features (Optional)

- [ ] **Payment Integration** - Stripe for paid orders
- [ ] **Inventory Management** - Track vegetable availability
- [ ] **Review System** - Customers rate experiences
- [ ] **Referral Program** - Reward customer referrals
- [ ] **Mobile App** - React Native for iOS/Android

### Phase 6: Scaling

- [ ] **Multi-Farm Support** - Multiple farm locations
- [ ] **Warehouse Management** - Inventory tracking
- [ ] **Delivery Routing** - Optimize delivery routes
- [ ] **Customer Insights** - Analytics dashboard
- [ ] **Machine Learning** - Predict harvest yields

### Performance Optimizations

- [ ] Code splitting for routes
- [ ] Lazy loading for admin components
- [ ] Image optimization
- [ ] Database query optimization
- [ ] Caching strategies

### International Expansion

- [ ] Multi-language support
- [ ] Multi-currency pricing
- [ ] Localized delivery areas
- [ ] Regional compliance

---

## Key Architectural Decisions

### 1. Why Supabase?
- ✅ PostgreSQL with RLS (security)
- ✅ Built-in auth (OAuth, email/password)
- ✅ Real-time subscriptions
- ✅ Developer-friendly API

### 2. Why TanStack Router?
- ✅ Type-safe routes
- ✅ File-based routing (conventional)
- ✅ beforeLoad guards for auth
- ✅ SEO-friendly

### 3. Why Server Functions?
- ✅ Email API key never exposed to client
- ✅ Secure backend operations
- ✅ TanStack Start handles RPC

### 4. Why Sentry?
- ✅ Real-time error tracking
- ✅ Session replay for debugging
- ✅ Performance monitoring
- ✅ Integrated error context

### 5. Why RLS?
- ✅ Database enforces security (not app)
- ✅ Can't bypass with app changes
- ✅ Granular row-level permissions
- ✅ Scales with data

---

## Support & Contact

**Technical Issues**: Check troubleshooting section above  
**Architecture Questions**: Review PHASE_4*.md files  
**Security Issues**: See PHASE_4A_SECURITY_AUDIT.md  

---

## Changelog

### Phase 4 (Current - v1.0)
- ✅ 4A: Security hardening
- ✅ 4B: Database hardening
- ✅ 4C: Customer UX polish
- ✅ 4D: Admin metrics
- ✅ 4E: Email system
- ✅ 4F: Performance optimization
- ✅ 4G: Error tracking (Sentry)
- ✅ 4H: Testing checklist
- ✅ 4I: Architecture documentation

### Phase 3 (Security)
- User signup/login security
- Hardcoded admin check removal
- PII-safe structured logging

### Phase 1-2 (MVP)
- Core reservation system
- Admin dashboard
- Customer dashboard
- Database schema

---

**End of Architecture Documentation**

**Last Updated**: Phase 4I Complete  
**Maintained By**: Development Team  
**Next Review**: Phase 5 Planning
