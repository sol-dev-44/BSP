# Roadmap: Big Sky Parasail — Milestone 2

## Overview

Three phases address the core gaps in Milestone 2: first, guarantee price integrity through the entire booking flow; second, add the discount code feature end-to-end (admin CRUD through customer checkout); third, clean up the admin panel and fix scheduling bugs. Each phase is independently verifiable and delivers complete, working capabilities.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Pricing Integrity** - Correct price flows from slot selection through Stripe charge, email, and success page
- [x] **Phase 2: Discount Codes** - Admin can manage discount codes; customers can apply them at checkout (completed 2026-04-01)
- [x] **Phase 3: Admin & Scheduling** - Admin panel cleaned up, cancellation revenue fixed, sunset and Monday scheduling corrected (completed 2026-04-01)

## Phase Details

### Phase 1: Pricing Integrity
**Goal**: The correct per-person price is displayed, charged, and confirmed at every step of the booking flow
**Depends on**: Nothing (first phase)
**Requirements**: PRICE-01, PRICE-02, PRICE-03, PRICE-04
**Success Criteria** (what must be TRUE):
  1. Customer sees $99, $119, or $159 per-person based on their selected slot type throughout all booking steps
  2. The Stripe charge matches exactly what was displayed on the payment screen
  3. The confirmation email shows an itemized receipt with the correct rate and slot type label
  4. The success page shows the same itemized receipt matching what was charged
**Plans**: 3 plans
Plans:
- [x] 01-01-PLAN.md — Add slot_type and per_person_rate columns to bsp_bookings (schema + human SQL execution)
- [x] 01-02-PLAN.md — Fix GuestForm tip calculation prop (BUG A: hardcoded $119 for tips)
- [x] 01-03-PLAN.md — Store slot pricing in bookings API and fix success page receipt (BUG B)
**UI hint**: yes

### Phase 2: Discount Codes
**Goal**: Admin can create, edit, and delete fixed-dollar discount codes; customers can apply a valid code during booking to reduce their total
**Depends on**: Phase 1
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DISC-06
**Success Criteria** (what must be TRUE):
  1. Admin can create a discount code with a name and dollar amount, and it appears in the admin list
  2. Admin can edit an existing code's name and amount, and the change takes effect immediately
  3. Admin can delete a code, and deleted codes are rejected when a customer tries to use them
  4. Customer can enter a discount code during booking and see the total price reduced by the code's dollar amount
  5. The discount amount appears in the confirmation email and success page alongside the itemized receipt
**Plans**: 5 plans
Plans:
- [x] 02-01-PLAN.md — Create bsp_discount_codes table and add discount columns to bsp_bookings (schema + human SQL)
- [x] 02-02-PLAN.md — Admin CRUD UI and API routes for discount codes (RTK Query pattern)
- [x] 02-03-PLAN.md — Discount validation endpoint and payment-intent discount application
- [x] 02-04-PLAN.md — Booking form discount code input and PriceBreakdown display
- [x] 02-05-PLAN.md — Store discount on booking record; show in success page and confirmation email
**UI hint**: yes

### Phase 3: Admin & Scheduling
**Goal**: The admin panel reflects accurate business state — no dead SMS references, correct revenue after cancellations — and the booking calendar reflects real scheduling rules
**Depends on**: Phase 1
**Requirements**: ADMIN-01, ADMIN-02, ADMIN-03, SCHED-01, SCHED-02, SCHED-03
**Success Criteria** (what must be TRUE):
  1. Admin dashboard contains no Twilio or SMS references
  2. Revenue and booking count totals in the dashboard update correctly when a booking is cancelled
  3. Sunset flight time slots start at least 1 hour before actual Montana sunset for each date in the season
  4. Sunset flight times shift earlier or later through the season (May–September) matching real sunset data
  5. Mondays show no available booking slots across all flight types
**Plans**: 2 plans
Plans:
- [x] 03-01-PLAN.md — Remove Twilio/SMS stat cards and fix Transactions count to exclude cancelled bookings
- [x] 03-02-PLAN.md — Expand solar schedule to bi-weekly sunset data and exclude Mondays from booking

### Phase 4: SEO Audit & Automated Optimization
**Goal**: All technical SEO gaps are closed — stale files removed, structured data wired to all pages, metadata accurate, manifest linked, OG image optimized — entirely through code changes with no human content effort
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10
**Success Criteria** (what must be TRUE):
  1. Dynamic sitemap.ts and robots.ts serve /sitemap.xml and /robots.txt (no static file conflicts)
  2. All 7 public pages emit BreadcrumbList JSON-LD with URLs from BUSINESS_INFO.url
  3. /services page emits ServiceSchema JSON-LD for each service
  4. /location page emits TouristAttractionSchema JSON-LD
  5. Schema.org openingHours says Tu-Su (not Mo-Su)
  6. No invalid google-site-verification meta tag in HTML
  7. /bsp-chat page has its own title and description (not homepage defaults)
  8. Web manifest is linked from layout and manifest icons reference existing files
  9. OG image uses CDN-hosted URL for fast social previews
**Plans**: 3 plans
Plans:
- [x] 04-01-PLAN.md — Delete stale static files, fix openingHours, remove verification placeholder, switch OG image to CDN
- [x] 04-02-PLAN.md — Wire structured data (ServiceSchema, TouristAttractionSchema, BreadcrumbList) to all pages, fix hardcoded URLs
- [x] 04-03-PLAN.md — Convert bsp-chat to server wrapper pattern with metadata, link manifest, fix manifest icons

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Pricing Integrity | 1/3 | In Progress|  |
| 2. Discount Codes | 5/5 | Complete   | 2026-04-01 |
| 3. Admin & Scheduling | 2/2 | Complete   | 2026-04-01 |
| 4. SEO & Optimization | 3/3 | Complete   | 2026-04-08 |
