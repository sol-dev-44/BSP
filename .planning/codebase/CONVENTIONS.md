# Coding Conventions

**Analysis Date:** 2026-03-31

## Naming Patterns

**Files:**
- React components: PascalCase matching the export name (`Navbar.tsx`, `BookingForm.tsx`, `TasksClient.tsx`)
- API routes: always named `route.ts` inside Next.js App Router directories
- Config modules: camelCase noun (`business.ts`, `solarSchedule.ts`, `booking.ts`)
- API client slices: camelCase with `Api` suffix (`reservationsApi.ts`, `expensesApi.ts`)
- Server action files: `actions.ts` at the feature directory level

**Directories:**
- Feature pages: kebab-case (`bsp-chat/`, `bsp-rag/`)
- Component sub-groups: lowercase noun (`booking/`, `admin/`)
- Top-level source dirs: short nouns (`app/`, `components/`, `lib/`, `config/`, `types/`)

**Functions and Variables:**
- Event handlers: `handle` prefix + PascalCase noun+verb (`handleDateSelect`, `handleAddTodo`, `handleProceedToPayment`)
- Boolean state/flags: `is`/`has` prefix (`isLoading`, `isOpen`, `isAdding`, `isFormValid`)
- Derived/computed values: descriptive nouns (`processedExpenses`, `availableSlots`, `displayTotal`)
- Helper functions in config files: `get`/`format`/`generate` prefix (`getFullAddress`, `formatTime`, `generatePageMetadata`)
- Named constants: SCREAMING_SNAKE_CASE (`BUSINESS_INFO`, `BOOKING_CONFIG`, `SOLAR_TABLE`, `BASE_METADATA`)

**Types and Interfaces:**
- Interfaces: PascalCase (`BookingFormProps`, `SolarEntry`, `RetrievedDoc`)
- Type aliases: PascalCase (`BookingStatus`, `RootState`, `AppDispatch`)
- Interface props suffix: `Props` (`BookingFormProps`, `PaymentFormProps`)
- RTK Query slice interfaces co-located in the API file (`Expense` in `expensesApi.ts`)

## Code Style

**Formatting:**
- No Prettier config file present — formatting is applied manually or via editor settings
- Single quotes for imports in most files; double quotes in some config/layout files (inconsistent)
- Trailing commas present in objects and arrays
- 4-space indentation throughout (no 2-space)
- Semicolons used consistently

**Linting:**
- ESLint v9 with `eslint-config-next` (Next.js defaults)
- No custom `.eslintrc` — uses Next.js built-in ruleset
- `npm run lint` runs ESLint

**TypeScript:**
- `strict: true` in `tsconfig.json`
- Non-null assertions (`!`) used for env vars: `process.env.NEXT_PUBLIC_SUPABASE_URL!`
- `as any` used sparingly to bypass Stripe API version type constraint
- `error: unknown` caught and narrowed via `instanceof Error` check in newer routes
- `error: any` used in older routes for direct `.message` access

## Import Organization

**Order (not enforced by tooling, but observed pattern):**
1. React and framework imports (`'use client'` directive first, then React/Next.js)
2. Third-party libraries (`framer-motion`, `lucide-react`, `date-fns`, `@stripe/...`)
3. Internal `@/lib/` and `@/types/` imports
4. Internal `@/config/` imports
5. Internal `@/components/` imports (sub-components last)

**Path Aliases:**
- `@/*` maps to `./src/*` — use this for all internal imports
- Example: `import { BUSINESS_INFO } from '@/config/business'`
- Never use relative paths like `../../config/business`

## Client vs Server Directives

**`'use client'` directive:**
- Required at top of any component using hooks (`useState`, `useEffect`, `useRef`), browser APIs, or event handlers
- Components in `src/components/` that are interactive all declare `'use client'`
- Named `*Client.tsx` suffix used for interactive page-level components (`TasksClient.tsx`, `ExpensesClient.tsx`)

**`'use server'` directive:**
- Used in `src/app/admin/actions.ts` for Next.js Server Actions
- API routes in `src/app/api/` do NOT need this — they are server-only by default

**Server Components (no directive):**
- Page files (`page.tsx`) that only compose components or fetch metadata are server components
- Pattern: `page.tsx` renders the `*Client.tsx` wrapper, which holds all state

## Error Handling

**API Routes:**
- Wrap entire handler body in `try/catch`
- Return `NextResponse.json({ error: '...' }, { status: NNN })` for errors
- `console.error('context:', error)` before returning error response
- Supabase errors checked via `if (error)` after destructuring: `const { data, error } = await supabase...`
- Throw on non-recoverable Supabase errors: `throw new Error('Failed to save booking')`

**Client Components:**
- Async operations wrapped in `try/catch`
- Errors logged with `console.error('description', err)`
- User-facing errors use `alert()` (booking flow) or silent state reset (admin tools)
- RTK Query mutations use `.unwrap()` to propagate errors to the catch block

**Server Actions (`actions.ts`):**
- Return `{ success: boolean, error?: string }` objects — never throw
- Example: `return { success: false, error: error.message }`

**Error narrowing:**
- Newer code: `catch (error: unknown) { const message = error instanceof Error ? error.message : 'Unknown' }`
- Older code: `catch (error: any) { ... error.message ... }`

## Logging

**Framework:** Native `console` (no logging library)

**Patterns:**
- Prefixed namespace brackets in API routes: `console.log('[EMAIL] ...')`, `console.log('[BSP RAG] ...')`
- `console.error('context:', error)` at every caught exception in API routes
- `console.warn()` for degraded-but-functional paths (mock Stripe payment intents)
- `console.log()` for operational info (email recipients, document counts, query strings)
- Client components use `console.error` only — no `console.log` in UI layer

## Comments

**When to Comment:**
- Module-level JSDoc blocks on config/utility files (`solarSchedule.ts` has full JSDoc)
- Inline section headers for long function bodies: `// 1. Validate Payment Intent`, `// 2. Insert into Supabase`
- `// BSP color palette:` style comments in UI components noting design system colors
- Avoid comments that restate the code; prefer comments explaining *why*

**JSDoc:**
- Used in `src/config/solarSchedule.ts` for all exported functions
- Not consistently used elsewhere — only add JSDoc for utility/config functions

## Function Design

**Size:** Large monolithic functions are present (booking route ~286 lines, BookingForm ~353 lines). No hard limits enforced.

**Parameters:**
- Props interfaces always defined for React components: `interface BookingFormProps { className?: string }`
- Destructured at parameter site: `export default function BookingForm({ className }: BookingFormProps)`
- API handlers receive `request: Request` or `req: NextRequest`

**Return Values:**
- API routes always return `NextResponse.json(...)` or `Response.json(...)` (not raw objects)
- Helper functions return primitives or plain objects (never `NextResponse`)
- Server actions return `{ success: boolean, error?: string }`

## Module Design

**Exports:**
- Components: `export function ComponentName()` (named) or `export default function ComponentName()` (default)
- Named exports preferred for shared components (`export function Navbar()`, `export function Hero()`)
- Default exports used for page-level Client components (`export default function TasksClient()`)
- Config: `export const BUSINESS_INFO = {...}` plus named helper functions

**Barrel Files:**
- Not used — imports always point directly to the source file

## Tailwind CSS Conventions

**Approach:**
- Utility-first Tailwind v4 with no component abstractions
- Hardcoded hex colors inline: `bg-[#FF9500]`, `text-[#2D1600]`, `border-[#FFD700]/20`
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` used extensively
- Dark mode: `dark:` variant used for admin pages (sky/slate palette); public pages are light-only
- Brand palette: `#FF9500` (orange primary), `#FFD700` (gold accent), `#2D1600` (dark brown), `#FFF8EE` (cream surface)
- Admin palette: `sky-600` primary, `slate-*` backgrounds, `emerald-500` success

---

*Convention analysis: 2026-03-31*
