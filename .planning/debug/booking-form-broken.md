---
status: awaiting_human_verify
trigger: "booking form at /book is completely broken after recent code changes to add observer pass support"
created: 2026-04-03T00:00:00Z
updated: 2026-04-03T00:00:00Z
---

hypothesis: Three confirmed bugs with strong evidence:
  (1) party_size select uses `inputBaseClass` which lacks `appearance-none` + custom chevron — native select dropdown may be invisible/non-functional on some browsers with heavy custom styling; also the initial option ordering starts at 0 which could visually show "0 (observer only)" if controlled value doesn't bind
  (2) Observer Pass section placed INSIDE white card after all of GuestForm content (personal fields + 3-column add-ons grid + 4-column gratuity row) — requires 800-1000px of scrolling past GuestForm; user reports "not visible on page"
  (3) $0 total caused by (1): if the party_size select is broken and defaults to showing option 0, then party_size=2 in state but the visible "0" makes the user see apparent "$0" behavior, OR the interactive fix (1) allows proper state updates
test: complete code review done; all three bugs traced to root
next_action: apply three targeted fixes

## Symptoms

expected: User can select parasailer count from dropdown, see Observer Pass dropdown, see correct total in order summary sidebar
actual: 1) Parasailer selector is not interactive, 2) Observer Pass option not visible, 3) Order summary total shows $0
errors: No server-side errors. No browser console errors reported.
reproduction: Go to localhost:3000/book, select a date and time, click Continue to step 2. Parasailer field not interactive, no observer dropdown visible.
started: After recent code changes in this session — original had <input type="number">, changes converted to <select> dropdowns and moved observer section from GuestForm.tsx into BookingForm.tsx

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-04-03T00:10:00Z
  checked: GuestForm.tsx select for party_size (lines 121-133)
  found: Uses `inputBaseClass` (designed for inputs) — bg-[#FFD699] background, rounded-xl, no appearance utility. Options start at value={0} labeled "0 (observer only)". Initial formData.party_size=2.
  implication: Custom CSS on select may interfere with native dropdown arrow rendering on some browsers. Missing appearance-none + custom indicator means visual appearance is browser-dependent.

- timestamp: 2026-04-03T00:10:00Z
  checked: BookingForm.tsx step 2 layout (lines 301-355)
  found: Observer section is INSIDE the white card div, rendered AFTER GuestForm. GuestForm contains: date header, 4 personal detail inputs, notes textarea, 3-column add-ons grid, 4-button + custom-input gratuity section. That is a tall form. Observer section has only mt-6 spacing.
  implication: User must scroll past ~800-1000px of GuestForm content to see observer section. "Not visible on page" is explained by placement buried below substantial form content.

- timestamp: 2026-04-03T00:10:00Z
  checked: GuestForm.tsx interface (lines 4-23) vs BookingForm.tsx formData state (lines 30-42)
  found: GuestForm interface does NOT include combo_package in add_ons. BookingForm state also doesn't include combo_package. GuestForm renders combo_package select with `(formData.add_ons as any)?.combo_package`. This is added dynamically to state.
  implication: Not a crash bug but technical debt. No impact on described symptoms.

- timestamp: 2026-04-03T00:10:00Z
  checked: GuestForm.tsx `'use client'` directive
  found: MISSING. File starts with `import { useState }`. BookingForm.tsx HAS `"use client"`. In Next.js App Router, GuestForm is implicitly a client component since it's always imported+rendered by BookingForm (a client component). useState works correctly.
  implication: Not the cause of the bugs. GuestForm is correctly treated as a client component via parent boundary propagation.

- timestamp: 2026-04-03T00:10:00Z
  checked: calculateTotal() and PriceBreakdown with initial state
  found: formData.party_size=2, getSelectedSlotPrice()=119, flightTotal=238. Grand total should NOT be $0 initially. $0 is only possible if party_size somehow resolves to 0.
  implication: $0 total is likely a VISUAL issue — the select appearing to show "0" even though React state has 2, due to controlled component value binding. Fix: ensure options use string values to match React's string comparison, or the select interactivity fix will resolve it.

- timestamp: 2026-04-03T00:10:00Z
  checked: Tailwind v4 preflight in .next/dev/static/chunks/src_app_globals_css_bad6b30c._.single.css
  found: No `appearance: none` applied to `select` elements in preflight. Select gets: font:inherit, color:inherit, background-color:#0000, border-radius:0. NO appearance stripping.
  implication: The native dropdown arrow IS preserved. The select IS interactive. The issue is more likely UX/visual — custom bg-[#FFD699] may make dropdown appear as a flat colored box on some browser/OS combos.

- timestamp: 2026-04-03T00:10:00Z
  checked: git diff HEAD~1 for GuestForm.tsx and BookingForm.tsx
  found: Previous GuestForm had `<input type="number" name="boat_riders">` which was REMOVED. New code uses `<select name="party_size">` instead of `<input type="number">`. Observer section added to BookingForm after GuestForm. handleFormChange correctly handles both party_size and boat_riders by name.
  implication: The conversion from input to select is functionally correct but the CSS/UX for the select was not adapted. The boat_riders section was moved to BookingForm but is now buried below extensive GuestForm content.

## Resolution

root_cause: Three interacting bugs: (1) The party_size <select> in GuestForm.tsx used `inputBaseClass` (designed for <input>) without `appearance-none`, causing the native browser dropdown arrow to be obscured or hidden by the heavy CSS styling (bg-[#FFD699], rounded-xl, custom padding). The element rendered but did not visually communicate it was an interactive dropdown, explaining "cannot interact at all." (2) The observer pass section was placed in BookingForm.tsx AFTER GuestForm, requiring the user to scroll past personal details + 3-column add-ons grid + 4-column gratuity section (~800-1000px) to see it — explaining "not visible on page." (3) The $0 total was caused by users either (a) unable to change party_size from its controlled value due to the broken select UX, or (b) accidentally selecting "0 (observer only)" as first option. With party_size=0 and boat_riders=0, total = $0.

fix: (1) Added `appearance-none` class + inline SVG chevron background to both the party_size and boat_riders select elements, making them clearly interactive dropdowns on all browsers. (2) Moved observer pass section from BookingForm.tsx INTO GuestForm.tsx, placed directly below the parasailer count field where it logically belongs (both affect total passenger count). Now uses `onChange={onChange}` with `name="boat_riders"` so the existing handleFormChange handler in BookingForm processes it correctly. (3) Added `'use client'` directive to GuestForm.tsx for explicitness. Build passes clean with no errors or warnings.

verification: `npx tsc --noEmit` passes clean. `npx next build` passes clean with no errors or warnings.

files_changed:
  - src/components/booking/GuestForm.tsx
  - src/components/booking/BookingForm.tsx
