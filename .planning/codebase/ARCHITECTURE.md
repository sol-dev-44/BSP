# Architecture

**Analysis Date:** 2026-03-31

## Pattern Overview

**Overall:** Next.js 15 App Router — full-stack monolith with clear server/client boundary

**Key Characteristics:**
- Server Components for data-fetching pages (admin dashboard reads Supabase directly in page components)
- Client Components for interactive UI (booking flow, chat, admin CRUD forms marked `"use client"`)
- API Routes as the backend layer — all external service calls (Stripe, Resend, OpenAI, Anthropic) happen here
- Redux Toolkit Query (RTK Query) for admin-side async state and cache invalidation
- Cookie-based admin auth enforced at the middleware layer, no third-party auth provider

## Layers

**Presentation — Public Pages:**
- Purpose: Marketing site and customer-facing flows
- Location: `src/app/page.tsx`, `src/app/book/`, `src/app/bsp-chat/`, `src/app/faq/`, `src/app/gallery/`, `src/app/services/`, `src/app/location/`, `src/app/jobs/`
- Contains: Server Components (metadata export + layout), Client Components delegated for interactivity
- Depends on: `src/components/`, `src/config/`, `src/lib/stripe.ts`
- Used by: End customers via browser

**Presentation — Admin Pages:**
- Purpose: Internal operations dashboard (bookings, expenses, tasks, notes, maintenance)
- Location: `src/app/admin/`
- Contains: Mix of async Server Components (bookings read Supabase directly) and Client Components (expenses/tasks/supplies use RTK Query)
- Depends on: `src/lib/supabaseAdmin.ts`, `src/lib/api/*Api.ts`, `src/components/admin/`
- Used by: Business owner behind cookie auth

**Component Layer:**
- Purpose: Reusable UI blocks
- Location: `src/components/` (public marketing), `src/components/booking/` (multi-step booking flow), `src/components/admin/` (admin widgets)
- Contains: Named exports, all TypeScript, mix of server and client components
- Depends on: `src/config/`, `src/lib/`, Tailwind classes, framer-motion, lucide-react
- Used by: `src/app/**`

**API Layer:**
- Purpose: Backend endpoints — all external service integrations live here
- Location: `src/app/api/`
- Contains: Route handlers (`route.ts`) following Next.js App Router conventions
- Depends on: `src/config/`, `src/lib/supabaseAdmin.ts`, Stripe SDK, Resend SDK, OpenAI SDK, Anthropic SDK
- Used by: Client components (via `fetch`), RTK Query base queries

**Config Layer:**
- Purpose: Centralized business constants, zero runtime fetching
- Location: `src/config/`
- Contains: `business.ts` (all contact/pricing/service info), `booking.ts` (season dates, capacity), `solarSchedule.ts` (time slot logic), `seo.ts` (metadata helpers), `structured-data.tsx` (JSON-LD generators), `theme.config.ts`
- Depends on: Nothing (pure constants and pure functions)
- Used by: All other layers

**Data Access Layer:**
- Purpose: Supabase clients and RTK Query API slices
- Location: `src/lib/`
- Contains: `supabaseClient.ts` (anon key, public), `supabaseAdmin.ts` (service role, server-only), `stripe.ts` (client-side Stripe promise), `store.ts` (Redux store), `src/lib/api/` (RTK Query slices for reservations, expenses, todos, maintenance, supplies)
- Depends on: Supabase JS, RTK Query, Stripe JS
- Used by: Server Components (supabaseAdmin), Client Components (supabaseClient, RTK Query hooks), API Routes

## Data Flow

**Booking Flow (customer-facing):**

1. Customer lands on `/book` → `BookingClient.tsx` (client component) renders multi-step UI
2. Step 1: Date selected → `getTimeSlotsForDate()` from `src/config/solarSchedule.ts` generates slots client-side; real-time availability fetched from `GET /api/availability` → queries `bsp_bookings` via supabaseAdmin
3. Step 2: Guest details form collects `customer_name`, `customer_email`, `customer_phone`, `party_size`, add-ons
4. Step 3: `POST /api/create-payment-intent` — server-side price calculation using `getSlotType/getSlotPrice`, Stripe PaymentIntent created
5. Stripe Elements payment form presented with `clientSecret`
6. On Stripe payment success: `POST /api/bookings` — verifies PaymentIntent with Stripe, inserts into `bsp_bookings`, sends confirmation emails via Resend to customer and admin

**AI Chat Flow (RAG):**

1. User types query in `src/app/bsp-chat/page.tsx`
2. `POST /api/bsp-rag/chat` receives query + chat history
3. OpenAI `text-embedding-3-small` generates query embedding
4. Supabase `match_bsp_documents` RPC performs cosine similarity search against `bsp_documents` (pgvector)
5. Top 5 matching chunks injected into system prompt for Anthropic `claude-sonnet-4-20250514`
6. Response streamed back as Server-Sent Events (SSE); client reads stream and updates UI in real time

**Admin Data Flow:**

1. Admin hits `/admin/*` → middleware (`src/middleware.ts`) checks `admin_session` cookie; redirects to `/admin/login` if missing
2. Server Components (e.g., `src/app/admin/bookings/page.tsx`) call `supabaseAdmin` directly — no API route hop
3. Client-side admin sections (expenses, todos, supplies) use RTK Query hooks which call REST API routes (`/api/expenses`, `/api/todos`, etc.)
4. Mutations invalidate RTK Query tags triggering automatic re-fetch
5. Cancellation uses a Next.js Server Action in `src/app/admin/actions.ts` with `revalidatePath`

**State Management:**
- Public customer UI: Local React `useState` within components (no global state needed)
- Admin UI: Redux Toolkit store (`src/lib/store.ts`) with RTK Query slices for server state caching
- Theme: `next-themes` ThemeProvider (forced dark mode currently)

## Key Abstractions

**`BUSINESS_INFO` constant:**
- Purpose: Single source of truth for all business data (contact, pricing, hours, services, social links)
- Examples: `src/config/business.ts`
- Pattern: Plain TypeScript object with exported helper functions; imported everywhere including API routes and components

**Solar Schedule:**
- Purpose: Dynamically generates available time slots and tier pricing based on Montana sunrise/sunset per month
- Examples: `src/config/solarSchedule.ts`
- Pattern: Pure functions — `getTimeSlotsForDate(dateStr)`, `getSlotType(dateStr, timeStr)`, `getSlotPrice(slotType)` — called on both client and server

**RTK Query API Slices:**
- Purpose: Typed async data fetching with automatic caching and cache invalidation for admin CRUD
- Examples: `src/lib/api/reservationsApi.ts`, `src/lib/api/expensesApi.ts`, `src/lib/api/todosApi.ts`, `src/lib/api/maintenanceApi.ts`, `src/lib/api/suppliesApi.ts`
- Pattern: `createApi` with `fetchBaseQuery({ baseUrl: '/api' })`; hooks exported and consumed in client components

**Dual Supabase Clients:**
- Purpose: Separate clients enforce access boundaries — anon key for public/client use, service role for admin/server-only
- Examples: `src/lib/supabaseClient.ts` (anon), `src/lib/supabaseAdmin.ts` (service role)
- Pattern: `supabaseAdmin` used only in API routes and Server Components; `supabase` (anon) used in client components and RAG chat route

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: All page renders
- Responsibilities: Font loading (Oswald + Inter), global CSS, `Providers` wrapper (ThemeProvider + Redux Provider), JSON-LD structured data injection

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Assembles marketing sections in order: Navbar, Hero, Stats, VesselShowcase, ExperienceGallery, Testimonials, InstagramFeed, LocationHighlights, Footer, ChatCTA

**Booking Entry:**
- Location: `src/app/book/page.tsx` → delegates to `src/app/book/BookingClient.tsx`
- Triggers: GET `/book`
- Responsibilities: Metadata export (Server Component wrapper), renders `BookingForm` multi-step flow

**Admin Entry:**
- Location: `src/app/admin/page.tsx`
- Triggers: GET `/admin` (after middleware auth check)
- Responsibilities: Immediate redirect to `/admin/bookings`

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: All requests matching `/admin/:path*`
- Responsibilities: Checks `admin_session` HttpOnly cookie; redirects unauthenticated requests to `/admin/login`

**AI Chat API:**
- Location: `src/app/api/bsp-rag/chat/route.ts`
- Triggers: POST `/api/bsp-rag/chat`
- Responsibilities: Rate limiting, embedding generation (OpenAI), vector search (Supabase pgvector), LLM response streaming (Anthropic Claude)

## Error Handling

**Strategy:** Catch-all try/catch in API routes returning `NextResponse.json({ error: message }, { status: 5xx })`. Email sending failures are non-blocking — errors are logged but do not fail the booking response.

**Patterns:**
- API routes: `try/catch` → `NextResponse.json({ error: error.message })` with appropriate HTTP status
- Client components: `try/catch` around `fetch` calls → `alert()` for user-facing errors (booking form uses this pattern — a concern)
- Admin Server Components: Render inline error message on Supabase failure (`<div>Error loading: {error.message}</div>`)
- Email errors: Wrapped in independent try/catch, status tracked in `customerEmailStatus`/`adminEmailStatus` objects returned in response

## Cross-Cutting Concerns

**Logging:** `console.log` / `console.error` with `[PREFIX]` tags (e.g., `[BSP RAG]`, `[EMAIL]`) — no structured logging library
**Validation:** Inline in API routes (manual field checks); client-side form validation in `BookingForm.isFormValid()`
**Authentication:** Cookie-based admin auth only; enforced via `src/middleware.ts`; no customer auth
**SEO:** `generatePageMetadata()` used on every public page; JSON-LD structured data injected in root layout and individual pages via `StructuredData` component from `src/config/structured-data.tsx`
**Pricing:** Server-side authoritative calculation in `/api/create-payment-intent` using `getSlotType/getSlotPrice`; client mirrors this for display only

---

*Architecture analysis: 2026-03-31*
