# Requirements: Big Sky Parasail — Milestone 2

**Defined:** 2026-03-31
**Core Value:** Customers book and pay for the correct flight at the correct price, and the business owner sees accurate revenue and booking data.

## v1 Requirements

### Pricing

- [ ] **PRICE-01**: Booking flow displays correct per-person price ($99/$119/$159) based on selected time slot type throughout all steps
- [ ] **PRICE-02**: Stripe payment intent is created with the correct total matching the displayed price
- [ ] **PRICE-03**: Confirmation email shows correct itemized receipt with accurate per-person rate and slot type label
- [ ] **PRICE-04**: Success page displays correct itemized receipt matching what was charged

### Discount Codes

- [ ] **DISC-01**: Admin can create a discount code with a name and fixed dollar amount
- [ ] **DISC-02**: Admin can edit an existing discount code's name and amount
- [ ] **DISC-03**: Admin can delete a discount code, making it immediately invalid for future bookings
- [ ] **DISC-04**: Customer can enter a discount code during booking and see the total reduced by the code's dollar amount
- [ ] **DISC-05**: Booking API validates the discount code exists and is active before applying the discount
- [ ] **DISC-06**: Discount amount is stored on the booking record and reflected in confirmation email and success page

### Admin Panel

- [ ] **ADMIN-01**: Remove all Twilio/SMS balance and usage references from admin dashboard
- [ ] **ADMIN-02**: Add Resend email usage/monitoring widget if Resend API supports it
- [ ] **ADMIN-03**: When a booking is cancelled, revenue totals and booking counts update correctly in the dashboard

### Scheduling

- [ ] **SCHED-01**: Sunset flights are scheduled to start minimum 1 hour before actual sunset time for the given date in Montana
- [ ] **SCHED-02**: Sunset flight times vary throughout the season (May-September) based on real sunset data
- [ ] **SCHED-03**: Mondays are excluded from booking availability across all flight types

## v2 Requirements

### Discount Codes (Future)

- **DISC-F01**: Percentage-based discount codes
- **DISC-F02**: Per-person discount codes
- **DISC-F03**: Usage limits per code (max redemptions)
- **DISC-F04**: Expiration dates on codes

### Notifications (Future)

- **NOTIF-F01**: SMS booking confirmations via Twilio or similar
- **NOTIF-F02**: Automated day-before reminder emails

## Out of Scope

| Feature | Reason |
|---------|--------|
| Percentage/per-person discounts | User wants simplicity — fixed dollar only for now |
| Code usage limits | User preference — just active or deleted |
| Code expiration dates | User preference — keep it simple |
| SMS notifications | Removed Twilio, not needed currently |
| Booking flow redesign | Only fixing price consistency, not UX changes |
| New payment providers | Stripe only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PRICE-01 | — | Pending |
| PRICE-02 | — | Pending |
| PRICE-03 | — | Pending |
| PRICE-04 | — | Pending |
| DISC-01 | — | Pending |
| DISC-02 | — | Pending |
| DISC-03 | — | Pending |
| DISC-04 | — | Pending |
| DISC-05 | — | Pending |
| DISC-06 | — | Pending |
| ADMIN-01 | — | Pending |
| ADMIN-02 | — | Pending |
| ADMIN-03 | — | Pending |
| SCHED-01 | — | Pending |
| SCHED-02 | — | Pending |
| SCHED-03 | — | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 0
- Unmapped: 16

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-03-31 after initial definition*
