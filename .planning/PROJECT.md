# Big Sky Parasail — Milestone 2

## What This Is

Big Sky Parasail's customer-facing booking site and admin dashboard, built on Next.js 16 with Supabase, Stripe, and Resend. This milestone focuses on fixing pricing consistency, adding discount codes, cleaning up the admin panel, fixing cancellation revenue tracking, and tuning the sunset flight schedule.

## Core Value

Customers book and pay for the correct flight at the correct price, and the business owner sees accurate revenue and booking data in the admin dashboard.

## Requirements

### Validated

- ✓ Multi-step booking flow with date/time selection, guest form, payment — existing
- ✓ Stripe payment integration with tiered pricing (Early Bird/Standard/Sunset) — existing
- ✓ Email confirmations via Resend to guest + admin — existing (just fixed)
- ✓ Admin dashboard with bookings, expenses, todos, supplies, maintenance — existing
- ✓ Solar schedule system for dynamic Montana time slots — existing
- ✓ RAG-powered chat assistant (Jerry Bear) — existing
- ✓ SEO with structured data, sitemap, per-page metadata — existing
- ✓ Cookie-based admin auth — existing

### Active

- [ ] Price consistency: Early Bird ($99), Standard ($119), Sunset ($159) stays correct from slot selection through payment, email, and success page
- [ ] Discount codes: Admin can create codes with name and fixed dollar amount
- [ ] Discount codes: Admin can edit existing codes
- [ ] Discount codes: Admin can delete codes (deleted = invalid)
- [ ] Discount codes: Customer can apply a code during booking to reduce total
- [ ] Admin cleanup: Remove Twilio/SMS references from admin panel
- [ ] Admin cleanup: Add Resend email monitoring if API supports it
- [ ] Cancellations: Revenue/money numbers update when a flight is cancelled
- [ ] Sunset scheduling: Sunset flights start minimum 1 hour before actual Montana sunset, varying by date
- [ ] Schedule: Remove Mondays from booking availability

### Out of Scope

- Usage limits or expiration dates on discount codes — keep it simple for now
- Percentage-based or per-person discount types — fixed dollar only
- SMS/text notifications — removed, not needed
- New booking flow redesign — only fixing price consistency

## Context

- Hosted on Vercel, DNS on Cloudflare
- Supabase for database (bsp_bookings, bsp_expenses, bsp_todos, etc.)
- Stripe in test mode currently (sk_test keys), live keys commented out in .env.local
- Resend domain montanaparasail.com just verified (2026-03-31)
- Solar schedule in `src/config/solarSchedule.ts` drives time slot logic
- Business config centralized in `src/config/business.ts` (pricing, contact, services)
- Admin panel uses RTK Query for expenses/todos/supplies/maintenance
- Season: May 1 - September 30

## Constraints

- **Stack**: Next.js 16 App Router, Supabase, Stripe, Resend — no new services
- **Database**: Supabase — discount codes need a new table (bsp_discount_codes)
- **Pricing source of truth**: `src/config/business.ts` and `src/config/solarSchedule.ts` — all pricing must derive from these
- **Admin auth**: Cookie-based, no changes needed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fixed dollar discounts only | User wants simplicity, no percentage/per-person complexity | — Pending |
| No usage limits on codes | User preference — just active or deleted | — Pending |
| Remove Twilio/SMS entirely | Not using SMS notifications, clutters admin | — Pending |
| Resend for all email | Domain verified, replaces any prior email approach | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after initialization*
