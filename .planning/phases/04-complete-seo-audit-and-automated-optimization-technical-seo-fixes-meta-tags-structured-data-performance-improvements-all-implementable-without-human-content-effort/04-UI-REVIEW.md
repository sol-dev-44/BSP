# Site-Wide UI Review — Big Sky Parasail

**Audited:** 2026-07-03
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists for this project)
**Screenshots:** Not captured — no dev server detected on localhost:3000, 5173, or 8080. This is a code-only audit.
**Scope:** Full site — public marketing pages, customer booking flow, chatbot, and admin dashboard (not limited to Phase 04). Requested as a whole-site refinement audit; findings below apply across the codebase, not just Phase 04's SEO work.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Specific, on-brand CTAs and empty/error states throughout; no generic "Submit/Click Here/OK" labels found |
| 2. Visuals | 3/4 | Strong hero focal point and hierarchy, but several icon-only controls lack `aria-label`, and admin nav duplication creates visual inconsistency per-page |
| 3. Color | 3/4 | Consistent, intentional brand palette (orange/gold/cream/brown), but the `@theme` design tokens in `globals.css` are defined and then almost never used (hardcoded hex is the de facto system) |
| 4. Typography | 2/4 | Entire booking/checkout flow (6 files) renders headings in Tailwind's default `font-serif` instead of the brand's Oswald `--font-headline`, breaking brand consistency at the highest-value page |
| 5. Spacing | 4/4 | Spacing classes are drawn from a clean, consistent 4px-based Tailwind scale; arbitrary bracket values are rare and justified (image/video crop heights) |
| 6. Experience Design | 3/4 | Loading/error/empty states and destructive-action confirmations are consistently implemented, but the 7-page admin nav is hand-duplicated with drifting/missing links, and error handling still relies on `alert()` |

**Overall: 19/24**

---

## Top 3 Priority Fixes

1. **Admin navigation is hand-duplicated across 7 pages with drifting, inconsistent link sets** — The business owner loses the ability to reach some admin sections depending on which page they're currently on (e.g. `/admin/bookings` has no link to Discount Codes; `/admin/maintenance`, `/admin/tasks`, and `/admin/calendar` have no link to Notes or Discount Codes). Two different visual conventions are also mixed (`text-slate-500 hover:text-sky-600` with no `dark:` variant vs. `text-sky-600 dark:text-sky-400 hover:underline`). **Fix:** extract a single `AdminNav` component (list: Bookings, Calendar, Tasks, Expenses, Maintenance, Notes, Discount Codes) and render it from one shared admin layout (e.g. `src/app/admin/layout.tsx`) so every page gets the same, complete nav with one consistent style.
   - Evidence: `src/app/admin/bookings/page.tsx:58-73`, `src/app/admin/discount-codes/page.tsx:17-34`, `src/app/admin/expenses/page.tsx:17-...`, `src/app/admin/maintenance/page.tsx:17-26`, `src/app/admin/tasks/page.tsx:18-27`, `src/app/admin/notes/page.tsx:17-29`, `src/app/admin/calendar/page.tsx:28-37`

2. **Booking flow headings render in the wrong font family** — All headings inside the customer checkout flow ("Select a Time", "Your Details", "Booking For", "Order Summary", "Payment Details", "Total", "Booking Confirmed!") use Tailwind's default `font-serif` utility instead of the site's brand headline font (`font-[family-name:var(--font-headline)]` / Oswald), which is used correctly in 45+ other locations across the rest of the site. This is the one page where brand consistency matters most (it's where the sale happens) and it visibly looks like a different site. **Fix:** replace `font-serif` with `font-[family-name:var(--font-headline)]` in the 6 affected files.
   - Evidence: `src/components/booking/BookingForm.tsx:218,265`, `src/components/booking/DateSelector.tsx:106`, `src/components/booking/GuestForm.tsx:59,67,181,238`, `src/components/booking/PaymentForm.tsx:47`, `src/components/booking/PriceBreakdown.tsx:48,143`, `src/components/booking/TimeSlotPicker.tsx:66,75,107,113,127`

3. **Month-navigation chevrons in the date picker have no accessible label** — The prev/next month buttons in the customer-facing date selector (`DateSelector.tsx`, step 1 of the booking flow — the very first interaction a customer makes) and the equivalent buttons in the admin calendar are icon-only with no `aria-label`, `title`, or visible text. A screen reader announces these as unlabeled "button" elements, meaning keyboard/screen-reader users cannot navigate months to find their trip date. **Fix:** add `aria-label="Previous month"` / `aria-label="Next month"` to both button pairs.
   - Evidence: `src/components/booking/DateSelector.tsx:110,113` (customer-facing, live), `src/app/admin/calendar/CalendarClient.tsx:64,68` (admin, live)

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

Copy is specific and contextual throughout, both public and admin surfaces:

- CTAs are action-specific, not generic: "Book Your Flight" (`Hero.tsx:76`), "View Full Gallery" (`ExperienceGallery.tsx:100`), "Follow @bigskyparasail" (`InstagramFeed.tsx:74-79`), "Learn More About Our Location" (`LocationHighlights.tsx:91-94`).
- Grep for generic patterns (`>Submit<`, `>Click Here<`, `>OK<`, `>Cancel<`, `>Save<`) returned zero matches. Buttons that do render the word "Cancel" are scoped and contextual — e.g. `DiscountCodesClient.tsx:118-119` toggles "Cancel" only while an add-form is open, and `CancelBookingButton.tsx:27` is explicitly "Cancel" a specific booking with a confirm() guard first.
- Empty states are specific, not boilerplate: "No images in this category yet" (`GalleryClient.tsx:232`), "No matching questions found. Try a different search term or category." (`FAQ.tsx:227-228`), "No available slots for this date." (`TimeSlotPicker.tsx:91`), "No discount codes yet. Create your first code above." (`DiscountCodesClient.tsx:218`), "No tasks planned for this day yet." (`TasksClient.tsx:273`).
- Error copy is understandable and actionable, e.g. `TimeSlotPicker.tsx:150-160` explains exactly why a slot is unbookable and gives a phone number to call instead of a dead end.

Minor, non-priority nit: the literal string "Please try again." is reused verbatim in 4 unrelated components (`admin/login/page.tsx:35`, `bsp-chat/BSPChatClient.tsx:83`, `book/BookingClient.tsx:230`, `SuppliesModal.tsx:62`). Not a real problem, just an opportunity to make each message slightly more specific to its context if revisited.

### Pillar 2: Visuals (3/4)

**Strengths:** The homepage has an unambiguous focal point (full-bleed video hero with a single primary CTA). Visual hierarchy is established consistently through the Oswald headline font at large sizes + orange/gold accent color + uppercase tracking, e.g. `VesselShowcase.tsx:67-69`, `Testimonials.tsx:123-125`. Section-to-section rhythm alternates background tones (`#FFF8EE` → `#3D1C00` → `#FFEACC` → `#FFF0D6`) to create clear visual breaks without needing dividers.

**Gaps:**
- Icon-only controls without `aria-label`:
  - `src/components/booking/DateSelector.tsx:110,113` — prev/next month chevrons in the live customer date picker (see Top Fix #3).
  - `src/app/admin/calendar/CalendarClient.tsx:64,68` — same pattern in the admin calendar.
  - `src/components/booking/PassengerPicker.tsx:24-40` (`Minus`/`Plus` stepper buttons, no `aria-label`) — note this component is currently unused/dead code (no importers found via `grep -rln "PassengerPicker" src`), so it's not user-facing today, but should either get the aria-labels or be deleted if truly obsolete.
  - Compare against the well-handled pattern elsewhere: `ExperienceGallery.tsx:117,129,159` and `GalleryClient.tsx:253,265` lightbox controls all correctly pair icon buttons with `aria-label`, as does the `Footer.tsx` social icon row (`aria-label` + `title` on every icon link).
- Admin dashboard has no shared chrome/layout — each of the 7 admin pages (`bookings`, `calendar`, `discount-codes`, `expenses`, `maintenance`, `notes`, `tasks`) independently renders its own header, causing visible drift in which links appear and how they're styled (see Top Fix #1). This reads as 7 slightly different mini-apps rather than one dashboard.

### Pillar 3: Color (3/4)

The brand palette (`#FF9500` orange, `#FFD700` gold, `#2D1600` dark brown, `#FFF8EE` cream) is applied consistently and intentionally across all public pages — 296 uses of `#FF9500` and 121 of `#FFD700` across `src/components` + `src/app`, which is high in raw count but expected and appropriate given the site's "Montana '95 throwback" identity spans 60+ files; this isn't accent overuse in the "one card has 15 different accented elements" sense, it's a deliberate saturated brand system used the same way everywhere.

**Real finding:** `src/app/globals.css:1-50` defines a full Material-style design-token system in a Tailwind v4 `@theme` block (`--color-primary`, `--color-secondary`, `--color-surface`, `--color-on-surface`, `--color-outline`, etc.) — but semantic classes like `text-primary`/`bg-primary`/`border-primary` are used **zero times** in the codebase (`grep -rn "text-primary\|bg-primary\|border-primary" src` → 0 hits), and even the simpler surface/foreground tokens (`bg-surface`, `text-on-surface`, `text-foreground`) only appear in 7 of 60+ component files (`page.tsx`, `layout.tsx`, `faq/page.tsx`, `bsp-chat/admin/page.tsx`, `SocialShare.tsx`, `booking/BookingForm.tsx`, `ReviewCTA.tsx`). The other ~1040 color references bypass the token system entirely with raw hex literals (e.g. `bg-[#FF9500]`, `text-[#2D1600]`). This means there are two parallel color systems, one nearly dead. This is consistent with the documented project convention ("Hardcoded hex colors inline" is called out explicitly in `CLAUDE.md`), so it isn't a defect against the current convention — but it is dead weight worth either committing to (migrate to tokens) or deleting (trim the unused `@theme` variables) in a refinement pass.

Secondary, smaller finding: admin nav link colors are inconsistent between pages — `discount-codes/expenses/maintenance/tasks` pages use `text-slate-500 hover:text-sky-600` with **no** `dark:` override, while `bookings/calendar/notes` pages use `text-sky-600 dark:text-sky-400`. Rolls up into the same root cause as Top Fix #1 (no shared nav component).

### Pillar 4: Typography (2/4)

**Real bug:** the entire customer booking/checkout flow uses the wrong font family for headings. `font-serif` (Tailwind's default serif stack, e.g. Georgia/Times) appears 15 times across 6 files in `src/components/booking/`, while the rest of the site (45 occurrences) correctly uses `font-[family-name:var(--font-headline)]` to render Oswald. Concretely, every heading a customer sees while paying — "Select a Time" (`TimeSlotPicker.tsx:66,107,127`), "Your Details" (`GuestForm.tsx:67`), "Booking For" date/time display (`GuestForm.tsx:59`), "Order Summary" / "Total" (`PriceBreakdown.tsx:48,143`), "Payment Details" (`PaymentForm.tsx:47`), month label in the calendar (`DateSelector.tsx:106`), and the final "Booking Confirmed!" screen (`BookingForm.tsx:218,265`) — renders in a mismatched font that doesn't match the Oswald brand voice established on every marketing page. See Top Fix #2 for full file:line list.

Beyond that specific bug, the codebase uses 13 distinct `text-*` size utilities (`text-xs` through `text-9xl`) and 6 distinct font-weight utilities (`font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`, `font-black`) across the whole site. For a single component this would be a flag; across a ~14-page multi-surface site (marketing pages with display type + dense admin tables + a booking form) this level of range is largely justified by genuinely different contexts. The one avoidable inconsistency: `font-bold` and `font-semibold` are used interchangeably for what appears to be the same visual role (card/section sub-headings) in neighboring files — e.g. `GuestForm.tsx:67,181,238` use `font-semibold` for h3 section headers while `PriceBreakdown.tsx:48` and `VesselShowcase.tsx:108` use `font-bold` for the same visual role. Not a priority fix, but worth a pass if doing a broader typography cleanup.

### Pillar 5: Spacing (4/4)

Spacing utilities are drawn from a clean, standard Tailwind numeric scale — the most common values site-wide are `gap-2` (93), `px-4` (78), `p-4` (76), `px-6` (72), `py-2` (51), `p-8` (48), `gap-3` (48), `py-3` (47) — all conventional 4px-increment Tailwind tokens, no odd one-off numbers competing for the same role.

Arbitrary bracket values (`grep -rn "\[.*px\]\|\[.*rem\]"`) appear only 28 times across the whole `src/components` + `src/app` tree, and on inspection nearly all are legitimate uses outside the padding/margin system — image/video crop heights (`VesselShowcase.tsx:87,147`, `LocationHighlights.tsx:57`, `Testimonials.tsx:133`), badge/label micro-text sizing (`TimeSlotPicker.tsx:198,206,229,245`, `ExperienceGallery.tsx:88,91`), and fixed-height containers (`admin/tasks/page.tsx:31`, `bsp-chat/BSPChatClient.tsx`'s `h-[600px]` message pane). No action needed here.

### Pillar 6: Experience Design (3/4)

**Strengths:** State coverage is consistently strong across both public and admin surfaces:
- Loading states: `TimeSlotPicker.tsx:55-61` spinner while slots load, `DiscountCodesClient.tsx:209-214` "Loading discount codes...", RTK Query `isLoading` destructured and rendered in `ExpensesClient.tsx:236`, `TasksClient.tsx:269`, `SuppliesModal.tsx:204`, `MaintenanceClient.tsx:51-52` (tracks both `isLoading` and `isFetching`/`isSaving` separately).
- Empty states: present and specific everywhere data can legitimately be zero (see Pillar 1 examples) — including the booking form's zero-slots case and the admin discount-codes/tasks/notes/supplies tables.
- Destructive-action confirmation: every delete/cancel action gates on `confirm()` first — `CancelBookingButton.tsx:10`, `DiscountCodesClient.tsx:87`, `NotesClient.tsx:100`, `SuppliesModal.tsx:67`, `TasksClient.tsx:108`.
- Disabled states on in-flight actions: `PaymentForm.tsx:63` (`disabled={!stripe || isProcessing || !isReady}`), `CancelBookingButton.tsx:24`/`CompleteBookingButton.tsx:24` (`disabled={isLoading}`), `BookingForm.tsx:295,326` (Continue/Proceed buttons disabled until valid).

**Gaps:**
- The admin nav duplication (Top Fix #1) is as much an Experience Design problem as a Visuals one — it's a genuine navigation defect, not just a style nit. A user on `/admin/bookings` cannot click through to Discount Codes at all; they'd need to already know the URL.
- Client-side error handling still relies on `alert()` for user-facing errors in the booking flow (`BookingForm.tsx:145,149,184,187`, `DiscountCodesClient.tsx:48,74,92`) — this is a known, already-documented pattern in `CLAUDE.md` itself ("a concern"), so it's not a new finding, but it remains the single biggest inconsistency between admin's otherwise-polished inline error UI (e.g. `admin/login/page.tsx:84-88` renders a proper inline error box) and the booking flow's blocking native `alert()` popups at the moment a customer is trying to pay.

---

## Files Audited

**Public marketing:**
`src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `tailwind.config.ts`, `src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/components/Stats.tsx`, `src/components/VesselShowcase.tsx`, `src/components/ExperienceGallery.tsx`, `src/components/Testimonials.tsx`, `src/components/InstagramFeed.tsx`, `src/components/LocationHighlights.tsx`, `src/components/Footer.tsx`, `src/components/ChatCTA.tsx`, `src/components/FAQ.tsx`, `src/components/Features.tsx`

**Public pages:** `src/app/faq/page.tsx`, `src/app/gallery/page.tsx` + `GalleryClient.tsx`, `src/app/services/page.tsx` + `ServicesClient.tsx`, `src/app/location/page.tsx` + `LocationClient.tsx` (metadata only), `src/app/jobs/page.tsx` (metadata only)

**Booking flow:** `src/app/book/BookingClient.tsx` (referenced), `src/components/booking/BookingForm.tsx`, `DateSelector.tsx`, `GuestForm.tsx`, `PassengerPicker.tsx`, `PaymentForm.tsx`, `PriceBreakdown.tsx`, `TimeSlotPicker.tsx`

**Chatbot:** `src/app/bsp-chat/page.tsx`, `src/app/bsp-chat/BSPChatClient.tsx`

**Admin dashboard:** `src/app/admin/page.tsx`, `src/app/admin/login/page.tsx`, `src/app/admin/bookings/page.tsx` + `BookingsTable.tsx`, `src/app/admin/calendar/page.tsx` + `CalendarClient.tsx`, `src/app/admin/discount-codes/page.tsx` + `DiscountCodesClient.tsx`, `src/app/admin/expenses/page.tsx` + `ExpensesClient.tsx` (state-coverage grep only), `src/app/admin/maintenance/page.tsx` + `MaintenanceClient.tsx` (state-coverage grep only), `src/app/admin/notes/page.tsx` + `NotesClient.tsx` (state-coverage grep only), `src/app/admin/tasks/page.tsx` + `TasksClient.tsx` (state-coverage grep only), `src/components/admin/CancelBookingButton.tsx`, `CompleteBookingButton.tsx`, `SuppliesModal.tsx` (state-coverage grep only), `LogoutButton.tsx` (referenced)

**Not read in full (out of budget, sampled via grep only):** `src/components/EmailTemplate.tsx`, `RetroStripes.tsx`, `ReviewCTA.tsx`, `SectionDivider.tsx`, `SocialShare.tsx`, `ThemeToggle.tsx`, `src/app/jobs/JobsClient.tsx`, `src/app/location/LocationClient.tsx`, `src/config/structured-data.tsx`

**Registry audit:** `components.json` not found — shadcn not initialized in this project. Registry safety audit skipped per protocol.
