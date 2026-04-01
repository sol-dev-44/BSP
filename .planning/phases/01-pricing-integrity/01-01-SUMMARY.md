---
plan: 01-01
phase: 01-pricing-integrity
status: complete
started: 2026-03-31
completed: 2026-03-31
---

# Plan 01-01: Schema Migration — Summary

## What Was Built
Added `slot_type` (TEXT with CHECK constraint) and `per_person_rate` (NUMERIC(10,2)) columns to the `bsp_bookings` table. These columns allow the bookings API to store authoritative pricing data that the success page can read back.

## Tasks Completed
| # | Task | Status |
|---|------|--------|
| 1 | Document schema additions in bsp-schema.sql | Done |
| 2 | Apply migration to live Supabase project | Done (human checkpoint) |

## Key Files
- `supabase/bsp-schema.sql` — Section 9 added with ALTER TABLE migration

## Commits
- `ce4979e` — feat(01-01): add slot_type and per_person_rate columns to bsp_bookings schema

## Deviations
None.

## Self-Check: PASSED
- [x] bsp-schema.sql contains ALTER TABLE with both new columns
- [x] Human confirmed SQL applied to live Supabase project
