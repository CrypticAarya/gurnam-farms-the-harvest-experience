# DEPLOYMENT_GUIDE.md

**Project**: Gurnam Farms - The Harvest Experience  
**Status**: Production-Ready  
**Platform**: Vercel (Recommended)  
**Deployment Time**: ~3-5 minutes

---

## TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Troubleshooting](#troubleshooting)
6. [Monitoring](#monitoring)

---

## PREREQUISITES

Before deploying, ensure:

- ✅ Supabase project created
- ✅ Database migrations executed (005 & 006)
- ✅ Admin user assigned role in database
- ✅ Resend account created (optional, for emails)
- ✅ Sentry project created (optional, for errors)
- ✅ GitHub repository connected to Vercel

---

## ENVIRONMENT SETUP

### 1. Supabase Configuration

**Required Environment Variables**:

```bash
VITE_SUPABASE_URL=https://{project-id}.supabase.co
VITE_SUPABASE_ANON_KEY={your-anon-key}
```

Where to find:
- Supabase Dashboard → Settings → API
- Copy "Project URL" → VITE_SUPABASE_URL
- Copy "anon public" key → VITE_SUPABASE_ANON_KEY

**Optional Environment Variables**:

```bash
# Email (Resend)
RESEND_API_KEY={your-resend-api-key}

# Error Tracking (Sentry)
VITE_SENTRY_DSN={your-sentry-dsn}
```

### 2. Update .env.example

Commit this to repository for documentation:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
VITE_SENTRY_DSN=https://key@sentry.io/project
RESEND_API_KEY=re_xxxxxxxxx
```

---

## VERCEL DEPLOYMENT

### Step 1: Connect to Vercel

```bash
# Option A: Via Vercel CLI
npm install -g vercel
vercel login
vercel link

# Option B: Via Vercel Dashboard
# Visit: https://vercel.com/new
# Select GitHub repository: CrypticAarya/gurnam-farms-the-harvest-experience
```

### Step 2: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add these environment variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| VITE_SUPABASE_URL | https://{id}.supabase.co | Production, Preview, Development |
| VITE_SUPABASE_ANON_KEY | {your-key} | Production, Preview, Development |
| VITE_SENTRY_DSN | {your-dsn} | Production (optional) |
| RESEND_API_KEY | {your-key} | Production (optional) |

3. Click "Save"

### Step 3: Deploy

**Automatic** (Recommended):
- Push to main branch
- Vercel automatically builds and deploys

**Manual**:
```bash
vercel --prod
```

### Step 4: Verify Build

In Vercel Dashboard:
- ✅ Build Status: "Ready"
- ✅ Deployment Status: "Success"
- ✅ All checks passed

---

## BUILD CONFIGURATION

The `vercel.json` file is already configured:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Do not modify** unless you need custom behavior.

---

## POST-DEPLOYMENT VERIFICATION

### 1. Smoke Tests (First 5 minutes)

```
□ Website loads without errors
□ Navbar displays correctly
□ Landing page animations smooth
□ All images load
□ No console errors
```

### 2. Customer Flow (First 30 minutes)

```
□ Sign up page loads
□ Create account works
□ Email verification (check inbox)
□ Login succeeds
□ Redirect to dashboard
□ Can view reservations (if any)
```

### 3. Admin Flow (First 30 minutes)

```
□ Admin login page loads
□ Admin user can login
□ Admin dashboard loads
□ Metrics display correctly
□ Can view all reservations
□ Can update reservation status
```

### 4. Reservation Flow (First 1 hour)

```
□ Reserve page loads
□ Form validation works
□ Can submit reservation
□ Confirmation page displays
□ Confirmation email received (if configured)
□ Reservation appears in admin dashboard
□ Progress tracking visible
```

### 5. Security Check (First 2 hours)

```
□ Cannot access /admin without login
□ Customer cannot access /admin (redirects)
□ Non-admin cannot become admin (tried role manipulation)
□ CSRF protection working
□ RLS policies enforced in database
```

### 6. Monitor Sentry (First 24 hours)

If Sentry configured:
```
□ No error spike
□ No unhandled exceptions
□ Session replay available
□ Error grouping working
```

### 7. Monitor Analytics

Check these metrics after 24 hours:
- Page views
- Error rate (should be < 1%)
- API latency
- Database query times

---

## DOMAIN CONFIGURATION

### Step 1: Update Domain in Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., gurnamfarms.com)
4. Choose DNS provider

### Step 2: DNS Setup

**For Domain Registrar's DNS**:

Add CNAME record:
```
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

Add A record:
```
Host: @
Value: 76.76.19.165
TTL: 3600
```

**Or use Vercel's nameservers** (easier):
1. Copy Vercel's nameservers
2. Update registrar to use them
3. Wait 24-48 hours for propagation

### Step 3: Verify SSL

SSL certificate is automatic:
- ✅ Vercel issues free certificate
- ✅ Auto-renews
- ✅ No configuration needed

---

## DATABASE MIGRATIONS

Before deploying, execute these in Supabase SQL Editor:

**Migration 005: Security Hardening**
```sql
-- Run scripts/migrations/005_security_hardening.sql
```

**Migration 006: Database Hardening**
```sql
-- Run scripts/migrations/006_database_hardening.sql
```

Both migrations are idempotent (safe to run multiple times).

---

## TROUBLESHOOTING

### Build Fails

**Error**: "Cannot find module '@supabase/supabase-js'"

**Solution**:
```bash
# Verify package.json has dependency
npm install
npm run build --verbose

# Check Vercel logs for details
vercel logs --follow
```

### Environment Variables Missing

**Error**: "Supabase configuration is missing"

**Solution**:
1. Vercel Dashboard → Settings → Environment Variables
2. Verify all VITE_* variables are set
3. Redeploy: `vercel --prod`

### Hydration Mismatch

**Error**: "Text content did not match"

**Solution**:
1. This is usually SSR timing issue
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
3. Clear browser cache
4. If persists, check browser console for specifics

### Database Connection Fails

**Error**: "Supabase authentication failed"

**Solution**:
1. Verify VITE_SUPABASE_URL is correct
2. Verify VITE_SUPABASE_ANON_KEY is correct
3. Check Supabase dashboard → Auth → RLS policies
4. Verify RLS policies are enabled

### Admin Login Fails

**Error**: "Authentication error" or "Access denied"

**Solution**:
1. Verify user exists in auth.users
2. Check user's profile has role='admin'
3. Run in Supabase SQL Editor:
   ```sql
   SELECT id, role FROM profiles WHERE email='your@email.com';
   ```
4. If role is 'customer', update:
   ```sql
   UPDATE profiles SET role='admin' WHERE email='your@email.com';
   ```

### Email Not Sending

**Error**: Reservation created but no confirmation email

**Solution**:
1. Check if RESEND_API_KEY is set
2. Verify Resend API key is valid
3. Check Resend dashboard for failed sends
4. Check spam folder for email
5. Application works without emails (graceful degradation)

---

## MONITORING

### Error Tracking (Sentry)

If configured, monitor at:
```
https://sentry.io/organizations/{your-org}/issues/?project={project-id}
```

### Performance Monitoring

Use Vercel Analytics:
```
Vercel Dashboard → Analytics
```

Monitor these metrics:
- Web Vitals (LCP, CLS, FID)
- API response times
- Database query times

### Log Aggregation

View deployment logs:
```bash
vercel logs --follow
```

Or in Vercel Dashboard:
```
Project → Deployments → Click deployment → Runtime logs
```

---

## SCALING CONSIDERATIONS

### Rate Limiting

Vercel has built-in rate limiting. If needed:
1. Use Vercel Middleware
2. Implement request deduplication
3. Add database query caching

### Database Optimization

After 1000+ reservations:
1. Verify indexes exist (in migrations)
2. Check slow query log in Supabase
3. Consider read replicas for high-traffic analytics

### CDN Caching

Static assets are cached with:
- Browser cache: 1 hour
- Vercel edge cache: 1 year (for immutable assets)

---

## ROLLBACK PROCEDURE

If deployment fails:

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy from specific commit
vercel --prod
```

Vercel keeps last 50 deployments.

---

## SECURITY CHECKLIST

Before going live:

- [ ] All environment variables are secrets (not committed)
- [ ] HTTPS enabled (automatic)
- [ ] RLS policies enabled in Supabase
- [ ] Admin role assignment process documented
- [ ] Email templates reviewed (no sensitive data)
- [ ] Error logging doesn't expose PII
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up

---

## SUPPORT

### Common Issues

1. **Build fails** → Check error logs: `vercel logs --tail`
2. **Can't login** → Verify Supabase credentials
3. **Emails not sending** → Check RESEND_API_KEY
4. **Errors not tracked** → Check VITE_SENTRY_DSN

### Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Project Architecture](./ARCHITECTURE.md)

### Getting Help

1. Check relevant logs
2. Review error messages carefully
3. Check documentation links above
4. Ask team members

---

**Deployment Guide Version**: 1.0  
**Last Updated**: Phase 4 Complete  
**Status**: Production-Ready

