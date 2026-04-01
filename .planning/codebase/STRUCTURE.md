# Codebase Structure

**Analysis Date:** 2026-03-31

## Directory Layout

```
BSP/                              # Project root
├── src/                          # All application source code
│   ├── app/                      # Next.js App Router — pages and API routes
│   │   ├── layout.tsx            # Root layout (fonts, providers, JSON-LD)
│   │   ├── page.tsx              # Home page (marketing)
│   │   ├── providers.tsx         # Client-side Redux + ThemeProvider wrapper
│   │   ├── globals.css           # Global styles (Tailwind base + custom CSS vars)
│   │   ├── robots.ts             # Next.js robots.txt generator
│   │   ├── sitemap.ts            # Next.js sitemap generator
│   │   ├── admin/                # Admin dashboard (cookie-auth protected)
│   │   │   ├── page.tsx          # Redirects to /admin/bookings
│   │   │   ├── actions.ts        # Server Actions (cancelBooking with revalidatePath)
│   │   │   ├── bookings/page.tsx # Server Component — booking list + stats
│   │   │   ├── expenses/         # Client-side CRUD via RTK Query
│   │   │   ├── tasks/            # Client-side CRUD via RTK Query
│   │   │   ├── maintenance/      # Client-side CRUD via RTK Query
│   │   │   ├── notes/            # Client-side CRUD via RTK Query
│   │   │   └── login/page.tsx    # Admin login form
│   │   ├── api/                  # Backend API Route handlers
│   │   │   ├── availability/route.ts          # GET — time slots with real capacity
│   │   │   ├── bookings/route.ts              # POST — create booking + send emails
│   │   │   ├── bookings/[id]/route.ts         # GET — retrieve single booking
│   │   │   ├── create-payment-intent/route.ts # POST — Stripe PaymentIntent creation
│   │   │   ├── admin/login/route.ts           # POST — set admin_session cookie
│   │   │   ├── admin/logout/route.ts          # POST — clear admin_session cookie
│   │   │   ├── admin/bookings/[id]/route.ts   # DELETE/PATCH — cancel or update booking
│   │   │   ├── bsp-rag/chat/route.ts          # POST — RAG chat (stream SSE), GET — health
│   │   │   ├── bsp-rag/upload/route.ts        # POST/GET/DELETE — manage knowledge docs
│   │   │   ├── expenses/route.ts              # GET/POST expenses
│   │   │   ├── expenses/[id]/route.ts         # PATCH/DELETE expense
│   │   │   ├── todos/route.ts                 # GET/POST todos
│   │   │   ├── todos/[id]/route.ts            # PATCH/DELETE todo
│   │   │   ├── maintenance/route.ts           # GET/POST maintenance records
│   │   │   ├── notes/route.ts                 # GET/POST notes
│   │   │   ├── supplies/route.ts              # GET/POST supplies
│   │   │   ├── supplies/[id]/route.ts         # DELETE supply
│   │   │   └── test-email/route.ts            # Dev-only email test endpoint
│   │   ├── book/                 # Customer booking flow
│   │   │   ├── page.tsx          # Server wrapper (metadata) → BookingClient
│   │   │   ├── BookingClient.tsx # "use client" — renders BookingForm
│   │   │   └── success/page.tsx  # Post-booking confirmation page
│   │   ├── bsp-chat/             # Jerry Bear AI chat interface
│   │   │   ├── page.tsx          # "use client" — streaming chat UI
│   │   │   └── admin/            # RAG document upload admin UI
│   │   ├── faq/page.tsx          # FAQ page
│   │   ├── gallery/page.tsx      # Photo gallery page
│   │   ├── services/page.tsx     # Services/pricing page
│   │   ├── location/page.tsx     # Location/directions page
│   │   └── jobs/page.tsx         # Jobs/hiring page
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx            # Site navigation
│   │   ├── Hero.tsx              # Landing page hero section
│   │   ├── Stats.tsx             # Business stats bar
│   │   ├── VesselShowcase.tsx    # Boat showcase section
│   │   ├── ExperienceGallery.tsx # Photo gallery component
│   │   ├── Testimonials.tsx      # Customer reviews section
│   │   ├── InstagramFeed.tsx     # Instagram embed section
│   │   ├── LocationHighlights.tsx# Location/map section
│   │   ├── FAQ.tsx               # FAQ accordion component
│   │   ├── Features.tsx          # Features/benefits section
│   │   ├── Footer.tsx            # Site footer
│   │   ├── ChatCTA.tsx           # Floating Jerry Bear chat CTA button
│   │   ├── EmailTemplate.tsx     # Reusable email HTML component
│   │   ├── ReviewCTA.tsx         # Review solicitation section
│   │   ├── SocialShare.tsx       # Social sharing buttons
│   │   ├── RetroStripes.tsx      # Decorative stripe divider
│   │   ├── SectionDivider.tsx    # Generic section divider
│   │   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   │   ├── booking/              # Multi-step booking form sub-components
│   │   │   ├── BookingForm.tsx   # Orchestrator — step state, payment intent logic
│   │   │   ├── DateSelector.tsx  # Calendar date picker
│   │   │   ├── TimeSlotPicker.tsx# Time slot grid with pricing tiers
│   │   │   ├── GuestForm.tsx     # Party size + customer info + add-ons
│   │   │   ├── PaymentForm.tsx   # Stripe Elements payment form
│   │   │   └── PriceBreakdown.tsx# Live pricing sidebar
│   │   └── admin/                # Admin-only components
│   │       ├── CancelBookingButton.tsx  # Server Action cancel button
│   │       ├── LogoutButton.tsx         # Cookie clear logout
│   │       └── SuppliesModal.tsx        # Add supplies modal
│   ├── config/                   # Business constants and pure utility functions
│   │   ├── business.ts           # BUSINESS_INFO — all contact, pricing, services, social
│   │   ├── booking.ts            # BOOKING_CONFIG — season dates, capacity, season helpers
│   │   ├── solarSchedule.ts      # Time slot generation + tiered pricing logic
│   │   ├── seo.ts                # BASE_METADATA + generatePageMetadata()
│   │   ├── structured-data.tsx   # JSON-LD schema generators + StructuredData component
│   │   ├── faq.ts                # FAQ data (questions and answers)
│   │   └── theme.config.ts       # Tailwind theme extension config
│   ├── lib/                      # Data access and state management
│   │   ├── supabaseClient.ts     # Supabase anon client (public/client-side use)
│   │   ├── supabaseAdmin.ts      # Supabase service role client (server-only)
│   │   ├── stripe.ts             # Stripe.js promise (client-side only)
│   │   ├── store.ts              # Redux Toolkit store with RTK Query middleware
│   │   └── api/                  # RTK Query API slice definitions
│   │       ├── reservationsApi.ts # Bookings: checkAvailability, createBooking, getBooking
│   │       ├── expensesApi.ts     # Expenses: getExpenses, addExpense, updateExpense, deleteExpense
│   │       ├── todosApi.ts        # Todos: getTodos, addTodo, updateTodo, deleteTodo
│   │       ├── maintenanceApi.ts  # Maintenance: get/add/update/delete records
│   │       └── suppliesApi.ts     # Supplies: getSupplies, addSupply, deleteSupply
│   ├── types/                    # TypeScript type definitions
│   │   ├── reservations.ts       # Booking, CreateBookingRequest, AvailabilityResponse, BookingStatus
│   │   └── pdf-parse-fork.d.ts   # Module declaration for pdf-parse-fork
│   └── middleware.ts             # Edge middleware — admin cookie auth guard
├── public/                       # Static assets (served at root)
│   ├── JerryBearLogo.png         # Jerry Bear mascot logo (used throughout)
│   ├── colorfulChute.jpg         # Primary OG/hero image
│   ├── thumbAction.png           # Action thumbnail
│   └── .well-known/              # Domain verification files
├── supabase/
│   └── bsp-schema.sql            # Full database schema (tables + RLS + pgvector function)
├── chatbot-training/             # Plain-text training documents for RAG knowledge base
│   ├── 01-business-overview.txt
│   ├── 02-pricing-and-services.txt
│   ├── 03-location-and-directions.txt
│   ├── 04-safety-and-requirements.txt
│   ├── 05-faq-complete.txt
│   ├── 06-flathead-lake-and-montana.txt
│   └── 07-booking-and-schedule.txt
├── next.config.ts                # Next.js config (image domains, redirects)
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config (paths: @/* → src/*)
├── package.json                  # Dependencies and scripts
└── .planning/                    # GSD planning documents (not committed by default)
```

## Directory Purposes

**`src/app/`:**
- Purpose: All routes — public pages, API endpoints, admin dashboard
- Contains: Page Server Components, API Route handlers (`route.ts`), one client wrapper pattern (`BookingClient.tsx`, `ExpensesClient.tsx`)
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/providers.tsx`

**`src/components/`:**
- Purpose: Reusable UI — split between public marketing components (flat in `components/`) and feature-specific sub-directories
- Contains: Named exports, TypeScript, mostly client components
- Key files: `src/components/booking/BookingForm.tsx`, `src/components/Navbar.tsx`, `src/components/ChatCTA.tsx`

**`src/config/`:**
- Purpose: Static business data and pure helper functions — the authoritative source for pricing, contact info, schedule logic
- Contains: No API calls, no side effects — safe to import anywhere including server and client
- Key files: `src/config/business.ts`, `src/config/solarSchedule.ts`, `src/config/booking.ts`

**`src/lib/`:**
- Purpose: Infrastructure clients and Redux store
- Contains: Two Supabase clients (anon and admin), Stripe promise, Redux store, RTK Query slices
- Key files: `src/lib/supabaseAdmin.ts` (server-only), `src/lib/store.ts`, `src/lib/api/expensesApi.ts`

**`src/types/`:**
- Purpose: Shared TypeScript interfaces and type aliases
- Contains: Domain types for reservations; module declarations for untyped packages
- Key files: `src/types/reservations.ts`

**`supabase/`:**
- Purpose: Database schema definition for reference and re-provisioning
- Contains: SQL for all 7 tables (`bsp_bookings`, `bsp_documents`, `bsp_supplies`, `bsp_expenses`, `bsp_maintenance`, `bsp_todos`, `bsp_notes`), RLS policies, pgvector function
- Key files: `supabase/bsp-schema.sql`

**`chatbot-training/`:**
- Purpose: Source text documents for the RAG knowledge base — uploaded via `/api/bsp-rag/upload`
- Contains: 7 plain-text files covering business overview, pricing, safety, FAQ, location, and scheduling
- Generated: No — manually authored; not auto-indexed on deploy

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML shell, font variables, providers
- `src/app/page.tsx`: Home page — assembles all marketing sections
- `src/middleware.ts`: Admin route protection
- `src/app/admin/login/page.tsx`: Admin authentication form

**Configuration:**
- `src/config/business.ts`: All business constants — update here when pricing/contact changes
- `src/config/solarSchedule.ts`: Time slot and pricing tier logic
- `src/config/booking.ts`: Season dates and max capacity (`MAX_PASSENGERS = 10`)
- `next.config.ts`: Supabase image hostname allowlist, `/reservations` → `/book` redirect

**Core Logic:**
- `src/app/api/create-payment-intent/route.ts`: Server-side price calculation + Stripe PaymentIntent
- `src/app/api/bookings/route.ts`: Booking creation, Stripe verification, dual-email confirmation
- `src/app/api/bsp-rag/chat/route.ts`: RAG pipeline — embedding → vector search → Claude streaming
- `src/app/api/availability/route.ts`: Real-time slot capacity from Supabase

**State:**
- `src/lib/store.ts`: Redux store configuration
- `src/lib/api/`: RTK Query slice files (one per admin resource)

**Database:**
- `supabase/bsp-schema.sql`: Full schema including `match_bsp_documents` pgvector RPC

**Testing:**
- Not detected — no test files present

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention, always lowercase)
- API routes: `route.ts` (Next.js convention, always lowercase)
- Components: `PascalCase.tsx` (e.g., `BookingForm.tsx`, `Navbar.tsx`)
- Config/lib: `camelCase.ts` (e.g., `solarSchedule.ts`, `supabaseAdmin.ts`)
- RTK Query slices: `camelCase` + `Api` suffix (e.g., `expensesApi.ts`, `reservationsApi.ts`)
- Client page wrappers: `PascalCase` + `Client` suffix (e.g., `BookingClient.tsx`, `ExpensesClient.tsx`)

**Directories:**
- App routes: `kebab-case` matching URL segment (e.g., `bsp-chat/`, `book/`, `admin/`)
- Components sub-dirs: `lowercase` (e.g., `booking/`, `admin/`)
- Dynamic API segments: `[id]` convention

**Exports:**
- Components: Named exports (e.g., `export function Navbar()`)
- Config: Named const exports + named function exports
- RTK Query: Named hook exports from slice files

## Where to Add New Code

**New public page:**
- Create directory: `src/app/{route-name}/`
- Add `page.tsx` as Server Component with `export const metadata = generatePageMetadata(...)`
- Delegate to a Client Component in the same directory if interactivity is needed

**New API endpoint:**
- Create `src/app/api/{resource}/route.ts`
- For CRUD with dynamic IDs: `src/app/api/{resource}/[id]/route.ts`
- Use `supabaseAdmin` for all DB access in API routes

**New admin CRUD section:**
- Add page at `src/app/admin/{section}/page.tsx`
- Create RTK Query slice at `src/lib/api/{section}Api.ts`
- Register slice in `src/lib/store.ts` (reducer + middleware)
- Add API routes at `src/app/api/{section}/route.ts`

**New shared component:**
- Marketing/public: `src/components/PascalCase.tsx`
- Booking-related: `src/components/booking/PascalCase.tsx`
- Admin-only: `src/components/admin/PascalCase.tsx`

**New business constant:**
- Add to `src/config/business.ts` in the `BUSINESS_INFO` object

**New type definition:**
- Add to `src/types/reservations.ts` if booking-related, or create `src/types/{domain}.ts`

**Utilities:**
- Pure functions: `src/config/` (no imports from lib or app)
- Data access helpers: `src/lib/`

## Special Directories

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: By GSD commands
- Committed: Depends on project — check `.gitignore`

**`chatbot-training/`:**
- Purpose: Source documents for the Jerry Bear RAG knowledge base
- Generated: No — manually maintained
- Committed: Yes — these are the authoritative training texts

**`supabase/`:**
- Purpose: Schema reference only — database is hosted on Supabase cloud (project `qcohcaavhwujvagmpbdp`)
- Generated: No — manually maintained
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes — by `next build` / `next dev`
- Committed: No (in `.gitignore`)

---

*Structure analysis: 2026-03-31*
