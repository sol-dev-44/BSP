# Technology Stack

**Analysis Date:** 2026-03-31

## Languages

**Primary:**
- TypeScript 5.x - All application code in `src/`
- SQL - Database schema in `supabase/bsp-schema.sql`

**Secondary:**
- CSS - Global styles in `src/app/globals.css`

## Runtime

**Environment:**
- Node.js (version not pinned — no `.nvmrc` or `.node-version`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present (lockfileVersion 3)

## Frameworks

**Core:**
- Next.js 16.1.1 - Full-stack React framework (App Router), handles routing, API routes, SSR/SSG
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS framework
- `@tailwindcss/postcss` 4.x - PostCSS integration
- Config: `tailwind.config.ts` (dark mode via `class`, content paths cover `src/`)
- PostCSS config: `postcss.config.mjs`

**Animation:**
- Framer Motion 12.x - UI animations throughout components

**State Management:**
- Redux Toolkit 2.x (`@reduxjs/toolkit`) - Global state and API caching
- React Redux 9.x - React bindings
- RTK Query - API data fetching layer, configured in `src/lib/store.ts`
- RTK Query slices: `reservationsApi`, `todosApi`, `expensesApi`, `maintenanceApi`, `suppliesApi` in `src/lib/api/`

**Theme:**
- next-themes 0.4.x - Dark/light mode toggle; app forced to dark mode in `src/app/providers.tsx`

**Fonts:**
- Google Fonts via `next/font/google`: Oswald (headlines, `--font-headline`), Inter (body, `--font-body`)

**Testing:**
- Not detected — no test framework configured

**Build/Dev:**
- `next dev` - Development server
- `next build` - Production build
- `next start` - Production server
- ESLint 9.x with `eslint-config-next` - Linting (`npm run lint`)

## Key Dependencies

**Critical:**
- `stripe` 20.x + `@stripe/react-stripe-js` 5.x + `@stripe/stripe-js` 8.x — Payment processing; server-side payment intent creation and client-side Elements
- `@supabase/supabase-js` 2.x — Database client; two clients (anon + service role) in `src/lib/supabaseClient.ts` and `src/lib/supabaseAdmin.ts`
- `openai` 6.x — Embeddings generation (`text-embedding-3-small`) for RAG chatbot
- `@anthropic-ai/sdk` 0.78.x — LLM inference (`claude-sonnet-4-20250514`) for chatbot responses
- `resend` 6.x — Transactional email (booking confirmations, admin notifications)

**Utilities:**
- `date-fns` 4.x — Date formatting and manipulation in booking flows
- `lucide-react` 0.562.x — Icon library
- `react-markdown` 10.x — Renders chatbot markdown responses
- `pdf-parse-fork` 1.2.x — PDF text extraction for RAG document uploads

## Configuration

**Environment:**
- `.env.local` file present (contents not read)
- Required variables referenced in code:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe client-side key
  - `STRIPE_SECRET_KEY` — Stripe server-side key
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public key
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (server-only)
  - `OPENAI_API_KEY` — OpenAI embeddings
  - `ANTHROPIC_API_KEY` — Anthropic LLM
  - `RESEND_API_KEY` — Resend email service
  - `RESEND_VERIFIED_DOMAIN` — Optional; gates production email sender address
  - `RESEND_ACCOUNT_EMAIL` — Dev fallback email destination
  - `ADMIN_USER` — Admin panel username (default: `admin`)
  - `ADMIN_PASSWORD` — Admin panel password (default: `bigsky2026`)
  - `NODE_ENV` — Controls dev vs. production behavior in email and auth routes

**Build:**
- `next.config.ts` — Configures remote image domain (`qcohcaavhwujvagmpbdp.supabase.co`), `/reservations` → `/book` redirect
- `tsconfig.json` — Strict mode, `@/*` path alias maps to `./src/*`, target ES2017

## Platform Requirements

**Development:**
- Node.js (recent LTS recommended; no version pinned)
- npm

**Production:**
- Deployed as a Node.js server (`next start`) or edge-compatible platform
- Supabase project `qcohcaavhwujvagmpbdp` (Flathead Harbor region, visible in image URLs and schema comments)
- Supabase pgvector extension required for RAG embeddings (`supabase/bsp-schema.sql`)

---

*Stack analysis: 2026-03-31*
