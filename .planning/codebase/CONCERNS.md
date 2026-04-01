# Codebase Concerns

**Analysis Date:** 2026-03-31

---

## Security Considerations

**Hardcoded fallback admin password:**
- Risk: If `ADMIN_PASSWORD` env var is unset in any environment, the server falls back to a plaintext hardcoded value (`'bigsky2026'`) which is visible in source code.
- Files: `src/app/api/admin/login/route.ts` (line 9)
- Current mitigation: Cookie-based session. Env var can override.
- Recommendation: Remove the fallback string entirely. Throw an error or return 500 if the env var is missing, so the app fails loudly rather than silently using a known default.

**Hardcoded PIN in client-side chat admin:**
- Risk: PIN `'4242'` is hardcoded in the client bundle and stored in `localStorage`. Anyone who opens devtools can read it. The `/bsp-chat/admin` page is not protected by the main cookie-based middleware.
- Files: `src/app/bsp-chat/admin/page.tsx` (lines 21, 61, 69–70)
- Current mitigation: `robots.txt` disallows the path. PIN checked client-side only.
- Recommendation: Move the upload admin route behind the `/admin/` middleware and cookie session, or at minimum check the PIN server-side on upload/delete requests.

**Admin API routes lack request-level authentication:**
- Risk: `GET /api/notes`, `POST /api/notes`, `DELETE /api/notes`, `GET/POST /api/expenses`, `GET/POST/PUT /api/todos`, `GET/POST /api/maintenance`, `GET/POST /api/supplies` — all are unauthenticated at the API layer. The middleware only protects `/admin/*` page routes. Anyone who discovers the API endpoints can read and write internal operational data directly.
- Files: `src/app/api/notes/route.ts`, `src/app/api/expenses/route.ts`, `src/app/api/todos/route.ts`, `src/app/api/maintenance/route.ts`, `src/app/api/supplies/route.ts`
- Current mitigation: None. These routes use the service role key which bypasses RLS.
- Recommendation: Add a cookie-check helper that reads and validates the `admin_session` cookie in each admin API route, or create a shared middleware matcher that covers `/api/notes`, `/api/expenses`, etc.

**Mock payment intent bypass in production code:**
- Risk: The bookings route accepts any `payment_intent_id` prefixed with `pi_mock` and unconditionally sets status to `confirmed` with `total_amount = 100`. This code path is live in production and could be exploited to create free confirmed bookings.
- Files: `src/app/api/bookings/route.ts` (lines 45–49)
- Current mitigation: None — no env guard, no feature flag.
- Recommendation: Wrap the mock branch in a `process.env.NODE_ENV !== 'production'` guard and remove it from production builds.

**No security headers configured:**
- Risk: No Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, or Referrer-Policy headers are set. Payment flows and admin pages are exposed without CSP.
- Files: `next.config.ts`
- Current mitigation: None.
- Recommendation: Add a `headers()` export to `next.config.ts` with at minimum CSP, X-Frame-Options: DENY, and X-Content-Type-Options: nosniff.

**Admin session cookie is not cryptographically validated:**
- Risk: The middleware checks only for the _existence_ of the `admin_session` cookie with value `'authenticated'`. Any request with that cookie value passes. There is no signature, JWT, or server-side session store.
- Files: `src/middleware.ts`, `src/app/api/admin/login/route.ts`
- Current mitigation: HttpOnly cookie limits JavaScript access.
- Recommendation: Sign the cookie value (e.g. with `jose` or `iron-session`) so it cannot be trivially forged by setting a cookie manually.

---

## Tech Debt

**Pricing defined in two places — divergence risk:**
- Issue: Per-person prices (Early Bird $99, Standard $119, Sunset $159) are hardcoded in `src/config/solarSchedule.ts` inside `getSlotPrice()`, and separately in `src/config/business.ts` under `BUSINESS_INFO.pricing`. If one is updated without the other, the chatbot/display price diverges from what is actually charged.
- Files: `src/config/solarSchedule.ts` (lines 177–183), `src/config/business.ts` (lines 77–82)
- Impact: Customer sees one price in the UI and is charged a different amount, or Jerry Bear quotes the wrong price.
- Fix approach: Have `getSlotPrice()` import from `BUSINESS_INFO.pricing` so there is a single source of truth.

**`observer` add-on field named inconsistently across the codebase:**
- Issue: The observer add-on is called `observer_package` in `BookingClient.tsx`, `GuestForm.tsx`, `PriceBreakdown.tsx`, and `success/page.tsx`, but `observer_count` in `bookings/route.ts` (email template check) and `create-payment-intent/route.ts`. The API routes paper over the inconsistency with `add_ons?.observer_count || add_ons?.observer_package`, but this is fragile and causes silent email failures (the email row only shows when `observer_count > 0`, but the field sent from the client is `observer_package`).
- Files: `src/app/api/bookings/route.ts` (lines 115, 137–138), `src/app/api/create-payment-intent/route.ts` (lines 36, 63), `src/app/book/BookingClient.tsx` (line 53)
- Impact: Observer line item may silently disappear from confirmation emails. Admin email also shows `Boat Rider x undefined` if `observer_count` is absent.
- Fix approach: Standardize on `observer_count` throughout, or rename to `observer_package` in all places including the API routes.

**Outdated Stripe API version with type cast suppression:**
- Issue: Both Stripe clients are initialized with `apiVersion: '2023-10-16' as any`. The `as any` cast is required because the installed SDK no longer recognizes this as a valid version string, meaning types are being silently bypassed for all Stripe interactions.
- Files: `src/app/api/bookings/route.ts` (line 10), `src/app/api/create-payment-intent/route.ts` (line 8)
- Impact: Type errors from Stripe SDK updates are invisible. Potential breaking changes when Stripe retires old API versions go undetected.
- Fix approach: Update `apiVersion` to the current Stripe API version supported by the installed SDK (remove the `as any` cast).

**`reservations.ts` type definition is stale and does not match actual data shape:**
- Issue: `src/types/reservations.ts` defines `add_ons` with `photo_package?: boolean` and `gopro_package?: boolean`, but the actual data stored and read is numeric counts (`number`). The `riders` field is defined but does not exist in the database schema. `AvailabilitySlot` is missing the `type` field that the API actually returns.
- Files: `src/types/reservations.ts`
- Impact: Type mismatches are hidden. RTK Query and other consumers that import these types get incorrect compile-time guarantees.
- Fix approach: Audit the actual Supabase schema and update the types to match. Remove unused fields (`riders`). Add `type: 'earlybird' | 'sunset' | 'standard'` to `AvailabilitySlot`.

**Supabase client instantiated inline in multiple API routes instead of using shared instances:**
- Issue: `createClient()` is called inline in `src/app/api/bookings/route.ts`, `src/app/api/bsp-rag/chat/route.ts`, `src/app/api/bsp-rag/upload/route.ts`, and `src/app/api/availability/route.ts`, creating duplicate client instances rather than importing from `src/lib/supabaseAdmin.ts` or `src/lib/supabaseClient.ts`.
- Files: `src/app/api/bookings/route.ts` (lines 13–17), `src/app/api/bsp-rag/chat/route.ts` (lines 7–10), `src/app/api/bsp-rag/upload/route.ts` (lines 5–8), `src/app/api/availability/route.ts` (lines 6–9)
- Impact: Inconsistency risk — if the URL or key changes, it must be updated in 4+ places. The RAG routes also use the anon key server-side where the service role key would be more appropriate (given RLS bypass is likely needed for document inserts).
- Fix approach: Import `supabaseAdmin` from `src/lib/supabaseAdmin.ts` in all API routes.

**Season dates hardcoded to 2026 with no multi-year support:**
- Issue: `BOOKING_CONFIG.seasons` and `locationSchedule` are hardcoded to `2026-05-01` through `2026-09-30`. After the season ends, the booking UI will show no valid dates. Each year requires a manual code change and deployment.
- Files: `src/config/booking.ts` (lines 11, 42)
- Impact: Site becomes non-functional for booking after September 30, 2026 until a developer updates the config.
- Fix approach: Compute the current season dynamically based on the current year (`new Date().getFullYear()`), or support multiple season entries in the array and select the current or next upcoming season at runtime.

**In-memory rate limiter resets on serverless cold starts:**
- Issue: The `rateLimitMap` in the RAG chat route is a module-level `Map`. In a serverless environment (Vercel), each cold start creates a fresh instance. The rate limit is per-process, not per-user globally, meaning it provides only weak protection against abuse.
- Files: `src/app/api/bsp-rag/chat/route.ts` (lines 16–32)
- Impact: A determined attacker can bypass the 10-request limit by triggering cold starts or using multiple regions.
- Fix approach: Use an edge-compatible key-value store (Vercel KV, Upstash Redis) for rate limiting state.

---

## Known Bugs

**Observer email row shows wrong count (likely zero) in confirmation email:**
- Symptoms: The "Boat Rider" line in confirmation emails checks `add_ons?.observer_count` but the client sends `observer_package`. The condition `if ((add_ons?.observer_count || 0) > 0)` evaluates to false, so the row is never rendered even when observers were booked.
- Files: `src/app/api/bookings/route.ts` (lines 137–139)
- Trigger: Any booking that includes observers/boat riders.
- Workaround: Observer cost is still included in `total_amount` (line 115 handles both field names), so the charge is correct — only the email line item is missing.

**Status casing inconsistency causes availability leakage:**
- Symptoms: The availability route filters cancelled bookings using both `'cancelled'` and `'Cancelled'` (two separate `.neq()` calls), implying that some older records were stored with capital-C status. New cancellations via the admin UI use lowercase `'cancelled'`. If the DB has mixed casing, filtering `neq('status', 'cancelled')` alone would miss uppercase-C records and count cancelled bookings toward capacity.
- Files: `src/app/api/availability/route.ts` (lines 29–30)
- Trigger: Legacy records or records cancelled through a different pathway than the current UI.
- Workaround: The double `neq` is the workaround. A database migration to normalize all status values to lowercase would eliminate the issue.

---

## Performance Bottlenecks

**Document upload processes chunks sequentially with blocking OpenAI calls:**
- Problem: `src/app/api/bsp-rag/upload/route.ts` iterates chunks in a `for` loop, calling `generateEmbedding()` and then `supabase.insert()` serially. Large documents (many chunks) will time out on Vercel's 10-second serverless function limit.
- Files: `src/app/api/bsp-rag/upload/route.ts` (lines 99–121)
- Cause: Sequential `await` in a for loop rather than batched parallel calls.
- Improvement path: Use `Promise.all()` with a concurrency limiter (e.g. p-limit) to batch embedding generation, then batch-insert to Supabase.

**Admin bookings page fetches all bookings with no pagination:**
- Problem: `src/app/admin/bookings/page.tsx` selects `*` from `bsp_bookings` ordered by `created_at` with no limit. As booking volume grows, the initial load time increases linearly.
- Files: `src/app/admin/bookings/page.tsx` (lines 16–19)
- Cause: No `.limit()` or `.range()` applied to the query.
- Improvement path: Add server-side pagination with query params (`?page=N`), or at least a reasonable `.limit(200)`.

**Availability endpoint has console.log per booking per request:**
- Problem: The availability route logs per-booking debug output (`Mapped ${booking.trip_time}...`) on every availability check. The booking page polls this endpoint on every date change, flooding production logs.
- Files: `src/app/api/availability/route.ts` (lines 18, 37, 53)
- Cause: Debug-level logging left in production path.
- Improvement path: Remove or gate behind a `DEBUG` env flag.

---

## Fragile Areas

**Booking flow has no server-side capacity verification before payment:**
- Files: `src/app/api/create-payment-intent/route.ts`, `src/app/api/bookings/route.ts`
- Why fragile: Capacity is checked client-side via the availability endpoint, but the payment intent is created without re-verifying remaining capacity. Two users can simultaneously select the last spot, both proceed to payment, and both successfully create bookings — resulting in overbooking.
- Safe modification: Add a capacity check inside `create-payment-intent/route.ts` before creating the Stripe payment intent. Alternatively, add a DB-level check in `bookings/route.ts` before inserting (with a database lock or constraint).
- Test coverage: None — no tests exist in this codebase.

**`getTimeSlotsForDate` uses per-month approximations with no day-level precision:**
- Files: `src/config/solarSchedule.ts`
- Why fragile: Slot times are based on month-level solar averages. Early and late days within a month (e.g. Sept 1 vs. Sept 30) can differ significantly in sunset time. The last-trip slot for September is `6:00 PM` regardless of exact date.
- Safe modification: This is acceptable given the operational context (manual override is always possible), but be aware that edge dates near month transitions may have off-by-one-slot issues.
- Test coverage: None.

**Chat history is truncated to last 6 messages client-side AND server-side independently:**
- Files: `src/app/bsp-chat/page.tsx` (line 36), `src/app/api/bsp-rag/chat/route.ts` (line 157)
- Why fragile: The client sends only the last 6 messages, and the server also slices to the last 6 from what it receives. This means the AI effectively only ever sees 6 messages of context — not a bug per se, but changing one slice without the other will produce unexpected behavior.
- Safe modification: Treat the context window budget as a single decision — either truncate server-side only (don't double-truncate), or document that both intentionally cap at 6.

**`/bsp-chat/admin` is not behind the main admin cookie auth:**
- Files: `src/middleware.ts`, `src/app/bsp-chat/admin/page.tsx`
- Why fragile: The middleware matcher only covers `/admin/:path*`. The `/bsp-chat/admin` page is outside that scope and protected only by the client-side PIN (`4242`). The upload and delete API endpoints at `/api/bsp-rag/upload` have no auth check.
- Safe modification: Add `/bsp-chat/admin` to the middleware matcher, or add a server-side cookie check to the upload/delete route handlers.

---

## Test Coverage Gaps

**Zero automated tests:**
- What's not tested: The entire codebase — booking flow, payment intent creation, availability calculation, price computation, email sending, RAG pipeline, admin CRUD operations.
- Files: All `src/` files
- Risk: Any refactor or bug fix is unverifiable. The mock payment bypass, observer field naming bug, and capacity race condition described above would all be caught by integration tests.
- Priority: High

**Pricing logic is untested:**
- What's not tested: `getSlotType()`, `getSlotPrice()`, `getTimeSlotsForDate()`, `isWithinSeason()`, `calculateTotal()` in `BookingClient.tsx`.
- Files: `src/config/solarSchedule.ts`, `src/config/booking.ts`, `src/app/book/BookingClient.tsx`
- Risk: A price calculation regression would silently charge customers the wrong amount. A season date bug would block all bookings.
- Priority: High

**Admin API mutation routes are untested:**
- What's not tested: Create, update, delete for notes, expenses, todos, supplies, maintenance logs.
- Files: `src/app/api/notes/route.ts`, `src/app/api/expenses/route.ts`, `src/app/api/todos/route.ts`, `src/app/api/maintenance/route.ts`, `src/app/api/supplies/route.ts`
- Risk: Silent data corruption or failed mutations surface only when an admin notices data missing.
- Priority: Medium

---

## Scaling Limits

**Single-region Supabase with no connection pooling configured:**
- Current capacity: Supabase free/pro tier connection limits apply. Module-level `createClient()` calls in each serverless function may create many short-lived connections under load.
- Limit: Supabase connection pool limits (typically 60 direct connections on free tier).
- Scaling path: Enable Supabase connection pooler (PgBouncer) via the Supabase dashboard and use the pooler connection string.

**Rate limiting is per serverless instance (in-memory Map):**
- Current capacity: 10 requests/minute per IP, per running instance.
- Limit: Does not protect across instances or regions.
- Scaling path: Replace `rateLimitMap` with Upstash Redis or Vercel KV.

---

*Concerns audit: 2026-03-31*
