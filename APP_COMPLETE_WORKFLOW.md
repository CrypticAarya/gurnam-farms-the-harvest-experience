# Gurnam Farms - Complete App Workflow

## 📋 Overview

Gurnam Farms is a **weekly harvest reservation platform** that allows customers to reserve fresh seasonal vegetables delivered to their doorstep. The app has 3 main user flows:

1. **Customer Journey** - Browse & reserve
2. **Form Submission** - Fill 7-step reservation form
3. **Admin Dashboard** - View all reservations

---

## 🏗️ Technical Stack

```
Frontend
├── React 19 + TypeScript 5.x
├── TanStack Router (file-based routing)
├── TanStack React Query (data fetching)
├── Vite (build tool)
└── Tailwind CSS + shadcn/ui (styling)

Backend
├── Supabase (PostgreSQL database)
├── JWT Authentication
├── Row Level Security (RLS)
└── Real-time subscriptions

Hosting
├── Frontend: Vite dev server (http://127.0.0.1:8081)
└── Backend: Supabase Cloud
```

---

## 🗺️ App Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / User                           │
└────────────┬────────────────────────────────────────────────────┘
             │ HTTP Requests
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  TanStack Router                                         │   │
│  │  ├── /  (Homepage)                                       │   │
│  │  ├── /reserve (Reservation form - 7 steps)              │   │
│  │  ├── /admin/login (Admin login)                         │   │
│  │  ├── /admin/reservations (View all reservations)        │   │
│  │  └── /admin/contact (View contact submissions)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Supabase Client (supabase.ts)                          │   │
│  │  ├── Authentication functions                           │   │
│  │  ├── submitReservation()                                │   │
│  │  ├── fetchReservations()                                │   │
│  │  └── Error handling & formatting                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────────┘
             │ REST API Calls (.insert, .select, .order)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Supabase Backend (PostgreSQL)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables                                                  │   │
│  │  ├── reservations (PUBLIC - RLS disabled)               │   │
│  │  ├── profiles (RLS enabled - auth users only)           │   │
│  │  ├── contact_submissions (PUBLIC - RLS disabled)        │   │
│  │  ├── newsletter_subscribers (PUBLIC - RLS disabled)     │   │
│  │  └── harvest_reservations (PUBLIC - RLS disabled)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Authentication (Supabase Auth)                         │   │
│  │  ├── JWT tokens for admin login                         │   │
│  │  └── Email/password authentication                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 User Flows

### Flow 1: Customer Landing → Browse

```
Customer opens http://127.0.0.1:8081/
│
├─> Homepage (src/routes/index.tsx) loads
│   ├── Navbar component
│   │   └── Shows: Logo, "Reserve Your Field" button, Links
│   │
│   ├── Hero section
│   │   └── "Farm Fresh, Delivered Before Dawn"
│   │
│   ├── Story section
│   │   └── About Gurnam Farms (background story)
│   │
│   ├── SeasonalHarvest section
│   │   └── Shows current seasonal vegetables (winter/summer)
│   │
│   ├── DeliveryAreas section (NEW)
│   │   └── 4 cities: Patiala, Rajpura, Ambala, Chandigarh
│   │
│   ├── DeliveryNetwork section (Our Farm)
│   │   ├── Farm info and address
│   │   ├── Google Maps embed
│   │   └── CTA buttons: "Get Directions" + "Reserve Your Harvest"
│   │
│   └── Footer
│       └── Links, contact, social media
│
└─> Customer clicks "Reserve Your Harvest" button
    └─> Navigates to /reserve
```

---

### Flow 2: Reservation Form (7 Steps)

```
Customer clicks "Reserve Your Harvest"
│
└─> Navigate to http://127.0.0.1:8081/reserve
    │
    └─> ReservePage component (src/routes/reserve.tsx) loads
        │
        ├─ Step 1: Full Name
        │  ├─ Input: Text field
        │  ├─ Stores: form.fullName
        │  ├─ Validation: Required (not empty)
        │  └─ Next button disabled until filled
        │
        ├─ Step 2: Phone Number
        │  ├─ Input: Tel field
        │  ├─ Stores: form.phone
        │  ├─ Validation: Required (not empty)
        │  └─ Next button disabled until filled
        │
        ├─ Step 3: Email Address
        │  ├─ Input: Email field
        │  ├─ Stores: form.email
        │  ├─ Validation: Required (not empty)
        │  └─ Next button disabled until filled
        │
        ├─ Step 4: Delivery Area ⭐ CRITICAL STEP
        │  ├─ Input: Dropdown select
        │  ├─ Options: "Patiala", "Rajpura", "Ambala", "Chandigarh"
        │  ├─ Stores: form.deliveryArea
        │  ├─ Validation: Required (not empty) ✅ FIXED
        │  └─ Next button disabled until selected
        │
        ├─ Step 5: Delivery Address
        │  ├─ Input: Dropdown select (locality)
        │  ├─ PATIALA Localities:
        │  │  ├─ Model Town
        │  │  ├─ Urban Estate
        │  │  ├─ Tripuri
        │  │  ├─ Lower Mall
        │  │  ├─ Lehal Colony
        │  │  ├─ Rajpura Road
        │  │  ├─ Bhupindra Road
        │  │  ├─ New Lal Bagh
        │  │  ├─ Anardana Chowk
        │  │  └─ 21 No. Phatak
        │  ├─ Stores: form.address (just locality name)
        │  ├─ Validation: Required (not empty) ✅ SIMPLIFIED
        │  └─ Next button disabled until selected
        │
        ├─ Step 6: Select Vegetables ⭐ MULTI-SELECT
        │  ├─ Winter Vegetables (8 options):
        │  │  ├─ Cauliflower ☐
        │  │  ├─ Carrot ☐
        │  │  ├─ Mustard Greens ☐
        │  │  ├─ Spinach ☐
        │  │  ├─ Radish ☐
        │  │  ├─ Turnip ☐
        │  │  ├─ Peas ☐
        │  │  └─ Cabbage ☐
        │  │
        │  ├─ Summer Vegetables (8 options):
        │  │  ├─ Okra ☐
        │  │  ├─ Bottle Gourd ☐
        │  │  ├─ Bitter Gourd ☐
        │  │  ├─ Ridge Gourd ☐
        │  │  ├─ Brinjal ☐
        │  │  ├─ Tomato ☐
        │  │  ├─ Cucumber ☐
        │  │  └─ Green Chilli ☐
        │  │
        │  ├─ Stores: form.selectedVegetables (array)
        │  ├─ Validation: Minimum 1 item required
        │  └─ Next button disabled if 0 selected
        │
        ├─ Step 7: Additional Notes
        │  ├─ Input: Textarea
        │  ├─ Stores: form.notes
        │  ├─ Validation: Optional (always allowed)
        │  └─ Submit button enabled
        │
        └─ Step 8: Success Screen
           ├─ Message: "Your Harvest Awaits 🌱"
           ├─ Details: Confirmation text
           └─ Button: "Return to Home"

FORM STATE OBJECT (what gets stored in React):
{
  fullName: "John Doe",
  phone: "+91 98765 43210",
  email: "john@example.com",
  deliveryArea: "Ambala",        ← Step 4
  address: "Model Town",          ← Step 5 (just locality)
  selectedVegetables: ["Cauliflower", "Carrot"],  ← Step 6
  notes: "Sunday delivery"        ← Step 7
}
```

---

### Flow 3: Form Submission to Database

```
User fills all 7 steps and clicks "Complete Reservation"
│
└─> handleSubmit() function triggered
    │
    ├─ VALIDATION CHECK:
    │  ├─ ✅ deliveryArea not empty?
    │  ├─ ✅ selectedVegetables length > 0?
    │  └─ If validation fails: Show error, don't submit
    │
    ├─ DATA TRANSFORMATION:
    │  │ Form data (camelCase) → Supabase format (snake_case)
    │  │
    │  └─ Transformation:
    │     {
    │       full_name: "John Doe",           ← fullName
    │       phone_number: "+91 98765 43210",  ← phone
    │       email: "john@example.com",       ← email
    │       delivery_area: "Ambala",         ← deliveryArea
    │       address: "Model Town",           ← address
    │       selected_vegetables: ["Cauliflower", "Carrot"],  ← array
    │       notes: "Sunday delivery"         ← notes
    │     }
    │
    ├─ SUPABASE CALL:
    │  │ await submitReservation(transformedData)
    │  │
    │  └─ In supabase.ts:
    │     supabase
    │       .from<ReservationRow>("reservations")
    │       .insert(transformedData)        ← Insert into table
    │       .select()                       ← Return inserted row
    │
    ├─ DATABASE INSERTION:
    │  │ Supabase receives insert request
    │  │
    │  ├─ CHECK 1: Is RLS enabled? 
    │  │  └─ ✅ RLS DISABLED on reservations table
    │  │     → Public form can insert ✅
    │  │
    │  ├─ CHECK 2: Are all required fields present?
    │  │  ├─ full_name? ✅
    │  │  ├─ phone_number? ✅
    │  │  ├─ email? ✅
    │  │  ├─ delivery_area? ✅
    │  │  ├─ address? ✅
    │  │  └─ selected_vegetables? ✅
    │  │
    │  ├─ DATABASE ROW CREATED:
    │  │  {
    │  │    id: 1,                                    ← Auto-generated
    │  │    full_name: "John Doe",
    │  │    phone_number: "+91 98765 43210",
    │  │    email: "john@example.com",
    │  │    delivery_area: "Ambala",
    │  │    address: "Model Town",
    │  │    selected_vegetables: ["Cauliflower", "Carrot"],
    │  │    notes: "Sunday delivery",
    │  │    created_at: "2026-06-04T14:30:00Z"     ← Auto timestamp
    │  │  }
    │  │
    │  └─ Return to frontend
    │
    ├─ FRONTEND RESPONSE:
    │  ├─ IF SUCCESS:
    │  │  ├─ setStatus("success")
    │  │  ├─ setStep(8)
    │  │  └─ Show: "Your Harvest Awaits 🌱"
    │  │
    │  └─ IF ERROR:
    │     ├─ setStatus("error")
    │     ├─ Extract error message from Supabase
    │     └─ Show error to user
    │
    └─> User sees success screen and can click "Return to Home"
```

---

## 🔐 Authentication & Admin Flow

### Admin Login

```
Admin goes to http://127.0.0.1:8081/admin/login
│
└─> LoginPage component loads (src/routes/admin/login.tsx)
    │
    ├─ Email input: "admin@gurnamfarms.com"
    ├─ Password input: [password]
    │
    └─> Click "Sign In"
        │
        └─> signInAdmin() function
            │
            └─> supabase.auth.signInWithPassword(email, password)
                │
                ├─ Supabase verifies credentials
                ├─ Returns JWT token if valid
                └─ Store session in browser
                    │
                    └─> Navigate to /admin/reservations
```

### Admin Dashboard

```
Admin logs in → http://127.0.0.1:8081/admin/reservations
│
└─> ReservationsPage component (src/routes/admin/reservations.tsx)
    │
    ├─ ROUTE GUARD (beforeLoad):
    │  ├─ Check: Is user authenticated?
    │  ├─ Check: Is email in ADMIN_EMAILS?
    │  └─ If not → Redirect to login
    │
    ├─ FETCH RESERVATIONS:
    │  │ useQuery(() => fetchReservations())
    │  │
    │  └─ In supabase.ts:
    │     supabase
    │       .from<ReservationRow>("reservations")
    │       .select("*")
    │       .order("created_at", { ascending: false })
    │
    ├─ DISPLAY TABLE:
    │  │ Columns (left to right):
    │  │
    │  ├─ Full Name
    │  ├─ Phone Number
    │  ├─ Email
    │  ├─ Delivery Area        ⭐ Gold highlight
    │  ├─ Address
    │  ├─ Selected Vegetables
    │  ├─ Notes
    │  └─ Date
    │
    ├─ FEATURES:
    │  ├─ Search by name/email/phone
    │  ├─ Clear search button
    │  └─ Auto-sorts by created_at DESC (newest first)
    │
    └─> Admin can review all customer reservations
```

---

## 📊 Database Schema

### Reservations Table (MAIN)

```sql
Table: reservations

┌─────────────────────────────────────────────────────┐
│ Column              │ Type                │ Notes   │
├─────────────────────────────────────────────────────┤
│ id                  │ bigserial (PK)      │ Auto-ID │
│ full_name           │ text (NOT NULL)     │ Step 1  │
│ phone_number        │ text (NOT NULL)     │ Step 2  │
│ email               │ text (NOT NULL)     │ Step 3  │
│ delivery_area       │ text (NOT NULL)     │ Step 4  │
│                     │ default: 'Patiala'  │         │
│ address             │ text (NOT NULL)     │ Step 5  │
│ selected_vegetables │ text[] (NOT NULL)   │ Step 6  │
│                     │ Example: ["Carrot", │ Array   │
│                     │ "Cauliflower"]      │         │
│ notes               │ text                │ Step 7  │
│                     │ (NULLABLE)          │ Optional│
│ created_at          │ timestamptz         │ Auto TS │
│                     │ default: now()      │         │
└─────────────────────────────────────────────────────┘

INDEXES:
✓ idx_reservations_email (for searching by email)
✓ idx_reservations_delivery_area (for filtering by city)
✓ idx_reservations_created_at (for sorting)

RLS: DISABLED ✅ (allows public form submission)
```

### Example Row

```json
{
  "id": 1,
  "full_name": "Rajesh Kumar",
  "phone_number": "+91 98765 43210",
  "email": "rajesh@example.com",
  "delivery_area": "Patiala",
  "address": "Model Town",
  "selected_vegetables": ["Cauliflower", "Carrot", "Spinach"],
  "notes": "Early morning delivery preferred",
  "created_at": "2026-06-04T09:15:00Z"
}
```

---

## 🔌 Component Structure

### Route Tree

```
src/routes/
├── __root.tsx                 ← App shell, Navbar, Footer
├── index.tsx                  ← Homepage
│
├── reserve.tsx                ← 7-step reservation form
│
├── admin/
│   ├── __layout.tsx          ← Admin layout
│   ├── login.tsx             ← Admin login page
│   ├── reservations.tsx      ← View all reservations
│   ├── contact.tsx           ← View contact forms
│   ├── customers.tsx         ← Customer management
│   ├── enquiries.tsx         ← Support enquiries
│   ├── profile.tsx           ← Admin profile
│   └── signup.tsx            ← Admin signup
│
├── contact.tsx               ← Contact form page
├── subscribers.tsx           ← Newsletter subscribers
└── sitemap[.]xml.ts          ← XML sitemap

src/components/
├── site/
│   ├── Navbar.tsx            ← Header navigation
│   ├── Hero.tsx              ← Hero section
│   ├── Story.tsx             ← About story
│   ├── SeasonalHarvest.tsx   ← Seasonal veggies
│   ├── DeliveryAreas.tsx     ← 4 cities display
│   ├── DeliveryNetwork.tsx   ← Our Farm section
│   ├── Footer.tsx            ← Footer
│   └── Reveal.tsx            ← Scroll animations
│
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── textarea.tsx
    ├── form.tsx
    ├── table.tsx
    └── [other shadcn components]

src/lib/
├── supabase.ts               ← Database operations
├── config.ts                 ← Configuration (cities, veggies)
├── utils.ts                  ← Utility functions
└── error-capture.ts          ← Error handling
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER INTERACTION                         │
└────────┬──────────────────────────────────────────────────────┬─┘
         │ (1) Visit site                      (4) View form    │
         ▼                                                       ▼
    ┌─────────┐                                          ┌──────────┐
    │Homepage │ ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤ Success  │
    │         │  (5) Return home after submit           │ Screen   │
    └────┬────┘                                          └──────────┘
         │ (2) Click Reserve button                            ▲
         ▼                                                      │
    ┌──────────────┐                                          (5)
    │ Reservation  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
    │ Form (7 Step)│  (3) Fill form
    └──────┬───────┘
           │
           │ (3) Form Submit
           ▼
    ┌────────────────────┐
    │ React State        │
    │ {                  │
    │   fullName: "..."  │
    │   phone: "..."     │
    │   email: "..."     │
    │   deliveryArea: "" │
    │   address: ""      │
    │   vegetables: []   │
    │   notes: ""        │
    │ }                  │
    └────────┬───────────┘
             │
             │ (4) Validate & Transform
             │    camelCase → snake_case
             ▼
    ┌─────────────────────────────────────┐
    │ Data Transformation                 │
    │ {                                   │
    │   full_name: "...",                 │
    │   phone_number: "...",              │
    │   email: "...",                     │
    │   delivery_area: "...",             │
    │   address: "...",                   │
    │   selected_vegetables: [...],       │
    │   notes: "..."                      │
    │ }                                   │
    └────────┬────────────────────────────┘
             │
             │ (5) Submit to Supabase
             ▼
    ┌──────────────────────────────────────┐
    │ supabase.ts                          │
    │ submitReservation()                  │
    │ .from("reservations")                │
    │ .insert()                            │
    │ .select()                            │
    └────────┬─────────────────────────────┘
             │ REST API POST
             │ https://qpwpuzlxaciljoxmkxmp.supabase.co
             ▼
    ┌──────────────────────────────┐
    │ Supabase Backend             │
    │ ✅ RLS Check (DISABLED)      │
    │ ✅ Data Validation           │
    │ ✅ Insert into database      │
    │ ✅ Auto timestamp            │
    │ ✅ Return row                │
    └────────┬─────────────────────┘
             │ Response: { id: 1, ... }
             ▼
    ┌──────────────────────────────┐
    │ Frontend Success Handler     │
    │ setStatus("success")         │
    │ setStep(8)                   │
    │ Show success message         │
    └──────────────────────────────┘
             │
             └──> Show "Your Harvest Awaits"
                  + "Return to Home" button
```

---

## 🛡️ Error Handling

```
Error can occur at these points:

1. FORM VALIDATION ERROR
   ├─ User leaves step empty
   ├─ Next button stays disabled
   └─ Message: (implicit - button disabled)

2. SUBMISSION ERROR
   ├─ Network error
   ├─ Database constraint violation
   ├─ Missing required fields
   └─ formatSupabaseError() extracts details
      ├─ Error message
      ├─ Error details
      ├─ Error hint
      └─ Error code

3. HANDLED ERRORS
   ├─ RLS violation (code=42501)
   ├─ Table not found (PGRST205)
   ├─ Constraint violation
   └─ Network timeout

4. ERROR DISPLAY
   ├─ setStatus("error")
   ├─ setMessage(formattedError)
   └─ Show red error box to user
```

---

## 🔄 Configuration

### File: src/lib/config.ts

```typescript
export const ADMIN_EMAILS = ["admin@gurnamfarms.com"];

export const DELIVERY_AREAS = [
  "Patiala",
  "Rajpura",
  "Ambala",
  "Chandigarh"
];

export const DELIVERY_LOCATIONS = [
  "Model Town",          // Patiala neighborhoods
  "Urban Estate",
  "Tripuri",
  "Lower Mall",
  "Lehal Colony",
  "Rajpura Road",
  "Bhupindra Road",
  "New Lal Bagh",
  "Anardana Chowk",
  "21 No. Phatak"
];

export const VEGETABLES = {
  winter: [
    "Cauliflower", "Carrot", "Mustard Greens", "Spinach",
    "Radish", "Turnip", "Peas", "Cabbage"
  ],
  summer: [
    "Okra", "Bottle Gourd", "Bitter Gourd", "Ridge Gourd",
    "Brinjal", "Tomato", "Cucumber", "Green Chilli"
  ]
};
```

---

## 📱 UI/UX Features

### Design System

```
Colors:
├─ Forest Green: #1a3a2a (primary text, headings)
├─ Gold: #d4a574 (accents, highlights)
├─ Cream: #faf7f2 (backgrounds)
└─ White: #ffffff (cards, overlays)

Typography:
├─ Headlines: 2-3xl, semibold, forest-deep
├─ Body: sm-base, regular, muted-foreground
└─ Labels: sm, medium, forest-deep

Components Used:
├─ Button (shadcn/ui) - rounded-full, gold accents
├─ Input (shadcn/ui) - cream background, forest text
├─ Select (shadcn/ui) - dropdown selects
├─ Textarea (shadcn/ui) - multi-line notes
├─ Table (shadcn/ui) - admin dashboard
└─ Reveal (custom) - scroll animations
```

### Animation

```
Framer Motion (motion/react):
├─ Form step transitions (fade + slide)
├─ Success screen entrance
├─ Component reveals on scroll
└─ Smooth hover effects
```

---

## 🚀 Complete User Journey Timeline

```
TIME        ACTION                          COMPONENT           STATE
────────────────────────────────────────────────────────────────────────

00:00       User opens http://127.0.0.1:8081
            ↓
            Homepage loads
            ├─ Navbar (navigation)                              init
            ├─ Hero section
            ├─ Story section
            ├─ SeasonalHarvest
            ├─ DeliveryAreas
            ├─ DeliveryNetwork
            └─ Footer

00:05       User scrolls and reads content
            ↓
            Animations trigger on scroll
            └─ Reveal component shows details

00:30       User clicks "Reserve Your Harvest"
            ↓
            Navigate to /reserve route

00:32       Reservation form loads
            └─ Step 1: Full Name visible

00:35       User enters: "Rajesh Kumar"
            ├─ form.fullName = "Rajesh Kumar"
            ├─ Next button becomes enabled ✅
            └─ User clicks Next

00:40       Step 2: Phone Number visible
            ├─ User enters: "+91 98765 43210"
            ├─ form.phone = "+91 98765 43210"
            ├─ Next button enabled ✅
            └─ User clicks Next

00:45       Step 3: Email visible
            ├─ User enters: "rajesh@example.com"
            ├─ form.email = "rajesh@example.com"
            ├─ Next button enabled ✅
            └─ User clicks Next

00:50       Step 4: Delivery Area visible ⭐
            ├─ Dropdown shows 4 cities
            ├─ User selects: "Patiala"
            ├─ form.deliveryArea = "Patiala" ✅ FIXED
            ├─ Next button enabled ✅
            └─ User clicks Next

00:55       Step 5: Delivery Address visible
            ├─ Dropdown shows localities
            ├─ User selects: "Model Town"
            ├─ form.address = "Model Town" ✅ SIMPLIFIED
            ├─ Next button enabled ✅
            └─ User clicks Next

01:00       Step 6: Select Vegetables visible
            ├─ 16 checkboxes displayed (8 winter + 8 summer)
            ├─ User selects: Cauliflower, Carrot, Spinach
            ├─ form.selectedVegetables = ["Cauliflower", "Carrot", "Spinach"]
            ├─ Next button enabled ✅
            └─ User clicks Next

01:05       Step 7: Additional Notes visible
            ├─ User enters: "Early morning delivery"
            ├─ form.notes = "Early morning delivery"
            ├─ Submit button shown
            └─ User clicks "Complete Reservation"

01:07       SUBMISSION PROCESS
            ├─ Validation checks pass ✅
            ├─ Data transformed to snake_case ✅
            ├─ submitReservation() called
            ├─ Supabase insert executed
            ├─ RLS check: DISABLED ✅
            ├─ Data inserted into database
            ├─ Row returned with id=1, timestamp
            └─ Frontend receives success

01:08       SUCCESS SCREEN
            ├─ Step 8 displayed
            ├─ Message: "Your Harvest Awaits 🌱"
            ├─ Confirmation details shown
            └─ "Return to Home" button visible

01:10       User clicks "Return to Home"
            └─ Navigate back to homepage

DATABASE STATE:
┌─ reservations table now has 1 row:
   ├─ id: 1
   ├─ full_name: "Rajesh Kumar"
   ├─ phone_number: "+91 98765 43210"
   ├─ email: "rajesh@example.com"
   ├─ delivery_area: "Patiala"
   ├─ address: "Model Town"
   ├─ selected_vegetables: ["Cauliflower", "Carrot", "Spinach"]
   ├─ notes: "Early morning delivery"
   └─ created_at: "2026-06-04T01:07:30Z"
```

---

## 👨‍💼 Admin Dashboard Timeline

```
TIME        ACTION                          
────────────────────────────────────────────

00:00       Admin goes to /admin/login

00:05       Admin enters:
            ├─ Email: admin@gurnamfarms.com
            └─ Password: [password]

00:07       Click "Sign In"
            ├─ Supabase authenticates
            ├─ JWT token returned
            └─ Session stored in browser

00:10       Admin sees /admin/reservations
            ├─ Route guard checks:
            │  ├─ Is authenticated? ✅
            │  └─ Email in ADMIN_EMAILS? ✅
            └─ Access granted

00:15       Dashboard loads
            ├─ Query: fetchReservations()
            ├─ Fetches all rows from reservations table
            ├─ Order by created_at DESC (newest first)
            └─ Display in table

00:20       Admin sees table with columns:
            Full Name | Phone | Email | Delivery Area | Address | Vegetables | Notes | Date
            ──────────────────────────────────────────────────────────────────────────────
            Rajesh... | +91.. | raje..| Patiala (gold) | Model.. | Cauliflow..| Early| 06/04
            John...   | +91.. | john..| Ambala        | Urban.. | Carrot...  | Sun..| 06/04

00:25       Admin uses search
            ├─ Types: "rajesh@example.com"
            ├─ Table filters in real-time
            └─ Shows only matching rows

00:30       Admin clicks "Clear"
            └─ Search cleared, shows all rows again
```

---

## 🔍 Key Features Summary

### ✅ Customer Features
- Browse farm information
- See seasonal vegetables
- View delivery areas (4 cities)
- Fill 7-step reservation form
- Multi-select vegetables
- Receive confirmation

### ✅ Admin Features
- Secure login with authentication
- View all customer reservations
- See customer details (name, phone, email, location)
- Search by name/email/phone
- Track delivery areas
- Export data if needed

### ✅ Backend Features
- PostgreSQL database
- Supabase authentication
- RLS (Row Level Security)
- Automatic timestamps
- Data indexing
- Error handling
- Real-time capabilities (ready)

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Form stuck on Step 4 | Validation checked wrong field | ✅ Now checks deliveryArea |
| Address field malformed | Complex split logic | ✅ Simplified to just select |
| RLS violation (code=42501) | RLS enabled on public table | ✅ Disable RLS on public tables |
| Table not found (PGRST205) | Database tables not created | ✅ Run complete SQL setup |
| Form won't submit | Missing validation | ✅ All fields validated correctly |

---

## 📊 Summary

```
┌─────────────────────────────────────────────────────────┐
│                   APP SUMMARY                           │
├─────────────────────────────────────────────────────────┤
│ Frontend Framework    │ React 19 + TypeScript           │
│ Routing              │ TanStack Router                  │
│ Styling              │ Tailwind CSS + shadcn/ui        │
│ Backend              │ Supabase (PostgreSQL)           │
│ Authentication       │ Email/Password (JWT)            │
│ Main Features        │ Reservation form + Admin        │
│ Database Tables      │ 5 (reservations, profiles, ...) │
│ Form Steps           │ 7 + 1 success = 8 screens       │
│ Delivery Areas       │ 4 cities (Patiala, Rajpura...)  │
│ Vegetables           │ 16 (8 winter + 8 summer)        │
│ Admin Users          │ Email-based authorization       │
└─────────────────────────────────────────────────────────┘
```

---

This is the **complete end-to-end workflow** of your Gurnam Farms application! 🌱
