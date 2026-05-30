---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 02.1-02-PLAN.md
last_updated: "2026-05-30T02:14:44.694Z"
last_activity: 2026-05-30
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 17
  completed_plans: 15
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-31)

**Core value:** Customers book and pay for the correct flight at the correct price, and the business owner sees accurate revenue and booking data in the admin dashboard.
**Current focus:** Phase 02.1 — extend-discount-codes-with-per-flyer-pricing-usage-limits-and-early-bird-exclusion

## Current Position

Phase: 02.1 (extend-discount-codes-with-per-flyer-pricing-usage-limits-and-early-bird-exclusion) — EXECUTING
Plan: 3 of 4
Status: Ready to execute
Last activity: 2026-05-30

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01-pricing-integrity P02 | 5 | 2 tasks | 3 files |
| Phase 01-pricing-integrity P03 | 3min | 2 tasks | 2 files |
| Phase 02-discount-codes P03 | 3min | 2 tasks | 2 files |
| Phase 02-discount-codes P02 | 12min | 2 tasks | 7 files |
| Phase 02-discount-codes P05 | 8min | 2 tasks | 2 files |
| Phase 02-discount-codes P04 | 8min | 2 tasks | 2 files |
| Phase 03-admin-scheduling P01 | 5min | 1 tasks | 1 files |
| Phase 03-admin-scheduling P02 | 12 | 2 tasks | 3 files |
| Phase 04-complete-seo-audit P01 | 5 | 2 tasks | 5 files |
| Phase 04 P02 | 10min | 2 tasks | 7 files |
| Phase 04 P03 | 8 | 2 tasks | 4 files |
| Phase 02.1 P01 | 2min | 2 tasks | 2 files |
| Phase 02.1 P02 | 2m | 3 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Fixed dollar discounts only — no percentage/per-person
- No usage limits on codes — active or deleted only
- Remove Twilio/SMS entirely from admin
- Pricing source of truth: `src/config/business.ts` and `src/config/solarSchedule.ts`
- [Phase 01-pricing-integrity]: GuestForm receives pricePerPerson as a required prop rather than reading from BUSINESS_INFO directly — fixes tip calculation for all slot types
- [Phase 01-pricing-integrity]: Compute slotType/perPerson before the Supabase insert so values are available to store; use nullish coalescing fallback for historical bookings
- [Phase 02-discount-codes]: Payment intent creation is lenient on invalid discount codes — no rejection, just no discount applied
- [Phase 02-discount-codes]: Discount amount floored at 0 with Math.max to prevent negative Stripe charges
- [Phase 02-discount-codes]: code_name normalized to uppercase at API write layer for consistent discount code matching
- [Phase 02-discount-codes]: Status toggle implemented as clickable Active/Inactive badge in discount codes admin UI
- [Phase 02-discount-codes]: Discount row ordered after tip row in email and success receipt for consistent display
- [Phase 02-discount-codes]: Discount code UI placed between GuestForm and nav buttons in step 2; discountAmount defaults to 0 in PriceBreakdown for backwards-compatibility; grandTotal floored at Math.max(0, ...) to prevent negative charges
- [Phase 03-admin-scheduling]: Resend has no usage/analytics API endpoints — ADMIN-02 email monitoring is out of scope, documented via inline comment
- [Phase 03-admin-scheduling]: totalBookings now derived from activeBookings.length so Transactions stat excludes cancelled bookings (ADMIN-03)
- [Phase 03-admin-scheduling]: getSolarEntry signature changed from (month: number) to (dateStr: string) for date-level precision
- [Phase 03-admin-scheduling]: lastTripHour is strictly sunsetHour - 1 with lastTripMinute 0 - sunset flight always on the hour, always 1h before sunset
- [Phase 03-admin-scheduling]: Monday exclusion via BOOKING_CONFIG.excludedDaysOfWeek: [1] — isDayOfWeekAllowed drives both calendar UI and availability API
- [Phase 04-complete-seo-audit]: Deleted public/sitemap.xml and public/robots.txt to unblock dynamic App Router routes in src/app/sitemap.ts and src/app/robots.ts
- [Phase 04-complete-seo-audit]: openingHours corrected to Tu-Su in business.ts schema.org data to match Monday exclusion from Phase 3
- [Phase 04-complete-seo-audit]: Removed verification placeholder from seo.ts to prevent invalid google-site-verification meta tag; OG image switched to Supabase CDN URL
- [Phase 04]: All breadcrumb URLs use BUSINESS_INFO.url template literal instead of hardcoded domain — single source of truth for domain changes
- [Phase 04]: bsp-chat page.tsx converted to server wrapper — metadata export is silently ignored on 'use client' components
- [Phase 04]: Manifest icon purpose 'any maskable' changed to 'any' — JerryBearLogo.png not designed for maskable safe zone
- [Phase 02.1]: [Phase 02.1]: bsp_discount_codes.amount column name preserved with COMMENT documenting semantic shift from flat-total to per-guest — avoids destructive rename (D-01)
- [Phase 02.1]: [Phase 02.1]: max_redemptions defaults to 0 = unlimited so existing test rows remain backward compatible (D-02)
- [Phase 02.1]: [Phase 02.1]: bsp_increment_discount_redemption RPC uses atomic conditional UPDATE with cap guard (Pattern 2A) — at_cap flag returned so caller can log but not fail booking when Stripe already charged (D-10)
- [Phase 02.1]: [Phase 02.1]: 30OFF seed uses ON CONFLICT DO UPDATE but intentionally omits times_redeemed so dev test counters survive schema re-runs (D-15)
- [Phase 02.1]: Validate endpoint enforces D-05 check order (exists -> is_active -> cap -> early-bird) with verbatim D-07 error strings
- [Phase 02.1]: create-payment-intent re-checks cap and early-bird as last-gate safety; payment-intent stays LENIENT (no 4xx) per Phase 2 pattern
- [Phase 02.1]: Per-guest discount math: discountData.amount * party_size, floored with Math.max(0, ...) (D-08)
- [Phase 02.1]: PATCH /api/discount-codes/[id] accepts times_redeemed for admin reset workflow (Open Question 5)
- [Phase 02.1]: bookings/route.ts RPC bsp_increment_discount_redemption call placed after insert success, before email section; no inner try/catch (D-03, D-10)

### Roadmap Evolution

- Phase 4 added: Complete SEO audit and automated optimization — technical SEO fixes, meta tags, structured data, performance improvements
- Phase 02.1 inserted after Phase 2: Extend discount codes with per-flyer pricing, usage limits, and early-bird exclusion (URGENT)

### Pending Todos

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260407-u1d | Update tour availability schedule | 2026-04-08 | 9a311fb | [260407-u1d-update-tour-availability-schedule](./quick/260407-u1d-update-tour-availability-schedule/) |

### Blockers/Concerns

- Resend API monitoring (ADMIN-02) depends on whether Resend exposes usage data in their API — needs verification during planning.

## Session Continuity

Last activity: 2026-04-08 - Completed quick task 260407-u1d: Update tour availability schedule

Last session: 2026-05-30T02:14:35.794Z
Stopped at: Completed 02.1-02-PLAN.md
Resume file: None
