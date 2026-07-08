---
phase: quick-260708-hcu
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/admin/bookings/BookingsTable.tsx
autonomous: false
requirements: [QUICK-260708-hcu]
must_haves:
  truths:
    - "Owner can expand any booking row to see its Stripe payment intent ID"
    - "Owner can copy the Stripe PI to clipboard with one click"
    - "Owner can open the Stripe dashboard payment page for a booking via deep link"
    - "Owner can see tip amount, photo/GoPro/combo packages, and observer count per booking"
    - "Zero-value add-ons render quietly; non-zero add-ons render prominently"
    - "Booking reference (uppercased UUID prefix) is visible for each booking"
    - "OTA/mock bookings with null or missing Stripe PI / add_ons do not crash the table"
  artifacts:
    - path: "src/app/admin/bookings/BookingsTable.tsx"
      provides: "Expandable per-row details disclosure with Stripe PI + add-ons"
      contains: "add_ons"
  key_links:
    - from: "src/app/admin/bookings/BookingsTable.tsx"
      to: "Stripe dashboard"
      via: "anchor href to https://dashboard.stripe.com/payments/{pi}"
      pattern: "dashboard\\.stripe\\.com/payments"
    - from: "src/app/admin/bookings/page.tsx"
      to: "BookingsTable"
      via: "select('*') already passes stripe_payment_intent_id + add_ons"
      pattern: "select\\('\\*'\\)"
---

<objective>
Give the business owner at-a-glance access to the Stripe payment intent ID and add-on details (tip, photo/GoPro/combo packages, observer count) for each booking in the admin bookings table — so refunds and customer questions ("did they tip? did they buy pictures? did they have observers?") can be handled without direct database queries.

Purpose: Owner received a refund request quoting booking ref F0C24CF6 and had to query the DB to find the Stripe PI and add-ons. This closes that gap.
Output: An expandable details disclosure per booking row in `BookingsTable.tsx`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md

<interfaces>
<!-- page.tsx already does `select('*')` and passes `displayedBookings` to <BookingsTable>. -->
<!-- All fields below are ALREADY available at runtime — only the TS interface needs extending. -->

Existing (partial) interface in src/app/admin/bookings/BookingsTable.tsx:
```typescript
interface Booking {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  trip_date: string;
  trip_time: string;
  party_size: number;
  total_amount: number;
  status: string;
  notes: string | null;
}
```

Additional bsp_bookings columns available on every row (may be null / missing keys on OTA/older rows — handle defensively):
```typescript
stripe_payment_intent_id: string | null;   // e.g. "pi_3TSh41CIckeksaZb1t2UdJze"; null/mock for OTA-seeded rows
add_ons: {
  tip_amount?: number;
  photo_package?: number;
  gopro_package?: number;
  combo_package?: number;
  observer_count?: number;
  observer_package?: number;   // some rows use observer_package instead of observer_count
} | null;
discount_code: string | null;
discount_amount: number | null;
per_person_rate: number | null;
slot_type: string | null;      // 'earlybird' | 'standard' | 'sunset'
```

Booking reference already rendered in the "ID" column:
```typescript
booking.id.split('-')[0].toUpperCase()   // -> "F0C24CF6"
```

Add-on unit prices (src/config/business.ts BUSINESS_INFO.pricing) — for optional dollar display:
observer: 49, combo: 70, photos: 40, gopro: 40
</interfaces>

Admin dark palette to match: sky-600 primary, slate/gray backgrounds, emerald-500 success, `dark:` variants throughout. Table currently uses `bg-white dark:bg-gray-800`, `text-gray-*`, mono for IDs.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add expandable Stripe PI + add-ons details disclosure to bookings table</name>
  <files>src/app/admin/bookings/BookingsTable.tsx</files>
  <action>
Extend the bookings table so each row can be expanded to reveal payment and add-on details. Single-file change — `page.tsx` already `select('*')` and passes every column through, so NO page.tsx edit is needed.

1. **Extend the `Booking` interface** with the additional (optional/nullable) columns from the interfaces block above: `stripe_payment_intent_id?: string | null`, `add_ons?: Record<string, number> | null` (or a typed shape with all keys optional), `discount_code?: string | null`, `discount_amount?: number | null`, `per_person_rate?: number | null`, `slot_type?: string | null`. Keep all new fields optional so nothing breaks on OTA/older rows.

2. **Add expand state**: `const [expandedId, setExpandedId] = useState<string | null>(null);`. Add a toggle handler that sets `expandedId` to the row id or `null` if already open (accordion-style, one open at a time).

3. **Add a disclosure control per row**: In the existing far-left or the trailing actions cell, add a small chevron button (use `ChevronDown` / `ChevronRight` from `lucide-react`, matching the existing `ArrowUpDown`/`Search` import style) that calls the toggle. Give it an accessible `title`/`aria-label` like "Toggle details". Style with the existing muted gray + hover pattern. Do NOT add six new columns — keep the top-level table row scannable exactly as-is.

4. **Render an expanded details row** when `expandedId === booking.id`: append a second `<tr>` right after the booking's `<tr>` with a single `<td colSpan={9}>` (match the current column count) containing a details panel. Use a subtle nested background (e.g. `bg-gray-50 dark:bg-gray-900/40`) and a responsive grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4`). Panel contents:
   - **Booking Reference**: `booking.id.split('-')[0].toUpperCase()` in bold mono, plus the full `booking.id` in dimmed mono below (small). Label "Booking Reference".
   - **Stripe Payment**: if `stripe_payment_intent_id` is present and looks real (starts with `pi_`), render the PI in selectable `font-mono text-sm`, a click-to-copy button (uses `navigator.clipboard.writeText`, shows a transient "Copied!" state via a small local `copiedId` useState keyed by pi or booking id — reset after ~1.5s with `setTimeout`), and an external-link anchor to `https://dashboard.stripe.com/payments/${stripe_payment_intent_id}` (`target="_blank" rel="noopener noreferrer"`, use `ExternalLink` icon, sky-600 styling). If the PI is null or does not start with `pi_`, render a dimmed "No Stripe payment (OTA / mock)" note instead.
   - **Add-ons**: a compact list of the five add-ons. Normalize observer count as `add_ons?.observer_count ?? add_ons?.observer_package ?? 0`. For each of tip (`tip_amount`, shown as `$N`), photo (`photo_package`), gopro (`gopro_package`), combo (`combo_package`), observers (normalized count): render the label + value. Non-zero values render prominently (normal/bold text, e.g. emerald or default foreground); zero/missing values render dimmed with an em dash `—` (`text-gray-400 dark:text-gray-500`). Guard the whole block against `add_ons` being null (default to `{}`).
   - **Optional context** (nice-to-have, dim styling): `discount_code` + `$discount_amount` if a code is present, `slot_type`, and `per_person_rate` as `$N/person`. Skip any that are null.

5. Keep all existing table behavior (search, sort, past-row opacity, status/complete/cancel buttons) intact. Match the existing 4-space indentation, single-quote imports, and `dark:` palette conventions. Follow the CLAUDE.md GSD note: this file change is happening inside the quick workflow, so no other files should be touched.
  </action>
  <verify>
    <automated>npx tsc --noEmit</automated>
    <automated>npm run lint</automated>
  </verify>
  <done>
`npx tsc --noEmit` and `npm run lint` pass. Each booking row has a working expand/collapse control; expanding shows booking reference, Stripe PI (copyable + Stripe dashboard deep link when present, dimmed OTA note when absent), and all five add-ons with zero-values dimmed. Rows with null `add_ons`/`stripe_payment_intent_id` render without errors.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Expandable per-row details disclosure in the admin bookings table showing the Stripe payment intent ID (click-to-copy + Stripe dashboard deep link), booking reference, and add-on details (tip, photo, GoPro, combo, observer count).</what-built>
  <how-to-verify>
1. Run `npm run dev` and open http://localhost:3000/admin/bookings (log in if prompted).
2. Click the expand chevron on a normal (non-OTA) booking — ideally the one with ref F0C24CF6 if visible.
   - Confirm the Stripe PI shows, "Copy" copies it to clipboard (paste to check), and the Stripe dashboard link opens https://dashboard.stripe.com/payments/{pi} in a new tab.
   - Confirm non-zero add-ons (e.g. a tip or photo package) stand out and zero add-ons show a dimmed em dash.
   - Confirm the booking reference (uppercased UUID prefix) is shown.
3. Expand an OTA-seeded booking (GetYourGuide/Viator, likely null Stripe PI) — confirm it shows the "No Stripe payment (OTA / mock)" note and does not error.
4. Confirm the top-level table is still scannable (no new columns crammed in) and dark-mode styling matches the rest of the admin.
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues.</resume-signal>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes (Booking interface extended, no type errors).
- `npm run lint` passes.
- Expanding a row reveals Stripe PI (copy + deep link), booking ref, and all five add-ons.
- Null `add_ons` / null `stripe_payment_intent_id` rows render without crashing.
- Top-level table column layout unchanged; no six-column bloat.
</verification>

<success_criteria>
The owner can, from /admin/bookings alone and without a database query: find a booking by reference, copy its Stripe PI (or open it directly in the Stripe dashboard), and see whether the customer tipped, bought photo/GoPro/combo packages, or brought observers.
</success_criteria>

<output>
After completion, create `.planning/quick/260708-hcu-show-stripe-payment-intent-id-and-add-on/260708-hcu-SUMMARY.md`
</output>
