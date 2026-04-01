# External Integrations

**Analysis Date:** 2026-03-31

## APIs & External Services

**Payment Processing:**
- Stripe — Processes all customer payments for parasailing bookings
  - SDK/Client: `stripe` (server), `@stripe/react-stripe-js` + `@stripe/stripe-js` (client)
  - Auth: `STRIPE_SECRET_KEY` (server), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client)
  - Implementation: Payment Intent flow — intent created at `src/app/api/create-payment-intent/route.ts`, confirmed client-side via Stripe Elements, then booking saved at `src/app/api/bookings/route.ts` after server-side PI verification
  - API version pinned to `2023-10-16` in both server routes

**AI / LLM:**
- OpenAI — Generates vector embeddings for RAG knowledge base
  - SDK/Client: `openai` package
  - Auth: `OPENAI_API_KEY`
  - Model: `text-embedding-3-small` (1536-dimension vectors)
  - Used in: `src/app/api/bsp-rag/chat/route.ts`, `src/app/api/bsp-rag/upload/route.ts`

- Anthropic Claude — Powers the "Jerry Bear" chatbot responses via streaming
  - SDK/Client: `@anthropic-ai/sdk`
  - Auth: `ANTHROPIC_API_KEY`
  - Model: `claude-sonnet-4-20250514`
  - Used in: `src/app/api/bsp-rag/chat/route.ts`
  - Delivery: Server-Sent Events (SSE) streaming response

**Email:**
- Resend — Sends transactional emails (customer booking confirmations + admin notifications)
  - SDK/Client: `resend` package
  - Auth: `RESEND_API_KEY`
  - Used in: `src/app/api/bookings/route.ts`, `src/app/api/test-email/route.ts`
  - From address: `bookings@montanaparasail.com` (production with verified domain) or `onboarding@resend.dev` (dev fallback)
  - Admin recipient: `bigskyparasailing@gmail.com`

## Data Storage

**Databases:**
- Supabase (PostgreSQL) — Primary database for all application data
  - Project ID: `qcohcaavhwujvagmpbdp`
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`
  - Anon client: `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used in `src/lib/supabaseClient.ts` and RAG routes
  - Service role client: `SUPABASE_SERVICE_ROLE_KEY` — used in `src/lib/supabaseAdmin.ts`, admin routes, and booking creation
  - ORM/Client: `@supabase/supabase-js` v2
  - Schema file: `supabase/bsp-schema.sql`
  - Tables: `bsp_bookings`, `bsp_documents`, `bsp_supplies`, `bsp_expenses`, `bsp_maintenance`, `bsp_todos`, `bsp_notes`
  - All tables use RLS enabled with permissive service-role policies
  - pgvector extension enabled for `bsp_documents` embedding column (VECTOR(1536))
  - Custom SQL function `match_bsp_documents` performs cosine similarity search for RAG retrieval

**File Storage:**
- Supabase Storage — Hosts product/service images
  - Bucket: `bsp-images` at `qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/`
  - Configured as allowed remote image host in `next.config.ts`
  - Used for service page images (parasail shots, aerial photos, etc.)

**Caching:**
- RTK Query in-memory cache — Client-side API response caching via Redux store in `src/lib/store.ts`
- Next.js `Cache-Control: no-store` on availability endpoint to prevent stale slot data

## Authentication & Identity

**Admin Auth:**
- Custom cookie-based authentication — No third-party auth provider
  - Implementation: `src/app/api/admin/login/route.ts` validates username/password against env vars (`ADMIN_USER`, `ADMIN_PASSWORD`), sets `admin_session` HttpOnly cookie (30-day expiry)
  - Logout: `src/app/api/admin/logout/route.ts`
  - Protected area: `src/app/admin/` (admin dashboard for bookings, expenses, todos, maintenance, notes)
  - No Supabase Auth used — authentication is entirely env-var based

**Customer Auth:**
- None — customers book without accounts; booking lookup by Stripe payment intent ID

## Monitoring & Observability

**Error Tracking:**
- None detected — no Sentry, Datadog, or similar service

**Logs:**
- `console.log` / `console.error` throughout API routes with `[BSP RAG]`, `[EMAIL]`, `[BSP Upload]` prefixes for log filtering

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured in codebase — likely Vercel (Next.js project structure and `next.config.ts` conventions)

**CI Pipeline:**
- None detected — no `.github/workflows/`, CircleCI, or similar config found

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe public key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `OPENAI_API_KEY` — OpenAI embeddings
- `ANTHROPIC_API_KEY` — Anthropic Claude
- `RESEND_API_KEY` — Resend email
- `ADMIN_USER` — Admin login username (defaults to `admin` if missing)
- `ADMIN_PASSWORD` — Admin login password (defaults to `bigsky2026` if missing)

**Optional env vars:**
- `RESEND_VERIFIED_DOMAIN` — Set to enable production sender address; absence triggers dev fallback
- `RESEND_ACCOUNT_EMAIL` — Dev fallback email recipient

**Secrets location:**
- `.env.local` (present, not committed)

## Webhooks & Callbacks

**Incoming:**
- None detected — Stripe payment confirmation uses client-side PI verification rather than webhooks; booking is saved by the client POSTing to `/api/bookings` after Stripe Elements confirms payment

**Outgoing:**
- None detected

## Third-Party Content & Social

**Google Fonts:**
- Oswald + Inter loaded via `next/font/google` at build time (no runtime CDN call)

**Google Maps:**
- Static map links only (no Maps embed or Maps JS API)

**Social Profiles (linked, not integrated):**
- Facebook: `https://www.facebook.com/bigskyparasail`
- Instagram: `https://www.instagram.com/bigskyparasail/`
- Yelp, TripAdvisor, Google Business — defined in `src/config/business.ts`

**Structured Data:**
- Schema.org LocalBusiness + Organization JSON-LD injected server-side via `src/config/structured-data.tsx`

---

*Integration audit: 2026-03-31*
