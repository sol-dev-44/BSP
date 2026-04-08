---
phase: 04-complete-seo-audit-and-automated-optimization
plan: 03
subsystem: seo
tags: [next.js, metadata, pwa, manifest, structured-data, seo]

# Dependency graph
requires:
  - phase: 04-complete-seo-audit-and-automated-optimization
    provides: seo.ts generatePageMetadata, structured-data.tsx StructuredData/generateBreadcrumbSchema
provides:
  - bsp-chat page with correct title/description metadata (server wrapper pattern)
  - Web manifest linked from HTML head via Next.js manifest metadata property
  - Manifest icons corrected to use existing JerryBearLogo.png
affects: [seo, pwa, bsp-chat]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server wrapper pattern: 'use client' pages split into page.tsx (server, metadata export) + *Client.tsx (client, interactivity)"

key-files:
  created:
    - src/app/bsp-chat/BSPChatClient.tsx
  modified:
    - src/app/bsp-chat/page.tsx
    - src/app/layout.tsx
    - public/manifest.json

key-decisions:
  - "bsp-chat page.tsx converted to server wrapper with generatePageMetadata — metadata was silently ignored when 'use client' was on page.tsx"
  - "Manifest icon purpose changed from 'any maskable' to 'any' — JerryBearLogo.png is not designed for maskable safe zone requirements"
  - "Manifest theme_color updated from #2563eb (blue) to #FF9500 (brand orange) for consistency"

patterns-established:
  - "Server wrapper pattern: whenever a Next.js page needs both 'use client' interactivity and metadata export, create page.tsx (server) + NameClient.tsx (client)"

requirements-completed:
  - SEO-07
  - SEO-09
  - SEO-10

# Metrics
duration: 8min
completed: 2026-04-08
---

# Phase 04 Plan 03: bsp-chat Metadata and Web Manifest Fix Summary

**bsp-chat page gets correct SEO title via server wrapper split, web manifest linked in HTML head with corrected brand-consistent icon references**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-08T01:00:00Z
- **Completed:** 2026-04-08T01:01:17Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Converted /bsp-chat from a single 'use client' page (metadata silently ignored) to server wrapper + BSPChatClient pattern — title now "Ask Jerry Bear | Big Sky Parasail AI Chat"
- Added BreadcrumbList JSON-LD structured data to /bsp-chat via StructuredData component
- Linked web manifest from layout metadata (`manifest: '/manifest.json'`) so browsers can discover it
- Fixed manifest.json icons that referenced non-existent `/icon-192x192.png` and `/icon-512x512.png` to use existing `/JerryBearLogo.png`
- Updated manifest theme_color from generic blue (#2563eb) to brand orange (#FF9500)

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert bsp-chat to server wrapper + client pattern with metadata** - `92eea42` (feat)
2. **Task 2: Add manifest link to layout and fix manifest icon references** - `55d90de` (feat)

**Plan metadata:** (docs commit — final step)

## Files Created/Modified
- `src/app/bsp-chat/BSPChatClient.tsx` - New client component with all chat interactivity (unchanged logic, moved from page.tsx)
- `src/app/bsp-chat/page.tsx` - Server component wrapper with generatePageMetadata export and BreadcrumbList JSON-LD
- `src/app/layout.tsx` - Added `manifest: '/manifest.json'` to metadata export
- `public/manifest.json` - Updated icons to /JerryBearLogo.png, theme_color to #FF9500, purpose to 'any'

## Decisions Made
- bsp-chat page.tsx converted to server wrapper — metadata export is silently ignored on 'use client' components in Next.js App Router; splitting was the required fix
- Manifest icon purpose changed from 'any maskable' to 'any' — maskable icons require specific safe zone padding that JerryBearLogo.png is not designed for
- Manifest theme_color aligned to brand (#FF9500) — previous blue (#2563eb) was a placeholder value

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None — build passed cleanly on first attempt.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All bsp-chat SEO requirements fulfilled
- Web manifest is now discoverable and functional (icons exist, theme matches brand)
- Server wrapper pattern established for other pages that may need similar treatment

---
*Phase: 04-complete-seo-audit-and-automated-optimization*
*Completed: 2026-04-08*

## Self-Check: PASSED

- FOUND: src/app/bsp-chat/BSPChatClient.tsx
- FOUND: src/app/bsp-chat/page.tsx
- FOUND: src/app/layout.tsx
- FOUND: public/manifest.json
- FOUND: commit 92eea42
- FOUND: commit 55d90de
