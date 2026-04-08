---
phase: 04-complete-seo-audit-and-automated-optimization
plan: "01"
subsystem: seo-config
tags: [seo, config, static-files, og-image, schema]
dependency_graph:
  requires: []
  provides: [clean-seo-foundation, dynamic-sitemap-active, accurate-schema-hours]
  affects: [src/app/layout.tsx, src/app/sitemap.ts, src/app/robots.ts]
tech_stack:
  added: []
  patterns: [dynamic-app-router-routes-over-static-public-files, cdn-og-images]
key_files:
  created: []
  modified:
    - src/config/business.ts
    - src/config/seo.ts
  deleted:
    - public/sitemap.xml
    - public/robots.txt
    - public/seo-report.json
decisions:
  - "Deleted stale public/sitemap.xml and public/robots.txt to unblock dynamic App Router routes"
  - "openingHours changed from Mo-Su to Tu-Su to match BOOKING_CONFIG.excludedDaysOfWeek: [1]"
  - "Removed verification placeholder to prevent invalid google-site-verification meta tag emission"
  - "OG image switched from local 2.7 MB file to Supabase CDN for fast social previews"
metrics:
  duration: "~5 min"
  completed: "2026-04-08"
  tasks: 2
  files_modified: 5
---

# Phase 04 Plan 01: Delete Stale Static SEO Files and Fix Config-Level Metadata Summary

Removed three stale public/ files shadowing dynamic App Router routes, corrected schema.org opening hours to Tu-Su, removed invalid verification placeholder, and switched OG/Twitter images to Supabase CDN URL.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Delete stale static SEO files and fix config-level metadata | 87fc2d9 | public/sitemap.xml (deleted), public/robots.txt (deleted), public/seo-report.json (deleted), src/config/business.ts, src/config/seo.ts |
| 2 | Verify build succeeds with changes | (no commit — verification only) | — |

## What Was Built

### Stale Static Files Deleted

Three files in `public/` were shadowing the dynamic App Router routes:

- `public/sitemap.xml` — referenced 404 routes (`/about`, `/careers`, `/charters`, `/reservations`, `/theboat`). Now `src/app/sitemap.ts` serves `/sitemap.xml` exclusively with correct routes.
- `public/robots.txt` — conflicted with `src/app/robots.ts` which correctly blocks `/api/` and `/admin/`. Dynamic route is now sole source.
- `public/seo-report.json` — legacy report from a previous codebase, inaccurate and unnecessary.

The production build confirms both `/robots.txt` and `/sitemap.xml` are now served as `○ (Static)` routes from the App Router, not static files.

### Config Fixes

**`src/config/business.ts`** — `openingHours` corrected from `'Mo-Su 10:00-19:00'` to `'Tu-Su 10:00-19:00'`. This aligns the schema.org structured data with `BOOKING_CONFIG.excludedDaysOfWeek: [1]` (Monday exclusion implemented in Phase 3).

**`src/config/seo.ts`** — Two changes:
1. Removed entire `verification` block with `'your-google-verification-code'` placeholder. This was emitting an invalid `<meta name="google-site-verification">` tag in every HTML page head.
2. Switched `openGraph.images[0].url` and `twitter.images[0]` from local `/colorfulChute.jpg` (2.7 MB) to CDN-hosted `https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg`. Updated alt text to `'Parasailing above Flathead Lake, Montana - Big Sky Parasail'`.

## Verification Results

```
ALL CHECKS PASSED
- public/sitemap.xml does not exist
- public/robots.txt does not exist  
- public/seo-report.json does not exist
- src/config/business.ts contains 'Tu-Su 10:00-19:00'
- src/config/seo.ts does NOT contain 'your-google-verification-code'
- src/config/seo.ts contains 'supabase.co' (CDN OG image URL)
```

Build: `✓ Compiled successfully` — no TypeScript errors, no missing file errors.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All changes are complete and correct. The `hours.monday` field in `BUSINESS_INFO` still shows `'10:00 AM - 7:00 PM'` but that is the display text used in footer/contact pages (not schema.org format), not a stub — the schema.org `openingHours` array is the corrected field.

## Self-Check: PASSED

- `src/config/business.ts` — exists, contains `Tu-Su 10:00-19:00`
- `src/config/seo.ts` — exists, contains CDN URL, no verification block
- `public/sitemap.xml` — confirmed deleted
- `public/robots.txt` — confirmed deleted
- `public/seo-report.json` — confirmed deleted
- Commit `87fc2d9` — verified in git log
