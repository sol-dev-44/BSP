# Testing Patterns

**Analysis Date:** 2026-03-31

## Test Framework

**Runner:** None configured

**Assertion Library:** None

**Run Commands:**
```bash
# No test commands exist in package.json scripts
npm run lint    # Only automated quality check available
```

There are zero test files (`.test.*` or `.spec.*`) in this codebase. No Jest, Vitest, Playwright, or Cypress configuration exists. Testing infrastructure has not been set up.

## Test File Organization

**Location:** Not applicable — no tests exist.

**Naming:** Not established.

## What Exists Instead of Tests

The codebase relies on a combination of manual verification and runtime safeguards:

**Type Safety:**
- TypeScript `strict: true` (`tsconfig.json`) catches type errors at compile time
- Typed interfaces for all data models (`src/types/reservations.ts`)
- RTK Query endpoints are fully typed end-to-end

**Lint:**
- `npm run lint` runs ESLint with `eslint-config-next` defaults
- Catches React hook rule violations, unused imports, and basic JS errors

**Runtime Validation:**
- API routes validate required fields manually and return `400` with error messages
- Example in `src/app/api/expenses/route.ts`: explicit checks for `name`, `expense_date`, `amount`, `category`
- Example in `src/app/api/bsp-rag/chat/route.ts`: query length and type validation before calling external APIs

**Development Smoke Testing:**
- `src/app/api/test-email/route.ts` — a one-off manual endpoint for verifying Resend email delivery
- Mock payment intent support (`pi_mock` prefix) in `src/app/api/bookings/route.ts` for testing booking flow without real Stripe

## Mocking

**Framework:** None

**Existing Mock Patterns:**
- Stripe mock: booking route checks `if (payment_intent_id.startsWith('pi_mock'))` and skips real Stripe verification
- No component mocking, no API mocking, no module mocking infrastructure

## Fixtures and Factories

**Test Data:** None — no fixture files or factory functions exist.

## Coverage

**Requirements:** None enforced — no coverage tooling configured.

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present.

## Priority Areas for Adding Tests

If tests are added, these are the highest-value targets given the codebase:

**Critical Business Logic (Unit Tests):**
- `src/config/solarSchedule.ts` — `getSlotType()`, `getSlotPrice()`, `getTimeSlotsForDate()`, `isEarlyBirdSlot()`, `isSunsetSlot()` — pure functions with clear inputs/outputs, perfect for unit testing
- `src/config/business.ts` helper functions: `getFullAddress()`, `getFormattedPhone()`

**API Routes (Integration Tests):**
- `src/app/api/bookings/route.ts` — booking creation, idempotency via Stripe PI ID, email triggering
- `src/app/api/availability/route.ts` — slot conflict detection
- `src/app/api/create-payment-intent/route.ts` — Stripe intent creation and pricing logic

**Recommended Stack (if adding tests):**
```bash
# Install
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event

# Config file: vitest.config.ts
# Test location: co-located *.test.ts / *.test.tsx files
```

**Recommended test file pattern:**
```typescript
// src/config/solarSchedule.test.ts
import { describe, it, expect } from 'vitest'
import { getSlotType, getSlotPrice, getTimeSlotsForDate } from './solarSchedule'

describe('getSlotType', () => {
  it('returns earlybird for 9:00 AM slot', () => {
    expect(getSlotType('2026-07-15', '9:00 AM')).toBe('earlybird')
  })

  it('returns standard for midday slot', () => {
    expect(getSlotType('2026-07-15', '1:00 PM')).toBe('standard')
  })

  it('returns sunset for last slot of day', () => {
    expect(getSlotType('2026-07-15', '7:00 PM')).toBe('sunset')
  })
})
```

---

*Testing analysis: 2026-03-31*
