---
phase: quick-260705-ihu
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/app/api/availability/route.ts]
autonomous: true
requirements: [QUICK-260705-ihu]
must_haves:
  truths:
    - "The 4 PM, 5 PM, and 6 PM slots on 2026-07-05 return remaining: 0 and blocked: true from the availability API"
    - "All other 2026-07-05 slots (earlier/later, e.g. sunset) remain bookable"
    - "The change is committed and pushed to origin/main"
  artifacts:
    - path: "src/app/api/availability/route.ts"
      provides: "A '2026-07-05' entry in DATE_BLOCKS blocking hours 16-18"
      contains: "'2026-07-05'"
  key_links:
    - from: "DATE_BLOCKS['2026-07-05']"
      to: "slots.map blockPredicate"
      via: "predicate returns true for hours 16, 17, 18"
      pattern: "h >= 16 && h <= 18"
---

<objective>
Block the 4 PM, 5 PM, and 6 PM trip slots for July 5, 2026 in the availability API, leaving all other slots for that day open. Then push to origin/main.

Purpose: A partial-day operational blackout for July 5 (not a weather closure) — the owner needs those three mid-to-late afternoon slots removed from booking while keeping the rest of the day available.
Output: One-line addition to the DATE_BLOCKS map in the availability route, committed and pushed.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/app/api/availability/route.ts

<interfaces>
<!-- Existing DATE_BLOCKS mechanism in src/app/api/availability/route.ts (~line 77). -->
<!-- Predicate returns true for slots to BLOCK. to24Hour(t) converts "H:MM AM/PM" -> 0-23 hour. -->
<!-- Precedent for a mid-afternoon range block (2026-06-22 blocks 3-5 PM):

    '2026-06-22': (t) => { const h = to24Hour(t); return h !== null && h >= 15 && h <= 17; },

    This is NOT a weather day-wide closure — WEATHER_BLOCKED_DATES is the wrong mechanism.
    slotBlocked drives remaining: 0 and blocked: true in the SlotOut mapping. -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add 2026-07-05 DATE_BLOCKS entry for 4/5/6 PM</name>
  <files>src/app/api/availability/route.ts</files>
  <action>
    In the DATE_BLOCKS record (around line 77-94), add a new entry keyed '2026-07-05'
    that blocks the 4 PM, 5 PM, and 6 PM slots (24-hour hours 16, 17, 18) while leaving
    all other slots open. Follow the exact pattern of the existing '2026-06-22' entry.

    Add after the '2026-07-02' entry:

        // Sat — block 4, 5, 6 PM (keep earlier and sunset slots open)
        '2026-07-05': (t) => { const h = to24Hour(t); return h !== null && h >= 16 && h <= 18; },

    Do NOT touch WEATHER_BLOCKED_DATES or EVENT_DATES — this is a partial-day operational
    block with no notice banner, matching the '2026-06-22' precedent.
  </action>
  <verify>
    <automated>grep -q "'2026-07-05': (t) => { const h = to24Hour(t); return h !== null && h >= 16 && h <= 18; }" src/app/api/availability/route.ts && npx tsc --noEmit -p tsconfig.json</automated>
  </verify>
  <done>DATE_BLOCKS contains a '2026-07-05' predicate returning true only for hours 16-18; TypeScript compiles with no errors.</done>
</task>

<task type="auto">
  <name>Task 2: Commit and push to origin/main</name>
  <files>src/app/api/availability/route.ts</files>
  <action>
    Stage only src/app/api/availability/route.ts and commit with message:

        feat(availability): block 4/5/6 PM slots for Sat Jul 5, 2026

    Then push the current branch (main) to origin:

        git push origin main

    Do not stage unrelated working-tree files (the many untracked scripts/ files and
    .planning/ artifacts must NOT be included in this commit).
  </action>
  <verify>
    <automated>git log -1 --name-only --pretty=format:"%s" | grep -q "block 4/5/6 PM slots for Sat Jul 5" && git status -sb | grep -q "ahead" && echo "check-push" || git rev-parse @{u} >/dev/null 2>&1 && [ "$(git rev-parse HEAD)" = "$(git rev-parse @{u})" ]</automated>
  </verify>
  <done>Commit exists containing only the availability route change; local main is pushed to origin/main (HEAD matches upstream).</done>
</task>

</tasks>

<verification>
- The '2026-07-05' entry in DATE_BLOCKS blocks hours 16, 17, 18 and nothing else.
- No changes to WEATHER_BLOCKED_DATES, EVENT_DATES, or any other file.
- The commit is pushed to origin/main.
</verification>

<success_criteria>
- Availability API for 2026-07-05 marks 4 PM, 5 PM, 6 PM as blocked: true, remaining: 0.
- All other 2026-07-05 slots remain bookable.
- Change committed (single-file) and pushed to origin/main.
</success_criteria>

<output>
After completion, create `.planning/quick/260705-ihu-block-off-4-5-and-6-pm-trips-for-july-5/260705-ihu-SUMMARY.md`
</output>
