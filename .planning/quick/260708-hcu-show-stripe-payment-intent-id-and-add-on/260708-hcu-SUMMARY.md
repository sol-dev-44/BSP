---
phase: quick-260708-hcu
plan: 01
subsystem: ui
tags: [admin, bookings, stripe, react, tailwind]

# Dependency graph
requires: []
provides:
  - Expandable per-row details disclosure on the admin bookings table showing Stripe payment intent ID and add-on breakdown
affects: [admin-bookings]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Accordion-style row expansion via single expandedId state (one row open at a time)"
    - "Transient copiedId state with setTimeout reset for click-to-copy UX"

key-files:
  created: []
  modified:
    - src/app/admin/bookings/BookingsTable.tsx

key-decisions:
  - "Chevron toggle placed in the existing trailing actions cell (no new column added) to keep the top-level table scannable"
  - "Observer count normalized as add_ons?.observer_count ?? add_ons?.observer_package ?? 0 to handle both schema variants"
  - "PI validity check is a startsWith('pi_') guard so OTA/mock rows render a dimmed 'No Stripe payment' note instead of a broken link"

patterns-established:
  - "BookingDetailsPanel sub-component pattern: extracted expandable row content into its own function component to keep the main table render readable"

requirements-completed: [QUICK-260708-hcu]

# Metrics
duration: 12min
completed: 2026-07-08
---

# Quick Task 260708-hcu: Show Stripe Payment Intent ID and Add-on Details Summary

**Expandable per-row disclosure on the admin bookings table exposing the Stripe payment intent ID (copy + dashboard deep link) and add-on breakdown (tip, photo/GoPro/combo, observers) without a database query.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-07-08T18:22:00Z
- **Completed:** 2026-07-08T18:34:01Z
- **Tasks:** 1 of 2 (Task 2 is a human-verify checkpoint, pending)
- **Files modified:** 1

## Accomplishments
- Extended the `Booking` interface in `BookingsTable.tsx` with `stripe_payment_intent_id`, `add_ons`, `discount_code`, `discount_amount`, `per_person_rate`, `slot_type` (all optional/nullable, no `page.tsx` change needed since it already `select('*')`s)
- Added an accordion-style expand/collapse chevron per row (`ChevronDown`/`ChevronRight`) in the existing trailing actions cell — no new columns added
- Built a `BookingDetailsPanel` sub-component rendering: booking reference (uppercased prefix + full UUID), Stripe PI with click-to-copy (`Copy`/`Check` icon swap + "Copied!" transient state) and a `dashboard.stripe.com/payments/{pi}` deep link, or a dimmed "No Stripe payment (OTA / mock)" note when the PI is null/non-`pi_`
- Rendered all five add-ons (tip, photo, GoPro, combo, observer count) with non-zero values in bold emerald and zero/missing values dimmed with an em dash
- Added an optional dimmed context row for discount code/amount, slot type, and per-person rate when present

## Task Commits

Each task was committed atomically:

1. **Task 1: Add expandable Stripe PI + add-ons details disclosure to bookings table** - `4127bdf` (feat)

Task 2 (`checkpoint:human-verify`) is a manual browser verification step and was not executed by this agent per the quick-task constraints — see "Pending Human Verification" below.

## Files Created/Modified
- `src/app/admin/bookings/BookingsTable.tsx` - Extended `Booking` interface; added `expandedId`/`copiedId` state, toggle/copy handlers, expand chevron control, and `BookingDetailsPanel` component rendering booking reference, Stripe PI (copy + Stripe dashboard link, or OTA/mock note), and add-on breakdown

## Decisions Made
- Chevron control placed in the existing trailing actions `<td>` rather than adding a new leading column, per plan instruction to keep the top-level table scannable
- Used `Fragment` (not `React.Fragment`) with the existing named import style to pair each booking `<tr>` with its optional details `<tr>` under one `key`
- `handleCopyPi` wrapped in try/catch logging to `console.error` (matches project error-handling convention) rather than throwing on clipboard failure

## Deviations from Plan

None - plan executed exactly as written. `page.tsx` was not touched, matching the plan's note that it already passes every column through via `select('*')`.

## Issues Encountered
- `npm run lint` fails repo-wide with "ESLint couldn't find an eslint.config.(js|mjs|cjs) file" — verified via `git stash` that this is pre-existing on `main` (unrelated to this change) since ESLint 9 requires flat config and none exists in the repo. Logged to `deferred-items.md` in this task's directory per the out-of-scope rule; not fixed here. `npx tsc --noEmit` passes cleanly with zero errors.

## User Setup Required

None - no external service configuration required.

## Pending Human Verification

Task 2 of the plan is a `checkpoint:human-verify` gate that requires a live browser check and was intentionally left unexecuted per this run's constraints:

1. Run `npm run dev` and open `http://localhost:3000/admin/bookings` (log in if prompted).
2. Click the expand chevron on a normal (non-OTA) booking — ideally the one with ref `F0C24CF6` if visible.
   - Confirm the Stripe PI shows, "Copy" copies it to clipboard, and the Stripe dashboard link opens `https://dashboard.stripe.com/payments/{pi}` in a new tab.
   - Confirm non-zero add-ons stand out and zero add-ons show a dimmed em dash.
   - Confirm the booking reference (uppercased UUID prefix) is shown.
3. Expand an OTA-seeded booking (GetYourGuide/Viator) — confirm it shows "No Stripe payment (OTA / mock)" and does not error.
4. Confirm the top-level table is still scannable (no new columns) and dark-mode styling matches the rest of the admin.

## Next Phase Readiness
- Code change is complete, type-checked, and committed (`4127bdf`)
- Awaiting human browser verification per above before this quick task can be considered fully closed

---
*Phase: quick-260708-hcu*
*Completed: 2026-07-08*

## Self-Check: PASSED

- FOUND: src/app/admin/bookings/BookingsTable.tsx
- FOUND: .planning/quick/260708-hcu-show-stripe-payment-intent-id-and-add-on/260708-hcu-SUMMARY.md
- FOUND: commit 4127bdf
