---
phase: 02-discount-codes
plan: "05"
subsystem: booking-persistence
tags: [discount-codes, booking-api, success-page, email, receipt]
dependency_graph:
  requires: [02-03]
  provides: [discount-stored-on-booking, discount-in-email, discount-in-success-receipt]
  affects: [bsp_bookings, src/app/api/bookings/route.ts, src/app/book/success/page.tsx]
tech_stack:
  added: []
  patterns: [supabase-insert-extra-fields, conditional-email-rows, conditional-receipt-line-items]
key_files:
  created: []
  modified:
    - src/app/api/bookings/route.ts
    - src/app/book/success/page.tsx
decisions:
  - Discount row appended after tip row in both email and success page for consistent ordering
  - Total Paid unchanged — derived from Stripe PaymentIntent amount which already reflects discount
metrics:
  duration: 8min
  completed: "2026-03-31"
  tasks: 2
  files_modified: 2
---

# Phase 02 Plan 05: Booking Persistence and Receipt Display Summary

One-liner: Discount code and amount persisted on bsp_bookings; green discount line item surfaced in confirmation email and success page receipt.

## What Was Built

Completed DISC-05 and DISC-06: when a booking is finalized, `discount_code` and `discount_amount` are now stored on the `bsp_bookings` row and displayed as a line item in both the customer confirmation email and the success page itemized receipt.

### Task 1: Store discount fields in booking API and add discount to email (58e1df9)

**src/app/api/bookings/route.ts**

- Extended request body destructuring to include `discount_code` and `discount_amount`
- Added `discount_code: discount_code || null` and `discount_amount: discount_amount || 0` to the Supabase insert object
- Computed `discountTotal` after `tipTotal`
- Appended a green (`#16a34a`) discount row to `addOnRows` when `discountTotal > 0`, formatted as `-$XX.XX` with the code name

### Task 2: Update success page to display discount line item (3b2d71e)

**src/app/book/success/page.tsx**

- Extended `BookingDetails` interface with `discount_code?: string | null` and `discount_amount?: number | null`
- Derived `discountAmount` and `discountCode` from `booking` data
- Rendered a conditional green discount line item (`text-[#16a34a]`) after the tip row in the itemized receipt; only shown when `discountAmount > 0`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] PriceBreakdown TypeScript error blocking build**

- **Found during:** Task 2 build verification
- **Issue:** `BookingClient.tsx` was passing `discountAmount` and `discountCode` props to `PriceBreakdown`, but a prior agent had already updated `PriceBreakdown.tsx` with those props. The file was stale in the executor's read context. Re-reading confirmed the file was already correct — no edit was needed.
- **Fix:** Confirmed `PriceBreakdown.tsx` already had full implementation (interface, destructuring, grandTotal subtraction, discount UI row). Build passed on second run.
- **Files modified:** None (already correct)
- **Commit:** N/A

## Known Stubs

None — discount data is fully wired from the booking API through to both the success page and email.

## Self-Check: PASSED

- FOUND: src/app/api/bookings/route.ts
- FOUND: src/app/book/success/page.tsx
- FOUND: commit 58e1df9 (Task 1)
- FOUND: commit 3b2d71e (Task 2)
