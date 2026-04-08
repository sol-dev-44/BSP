# Phase 4: Complete SEO Audit and Automated Optimization — Research

**Researched:** 2026-04-07
**Domain:** Technical SEO — Next.js 16 App Router, structured data, Core Web Vitals, meta tags
**Confidence:** HIGH (findings from direct code audit; Next.js docs confirmed via training + well-established patterns)

---

## Summary

Big Sky Parasail already has a solid SEO foundation: `metadataBase`, `generatePageMetadata()`, Open Graph tags, Twitter cards, JSON-LD structured data generators (LocalBusiness, Organization, FAQPage, Service, BreadcrumbList), dynamic sitemap via `src/app/sitemap.ts`, dynamic robots via `src/app/robots.ts`, and GA4 analytics. The site is not starting from zero.

However, the audit reveals eight concrete gaps that are entirely fixable through code changes alone — no content writing required. The highest-value items are: (1) a duplicate-file conflict where static `public/sitemap.xml` and `public/robots.txt` shadow the dynamic App Router equivalents, (2) structured data generators exist but are not wired up on the `/services`, `/location`, and `/gallery` pages, (3) the placeholder `your-google-verification-code` in `seo.ts`, (4) large unoptimized images in `public/` (2–2.7 MB PNGs used as favicon/OG image), (5) missing `<link rel="manifest">` for the existing `manifest.json`, (6) hardcoded URLs in breadcrumb data instead of using `BUSINESS_INFO.url`, (7) the `openingHours` schema says `Mo-Su` but Monday bookings are excluded, and (8) the `bsp-chat` page has no metadata export.

**Primary recommendation:** Execute in three waves: (1) fix the static-vs-dynamic file conflict and wire up missing structured data, (2) fix metadata gaps (verification code, bsp-chat page, hardcoded URLs, opening hours accuracy), (3) add manifest link and image/performance improvements.

---

## Audit Findings — What Exists vs. What's Missing

### What Already Works
| Feature | File | Status |
|---------|------|--------|
| `metadataBase` | `src/config/seo.ts` | Correct — set to `BUSINESS_INFO.url` |
| Per-page metadata | All 7 public pages | Present via `generatePageMetadata()` |
| Open Graph tags | `src/config/seo.ts` | Present — title, desc, image, siteName |
| Twitter Card | `src/config/seo.ts` | Present — `summary_large_image` |
| robots meta | `src/config/seo.ts` | Present — index/follow, googleBot hints |
| LocalBusiness JSON-LD | `src/app/layout.tsx` | Rendered globally |
| Organization JSON-LD | `src/app/layout.tsx` | Rendered globally |
| FAQPage JSON-LD | `src/app/faq/page.tsx` | Present |
| BreadcrumbList JSON-LD | Home page, FAQ page | Present |
| Dynamic sitemap | `src/app/sitemap.ts` | Present — 8 routes, correct priorities |
| Dynamic robots | `src/app/robots.ts` | Present — blocks /api/, /admin/ |
| GA4 analytics | `src/lib/gtag.ts` + layout | Present with ecommerce tracking |
| Canonical URLs | `generatePageMetadata()` | Present via `alternates.canonical` |

### Gaps Found

**Gap 1 — Static files shadow dynamic routes (HIGH impact)**
Both `public/sitemap.xml` and `public/robots.txt` exist alongside `src/app/sitemap.ts` and `src/app/robots.ts`. In Next.js, the static `public/` files are served directly and take priority over App Router route files for the same path. The dynamic routes are likely being silently ignored in production. The `public/sitemap.xml` is dated `2025-06-30` and references old routes (`/about`, `/careers`, `/charters`, `/reservations`, `/theboat`) that no longer exist in this codebase. The `public/robots.txt` also uses a different rule set than `src/app/robots.ts`.
**Fix:** Delete `public/sitemap.xml` and `public/robots.txt` to let the App Router dynamic versions serve.

**Gap 2 — Structured data not wired on /services, /location, /gallery (MEDIUM impact)**
Generators exist in `src/config/structured-data.tsx` for Service schema and TouristAttraction schema, but neither is used on the pages that benefit most. The services page renders 7 `Service` objects from `BUSINESS_INFO.services` — each is a prime candidate for `generateServiceSchema()`. The location page is the ideal place for `generateTouristAttractionSchema()`. The gallery page has no JSON-LD at all. Breadcrumb schema is only on home and FAQ; it should be on all pages.
**Fix:** Import and render `StructuredData` in `src/app/services/page.tsx` (Service + Breadcrumb), `src/app/location/page.tsx` (TouristAttraction + Breadcrumb), `src/app/gallery/page.tsx` (Breadcrumb), `src/app/book/page.tsx` (Breadcrumb), `src/app/jobs/page.tsx` (Breadcrumb).

**Gap 3 — Google verification placeholder (LOW-MEDIUM impact)**
`src/config/seo.ts` line 56: `google: 'your-google-verification-code'`. This emits an invalid `<meta name="google-site-verification">` tag. It should be removed or replaced with the real code. Since the real code requires a human to log into Search Console, the right code-only fix is to remove the verification block from `BASE_METADATA` entirely. Search Console can also be verified via DNS TXT record or file upload without touching the code.
**Fix:** Remove the `verification` block from `BASE_METADATA`. (The owner can add it back with the real value when needed.)

**Gap 4 — `bsp-chat` page has no metadata (LOW impact)**
`src/app/bsp-chat/page.tsx` is a `'use client'` file (no `page.tsx` wrapper) — it exports no metadata. The route inherits only the root layout metadata, meaning it gets the homepage title/description for its `<title>` tag.
**Fix:** Convert to a server-component wrapper + client component pattern (matching the pattern used on all other pages). The server wrapper exports metadata, the client component holds state.

**Gap 5 — Hardcoded URLs in breadcrumb data (LOW impact)**
`src/app/faq/page.tsx` and `src/app/page.tsx` hardcode `https://www.montanaparasail.com/` in breadcrumb arrays instead of using `BUSINESS_INFO.url`. If the domain ever changes, these break.
**Fix:** Replace with `BUSINESS_INFO.url` imports. One-line fix per occurrence.

**Gap 6 — Opening hours schema inaccurate (LOW impact)**
`BUSINESS_INFO.openingHours` declares `'Mo-Su 10:00-19:00'` (Monday through Sunday). But Monday bookings are excluded via `BOOKING_CONFIG.excludedDaysOfWeek: [1]`. The schema tells Google the business is open Monday when it effectively is not for bookings.
**Fix:** Update `openingHours` in `business.ts` to `'Tu-Su 10:00-19:00'` to reflect actual availability. The `hours` object sub-keys for `monday` can stay (descriptive) but the schema.org format string should reflect actual booking days.

**Gap 7 — No `<link rel="manifest">` for PWA (LOW impact)**
`public/manifest.json` exists with correct data but is never linked from the layout. Next.js does not auto-discover `manifest.json` — it must be declared in metadata icons or as a link.
**Fix:** Add `manifest: '/manifest.json'` to the `metadata` export in `src/app/layout.tsx`. Next.js 13+ supports this via the `manifest` metadata property.

**Gap 8 — Large unoptimized images in `public/` serving as favicon and OG image (MEDIUM impact)**
- `public/JerryBearLogo.png` — 1.6 MB, used as `icon` and `apple` in layout metadata, and as `<img>` in `ChatCTA.tsx` and `bsp-chat/page.tsx`
- `public/colorfulChute.jpg` — 2.7 MB, used as the OG image (1200x630 reference in `seo.ts`)
- `public/thumbAction.png` — 2.7 MB, only referenced from `bsplogo.png`
- `public/bsplogo.png` — 2.3 MB
The OG image should be under 300 KB for fast social previews. The favicon file at 1.6 MB is fetched on every page load.
**Fix:** The favicon/logo PNG can be referenced as a `next/image`-served asset or a resized version added to `public/`. For the OG image: create `public/og-image.jpg` as a compressed JPEG (under 300 KB, 1200x630) from `colorfulChute.jpg`, then update `seo.ts` to reference it. This is a code + asset change but requires no human content work.

---

## Standard Stack

Next.js 16.1.1 App Router handles all SEO primitives natively. No additional SEO libraries are needed or appropriate for this project.

### Core SEO Features in Next.js 16 (HIGH confidence)
| Feature | API | Where Used / Should Be Used |
|---------|-----|----------------------------|
| Metadata export | `export const metadata: Metadata` | All `page.tsx` server components |
| Dynamic metadata | `export async function generateMetadata()` | Not needed here — static data |
| Base metadata | `metadataBase` in root layout | Already set correctly |
| Structured data | `<script type="application/ld+json">` via `StructuredData` component | Layout + individual pages |
| Sitemap | `src/app/sitemap.ts` returning `MetadataRoute.Sitemap` | Already present |
| Robots | `src/app/robots.ts` returning `MetadataRoute.Robots` | Already present |
| Open Graph images | `opengraph-image.jpg` file-based OR `openGraph.images` in metadata | `seo.ts` approach used |
| Canonical | `alternates.canonical` in Metadata | `generatePageMetadata()` handles this |
| Icons | `icons` in Metadata | In root layout — needs optimization |
| Web Manifest | `manifest` in Metadata | Missing — easy to add |

### No New Libraries Needed
The existing stack handles all improvements. Do not add `next-seo`, `react-helmet`, or any third-party SEO package. The project constraint is clear: no new services. Next.js metadata API covers everything.

---

## Architecture Patterns

### Pattern 1: Server Wrapper + Client Component for Metadata
`bsp-chat/page.tsx` is currently a full `'use client'` file. It cannot export metadata. The fix follows the pattern used by `/services`, `/location`, `/gallery`:

```typescript
// src/app/bsp-chat/page.tsx  (NEW — server component)
import { generatePageMetadata } from '@/config/seo'
import BSPChat from './BSPChatClient'  // rename existing page.tsx

export const metadata = generatePageMetadata(
    'Ask Jerry Bear | Big Sky Parasail AI Chat',
    'Get instant answers about parasailing on Flathead Lake from Jerry Bear, our AI assistant. Ask about pricing, safety, weather, and booking.',
    '/bsp-chat'
)

export default function BSPChatPage() {
    return <BSPChat />
}
```

The existing `bsp-chat/page.tsx` content moves to `bsp-chat/BSPChatClient.tsx` with `'use client'` at top.

### Pattern 2: Adding Structured Data to Page Server Components
Service and TouristAttraction schemas are generated from existing config — zero content writing.

```typescript
// src/app/services/page.tsx
import { generatePageMetadata } from '@/config/seo'
import { generateServiceSchema, generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import ServicesClient from './ServicesClient'

export const metadata = generatePageMetadata(...)

export default function ServicesPage() {
    const breadcrumbs = [
        { name: 'Home', url: BUSINESS_INFO.url + '/' },
        { name: 'Packages & Pricing', url: BUSINESS_INFO.url + '/services' }
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            {BUSINESS_INFO.services.map(service => (
                <StructuredData key={service.id} data={generateServiceSchema(service)} />
            ))}
            <ServicesClient />
        </>
    )
}
```

### Pattern 3: Deleting Static Files to Enable Dynamic Routes
Static files in `public/` are served verbatim by Next.js and override App Router generated routes for the same URL path. The fix is deletion:

```
DELETE: public/sitemap.xml
DELETE: public/robots.txt
```

After deletion, `src/app/sitemap.ts` serves `/sitemap.xml` and `src/app/robots.ts` serves `/robots.txt`. These are already correctly written.

### Pattern 4: Web Manifest via Metadata API
```typescript
// In src/app/layout.tsx metadata export — add:
export const metadata: Metadata = {
    ...BASE_METADATA,
    manifest: '/manifest.json',
    icons: {
        icon: '/JerryBearLogo.png',
        apple: '/JerryBearLogo.png',
    },
}
```

### Anti-Patterns to Avoid
- **Adding SEO libraries:** `next-seo` is redundant and conflicts with the built-in Metadata API in Next.js 13+. Do not add it.
- **Injecting JSON-LD in Client Components:** Always render `<StructuredData>` from server components (page.tsx, layout.tsx). Client components can't export `metadata` and JSON-LD in client components is hydration noise.
- **Multiple conflicting robots/sitemap files:** Never let `public/robots.txt` and `src/app/robots.ts` coexist. Only one source of truth.
- **Hardcoding domain in page files:** Always use `BUSINESS_INFO.url` for URLs in breadcrumbs and structured data.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom XML builder | `src/app/sitemap.ts` with `MetadataRoute.Sitemap` | Already exists and works |
| Robots.txt | Static file | `src/app/robots.ts` with `MetadataRoute.Robots` | Already exists and works |
| Structured data serialization | Manual JSON.stringify | `StructuredData` component in `structured-data.tsx` | Already handles `dangerouslySetInnerHTML` correctly |
| Open Graph metadata | Custom `<head>` tags | Next.js `metadata.openGraph` | Next.js generates correct meta tags |
| Canonical URLs | `<link rel="canonical">` manually | `metadata.alternates.canonical` | Next.js handles this |

---

## Common Pitfalls

### Pitfall 1: Static Public Files Shadow Dynamic App Router Routes
**What goes wrong:** `public/sitemap.xml` is served at `/sitemap.xml` and the dynamic `src/app/sitemap.ts` is never reached by the server. Crawlers get the stale static file referencing routes that no longer exist (`/about`, `/careers`, `/charters`, `/reservations/book/confirmation`, `/theboat`).
**Why it happens:** Next.js static file serving middleware runs before the App Router. Files in `public/` win.
**How to avoid:** Never keep both a static file and an App Router equivalent. One or the other.
**Warning signs:** The static `public/sitemap.xml` includes routes that 404 (e.g., `/about`, `/charters`, `/theboat`). A crawler would discover 5+ soft 404s.

### Pitfall 2: Client Components Cannot Export Metadata
**What goes wrong:** `bsp-chat/page.tsx` has `'use client'` at the top, so its `export const metadata` silently does nothing. The page gets the root layout's title.
**Why it happens:** Next.js only reads `metadata` exports from server components.
**How to avoid:** The `*Client.tsx` pattern used throughout the rest of this codebase is the correct solution.

### Pitfall 3: Opening Hours Inaccuracy Misleads Google
**What goes wrong:** Schema says `Mo-Su` (open Monday), but bookings are excluded on Mondays via `BOOKING_CONFIG.excludedDaysOfWeek: [1]`. A customer who checks Google's business hours panel may believe Monday availability exists.
**Why it happens:** The schema was written before the Monday exclusion was added in Phase 3.
**How to avoid:** Keep `openingHours` in sync with `BOOKING_CONFIG.excludedDaysOfWeek`.

### Pitfall 4: Large Public Images Inflate Page Weight
**What goes wrong:** `JerryBearLogo.png` at 1.6 MB is fetched on every page load as the favicon. The OG image at 2.7 MB is a poor social share experience (slow preview generation by social networks).
**Why it happens:** These were added as original files without optimization.
**How to avoid:** Favicons should be `<32 KB` in most cases. OG images should be `<300 KB`.

### Pitfall 5: Google Verification Placeholder Renders Invalid Tag
**What goes wrong:** `BASE_METADATA.verification.google = 'your-google-verification-code'` emits `<meta name="google-site-verification" content="your-google-verification-code">`. This is not harmful but it is noise in the HTML.
**Why it happens:** Placeholder left from initial setup.

---

## Code Examples

### Adding Structured Data to a Page Server Component
```typescript
// Source: existing pattern from src/app/faq/page.tsx
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'

export default function ServicesPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Packages & Pricing', url: `${BUSINESS_INFO.url}/services` },
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <ServicesClient />
        </>
    )
}
```

### Fixing Hardcoded URLs in Breadcrumbs
```typescript
// Before (in src/app/faq/page.tsx):
{ name: 'Home', url: 'https://www.montanaparasail.com/' }

// After:
import { BUSINESS_INFO } from '@/config/business'
{ name: 'Home', url: `${BUSINESS_INFO.url}/` }
```

### Updating Opening Hours to Exclude Monday
```typescript
// In src/config/business.ts — change:
openingHours: ['Mo-Su 10:00-19:00'],
// To:
openingHours: ['Tu-Su 10:00-19:00'],
```

### Removing Invalid Verification Placeholder
```typescript
// In src/config/seo.ts — remove the entire verification block:
// DELETE:
verification: {
    google: 'your-google-verification-code',
},
```

### Adding Manifest Link in Layout Metadata
```typescript
// In src/app/layout.tsx:
export const metadata: Metadata = {
    ...BASE_METADATA,
    manifest: '/manifest.json',
    icons: {
        icon: '/JerryBearLogo.png',
        apple: '/JerryBearLogo.png',
    },
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-seo` package | Next.js built-in Metadata API | Next.js 13 (2022) | No library needed |
| Static `sitemap.xml` | `src/app/sitemap.ts` returning `MetadataRoute.Sitemap` | Next.js 13.3+ | Auto-generated, always current |
| Manual `<head>` injection | `metadata` export from page/layout | Next.js 13 | Cleaner, type-safe |
| `getStaticProps` for SEO | Server Components | Next.js 13 | No data fetching needed for config-driven metadata |

**Deprecated/outdated in this project:**
- `public/sitemap.xml`: Stale (dated June 2025), references non-existent routes. Replaced by `src/app/sitemap.ts`.
- `public/robots.txt`: References old route structure. Replaced by `src/app/robots.ts`.
- `public/seo-report.json`: Legacy report from previous codebase. No longer accurate. Can be deleted.

---

## Open Questions

1. **OG Image Optimization**
   - What we know: `public/colorfulChute.jpg` is 2.7 MB. The OG spec recommends images under 300 KB for reliable social preview rendering.
   - What's unclear: Whether the owner has a preferred compressed version or wants us to create one programmatically.
   - Recommendation: Create a compressed copy at `public/og-image.jpg` using a build-time script, or use the existing Supabase-hosted image URLs which already have CDN optimization. The Supabase image at `qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg` would serve better as the OG image (CDN-hosted, no local 2.7 MB penalty). Update `seo.ts` to use the Supabase URL.

2. **Google Search Console Verification**
   - What we know: The `google: 'your-google-verification-code'` placeholder should be removed.
   - What's unclear: Does the owner have an existing Search Console property? DNS TXT verification is preferred over meta tag for sites using config-driven metadata.
   - Recommendation: Remove the placeholder. Document that DNS TXT or HTML file upload verification does not require code changes.

3. **Manifest Icon Files Missing**
   - What we know: `public/manifest.json` references `icon-192x192.png` and `icon-512x512.png` but neither file exists in `public/`.
   - What's unclear: Whether these should be generated from `JerryBearLogo.png` or left missing.
   - Recommendation: Either update `manifest.json` to reference existing images (`/JerryBearLogo.png`), or note to the planner that generating proper PWA icons requires a human asset step and should be skipped unless automated.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely code/config changes with no external dependencies. All changes are within Next.js source files and `public/` asset management.

---

## Project Constraints (from CLAUDE.md)

- **Stack:** Next.js 16 App Router, Supabase, Stripe, Resend — no new services. SEO must use Next.js built-in Metadata API only.
- **Pricing source of truth:** `src/config/business.ts` — structured data prices must derive from `BUSINESS_INFO.pricing` and `BUSINESS_INFO.services`.
- **No new services:** No third-party SEO libraries (`next-seo`, etc.), no external crawling APIs.
- **Import convention:** Always use `@/*` path aliases, never relative imports.
- **Client vs Server directives:** `'use client'` blocks metadata exports. Pages needing both metadata and interactivity must use server-component wrapper + client component pattern.
- **4-space indentation, single quotes, trailing commas** — follow existing file style.

---

## Ranked Work Items (Priority Order)

The planner should sequence work in this order:

| Priority | Item | Impact | Effort |
|----------|------|--------|--------|
| 1 | Delete `public/sitemap.xml` and `public/robots.txt` | HIGH — eliminates stale data for crawlers | Trivial |
| 2 | Delete `public/seo-report.json` (stale, inaccurate) | LOW — cleanup | Trivial |
| 3 | Add BreadcrumbList JSON-LD to all pages missing it (`/services`, `/location`, `/gallery`, `/book`, `/jobs`) | MEDIUM — improves SERP display | Low |
| 4 | Add ServiceSchema JSON-LD to `/services` page | MEDIUM — rich results for booking queries | Low |
| 5 | Add TouristAttractionSchema JSON-LD to `/location` page | MEDIUM — rich results for local queries | Low |
| 6 | Fix `openingHours` to `Tu-Su` in `business.ts` | LOW-MEDIUM — schema accuracy | Trivial |
| 7 | Remove Google verification placeholder from `seo.ts` | LOW — eliminates invalid tag | Trivial |
| 8 | Fix hardcoded URLs in breadcrumbs to use `BUSINESS_INFO.url` | LOW — maintainability | Trivial |
| 9 | Add metadata to `bsp-chat` page (server wrapper pattern) | LOW-MEDIUM — correct title/desc | Low |
| 10 | Add `manifest: '/manifest.json'` to layout metadata | LOW — PWA signal | Trivial |
| 11 | Update `manifest.json` icons to use existing `/JerryBearLogo.png` | LOW — fixes broken icon refs | Trivial |
| 12 | Update OG image reference in `seo.ts` to use Supabase CDN URL | MEDIUM — faster social previews | Trivial |

Items 1–12 are all code-only changes. Zero content writing required.

---

## Sources

### Primary (HIGH confidence)
- Direct code audit of BSP repository — `src/config/seo.ts`, `src/config/structured-data.tsx`, `src/app/layout.tsx`, all page files, `public/` directory
- Next.js 16 Metadata API: well-established patterns verified against existing correct usage in the codebase
- Schema.org specification: LocalBusiness, Service, TouristAttraction, FAQPage, BreadcrumbList types

### Secondary (MEDIUM confidence)
- Next.js static file serving order (public/ before App Router) — documented behavior, verified by the presence of both `public/sitemap.xml` and `src/app/sitemap.ts` in the repo

---

## Metadata

**Confidence breakdown:**
- Audit findings: HIGH — direct code read, no inference
- Static-vs-dynamic file conflict: HIGH — well-documented Next.js behavior
- Structured data correctness: HIGH — generators exist and follow schema.org spec
- Performance impact estimates: MEDIUM — image sizes measured directly, impact estimates are standard guidance

**Research date:** 2026-04-07
**Valid until:** 2026-07-07 (Next.js SEO API is stable; no fast-moving dependencies)
