# Phase 4H: Testing - Manual QA Checklist

## Overview
Comprehensive manual QA checklist for validating all critical user flows and system functionality. Use this checklist to test the platform before production deployment.

---

## ✅ 1. Authentication & Authorization

### 1.1 User Signup (Customer)
- [ ] Navigate to `/signup`
- [ ] Enter valid email, password, confirm password
- [ ] See success message
- [ ] Redirected to home page
- [ ] Cannot access dashboard immediately (not yet a customer)
- [ ] Database: Profile created with role='customer'

### 1.2 User Signup (Email Validation)
- [ ] Try signup with existing email
- [ ] See error message "Email already registered"
- [ ] Try signup with invalid email format
- [ ] See error message "Invalid email"
- [ ] Try signup with mismatched passwords
- [ ] See error message "Passwords don't match"

### 1.3 User Login
- [ ] Navigate to `/login`
- [ ] Enter correct email and password
- [ ] See success message
- [ ] Redirected to dashboard (if customer) or home (if not)
- [ ] Session persists on page refresh
- [ ] Try login with wrong password
- [ ] See error message "Invalid password"

### 1.4 Admin Access Control
- [ ] User with role='customer' cannot access `/admin`
- [ ] Attempting `/admin` redirects to home
- [ ] Admin user can access `/admin` dashboard
- [ ] Check RLS: Customer cannot see other customers' reservations
- [ ] Admin can see all reservations

### 1.5 Logout
- [ ] Click logout/profile menu
- [ ] Session cleared
- [ ] Redirected to home page
- [ ] Cannot access protected pages (/dashboard, /admin)

---

## ✅ 2. Customer Reservation Flow

### 2.1 Make a Reservation
- [ ] Navigate to `/reserve`
- [ ] Fill out full form:
  - [ ] Full Name: "John Doe"
  - [ ] Phone: "+91 98765 43210"
  - [ ] Email: "john@example.com"
  - [ ] Delivery Area: "Downtown"
  - [ ] Address: "123 Main St, Apt 4B"
  - [ ] Vegetables: Select 3-5 items
  - [ ] Notes (optional): "No tomatoes"
- [ ] Submit form
- [ ] See success message
- [ ] Redirected to dashboard
- [ ] Database: Reservation created
- [ ] Database: reservation_progress created with all flags=false
- [ ] Email: Confirmation email sent (if configured)

### 2.2 Form Validation
- [ ] Try submit without full name
- [ ] See error message
- [ ] Try submit without email
- [ ] See error message
- [ ] Try submit without vegetables
- [ ] See error message
- [ ] Try submit without delivery area
- [ ] See error message
- [ ] Try submit with invalid email
- [ ] See error message
- [ ] All fields are required except notes

### 2.3 Vegetable Selection
- [ ] At least 1 vegetable must be selected
- [ ] Can select multiple vegetables
- [ ] Selected items are highlighted
- [ ] Can deselect by clicking again
- [ ] Form shows error if 0 vegetables selected

---

## ✅ 3. Customer Dashboard

### 3.1 Dashboard Load & Empty State
- [ ] Login as customer with no reservations
- [ ] See empty state message: "No reservations yet"
- [ ] See "Make a Reservation" button
- [ ] Click button takes to `/reserve`

### 3.2 Dashboard with Active Reservation
- [ ] Make a reservation
- [ ] Dashboard shows reservation details:
  - [ ] Reservation date (creation date)
  - [ ] Delivery area
  - [ ] Address (truncated if long)
  - [ ] Contact phone number
  - [ ] Vegetables (comma-separated with badges)
  - [ ] Status: "Active"
- [ ] Progress section shows:
  - [ ] Progress bar (0/11 completed initially)
  - [ ] All 11 steps: Reservation Received, Farm Preparation, etc.
  - [ ] All steps show as incomplete (numbered circles)

### 3.3 Dashboard Updates
- [ ] Admin updates progress flags
- [ ] Dashboard refreshes automatically (every 10 seconds)
- [ ] Progress bar updates
- [ ] Completed steps show checkmarks instead of numbers
- [ ] Last updated timestamp is visible

### 3.4 Multiple Reservations
- [ ] Make 2 reservations
- [ ] Dashboard shows only the latest reservation (most recent)
- [ ] See "View all reservations" or navigate to `/dashboard/reservations`
- [ ] All previous reservations listed

### 3.5 Loading & Error States
- [ ] Dashboard shows spinner while loading
- [ ] If error fetching data: "Unable to load reservations" message
- [ ] Retry button is available
- [ ] Retry button refetches data

---

## ✅ 4. Reservation Management

### 4.1 View All Reservations
- [ ] Navigate to `/dashboard/reservations`
- [ ] See table with all customer reservations
- [ ] Columns: ID, Name, Status, Delivery Area, Date
- [ ] Most recent first (descending date order)
- [ ] Multiple reservations display correctly

### 4.2 Reservation Details
- [ ] Click on a reservation row
- [ ] See full details (if detail page exists)
- [ ] All information displays correctly

---

## ✅ 5. Admin Dashboard

### 5.1 Admin Access
- [ ] Login with admin account
- [ ] Access `/admin` dashboard
- [ ] See admin-specific sections

### 5.2 Reservation Metrics
- [ ] Dashboard shows 5 metric cards:
  - [ ] **Total Customers**: Count of unique profile_id
  - [ ] **Total Reservations**: Count of all reservations
  - [ ] **Pending**: Count of status='pending'
  - [ ] **Active Deliveries**: Count of status='confirmed' + 'pending'
  - [ ] **Completed**: Count of status='completed'
- [ ] Numbers are correct (verify against database)
- [ ] Cards have color-coded backgrounds
- [ ] Cards load without errors

### 5.3 Engagement Metrics
- [ ] Dashboard shows engagement section:
  - [ ] **Total Contact Enquiries**: From contact_submissions
  - [ ] **Total Reservations**: From reservations table
  - [ ] **Newsletter Subscribers**: From newsletter_subscribers
  - [ ] **Recent Activity**: Latest 6 submissions
- [ ] All counts are accurate
- [ ] Activity feed shows correct data with timestamps

### 5.4 Admin Dashboard Errors
- [ ] If error loading metrics: Error message shows
- [ ] Dashboard still renders (graceful degradation)
- [ ] Metrics show as "—" (loading state)

---

## ✅ 6. Admin Reservation Management

### 6.1 View All Reservations
- [ ] Navigate to `/admin/reservations`
- [ ] See table with ALL reservations (not just user's)
- [ ] Columns: ID, Name, Delivery Area, Status, Date
- [ ] Search functionality works
- [ ] Can sort by date

### 6.2 Update Reservation Status
- [ ] Click on a reservation
- [ ] See status dropdown or update button
- [ ] Change status: pending → confirmed
- [ ] Save changes
- [ ] Status updates in table
- [ ] Database reflects change

### 6.3 Update Harvest Progress
- [ ] Navigate to `/admin/reservations`
- [ ] Find a reservation
- [ ] Click "Update Progress" or similar
- [ ] See checkboxes for all 11 progress flags
- [ ] Check "Reservation Received"
- [ ] Save
- [ ] Customer dashboard updates automatically

### 6.4 Search/Filter
- [ ] Search by customer name
- [ ] Filter by status (pending, confirmed, completed)
- [ ] Filter by delivery area
- [ ] Results update correctly

---

## ✅ 7. Admin Customer Management

### 7.1 View All Customers
- [ ] Navigate to `/admin/customers`
- [ ] See list of all customers
- [ ] Show: Profile ID, Name, Email, City, Phone
- [ ] Total customer count accurate

### 7.2 Admin Subscribers Management
- [ ] Navigate to `/admin/subscribers`
- [ ] See all newsletter subscribers
- [ ] Show: Email, Signup Date
- [ ] Count accurate

### 7.3 Admin Contact Submissions
- [ ] Navigate to `/admin/enquiries` (or contact management)
- [ ] See all contact form submissions
- [ ] Show: Name, Email, Message, Date
- [ ] Can search/filter

---

## ✅ 8. Email System

### 8.1 Reservation Confirmation Email
- [ ] Make a reservation
- [ ] Check email inbox
- [ ] Email received from: "Gurnam Farms <reservations@gurnam-farms.com>"
- [ ] Subject: "Harvest Reservation Received - Gurnam Farms"
- [ ] Email content includes:
  - [ ] Greeting with customer name
  - [ ] Confirmation message
  - [ ] Delivery area
  - [ ] Address
  - [ ] Vegetables list
  - [ ] Next steps message
  - [ ] Footer

### 8.2 Email Styling
- [ ] Email is properly formatted (HTML)
- [ ] Mobile responsive
- [ ] No broken links
- [ ] Professional appearance

### 8.3 Email Failure Handling
- [ ] If Resend not configured: Reservation still succeeds
- [ ] Logs warn about missing email provider
- [ ] No user-facing error

---

## ✅ 9. Security & Authorization

### 9.1 RLS Enforcement
- [ ] Customer A cannot see Customer B's reservations
- [ ] Customer A cannot see Customer B's profile
- [ ] Admin can see all reservations
- [ ] Admin can modify any reservation

### 9.2 Admin Role Verification
- [ ] Non-admin users redirected from `/admin/*` routes
- [ ] Database check: Only users with role='admin' can access admin functions
- [ ] Verify app.is_admin() function works

### 9.3 Session Security
- [ ] Token expires after configured time
- [ ] Logout clears session
- [ ] Cannot reuse expired token
- [ ] Session persists across page refresh

### 9.4 CORS & API Security
- [ ] No sensitive data exposed in API responses
- [ ] API keys not visible in client bundle
- [ ] Supabase anon key is published key (safe)
- [ ] Service role key never exposed to client

---

## ✅ 10. Data Validation & Integrity

### 10.1 Database Constraints
- [ ] Cannot create reservation without full_name (NOT NULL)
- [ ] Cannot create reservation without email
- [ ] Cannot create reservation without delivery_area
- [ ] Cannot create reservation without address
- [ ] Cannot create reservation without vegetables (empty array fails)
- [ ] Cannot create reservation with invalid status

### 10.2 Foreign Key Integrity
- [ ] Deleting user sets reservation.profile_id to NULL (not cascading)
- [ ] Deleting reservation deletes reservation_progress (CASCADE)
- [ ] No orphaned records in database

### 10.3 Data Consistency
- [ ] All reservation fields match between form and database
- [ ] Timestamps are accurate
- [ ] Status values are valid

---

## ✅ 11. UI/UX & Responsiveness

### 11.1 Mobile Responsiveness
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1200px width)
- [ ] All layouts render correctly
- [ ] Forms are usable on mobile
- [ ] No horizontal scrolling

### 11.2 Navigation
- [ ] Navbar is visible on all pages
- [ ] Links work correctly
- [ ] Active route highlighted
- [ ] Mobile menu works (if applicable)

### 11.3 Forms & Inputs
- [ ] Inputs have proper labels
- [ ] Error messages are clear
- [ ] Form submission feedback (spinner, success message)
- [ ] Disabled buttons during submission

### 11.4 Visual Feedback
- [ ] Buttons have hover states
- [ ] Loading spinners visible during async operations
- [ ] Success messages appear and dismiss
- [ ] Error messages are visible

---

## ✅ 12. Performance & Loading

### 12.1 Page Load Times
- [ ] Home page loads in <2s
- [ ] Dashboard loads in <2s
- [ ] Admin pages load in <3s
- [ ] No long blocking operations

### 12.2 Caching & Optimization
- [ ] Repeated requests are cached (React Query)
- [ ] Images are optimized
- [ ] CSS/JS files are minified

### 12.3 Error Handling
- [ ] Network errors handled gracefully
- [ ] Server errors show user-friendly messages
- [ ] Database errors don't crash the app
- [ ] Fallback states render correctly

---

## ✅ 13. Logging & Monitoring

### 13.1 Error Logging
- [ ] Errors logged with context
- [ ] No PII exposed in logs
- [ ] Email addresses masked (email@****)
- [ ] Phone numbers masked (****3210)

### 13.2 Sentry Integration (if configured)
- [ ] Errors appear in Sentry dashboard
- [ ] Error details are useful for debugging
- [ ] No duplicate error entries

---

## ✅ 14. Browser Compatibility

### 14.1 Chrome/Edge
- [ ] All features work
- [ ] No console errors

### 14.2 Firefox
- [ ] All features work
- [ ] No console errors

### 14.3 Safari
- [ ] All features work
- [ ] No console errors
- [ ] Touch gestures work

---

## ✅ 15. Acceptance Criteria Met

### Success Criteria:
- [ ] 4A: Security audit passed (app.is_admin, RLS)
- [ ] 4B: Database hardening deployed (FK constraints, indexes)
- [ ] 4C: Customer dashboard enhanced (UX polish)
- [ ] 4D: Admin dashboard metrics working
- [ ] 4E: Email confirmations sending
- [ ] 4F: Code optimized (no dead code)
- [ ] 4G: Error tracking working
- [ ] 4H: QA checklist complete

### Production Readiness:
- [ ] No TypeScript errors
- [ ] No console errors in production build
- [ ] All critical flows tested
- [ ] Performance acceptable
- [ ] Security validated

---

## Test Results Summary

### Phase 4 Complete Test Date: _____________

**Tested By**: ___________________________

**Total Tests**: 15+ major sections  
**Critical Tests**: 25+  
**Pass Rate**: _____ / 100%  

### Issues Found:
```
(List any issues found during testing)
1. 
2. 
3. 
```

### Sign-off:
- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Ready for production deployment

---

## Deployment Checklist

### Before Deploying:
- [ ] All Phase 4 code reviewed
- [ ] Manual QA completed
- [ ] Security audit passed
- [ ] Performance benchmarks acceptable
- [ ] Environment variables configured:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_SENTRY_DSN (optional)
  - [ ] RESEND_API_KEY (optional)

### Deployment:
- [ ] Build successful: `npm run build`
- [ ] No TypeScript errors
- [ ] Deploy to staging
- [ ] Run smoke tests in staging
- [ ] Deploy to production

### Post-Deployment:
- [ ] Monitor Sentry for errors
- [ ] Check admin dashboard metrics
- [ ] Test key flows in production
- [ ] Monitor performance metrics
- [ ] Be available for user support

---

## Notes

- Keep this checklist updated as new features are added
- Run this checklist before every production deployment
- Document any issues or edge cases found
- Update test cases if behavior changes

**Phase 4H Status**: COMPLETE ✅

**Next Phase**: Phase 4I - Documentation (ARCHITECTURE.md)
