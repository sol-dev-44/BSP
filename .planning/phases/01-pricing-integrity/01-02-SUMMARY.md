---
phase: 01-pricing-integrity
plan: 02
subsystem: booking
tags: [pricing, tip-calculation, guest-form, props]
dependency_graph:
  requires: []
  provides: [slot-accurate-tip-calculation]
  affects: [booking-flow]
tech_stack:
  added: []
  patterns: [prop-drilling for slot-based pricing]
key_files:
  created: []
  modified:
    - src/components/booking/GuestForm.tsx
    - src/app/book/BookingClient.tsx
    - src/components/booking/BookingForm.tsx
decisions:
  - GuestForm now receives pricePerPerson as a required prop rather than reading from BUSINESS_INFO directly
  - BookingForm.tsx second call site fixed to pass getSelectedSlotPrice() — discovered during TypeScript validation
metrics:
  duration: ~5 minutes
  completed: "2026-04-01"
  tasks_completed: 2
  files_modified: 3
---

# Phase 01 Plan 02: Fix Tip Calculation Hardcoded Price Summary

GuestForm now receives slot-based pricePerPerson as a prop; the hardcoded $119 constant is removed so tip suggestion buttons reflect the actual Early Bird ($99), Standard ($119), or Sunset ($159) price.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Add pricePerPerson prop to GuestForm, remove hardcoded $119 | a959d48 |
| 2 | Pass pricePerPerson from BookingClient and BookingForm to GuestForm | 0053a71 |

## What Was Built

- `GuestFormProps` interface now includes `pricePerPerson: number` as a required field
- GuestForm function signature destructures the new prop
- The hardcoded `const pricePerPerson = BUSINESS_INFO.pricing.parasail` line (BUG A) is gone
- `BookingClient.tsx` passes `currentPricePerPerson` (already correctly computed from slot selection)
- `BookingForm.tsx` passes `getSelectedSlotPrice()` (the correct slot-aware price function)
- Tip buttons now correctly show: Early Bird 15%=$15, 20%=$20, 25%=$25 | Sunset 15%=$24, 20%=$32, 25%=$40

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Second GuestForm call site in BookingForm.tsx**
- **Found during:** Task 2 TypeScript check
- **Issue:** `BookingForm.tsx` line 282 also renders `<GuestForm>` without the new required `pricePerPerson` prop, causing a TypeScript compilation error
- **Fix:** Added `pricePerPerson={getSelectedSlotPrice()}` to the GuestForm JSX in BookingForm.tsx. `getSelectedSlotPrice()` was already defined in BookingForm.tsx and returns the correct slot-based price.
- **Files modified:** `src/components/booking/BookingForm.tsx`
- **Commit:** 0053a71

## Known Stubs

None — all price calculations are wired to real slot data.

## Self-Check: PASSED

- FOUND: src/components/booking/GuestForm.tsx
- FOUND: src/app/book/BookingClient.tsx
- FOUND: src/components/booking/BookingForm.tsx
- FOUND commit: a959d48 feat(01-02): add pricePerPerson prop to GuestForm
- FOUND commit: 0053a71 feat(01-02): pass pricePerPerson to GuestForm from all call sites
