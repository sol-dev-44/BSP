---
phase: 03-admin-scheduling
plan: 02
subsystem: scheduling
tags: [solar-schedule, booking, typescript, Montana, sunset]

# Dependency graph
requires:
  - phase: 03-admin-scheduling
    provides: Phase 3 planning context for scheduling fixes
provides:
  - Bi-weekly solar schedule table with per-date lastTripHour (1 hour before sunset)
  - Monday exclusion from booking availability (excludedDaysOfWeek: [1])
  - DateSelector calendar copy updated to reflect Tuesday-Sunday operation
affects:
  - src/app/api/availability/route.ts (getTimeSlotsForDate now date-precise)
  - booking calendar UI (Monday cells now disabled)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Bi-weekly solar lookup: dateStr split to month+day, bracket to day 1 or day 16 entry
    - lastTripHour always = sunsetHour - 1 (integer), lastTripMinute always 0
    - excludedDaysOfWeek array in BOOKING_CONFIG drives isDayOfWeekAllowed

key-files:
  created: []
  modified:
    - src/config/solarSchedule.ts
    - src/config/booking.ts
    - src/components/booking/DateSelector.tsx

key-decisions:
  - "getSolarEntry signature changed from (month: number) to (dateStr: string) for date-level precision"
  - "Bi-weekly entries use day 1 (covers days 1-15) and day 16 (covers days 16-31) bracket logic"
  - "lastTripHour is strictly sunsetHour - 1 with lastTripMinute 0 — sunset flight always on the hour, always 1h before sunset"
  - "Monday = day 1 in JS Date.getDay() — confirmed and excluded via excludedDaysOfWeek: [1]"

patterns-established:
  - "Solar lookup: getSolarEntry(dateStr) with bi-weekly day bracket instead of month-only lookup"
  - "Day exclusion: BOOKING_CONFIG.excludedDaysOfWeek drives isDayOfWeekAllowed, which DateSelector checks per cell"

requirements-completed: [SCHED-01, SCHED-02, SCHED-03]

# Metrics
duration: 12min
completed: 2026-03-31
---

# Phase 3 Plan 02: Scheduling Rules Summary

**Bi-weekly Flathead Lake solar table (10 entries, May–Sep) with per-date sunset-minus-1h last trip times, plus Monday booking exclusion across calendar and availability API**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-31T00:00:00Z
- **Completed:** 2026-03-31T00:12:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Replaced 5 monthly SOLAR_TABLE entries with 10 bi-weekly entries (May 1, May 16, Jun 1... Sep 16) covering Flathead Lake 48.0°N 114.2°W NOAA data
- lastTripHour is now strictly sunsetHour - 1 for every entry — June/July last trip is 8:00 PM, May/August is 7:00 PM, September is 6:00 PM
- getSolarEntry(dateStr) replaces getSolarEntry(month) — picks the correct bi-weekly bracket based on day-of-month (< 16 uses day 1 entry, >= 16 uses day 16 entry)
- Monday (day 1) added to BOOKING_CONFIG.excludedDaysOfWeek — isDayOfWeekAllowed returns false for all Monday dates
- DateSelector season notice updated from "Available 7 days a week during season" to "Open Tuesday–Sunday during season"

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand SOLAR_TABLE to bi-weekly entries with computed lastTripHour** - `674c743` (feat)
2. **Task 2: Exclude Mondays from booking availability** - `a0fd9ce` (feat)

**Plan metadata:** _(final docs commit follows)_

## Files Created/Modified
- `src/config/solarSchedule.ts` - SolarEntry interface gains `day` field; SOLAR_TABLE expanded to 10 bi-weekly entries; getSolarEntry changed from month-only to dateStr bracket lookup; all callers updated
- `src/config/booking.ts` - excludedDaysOfWeek changed from [] to [1] to block Mondays
- `src/components/booking/DateSelector.tsx` - Season notice copy changed to "Open Tuesday–Sunday during season"

## Decisions Made
- getSolarEntry signature changed to accept dateStr (YYYY-MM-DD) for date-level precision instead of month number — callers already had dateStr available so no intermediate extraction needed
- Bi-weekly bracket: days 1-15 use the day=1 entry, days 16-31 use the day=16 entry — simple integer comparison, no ambiguity
- lastTripHour is always sunsetHour - 1 as integer, lastTripMinute always 0 — guarantees sunset flight starts on the hour, always at least 1 hour before actual sunset
- Monday exclusion via existing excludedDaysOfWeek mechanism — no new code needed, just adding 1 to the array

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. `npm run lint` reported a config file issue (ESLint 9 flat config migration) but TypeScript (`npx tsc --noEmit`) and functional validation (`npx tsx`) both passed cleanly. Lint issue is pre-existing and unrelated to these changes.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- Solar schedule is now date-precise: booking slots in June/July show 8:00 PM as last trip; May/August show 7:00 PM; September shows 6:00 PM
- Monday cells in the booking calendar are disabled; availability API returns empty slots for Monday dates (isDayOfWeekAllowed returns false, getTimeSlotsForDate is not called for disabled days)
- Phase 3 scheduling work is complete (SCHED-01, SCHED-02, SCHED-03 all satisfied)

---
*Phase: 03-admin-scheduling*
*Completed: 2026-03-31*
