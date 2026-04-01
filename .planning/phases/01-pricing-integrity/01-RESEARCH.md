# Phase 1: Pricing Integrity - Research

**Researched:** 2026-03-31
**Domain:** Pricing data flow across Next.js booking flow (config → client display → Stripe → email → success page)
**Confidence:** HIGH — all findings are from direct source code inspection

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PRICE-01 | Booking flow displays correct per-person price ($99/$119/$159) based on selected time slot type throughout all steps | Steps 1–3 currently have divergent price sources; fix identified |
| PRICE-02 | Stripe payment intent is created with the correct total matching the displayed price | Server-side uses `getSlotPrice` correctly; client display has a separate bug that can show wrong number |
| PRICE-03 | Confirmation email shows correct itemized receipt with accurate per-person rate and slot type label | Email route computes price correctly but does not store `per_person_rate` in DB — success page re-derives it incorrectly |
| PRICE-04 | Success page displays correct itemized receipt matching what was charged | Success page hardcodes `BUSINESS_INFO.pricing.parasail` ($119) regardless of slot type |
</phase_requirements>

---

## Summary

The pricing source of truth is `src/config/solarSchedule.ts` (`getSlotType` + `getSlotPrice`) and `src/config/business.ts` (`BUSINESS_INFO.pricing.*`). These functions are pure and correct. Every server-side route that touches pricing (`/api/create-payment-intent`, `/api/bookings`, `/api/availability`) calls `getSlotType` and `getSlotPrice` correctly, so Stripe is always charged the right amount and the email receipt is always correct. The bugs are entirely in the client-side display layer and the success page.

There are two concrete bugs. First, `GuestForm.tsx` line 43 sets `pricePerPerson = BUSINESS_INFO.pricing.parasail` (hardcoded $119) for the gratuity percentage calculation instead of receiving the slot-based price from its parent. This makes the displayed tip suggestion wrong for early bird and sunset slots. Second and most seriously, `success/page.tsx` line 95 also hardcodes `const perPerson = BUSINESS_INFO.pricing.parasail` ($119) regardless of what slot was booked, so every success page receipt shows wrong per-person math for early bird ($99) and sunset ($159) bookings. The `bsp_bookings` table does not store `per_person_rate` or `slot_type`, so the success page cannot re-derive the correct price from the DB record alone.

The fix strategy is: (1) add `slot_type` and `per_person_rate` columns to `bsp_bookings`, (2) store them during booking creation in `/api/bookings`, (3) read them back on the success page, and (4) pass the slot-based price down to `GuestForm` for tip calculations. No changes to the Stripe charge logic or email logic are needed — those are already correct.

**Primary recommendation:** Store `slot_type` and `per_person_rate` on the booking record at creation time, then use those stored values on the success page instead of re-deriving from the time string.

---

## Project Constraints (from CLAUDE.md)

- Stack: Next.js 16 App Router, Supabase, Stripe, Resend — no new services
- Database: Supabase only — all schema changes go in `supabase/bsp-schema.sql`
- Pricing source of truth: `src/config/business.ts` and `src/config/solarSchedule.ts` — all pricing must derive from these two files
- Admin auth: Cookie-based, no changes needed
- All internal imports use `@/*` path alias (never relative paths)
- 4-space indentation, TypeScript strict mode
- API routes use `try/catch` → `NextResponse.json({ error: '...' }, { status: NNN })`
- Client components: errors via `alert()` in the booking flow
- `console.error('[CONTEXT] ...')` prefix logging in API routes
- No test framework is configured (`nyquist_validation: false` in config.json)

---

## Pricing Data Flow — Complete Trace

### Current Flow (annotated with bugs)

```
SLOT SELECTION (Step 1) — BookingClient.tsx
  BookingClient fetches /api/availability
  /api/availability calls getSlotType(date, time) + getSlotPrice(type) — CORRECT
  Returns { time, remaining, type, price } per slot
  TimeSlotPicker.tsx renders slot.price — CORRECT (derives from solarSchedule)

GUEST DETAILS (Step 2) — BookingClient.tsx + GuestForm.tsx
  BookingClient.getBasePricePerPerson() reads slot.price from availableSlots — CORRECT
  PriceBreakdown receives basePricePerPerson (slot-based) — CORRECT display
  GuestForm.tsx line 43: pricePerPerson = BUSINESS_INFO.pricing.parasail (HARDCODED $119)
    -> BUG A: Tip % buttons calculate against $119 regardless of slot type

PAYMENT INTENT (Step 2→3) — BookingClient.handleProceedToPayment
  POST /api/create-payment-intent with { trip_date, trip_time, party_size, add_ons }
  Server calls getSlotType(trip_date, trip_time) + getSlotPrice(slotType) — CORRECT
  Stripe charged correct amount — CORRECT
  Stores per_person_rate in PI metadata but NOT in Supabase

PAYMENT SCREEN (Step 3)
  PaymentForm receives amount from BookingClient.calculateTotal() — CORRECT (uses slot price)
  Displays "Pay $X.XX" and "Total to pay: $X.XX" — CORRECT

BOOKING CREATION — /api/bookings/route.ts
  Retrieves total_amount from paymentIntent.amount / 100 — CORRECT (what Stripe charged)
  Calls getSlotType + getSlotPrice — CORRECT for email
  Email receipt itemized correctly — CORRECT
  Inserts into bsp_bookings WITHOUT slot_type or per_person_rate columns

SUCCESS PAGE — /book/success/page.tsx
  Reads bsp_bookings row via supabase anon client
  Line 95: const perPerson = BUSINESS_INFO.pricing.parasail  (HARDCODED $119)
    -> BUG B: Shows wrong per-person rate for early bird ($99) and sunset ($159) bookings
  Line 96: flightSubtotal = booking.party_size * perPerson (wrong for non-standard slots)
  Line 160: Rate card shows "$119/person (group)" for all slot types
  total_amount shows correctly (from Stripe actual charge) but line items are wrong
```

### Bug Summary

| Bug | Location | Line(s) | Impact |
|-----|----------|---------|--------|
| BUG A | `src/components/booking/GuestForm.tsx` | 43 | Tip suggestion shows wrong % of $119 for early bird/sunset bookings |
| BUG B | `src/app/book/success/page.tsx` | 95, 96, 160 | Success page line items show wrong per-person rate and flight subtotal for all non-standard slots |

### Root Cause

The `bsp_bookings` table has no `slot_type` or `per_person_rate` columns. The success page fetches the booking row from Supabase but cannot reconstruct the correct per-person price because it only has `trip_time` (stored as `TIME` type in DB, format `HH:MM:SS`) and no slot type. Rather than calling `getSlotType(trip_date, trip_time)` on the success page (which would work), the developer hardcoded $119. The correct fix is to store `slot_type` and `per_person_rate` at booking creation time so the success page can use authoritative stored values.

---

## Standard Stack

### Core (already in project — no new installs needed)

| File | Version | Purpose |
|------|---------|---------|
| `src/config/solarSchedule.ts` | n/a | `getSlotType`, `getSlotPrice` — authoritative pricing logic |
| `src/config/business.ts` | n/a | `BUSINESS_INFO.pricing.*` — add-on prices |
| `src/app/api/create-payment-intent/route.ts` | n/a | Server-side Stripe charge calculation |
| `src/app/api/bookings/route.ts` | n/a | Booking creation + email |
| `src/app/book/success/page.tsx` | n/a | Success page receipt |
| `src/components/booking/GuestForm.tsx` | n/a | Guest details step (tip calculation) |
| `supabase/bsp-schema.sql` | n/a | Schema definition |

No new npm packages are required for this phase.

---

## Architecture Patterns

### Pattern 1: Server-side authoritative price, client display mirrors it

The existing architecture already enforces this correctly for the Stripe charge:
- Server (`/api/create-payment-intent`) calls `getSlotType` + `getSlotPrice` — client cannot manipulate the amount
- Client display should mirror the server calculation, not compute independently

The fix extends this pattern to the success page by storing authoritative values in the DB at booking creation time.

### Pattern 2: Schema additions follow `supabase/bsp-schema.sql`

All schema changes must be documented in `supabase/bsp-schema.sql` as `ALTER TABLE` statements. The Supabase project is cloud-hosted; migrations are applied via the Supabase SQL editor, not auto-run migrations.

### Recommended Schema Addition

```sql
-- Add to bsp-schema.sql as ALTER TABLE statements
ALTER TABLE bsp_bookings
    ADD COLUMN IF NOT EXISTS slot_type TEXT CHECK (slot_type IN ('earlybird', 'standard', 'sunset')),
    ADD COLUMN IF NOT EXISTS per_person_rate NUMERIC(10, 2);
```

### Pattern 3: Success page reads from Supabase with anon client

`success/page.tsx` uses `supabase` (anon client, `src/lib/supabaseClient.ts`) to fetch the booking by `booking_id` query param. This is the existing pattern — no change needed to the fetch mechanism. The fix is to query the two new columns and use them.

### Pattern 4: `BookingDetails` interface must match queried columns

The `BookingDetails` interface at the top of `success/page.tsx` must be extended to include `slot_type` and `per_person_rate` before they can be used in the render.

### Pattern 5: GuestForm receives price via props, not internal constant

`GuestForm.tsx` already receives `selectedDate` and `selectedTime` as props. The correct fix is to also accept a `pricePerPerson` prop (or derive it from `selectedDate`+`selectedTime` via `getSlotType`/`getSlotPrice` which are safe to call in client components). The parent `BookingClient` already has `currentPricePerPerson` computed correctly and passes it to `PriceBreakdown` — the same value should be passed to `GuestForm`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Per-person price from slot | Custom switch/hardcode | `getSlotPrice(getSlotType(date, time))` from `solarSchedule.ts` |
| Add-on prices | Inline numbers | `BUSINESS_INFO.pricing.*` from `business.ts` |
| Slot type label for display | Custom mapping | `slotType === 'earlybird' ? 'Early Bird' : ...` pattern already in `bookings/route.ts` line 153 |

**Key insight:** Every correct implementation in this codebase already uses `getSlotType` + `getSlotPrice`. The two bugs are the only places that deviate from this pattern.

---

## Common Pitfalls

### Pitfall 1: Re-deriving price from trip_time on the success page (without storing slot_type)

**What goes wrong:** The success page could call `getSlotType(booking.trip_date, booking.trip_time)` to re-derive the slot type. This would work today but is fragile: if the pricing tiers or slot boundaries ever change, historical bookings would show the wrong price. Storing `slot_type` and `per_person_rate` at booking creation time creates an immutable receipt.

**How to avoid:** Store `slot_type` and `per_person_rate` in the DB at creation time and read those values on the success page.

### Pitfall 2: The `add_ons` field uses inconsistent key names

**What goes wrong:** The `bsp_bookings.add_ons` JSONB column is written by `/api/bookings` but read back by the success page. The success page uses `observer_package` (line 99) but the bookings route writes `observer_count` from the create-payment-intent metadata (line 115). Looking at `BookingClient.tsx`, `formData.add_ons` uses `observer_package`. The API route in `/api/bookings` receives `add_ons` directly from the form body and stores it in the `add_ons` column — so the key name in the DB matches what `BookingClient` sends.

**Verification needed:** Confirm the key actually stored is `observer_package` (from BookingClient formData) not `observer_count` (from payment intent metadata). The `/api/bookings` route takes `add_ons` from `body.add_ons` which comes from `BookingClient.handlePaymentSuccess` sending `formData.add_ons` — that object uses `observer_package`. The payment intent route uses `observer_count` only for its internal calculation but that doesn't affect the stored JSONB. So the success page reading `observer_package` is correct.

### Pitfall 3: `combo_package` add-on is in `BookingClient` state but absent from success page

**What goes wrong:** `BookingClient.formData.add_ons` includes `combo_package`, and `BookingClient.calculateTotal()` adds `combo_package * BUSINESS_INFO.pricing.combo` to the total. The `BookingDetails` interface in `success/page.tsx` does not include `combo_package` in the `add_ons` type definition (line 20–24). This means `combo_package` is stored in the DB JSONB but not rendered on the success page. This means a customer who bought a media combo sees the correct total but no combo line item in the success receipt.

**Impact for this phase:** The total amount is correct (Stripe charged correctly). The itemized receipt is incomplete. This should be fixed as part of PRICE-04.

### Pitfall 4: `boat_riders` in `BookingForm.tsx` vs `observer_package` in `BookingClient.tsx`

**What goes wrong:** There are TWO booking flow entry points in the codebase:
- `src/components/booking/BookingForm.tsx` — an older version of the booking form that uses `boat_riders` in formData and sends `boat_riders` to the API
- `src/app/book/BookingClient.tsx` — the current production booking flow that uses `add_ons.observer_package`

`BookingForm.tsx` is imported in `BookingClient.tsx`... but wait — checking `BookingClient.tsx`, it does NOT import `BookingForm.tsx`. It directly imports the sub-components (`DateSelector`, `TimeSlotPicker`, `GuestForm`, `PaymentForm`, `PriceBreakdown`). `BookingForm.tsx` appears to be dead code or an alternate implementation that is not currently rendered.

**Action:** Verify `BookingForm.tsx` is not rendered anywhere in production. If it is dead code, leave it alone for this phase. Do not fix bugs in it.

### Pitfall 5: Total shown on success page uses `booking.total_amount` (correct) but line items use hardcoded rate (wrong)

**What goes wrong:** The total shown at the bottom of the success receipt (`booking.total_amount`) is always correct because it comes from `paymentIntent.amount / 100` (the actual Stripe charge). However, the individual line items (`flightSubtotal = party_size * 119`) are wrong for non-standard slots. This means the displayed line items won't add up to the displayed total for early bird and sunset bookings. A customer booked 2 people at $99 would see:
- Flight x 2: $238.00 (wrong — showing $119 * 2)
- Total Paid: $198.00 (correct — actual charge)

This is visually inconsistent and would erode trust.

### Pitfall 6: Supabase schema changes require manual SQL execution

**What goes wrong:** There is no migration runner. Schema changes in `bsp-schema.sql` must be manually applied in the Supabase SQL editor. The plan must include a clear note that these SQL statements must be run before the code changes are deployed.

---

## Code Examples

### Correct price derivation pattern (already used in API routes)

```typescript
// Source: src/app/api/bookings/route.ts lines 112-114
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';

const slotType = getSlotType(trip_date, trip_time || '');
const perPerson = getSlotPrice(slotType);
```

### Schema addition for new columns

```sql
-- Add to supabase/bsp-schema.sql
ALTER TABLE bsp_bookings
    ADD COLUMN IF NOT EXISTS slot_type TEXT CHECK (slot_type IN ('earlybird', 'standard', 'sunset')),
    ADD COLUMN IF NOT EXISTS per_person_rate NUMERIC(10, 2);
```

### Storing slot_type and per_person_rate at booking creation

```typescript
// In src/app/api/bookings/route.ts — extend the existing insert
const slotType = getSlotType(trip_date, trip_time || '');
const perPerson = getSlotPrice(slotType);

await supabase.from('bsp_bookings').insert([{
    // ... existing fields ...
    slot_type: slotType,
    per_person_rate: perPerson,
}]);
```

### Extended BookingDetails interface for success page

```typescript
// In src/app/book/success/page.tsx
interface BookingDetails {
    id: string;
    customer_name: string;
    customer_email: string;
    trip_date: string;
    trip_time: string;
    party_size: number;
    total_amount: number;
    slot_type: 'earlybird' | 'standard' | 'sunset' | null;
    per_person_rate: number | null;
    add_ons: {
        photo_package?: number;
        gopro_package?: number;
        observer_package?: number;
        combo_package?: number;   // add this — currently missing
        tip_amount?: number;
    };
    created_at: string;
}
```

### Corrected success page price calculation

```typescript
// In src/app/book/success/page.tsx — replace the hardcoded line
// OLD (BUG B):
const perPerson = BUSINESS_INFO.pricing.parasail;

// NEW:
const perPerson = booking.per_person_rate ?? BUSINESS_INFO.pricing.parasail;
const slotType = booking.slot_type ?? 'standard';
const slotTypeLabel = slotType === 'earlybird' ? 'Early Bird' : slotType === 'sunset' ? 'Sunset' : 'Standard';
```

### Fixing GuestForm tip calculation (BUG A)

```typescript
// GuestForm.tsx — add pricePerPerson prop
interface GuestFormProps {
    // ... existing props ...
    pricePerPerson: number;   // add this
}

// Then remove:
// const pricePerPerson = BUSINESS_INFO.pricing.parasail; // line 43

// Parent BookingClient passes currentPricePerPerson to GuestForm:
<GuestForm
    // ... existing props ...
    pricePerPerson={currentPricePerPerson}
/>
```

---

## File Change Map

| File | Change Type | What Changes |
|------|------------|--------------|
| `supabase/bsp-schema.sql` | Schema addition | `ALTER TABLE bsp_bookings ADD COLUMN slot_type`, `ADD COLUMN per_person_rate` |
| `src/app/api/bookings/route.ts` | Feature addition | Store `slot_type` and `per_person_rate` in the insert |
| `src/app/book/success/page.tsx` | Bug fix (BUG B) | Use `booking.slot_type`/`booking.per_person_rate`; extend interface; add `combo_package` line item |
| `src/components/booking/GuestForm.tsx` | Bug fix (BUG A) | Accept `pricePerPerson` prop; remove hardcoded $119 |
| `src/app/book/BookingClient.tsx` | Supporting fix | Pass `pricePerPerson={currentPricePerPerson}` to `GuestForm` |

No changes needed to:
- `src/app/api/create-payment-intent/route.ts` (already correct)
- `src/config/solarSchedule.ts` (authoritative source, no bugs)
- `src/config/business.ts` (authoritative source, no bugs)
- `src/components/booking/TimeSlotPicker.tsx` (already correct)
- `src/components/booking/PriceBreakdown.tsx` (already correct)
- `src/components/booking/PaymentForm.tsx` (already correct)

---

## Environment Availability

Step 2.6: SKIPPED — this phase is pure TypeScript code and SQL schema changes. No external tools, CLIs, or services beyond those already running (Supabase, Stripe, Resend) are needed. All are already configured via `.env.local`.

---

## Open Questions

1. **Is `BookingForm.tsx` dead code? CONFIRMED: YES**
   - Grep for `BookingForm` across all `.tsx` files finds zero imports — the component is only referenced inside its own file declaration
   - The planner can safely ignore `BookingForm.tsx`; it is not rendered in production

2. **Do existing bookings in production have `slot_type` / `per_person_rate` as NULL?**
   - What we know: These columns don't exist yet; once added they will be NULL for all historical rows
   - What's unclear: Whether the business owner cares about historical success pages
   - Recommendation: The success page fallback (`?? BUSINESS_INFO.pricing.parasail`) handles NULL gracefully. Historical bookings before this fix will show $119 on the success page (same as today). This is acceptable.

3. **Combo package not in success page — treat as PRICE-04 scope or separate?**
   - What we know: `combo_package` is added to the Stripe charge in `BookingClient.calculateTotal()` and stored in `add_ons` JSONB, but the success page does not show it as a line item
   - Recommendation: Fix in this phase as part of PRICE-04 (success page receipt). The fix is minimal: add `combo_package` to the `BookingDetails` type and add a conditional row.

---

## Validation Architecture

`nyquist_validation: false` in `.planning/config.json` — validation architecture section omitted per configuration.

---

## Sources

### Primary (HIGH confidence — direct source code inspection)
- `src/config/solarSchedule.ts` — authoritative slot type and price logic
- `src/config/business.ts` — add-on prices
- `src/app/api/create-payment-intent/route.ts` — Stripe charge calculation
- `src/app/api/bookings/route.ts` — booking creation and email receipt
- `src/app/book/success/page.tsx` — success page (contains BUG B)
- `src/components/booking/GuestForm.tsx` — guest form (contains BUG A)
- `src/app/book/BookingClient.tsx` — booking flow orchestration
- `src/components/booking/PriceBreakdown.tsx` — price display sidebar
- `src/app/api/availability/route.ts` — slot data with prices
- `supabase/bsp-schema.sql` — DB schema (no `slot_type` or `per_person_rate` columns)

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md` — phase requirements PRICE-01 through PRICE-04
- `.planning/codebase/ARCHITECTURE.md` — architectural patterns confirmed against source

---

## Metadata

**Confidence breakdown:**
- Bug identification: HIGH — confirmed by direct line-by-line code reading
- Fix strategy: HIGH — follows established patterns already present in the codebase
- Schema change approach: HIGH — follows `bsp-schema.sql` conventions
- Combo package gap: HIGH — confirmed by reading `BookingDetails` interface vs. `calculateTotal()`

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (stable domain; prices would have to change for this to go stale)
