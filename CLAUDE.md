<!-- GSD:project-start source:PROJECT.md -->
## Project

**Big Sky Parasail — Milestone 2**

Big Sky Parasail's customer-facing booking site and admin dashboard, built on Next.js 16 with Supabase, Stripe, and Resend. This milestone focuses on fixing pricing consistency, adding discount codes, cleaning up the admin panel, fixing cancellation revenue tracking, and tuning the sunset flight schedule.

**Core Value:** Customers book and pay for the correct flight at the correct price, and the business owner sees accurate revenue and booking data in the admin dashboard.

### Constraints

- **Stack**: Next.js 16 App Router, Supabase, Stripe, Resend — no new services
- **Database**: Supabase — discount codes need a new table (bsp_discount_codes)
- **Pricing source of truth**: `src/config/business.ts` and `src/config/solarSchedule.ts` — all pricing must derive from these
- **Admin auth**: Cookie-based, no changes needed
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - All application code in `src/`
- SQL - Database schema in `supabase/bsp-schema.sql`
- CSS - Global styles in `src/app/globals.css`
## Runtime
- Node.js (version not pinned — no `.nvmrc` or `.node-version`)
- npm
- Lockfile: `package-lock.json` present (lockfileVersion 3)
## Frameworks
- Next.js 16.1.1 - Full-stack React framework (App Router), handles routing, API routes, SSR/SSG
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering
- Tailwind CSS 4.x - Utility-first CSS framework
- `@tailwindcss/postcss` 4.x - PostCSS integration
- Config: `tailwind.config.ts` (dark mode via `class`, content paths cover `src/`)
- PostCSS config: `postcss.config.mjs`
- Framer Motion 12.x - UI animations throughout components
- Redux Toolkit 2.x (`@reduxjs/toolkit`) - Global state and API caching
- React Redux 9.x - React bindings
- RTK Query - API data fetching layer, configured in `src/lib/store.ts`
- RTK Query slices: `reservationsApi`, `todosApi`, `expensesApi`, `maintenanceApi`, `suppliesApi` in `src/lib/api/`
- next-themes 0.4.x - Dark/light mode toggle; app forced to dark mode in `src/app/providers.tsx`
- Google Fonts via `next/font/google`: Oswald (headlines, `--font-headline`), Inter (body, `--font-body`)
- Not detected — no test framework configured
- `next dev` - Development server
- `next build` - Production build
- `next start` - Production server
- ESLint 9.x with `eslint-config-next` - Linting (`npm run lint`)
## Key Dependencies
- `stripe` 20.x + `@stripe/react-stripe-js` 5.x + `@stripe/stripe-js` 8.x — Payment processing; server-side payment intent creation and client-side Elements
- `@supabase/supabase-js` 2.x — Database client; two clients (anon + service role) in `src/lib/supabaseClient.ts` and `src/lib/supabaseAdmin.ts`
- `openai` 6.x — Embeddings generation (`text-embedding-3-small`) for RAG chatbot
- `@anthropic-ai/sdk` 0.78.x — LLM inference (`claude-sonnet-4-20250514`) for chatbot responses
- `resend` 6.x — Transactional email (booking confirmations, admin notifications)
- `date-fns` 4.x — Date formatting and manipulation in booking flows
- `lucide-react` 0.562.x — Icon library
- `react-markdown` 10.x — Renders chatbot markdown responses
- `pdf-parse-fork` 1.2.x — PDF text extraction for RAG document uploads
## Configuration
- `.env.local` file present (contents not read)
- Required variables referenced in code:
- `next.config.ts` — Configures remote image domain (`qcohcaavhwujvagmpbdp.supabase.co`), `/reservations` → `/book` redirect
- `tsconfig.json` — Strict mode, `@/*` path alias maps to `./src/*`, target ES2017
## Platform Requirements
- Node.js (recent LTS recommended; no version pinned)
- npm
- Deployed as a Node.js server (`next start`) or edge-compatible platform
- Supabase project `qcohcaavhwujvagmpbdp` (Flathead Harbor region, visible in image URLs and schema comments)
- Supabase pgvector extension required for RAG embeddings (`supabase/bsp-schema.sql`)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: PascalCase matching the export name (`Navbar.tsx`, `BookingForm.tsx`, `TasksClient.tsx`)
- API routes: always named `route.ts` inside Next.js App Router directories
- Config modules: camelCase noun (`business.ts`, `solarSchedule.ts`, `booking.ts`)
- API client slices: camelCase with `Api` suffix (`reservationsApi.ts`, `expensesApi.ts`)
- Server action files: `actions.ts` at the feature directory level
- Feature pages: kebab-case (`bsp-chat/`, `bsp-rag/`)
- Component sub-groups: lowercase noun (`booking/`, `admin/`)
- Top-level source dirs: short nouns (`app/`, `components/`, `lib/`, `config/`, `types/`)
- Event handlers: `handle` prefix + PascalCase noun+verb (`handleDateSelect`, `handleAddTodo`, `handleProceedToPayment`)
- Boolean state/flags: `is`/`has` prefix (`isLoading`, `isOpen`, `isAdding`, `isFormValid`)
- Derived/computed values: descriptive nouns (`processedExpenses`, `availableSlots`, `displayTotal`)
- Helper functions in config files: `get`/`format`/`generate` prefix (`getFullAddress`, `formatTime`, `generatePageMetadata`)
- Named constants: SCREAMING_SNAKE_CASE (`BUSINESS_INFO`, `BOOKING_CONFIG`, `SOLAR_TABLE`, `BASE_METADATA`)
- Interfaces: PascalCase (`BookingFormProps`, `SolarEntry`, `RetrievedDoc`)
- Type aliases: PascalCase (`BookingStatus`, `RootState`, `AppDispatch`)
- Interface props suffix: `Props` (`BookingFormProps`, `PaymentFormProps`)
- RTK Query slice interfaces co-located in the API file (`Expense` in `expensesApi.ts`)
## Code Style
- No Prettier config file present — formatting is applied manually or via editor settings
- Single quotes for imports in most files; double quotes in some config/layout files (inconsistent)
- Trailing commas present in objects and arrays
- 4-space indentation throughout (no 2-space)
- Semicolons used consistently
- ESLint v9 with `eslint-config-next` (Next.js defaults)
- No custom `.eslintrc` — uses Next.js built-in ruleset
- `npm run lint` runs ESLint
- `strict: true` in `tsconfig.json`
- Non-null assertions (`!`) used for env vars: `process.env.NEXT_PUBLIC_SUPABASE_URL!`
- `as any` used sparingly to bypass Stripe API version type constraint
- `error: unknown` caught and narrowed via `instanceof Error` check in newer routes
- `error: any` used in older routes for direct `.message` access
## Import Organization
- `@/*` maps to `./src/*` — use this for all internal imports
- Example: `import { BUSINESS_INFO } from '@/config/business'`
- Never use relative paths like `../../config/business`
## Client vs Server Directives
- Required at top of any component using hooks (`useState`, `useEffect`, `useRef`), browser APIs, or event handlers
- Components in `src/components/` that are interactive all declare `'use client'`
- Named `*Client.tsx` suffix used for interactive page-level components (`TasksClient.tsx`, `ExpensesClient.tsx`)
- Used in `src/app/admin/actions.ts` for Next.js Server Actions
- API routes in `src/app/api/` do NOT need this — they are server-only by default
- Page files (`page.tsx`) that only compose components or fetch metadata are server components
- Pattern: `page.tsx` renders the `*Client.tsx` wrapper, which holds all state
## Error Handling
- Wrap entire handler body in `try/catch`
- Return `NextResponse.json({ error: '...' }, { status: NNN })` for errors
- `console.error('context:', error)` before returning error response
- Supabase errors checked via `if (error)` after destructuring: `const { data, error } = await supabase...`
- Throw on non-recoverable Supabase errors: `throw new Error('Failed to save booking')`
- Async operations wrapped in `try/catch`
- Errors logged with `console.error('description', err)`
- User-facing errors use `alert()` (booking flow) or silent state reset (admin tools)
- RTK Query mutations use `.unwrap()` to propagate errors to the catch block
- Return `{ success: boolean, error?: string }` objects — never throw
- Example: `return { success: false, error: error.message }`
- Newer code: `catch (error: unknown) { const message = error instanceof Error ? error.message : 'Unknown' }`
- Older code: `catch (error: any) { ... error.message ... }`
## Logging
- Prefixed namespace brackets in API routes: `console.log('[EMAIL] ...')`, `console.log('[BSP RAG] ...')`
- `console.error('context:', error)` at every caught exception in API routes
- `console.warn()` for degraded-but-functional paths (mock Stripe payment intents)
- `console.log()` for operational info (email recipients, document counts, query strings)
- Client components use `console.error` only — no `console.log` in UI layer
## Comments
- Module-level JSDoc blocks on config/utility files (`solarSchedule.ts` has full JSDoc)
- Inline section headers for long function bodies: `// 1. Validate Payment Intent`, `// 2. Insert into Supabase`
- `// BSP color palette:` style comments in UI components noting design system colors
- Avoid comments that restate the code; prefer comments explaining *why*
- Used in `src/config/solarSchedule.ts` for all exported functions
- Not consistently used elsewhere — only add JSDoc for utility/config functions
## Function Design
- Props interfaces always defined for React components: `interface BookingFormProps { className?: string }`
- Destructured at parameter site: `export default function BookingForm({ className }: BookingFormProps)`
- API handlers receive `request: Request` or `req: NextRequest`
- API routes always return `NextResponse.json(...)` or `Response.json(...)` (not raw objects)
- Helper functions return primitives or plain objects (never `NextResponse`)
- Server actions return `{ success: boolean, error?: string }`
## Module Design
- Components: `export function ComponentName()` (named) or `export default function ComponentName()` (default)
- Named exports preferred for shared components (`export function Navbar()`, `export function Hero()`)
- Default exports used for page-level Client components (`export default function TasksClient()`)
- Config: `export const BUSINESS_INFO = {...}` plus named helper functions
- Not used — imports always point directly to the source file
## Tailwind CSS Conventions
- Utility-first Tailwind v4 with no component abstractions
- Hardcoded hex colors inline: `bg-[#FF9500]`, `text-[#2D1600]`, `border-[#FFD700]/20`
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` used extensively
- Dark mode: `dark:` variant used for admin pages (sky/slate palette); public pages are light-only
- Brand palette: `#FF9500` (orange primary), `#FFD700` (gold accent), `#2D1600` (dark brown), `#FFF8EE` (cream surface)
- Admin palette: `sky-600` primary, `slate-*` backgrounds, `emerald-500` success
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Server Components for data-fetching pages (admin dashboard reads Supabase directly in page components)
- Client Components for interactive UI (booking flow, chat, admin CRUD forms marked `"use client"`)
- API Routes as the backend layer — all external service calls (Stripe, Resend, OpenAI, Anthropic) happen here
- Redux Toolkit Query (RTK Query) for admin-side async state and cache invalidation
- Cookie-based admin auth enforced at the middleware layer, no third-party auth provider
## Layers
- Purpose: Marketing site and customer-facing flows
- Location: `src/app/page.tsx`, `src/app/book/`, `src/app/bsp-chat/`, `src/app/faq/`, `src/app/gallery/`, `src/app/services/`, `src/app/location/`, `src/app/jobs/`
- Contains: Server Components (metadata export + layout), Client Components delegated for interactivity
- Depends on: `src/components/`, `src/config/`, `src/lib/stripe.ts`
- Used by: End customers via browser
- Purpose: Internal operations dashboard (bookings, expenses, tasks, notes, maintenance)
- Location: `src/app/admin/`
- Contains: Mix of async Server Components (bookings read Supabase directly) and Client Components (expenses/tasks/supplies use RTK Query)
- Depends on: `src/lib/supabaseAdmin.ts`, `src/lib/api/*Api.ts`, `src/components/admin/`
- Used by: Business owner behind cookie auth
- Purpose: Reusable UI blocks
- Location: `src/components/` (public marketing), `src/components/booking/` (multi-step booking flow), `src/components/admin/` (admin widgets)
- Contains: Named exports, all TypeScript, mix of server and client components
- Depends on: `src/config/`, `src/lib/`, Tailwind classes, framer-motion, lucide-react
- Used by: `src/app/**`
- Purpose: Backend endpoints — all external service integrations live here
- Location: `src/app/api/`
- Contains: Route handlers (`route.ts`) following Next.js App Router conventions
- Depends on: `src/config/`, `src/lib/supabaseAdmin.ts`, Stripe SDK, Resend SDK, OpenAI SDK, Anthropic SDK
- Used by: Client components (via `fetch`), RTK Query base queries
- Purpose: Centralized business constants, zero runtime fetching
- Location: `src/config/`
- Contains: `business.ts` (all contact/pricing/service info), `booking.ts` (season dates, capacity), `solarSchedule.ts` (time slot logic), `seo.ts` (metadata helpers), `structured-data.tsx` (JSON-LD generators), `theme.config.ts`
- Depends on: Nothing (pure constants and pure functions)
- Used by: All other layers
- Purpose: Supabase clients and RTK Query API slices
- Location: `src/lib/`
- Contains: `supabaseClient.ts` (anon key, public), `supabaseAdmin.ts` (service role, server-only), `stripe.ts` (client-side Stripe promise), `store.ts` (Redux store), `src/lib/api/` (RTK Query slices for reservations, expenses, todos, maintenance, supplies)
- Depends on: Supabase JS, RTK Query, Stripe JS
- Used by: Server Components (supabaseAdmin), Client Components (supabaseClient, RTK Query hooks), API Routes
## Data Flow
- Public customer UI: Local React `useState` within components (no global state needed)
- Admin UI: Redux Toolkit store (`src/lib/store.ts`) with RTK Query slices for server state caching
- Theme: `next-themes` ThemeProvider (forced dark mode currently)
## Key Abstractions
- Purpose: Single source of truth for all business data (contact, pricing, hours, services, social links)
- Examples: `src/config/business.ts`
- Pattern: Plain TypeScript object with exported helper functions; imported everywhere including API routes and components
- Purpose: Dynamically generates available time slots and tier pricing based on Montana sunrise/sunset per month
- Examples: `src/config/solarSchedule.ts`
- Pattern: Pure functions — `getTimeSlotsForDate(dateStr)`, `getSlotType(dateStr, timeStr)`, `getSlotPrice(slotType)` — called on both client and server
- Purpose: Typed async data fetching with automatic caching and cache invalidation for admin CRUD
- Examples: `src/lib/api/reservationsApi.ts`, `src/lib/api/expensesApi.ts`, `src/lib/api/todosApi.ts`, `src/lib/api/maintenanceApi.ts`, `src/lib/api/suppliesApi.ts`
- Pattern: `createApi` with `fetchBaseQuery({ baseUrl: '/api' })`; hooks exported and consumed in client components
- Purpose: Separate clients enforce access boundaries — anon key for public/client use, service role for admin/server-only
- Examples: `src/lib/supabaseClient.ts` (anon), `src/lib/supabaseAdmin.ts` (service role)
- Pattern: `supabaseAdmin` used only in API routes and Server Components; `supabase` (anon) used in client components and RAG chat route
## Entry Points
- Location: `src/app/layout.tsx`
- Triggers: All page renders
- Responsibilities: Font loading (Oswald + Inter), global CSS, `Providers` wrapper (ThemeProvider + Redux Provider), JSON-LD structured data injection
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Assembles marketing sections in order: Navbar, Hero, Stats, VesselShowcase, ExperienceGallery, Testimonials, InstagramFeed, LocationHighlights, Footer, ChatCTA
- Location: `src/app/book/page.tsx` → delegates to `src/app/book/BookingClient.tsx`
- Triggers: GET `/book`
- Responsibilities: Metadata export (Server Component wrapper), renders `BookingForm` multi-step flow
- Location: `src/app/admin/page.tsx`
- Triggers: GET `/admin` (after middleware auth check)
- Responsibilities: Immediate redirect to `/admin/bookings`
- Location: `src/middleware.ts`
- Triggers: All requests matching `/admin/:path*`
- Responsibilities: Checks `admin_session` HttpOnly cookie; redirects unauthenticated requests to `/admin/login`
- Location: `src/app/api/bsp-rag/chat/route.ts`
- Triggers: POST `/api/bsp-rag/chat`
- Responsibilities: Rate limiting, embedding generation (OpenAI), vector search (Supabase pgvector), LLM response streaming (Anthropic Claude)
## Error Handling
- API routes: `try/catch` → `NextResponse.json({ error: error.message })` with appropriate HTTP status
- Client components: `try/catch` around `fetch` calls → `alert()` for user-facing errors (booking form uses this pattern — a concern)
- Admin Server Components: Render inline error message on Supabase failure (`<div>Error loading: {error.message}</div>`)
- Email errors: Wrapped in independent try/catch, status tracked in `customerEmailStatus`/`adminEmailStatus` objects returned in response
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
