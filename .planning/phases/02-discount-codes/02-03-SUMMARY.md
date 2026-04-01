---
phase: 02-discount-codes
plan: "03"
subsystem: api
status: complete
started: 2026-04-01
completed: 2026-04-01
duration: 3min
tags: [discount-codes, stripe, supabase, api]
dependency_graph:
  requires: [02-01]
  provides: [discount-validation-api, payment-intent-discount]
  affects: [booking-flow, stripe-payment]
tech_stack:
  added: []
  patterns: [supabase-admin-query, stripe-metadata, server-side-normalization]
key_files:
  created:
    - src/app/api/discount-codes/validate/route.ts
  modified:
    - src/app/api/create-payment-intent/route.ts
decisions:
  - Payment intent creation is lenient — invalid/inactive codes simply result in no discount, no rejection
  - Discount code normalization (.trim().toUpperCase()) applied in both validate and payment-intent routes
  - Amount floored at 0 with Math.max(0, amount - discountAmount) to prevent negative Stripe charges
metrics:
  duration: 3min
  tasks_completed: 2
  files_modified: 2
requirements: [DISC-04, DISC-05]
---

# Phase 02 Plan 03: Discount Code Validation API — Summary

## One-liner

Server-side discount validation endpoint and Stripe payment intent updated to deduct fixed-dollar discount codes from charge amount with metadata tracking.

## What Was Built

### Task 1: POST /api/discount-codes/validate

Created `src/app/api/discount-codes/validate/route.ts` — a POST handler that:
- Accepts `{ code: string }` in request body
- Normalizes to uppercase and queries `bsp_discount_codes` via `supabaseAdmin`
- Returns `{ valid: true, code_name, amount }` for active codes
- Returns `{ valid: false, error: '...' }` for missing or inactive codes (always HTTP 200 to avoid leaking info)
- Logs with `[DISCOUNT]` prefix, wrapped in try/catch with `error: unknown` narrowing

### Task 2: Updated /api/create-payment-intent

Updated `src/app/api/create-payment-intent/route.ts` to:
- Accept optional `discount_code` in POST body
- Look up the code via `supabaseAdmin` and deduct its `amount` from the Stripe charge
- Floor the final amount at $0 using `Math.max(0, amount - discountAmount)`
- Store `discount_code` and `discount_amount` in Stripe PaymentIntent metadata
- Return `discountApplied: boolean` and `discountAmount: number` alongside `clientSecret`
- Treat missing/inactive codes as no-discount (lenient — validation is a separate concern)

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Create discount code validation endpoint | Done | cb30555 |
| 2 | Update create-payment-intent to accept and apply discount | Done | ed66585 |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — both endpoints are fully wired to live Supabase data.

## Self-Check: PASSED
