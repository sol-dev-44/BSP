---
phase: 02-discount-codes
plan: 02
subsystem: api, ui, admin
tags: [rtk-query, redux, supabase, next-js, tailwind]

# Dependency graph
requires:
  - phase: 02-01
    provides: bsp_discount_codes table in Supabase
provides:
  - RTK Query slice (discountCodesApi) with CRUD hooks
  - GET/POST /api/discount-codes API routes using supabaseAdmin
  - PATCH/DELETE /api/discount-codes/[id] API routes
  - Admin UI at /admin/discount-codes with full CRUD (add, inline edit, toggle, delete)
affects: [02-03, booking-flow, discount-validation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - RTK Query slice registered in Redux store following expensesApi pattern
    - Server component page.tsx wrapping Client component DiscountCodesClient.tsx
    - Uppercase normalization on code_name at write time (API layer)
    - Status toggle via badge click using updateDiscountCode mutation

key-files:
  created:
    - src/lib/api/discountCodesApi.ts
    - src/app/api/discount-codes/route.ts
    - src/app/api/discount-codes/[id]/route.ts
    - src/app/admin/discount-codes/page.tsx
    - src/app/admin/discount-codes/DiscountCodesClient.tsx
  modified:
    - src/lib/store.ts
    - src/app/admin/expenses/page.tsx

key-decisions:
  - "code_name normalized to uppercase in API write handlers to ensure case-insensitive matching"
  - "Status toggle implemented as clickable badge (no separate toggle button) for minimal UI"
  - "409 Conflict returned for duplicate code_name (unique constraint violation)"

patterns-established:
  - "RTK Query CRUD slice: create discountCodesApi.ts matching expensesApi.ts structure exactly"
  - "Admin page pattern: page.tsx (server, force-dynamic) + *Client.tsx (use client, RTK Query hooks)"
  - "Inline edit: editingId state controls per-row edit mode; editData holds form values"

requirements-completed: [DISC-01, DISC-02, DISC-03]

# Metrics
duration: 12min
completed: 2026-04-01
---

# Phase 02 Plan 02: Discount Codes Admin CRUD Summary

**RTK Query-backed admin CRUD for discount codes at /admin/discount-codes with GET/POST/PATCH/DELETE API routes hitting bsp_discount_codes in Supabase**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-01T10:32:00Z
- **Completed:** 2026-04-01T10:44:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Created discountCodesApi RTK Query slice with four hooks and registered it in the Redux store
- Built GET/POST /api/discount-codes and PATCH/DELETE /api/discount-codes/[id] routes using supabaseAdmin
- Created /admin/discount-codes page with full CRUD: add form, inline edit, active/inactive toggle, delete confirm
- Build passes with zero TypeScript or compilation errors

## Task Commits

Each task was committed atomically:

1. **Task 1: RTK Query slice and API routes** - `936ae08` (feat)
2. **Task 2: Admin discount codes page and client component** - `288f5ea` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `src/lib/api/discountCodesApi.ts` - RTK Query slice with DiscountCode interface and four CRUD hooks
- `src/lib/store.ts` - Added discountCodesApi reducer and middleware
- `src/app/api/discount-codes/route.ts` - GET (list) and POST (create) handlers with validation
- `src/app/api/discount-codes/[id]/route.ts` - PATCH (update) and DELETE handlers
- `src/app/admin/discount-codes/page.tsx` - Server component wrapper with nav and force-dynamic
- `src/app/admin/discount-codes/DiscountCodesClient.tsx` - Full CRUD client component
- `src/app/admin/expenses/page.tsx` - Added Discounts nav link

## Decisions Made
- code_name normalized to uppercase at the API write layer (both POST and PATCH) for consistent matching
- Status toggle implemented as a clickable Active/Inactive badge rather than a separate button
- Duplicate code_name returns 409 Conflict (surfaces Supabase unique constraint clearly)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Admin can create, edit, toggle, and delete discount codes at /admin/discount-codes
- RTK Query cache invalidates on every mutation so list stays current without page reload
- Ready for plan 02-03: customer-facing discount code application during booking flow
- bsp_discount_codes table must exist in Supabase (created in plan 02-01) before this page is functional

---
*Phase: 02-discount-codes*
*Completed: 2026-04-01*

## Self-Check: PASSED

- FOUND: src/lib/api/discountCodesApi.ts
- FOUND: src/app/api/discount-codes/route.ts
- FOUND: src/app/api/discount-codes/[id]/route.ts
- FOUND: src/app/admin/discount-codes/page.tsx
- FOUND: src/app/admin/discount-codes/DiscountCodesClient.tsx
- FOUND commit: 936ae08
- FOUND commit: 288f5ea
