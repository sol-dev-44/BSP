# Requirements: Big Sky Parasail — Milestone 2

**Defined:** 2026-03-31
**Core Value:** Customers book and pay for the correct flight at the correct price, and the business owner sees accurate revenue and booking data.

## v1 Requirements

### Pricing

- [x] **PRICE-01**: Booking flow displays correct per-person price ($99/$119/$159) based on selected time slot type throughout all steps
- [x] **PRICE-02**: Stripe payment intent is created with the correct total matching the displayed price
- [x] **PRICE-03**: Confirmation email shows correct itemized receipt with accurate per-person rate and slot type label
- [x] **PRICE-04**: Success page displays correct itemized receipt matching what was charged

### Discount Codes

- [x] **DISC-01**: Admin can create a discount code with a name and fixed dollar amount
- [x] **DISC-02**: Admin can edit an existing discount code's name and amount
- [x] **DISC-03**: Admin can delete a discount code, making it immediately invalid for future bookings
- [x] **DISC-04**: Customer can enter a discount code during booking and see the total reduced by the code's dollar amount
- [x] **DISC-05**: Booking API validates the discount code exists and is active before applying the discount
- [x] **DISC-06**: Discount amount is stored on the booking record and reflected in confirmation email and success page
- [x] **DISC-07**: Discount is applied per-guest — final discount equals (per-guest amount × party_size), not a flat total
- [x] **DISC-08**: Discount codes enforce a max_redemptions cap with an incrementing times_redeemed counter; codes at or above the cap are rejected at validation and at payment-intent creation
- [x] **DISC-09**: Discount codes can be configured to exclude early-bird slots; when set, the validate endpoint returns the exact error message "This code cannot be used with early bird flights" if the selected trip_time is an early-bird slot (per getSlotType in src/config/solarSchedule.ts)
- [x] **DISC-10**: Admin discount codes UI lets the operator set per-guest amount, max_redemptions, and excludes_early_bird; the list view displays times_redeemed / max_redemptions for each code
- [x] **DISC-11**: Seed migration inserts code "30off" with amount_per_guest = 30, max_redemptions = 6, times_redeemed = 0, excludes_early_bird = true, is_active = true

### Admin Panel

- [x] **ADMIN-01**: Remove all Twilio/SMS balance and usage references from admin dashboard
- [x] **ADMIN-02**: Add Resend email usage/monitoring widget if Resend API supports it
- [x] **ADMIN-03**: When a booking is cancelled, revenue totals and booking counts update correctly in the dashboard

### Scheduling

- [x] **SCHED-01**: Sunset flights are scheduled to start minimum 1 hour before actual sunset time for the given date in Montana
- [x] **SCHED-02**: Sunset flight times vary throughout the season (May-September) based on real sunset data
- [x] **SCHED-03**: Mondays are excluded from booking availability across all flight types

### SEO & Technical Optimization

- [x] **SEO-01**: Stale static files (public/sitemap.xml, public/robots.txt, public/seo-report.json) deleted so dynamic App Router routes serve /sitemap.xml and /robots.txt
- [x] **SEO-02**: All 7 public pages emit BreadcrumbList JSON-LD structured data with URLs derived from BUSINESS_INFO.url
- [x] **SEO-03**: Schema.org openingHours reflects actual availability (Tu-Su, excluding Monday per BOOKING_CONFIG)
- [x] **SEO-04**: /services page emits ServiceSchema JSON-LD for each service in BUSINESS_INFO.services
- [x] **SEO-05**: /location page emits TouristAttractionSchema JSON-LD
- [x] **SEO-06**: Invalid google-site-verification placeholder removed from BASE_METADATA and OG image uses CDN-hosted URL
- [x] **SEO-07**: /bsp-chat page has own metadata export (title, description, canonical) via server wrapper pattern
- [x] **SEO-08**: OG image meta tag references CDN-hosted Supabase URL instead of 2.7 MB local file
- [x] **SEO-09**: Web manifest linked from layout metadata via manifest property
- [x] **SEO-10**: manifest.json icon references point to files that exist in public/

## v2 Requirements

### Discount Codes (Future)

- **DISC-F01**: Percentage-based discount codes
- **DISC-F02**: Per-person discount codes
- **DISC-F03**: Usage limits per code (max redemptions)
- **DISC-F04**: Expiration dates on codes

### Notifications (Future)

- **NOTIF-F01**: SMS booking confirmations via Twilio or similar
- **NOTIF-F02**: Automated day-before reminder emails

## Out of Scope

| Feature | Reason |
|---------|--------|
| Percentage/per-person discounts | User wants simplicity — fixed dollar only for now |
| Code usage limits | User preference — just active or deleted |
| Code expiration dates | User preference — keep it simple |
| SMS notifications | Removed Twilio, not needed currently |
| Booking flow redesign | Only fixing price consistency, not UX changes |
| New payment providers | Stripe only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PRICE-01 | Phase 1 | Complete |
| PRICE-02 | Phase 1 | Complete |
| PRICE-03 | Phase 1 | Complete |
| PRICE-04 | Phase 1 | Complete |
| DISC-01 | Phase 2 | Complete |
| DISC-02 | Phase 2 | Complete |
| DISC-03 | Phase 2 | Complete |
| DISC-04 | Phase 2 | Complete |
| DISC-05 | Phase 2 | Complete |
| DISC-06 | Phase 2 | Complete |
| ADMIN-01 | Phase 3 | Complete |
| ADMIN-02 | Phase 3 | Complete |
| ADMIN-03 | Phase 3 | Complete |
| SCHED-01 | Phase 3 | Complete |
| SCHED-02 | Phase 3 | Complete |
| SCHED-03 | Phase 3 | Complete |
| SEO-01 | Phase 4 | Planned |
| SEO-02 | Phase 4 | Planned |
| SEO-03 | Phase 4 | Planned |
| SEO-04 | Phase 4 | Planned |
| SEO-05 | Phase 4 | Planned |
| SEO-06 | Phase 4 | Planned |
| SEO-07 | Phase 4 | Planned |
| SEO-08 | Phase 4 | Planned |
| SEO-09 | Phase 4 | Planned |
| SEO-10 | Phase 4 | Planned |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-04-07 — SEO requirements added for Phase 4*
