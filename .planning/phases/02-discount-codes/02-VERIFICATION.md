---
phase: 02-discount-codes
verified: 2026-04-01T10:51:58Z
status: gaps_found
score: 4/5 success criteria verified
re_verification: false
gaps:
  - truth: "The discount amount appears in the confirmation email and success page alongside the itemized receipt"
    status: failed
    reason: "BookingClient.tsx does not pass discount_code or discount_amount to the /api/bookings POST request. The bookings route reads these from the request body and stores them in bsp_bookings, but the client never sends them. As a result, bsp_bookings.discount_code is always null and discount_amount is always 0 for real bookings. The email and success page conditionally display discount lines only when discount_amount > 0 — so neither will ever show the discount line, and the confirmation email will be missing the discount row even when a code was applied."
    artifacts:
      - path: "src/app/book/BookingClient.tsx"
        issue: "handlePaymentSuccess (lines 228-254) POSTs to /api/bookings without discount_code or discount_amount in the body. Only ...formData, trip_date, trip_time, payment_intent_id, party_size, add_ons are included. The discountCode and discountAmount state variables are never forwarded."
    missing:
      - "Add discount_code: discountCode || null and discount_amount: discountAmount || 0 to the JSON body in handlePaymentSuccess when posting to /api/bookings"
human_verification:
  - test: "End-to-end booking with discount code"
    expected: "After fix: success page shows green 'Discount (CODE)' line item; confirmation email includes the discount row; Supabase bsp_bookings record has non-null discount_code and non-zero discount_amount"
    why_human: "Requires live Stripe test card payment and live Supabase DB — cannot verify programmatically without running the full booking flow"
---

# Phase 2: Discount Codes Verification Report

**Phase Goal:** Admin can create, edit, and delete fixed-dollar discount codes; customers can apply a valid code during booking to reduce their total
**Verified:** 2026-04-01T10:51:58Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Admin can create a discount code with a name and dollar amount, and it appears in the admin list | VERIFIED | DiscountCodesClient.tsx has full create form; discountCodesApi POST wired; /api/discount-codes route inserts to bsp_discount_codes |
| 2 | Admin can edit an existing code's name and amount, and the change takes effect immediately | VERIFIED | Inline edit in DiscountCodesClient with handleEditSave calling updateDiscountCode; PATCH route updates record and invalidates RTK cache |
| 3 | Admin can delete a code, and deleted codes are rejected when a customer tries to use them | VERIFIED | handleDelete calls deleteDiscountCode; DELETE route hard-deletes from DB; validate endpoint checks is_active and existence |
| 4 | Customer can enter a discount code during booking and see the total price reduced by the code's dollar amount | VERIFIED | Discount input UI in step 2 of BookingClient; handleApplyDiscount validates via /api/discount-codes/validate; discountAmount subtracted in calculateTotal; PriceBreakdown shows green discount row |
| 5 | The discount amount appears in the confirmation email and success page alongside the itemized receipt | FAILED | BookingClient.handlePaymentSuccess does not include discount_code or discount_amount in the /api/bookings request body — the columns are always stored as null/0, so the conditional display logic in both success page and email never triggers |

**Score:** 4/5 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `supabase/bsp-schema.sql` | CREATE TABLE bsp_discount_codes and ALTER bsp_bookings with discount columns | VERIFIED | Lines 203-222: full CREATE TABLE, RLS policy, indexes, ALTER TABLE adding discount_code and discount_amount |
| `src/lib/api/discountCodesApi.ts` | RTK Query slice with 4 CRUD hooks | VERIFIED | Full implementation with DiscountCode interface, all 4 endpoints, all 4 hooks exported |
| `src/lib/store.ts` | discountCodesApi registered in Redux store | VERIFIED | Imported, registered in reducer and middleware chain |
| `src/app/api/discount-codes/route.ts` | GET and POST handlers using supabaseAdmin | VERIFIED | Both handlers present with validation, normalization (uppercase), Supabase insert, duplicate code handling |
| `src/app/api/discount-codes/[id]/route.ts` | PATCH and DELETE handlers | VERIFIED | PATCH supports code_name/amount/is_active updates with updated_at; DELETE removes record |
| `src/app/admin/discount-codes/DiscountCodesClient.tsx` | Admin UI with list, add form, inline edit, delete, status toggle | VERIFIED | Full implementation: add form, inline edit, active/inactive toggle, delete with confirm |
| `src/app/admin/discount-codes/page.tsx` | Server component wrapper with nav | VERIFIED | force-dynamic, nav links, renders DiscountCodesClient |
| `src/app/api/discount-codes/validate/route.ts` | POST endpoint that validates active code | VERIFIED | Queries bsp_discount_codes, handles not-found and inactive cases, returns valid/invalid JSON |
| `src/app/api/create-payment-intent/route.ts` | Accepts discount_code and deducts from Stripe amount | VERIFIED | Reads discount_code, queries DB, applies Math.max(0, amount - discount), stores in Stripe metadata |
| `src/app/book/BookingClient.tsx` | Discount state, validate handler, passes to payment intent and PriceBreakdown | PARTIAL | discount_code is passed to create-payment-intent; PriceBreakdown receives discountAmount/discountCode props; but discount_code/discount_amount are NOT forwarded in handlePaymentSuccess to /api/bookings |
| `src/components/booking/PriceBreakdown.tsx` | Discount line item display when discountAmount > 0 | VERIFIED | discountAmount and discountCode props added; conditional green discount row renders correctly; grandTotal subtracts discountAmount |
| `src/app/api/bookings/route.ts` | Booking insert includes discount_code and discount_amount | PARTIAL | Route destructures and inserts discount fields correctly, but receives null/undefined from client because BookingClient does not send them |
| `src/app/book/success/page.tsx` | BookingDetails extended with discount fields; discount line item in receipt | PARTIAL | Interface has discount_code and discount_amount fields; conditional render at line 221-225 is correct; but the data fetched from DB will always have null/0 because the booking was saved without discount data |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| DiscountCodesClient.tsx | discountCodesApi.ts | useGetDiscountCodesQuery import | WIRED | Line 6 imports hook; line 13 uses it |
| discountCodesApi.ts | /api/discount-codes | fetchBaseQuery baseUrl /api | WIRED | baseUrl is '/api', endpoint path is 'discount-codes' |
| /api/discount-codes/route.ts | bsp_discount_codes | supabaseAdmin.from('bsp_discount_codes') | WIRED | Lines 6-9 (GET) and 38-42 (POST) query the table |
| validate/route.ts | bsp_discount_codes | supabaseAdmin.from('bsp_discount_codes').select | WIRED | Line 18-22 queries by code_name with is_active check |
| create-payment-intent/route.ts | stripe.paymentIntents.create | amount after discount deduction | WIRED | Lines 53-73 apply discount; line 77 creates PaymentIntent with discounted amount |
| BookingClient.tsx | /api/discount-codes/validate | fetch POST in handleApplyDiscount | WIRED | Line 170 fetches validate endpoint |
| BookingClient.tsx | /api/create-payment-intent | fetch POST with discount_code body | WIRED | Line 210: discount_code: discountCode passed in body |
| BookingClient.tsx | /api/bookings | fetch POST in handlePaymentSuccess with discount fields | NOT WIRED | Lines 230-241: discount_code and discount_amount absent from request body — the gap |
| BookingClient.tsx | PriceBreakdown.tsx | discountAmount and discountCode props | WIRED | Lines 507-508 and 560-561 pass both props |
| /api/bookings/route.ts | bsp_bookings | supabase insert with discount_code and discount_amount | WIRED (server side only) | Lines 96-97: insert correctly includes the fields, but receives undefined values from client |

---

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| DiscountCodesClient.tsx | codes (discount code list) | useGetDiscountCodesQuery -> /api/discount-codes -> supabaseAdmin.from('bsp_discount_codes').select('*') | Yes — full DB query | FLOWING |
| success/page.tsx | booking.discount_amount | supabase.from('bsp_bookings').select('*').eq('id', bookingId) | Structurally correct, but discount_amount always stored as 0 due to gap in BookingClient | HOLLOW — data disconnected at write path |
| success/page.tsx | booking.discount_code | same as above | Same issue — always null | HOLLOW — data disconnected at write path |
| confirmation email (in bookings/route.ts) | discountTotal | discount_amount from request body | Always 0 because BookingClient does not send discount_amount | HOLLOW — receives undefined, defaults to 0 |

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| discountCodesApi exports all 4 hooks | node -e "const m = require('./src/lib/api/discountCodesApi'); console.log(Object.keys(m))" | N/A (TS module, build verified) | PASS (build: 0 errors) |
| validate endpoint file exists and has correct structure | grep "valid: true" src/app/api/discount-codes/validate/route.ts | Line 38: returns {valid: true, code_name, amount} | PASS |
| create-payment-intent discounts the amount | grep "Math.max(0" src/app/api/create-payment-intent/route.ts | Line 71: amount = Math.max(0, amount - discountAmount) | PASS |
| bookings API is missing discount fields from client | grep -n "discount" src/app/book/BookingClient.tsx (handlePaymentSuccess block lines 228-254) | discount_code/discount_amount absent from POST body | FAIL |
| Build compiles without errors | npm run build | Compiled successfully in 3.2s, 29/29 static pages | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| DISC-01 | 02-01, 02-02 | Admin can create a discount code with name and fixed dollar amount | SATISFIED | POST /api/discount-codes inserts to bsp_discount_codes; admin create form in DiscountCodesClient |
| DISC-02 | 02-02 | Admin can edit an existing discount code's name and amount | SATISFIED | PATCH /api/discount-codes/[id] handles name/amount/is_active updates; inline edit in UI |
| DISC-03 | 02-02 | Admin can delete a discount code, making it immediately invalid | SATISFIED | DELETE /api/discount-codes/[id] removes from DB; validate endpoint rejects unknown codes |
| DISC-04 | 02-03, 02-04 | Customer can enter a discount code during booking and see total reduced | SATISFIED | Discount input UI, validate fetch, calculateTotal subtracts discountAmount, PriceBreakdown shows line item, Stripe charge is reduced |
| DISC-05 | 02-03, 02-05 | Booking API validates the discount code exists and is active before applying the discount | SATISFIED | create-payment-intent queries bsp_discount_codes and only applies discount if is_active; validate endpoint enforces same rules |
| DISC-06 | 02-05 | Discount amount is stored on the booking record and reflected in confirmation email and success page | BLOCKED | bookings/route.ts correctly inserts discount fields, but BookingClient.handlePaymentSuccess does not send discount_code or discount_amount in the request body. DB columns are always null/0. Email and success page display logic is correct but never activates. |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/app/book/BookingClient.tsx | 228-241 | handlePaymentSuccess body missing discount_code and discount_amount | Blocker | DISC-06 fails entirely — discount is never stored, never shown in email, never shown on success page |

---

## Human Verification Required

### 1. Full Booking Flow with Discount Code (after gap fix)

**Test:** Create a discount code "TEST10" ($10) in /admin/discount-codes. Go to /book, reach step 2, enter "TEST10", click Apply. Verify green confirmation appears. Click Proceed to Payment, complete with Stripe test card 4242424242424242. Check the success page.

**Expected:**
- Success page shows green "Discount (TEST10)" line at -$10.00
- Total Paid equals (base price + add-ons - $10.00)
- Confirmation email received at customer address shows the same discount row
- In Supabase table editor, bsp_bookings row for that booking has discount_code = "TEST10" and discount_amount = 10

**Why human:** Requires live Stripe test payment, live Supabase DB, and email delivery to verify end-to-end

### 2. Deleted Code Rejection

**Test:** Create a code "TESTDEL" ($5) in admin, then delete it. In the booking form step 2, enter "TESTDEL" and click Apply.

**Expected:** Red error message "Invalid discount code" appears

**Why human:** Requires live DB interaction and visual feedback verification

### 3. Admin Discount Codes Page Responsiveness

**Test:** Visit /admin/discount-codes in a browser. Create, edit, and delete a code.

**Expected:** All mutations immediately refresh the list without page reload (RTK Query cache invalidation working), badges toggle correctly, table is readable on mobile

**Why human:** Visual appearance and real-time behavior cannot be verified programmatically

---

## Gaps Summary

One critical gap blocks DISC-06 (the final success criterion): `BookingClient.tsx` handles payment success without forwarding the discount data to the booking record creation API.

**Root cause:** `handlePaymentSuccess` at line 228 spreads `...formData` (customer/trip fields) and adds trip/payment fields explicitly, but `discountCode` and `discountAmount` are separate state variables that were never included in this payload. The oversight is localized to two missing lines in one function.

**Consequence chain:**
1. Booking saved with `discount_code = null`, `discount_amount = 0`
2. `/api/bookings/route.ts` email builder: `discountTotal = discount_amount || 0` evaluates to `0` — discount row never appended to email HTML
3. `success/page.tsx`: fetches from DB and gets `discount_amount = null` — `discountAmount = 0` — discount row never rendered

**The Stripe PaymentIntent itself is correctly discounted** (Math.max applied in create-payment-intent), so the customer is charged the correct discounted amount. Only the receipt display and the DB record are affected.

**Fix:** Add two lines to `handlePaymentSuccess` in `src/app/book/BookingClient.tsx`:
```typescript
discount_code: discountCode || null,
discount_amount: discountAmount || 0,
```
These should be added inside the `JSON.stringify({...})` body at lines 233-240.

---

_Verified: 2026-04-01T10:51:58Z_
_Verifier: Claude (gsd-verifier)_
