---
phase: quick
plan: 260407-u1d
subsystem: booking-availability
tags: [availability, scheduling, config, booking-flow]
dependency_graph:
  requires: []
  provides: [restricted-hours-wed-fri, closed-mon-tue-thu, updated-schema-hours]
  affects: [booking-form, availability-api, date-selector, structured-data]
tech_stack:
  added: []
  patterns: [optional-param-default, day-of-week-guard]
key_files:
  created: []
  modified:
    - src/config/solarSchedule.ts
    - src/config/booking.ts
    - src/config/business.ts
    - src/app/api/availability/route.ts
    - src/components/booking/BookingForm.tsx
    - src/components/booking/DateSelector.tsx
decisions:
  - "RESTRICTED_START_HOUR=15 exported from solarSchedule.ts as the single source for Wed/Fri start hour"
  - "getTimeSlotsForDate gains optional startHour param (backwards-compatible, defaults to FIRST_TRIP_HOUR=10)"
  - "isRestrictedDay helper in booking.ts encapsulates the Wed/Fri check so callers stay DRY"
  - "Day-of-week computed via date+'T12:00:00' in both API and BookingForm to avoid timezone-shift issues"
  - "business.ts openingHours updated to We,Fr 15:00-19:00 + Sa,Su 10:00-19:00 for schema.org accuracy"
metrics:
  duration: "8min"
  completed_date: "2026-04-07"
  tasks_completed: 2
  files_changed: 6
---

# Quick Task 260407-u1d: Update Tour Availability Schedule Summary

**One-liner:** 2026 season schedule — Mon/Tue/Thu closed, Wed/Fri 3 PM+ restricted hours, Sat/Sun full 10 AM hours — enforced at config, API, and UI layers.

## What Was Done

Updated the booking system to reflect Big Sky Parasail's 2026 operating schedule. Previously only Monday was excluded; the system now closes Monday, Tuesday, and Thursday, and introduces restricted hours (3 PM through sunset) for Wednesday and Friday while preserving the full 10 AM schedule for Saturday and Sunday.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update config layer | 10fa071 | solarSchedule.ts, booking.ts, business.ts |
| 2 | Update callers | 87dde45 | availability/route.ts, BookingForm.tsx, DateSelector.tsx |

## Changes by File

**src/config/solarSchedule.ts**
- `getTimeSlotsForDate(dateStr, startHour?)` — optional `startHour` param, defaults to `FIRST_TRIP_HOUR` (10). All existing callers remain unchanged.
- `RESTRICTED_START_HOUR = 15` exported as the canonical 3 PM constant.
- `getScheduleDescription(dateStr, startHour?)` — accepts optional start hour to display correct range for restricted days.
- Updated module JSDoc to document 2026 schedule.

**src/config/booking.ts**
- `excludedDaysOfWeek: [1, 2, 4]` — Monday (1), Tuesday (2), Thursday (4) are now closed.
- `restrictedDaysOfWeek: [3, 5]` — Wednesday (3) and Friday (5) use 3 PM start.
- `isRestrictedDay(dayOfWeek)` helper exported for callers.
- `getTimeSlotsForDayOfWeek` updated to pass `RESTRICTED_START_HOUR` for restricted days.
- Static `timeSlots.daily` comment updated to clarify it is a Sat/Sun reference only.

**src/config/business.ts**
- `hours` object updated: Mon/Tue/Thu = "Closed", Wed/Fri = "3:00 PM - Sunset", Sat/Sun = "10:00 AM - Sunset".
- `openingHours` (schema.org) changed from `['Tu-Su 10:00-19:00']` to `['We,Fr 15:00-19:00', 'Sa,Su 10:00-19:00']`.

**src/app/api/availability/route.ts**
- Imports `isRestrictedDay` from booking and `RESTRICTED_START_HOUR` from solarSchedule.
- Computes `dayOfWeek` from the requested date (using `T12:00:00` to avoid TZ shifts), passes `startHour` to `getTimeSlotsForDate`.

**src/components/booking/BookingForm.tsx**
- Same pattern as availability API — `dayOfWeek` derived from `selectedDate`, `startHour` passed to `getTimeSlotsForDate` in the `useEffect` that builds client-side slots.

**src/components/booking/DateSelector.tsx**
- Schedule notice updated from "Open Tuesday–Sunday during season" to "Open Wed, Fri (3 PM+), Sat & Sun (10 AM+) during season".

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` — exit 0, zero errors
- `npm run build` — succeeded, all routes compiled
- Manual spot-checks (logic review):
  - 2026-06-03 (Wednesday) → `isRestrictedDay(3)=true` → slots start at 3:00 PM
  - 2026-06-06 (Saturday) → `isRestrictedDay(6)=false` → slots start at 10:00 AM
  - 2026-06-02 (Tuesday) → `isDayOfWeekAllowed(2)=false` → disabled in calendar

## Known Stubs

None.

## Self-Check: PASSED

- src/config/solarSchedule.ts — FOUND
- src/config/booking.ts — FOUND
- src/config/business.ts — FOUND
- src/app/api/availability/route.ts — FOUND
- src/components/booking/BookingForm.tsx — FOUND
- src/components/booking/DateSelector.tsx — FOUND
- Commit 10fa071 — FOUND
- Commit 87dde45 — FOUND
