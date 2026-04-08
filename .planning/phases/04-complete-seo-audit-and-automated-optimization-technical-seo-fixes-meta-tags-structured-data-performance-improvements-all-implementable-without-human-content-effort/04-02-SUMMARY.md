---
phase: 04-complete-seo-audit-and-automated-optimization
plan: "02"
subsystem: seo
tags: [structured-data, json-ld, breadcrumbs, schema-org, seo]
dependency_graph:
  requires: []
  provides: [structured-data-all-pages, service-schema, tourist-attraction-schema]
  affects: [src/app/services/page.tsx, src/app/location/page.tsx, src/app/gallery/page.tsx, src/app/book/page.tsx, src/app/jobs/page.tsx, src/app/page.tsx, src/app/faq/page.tsx]
tech_stack:
  added: []
  patterns: [json-ld-via-structured-data-component, business-info-url-as-source-of-truth]
key_files:
  created: []
  modified:
    - src/app/services/page.tsx
    - src/app/location/page.tsx
    - src/app/gallery/page.tsx
    - src/app/book/page.tsx
    - src/app/jobs/page.tsx
    - src/app/page.tsx
    - src/app/faq/page.tsx
decisions:
  - All breadcrumb URLs use BUSINESS_INFO.url template literal instead of hardcoded domain
  - ServiceSchema emitted once per BUSINESS_INFO.services entry using .map() with key=service.id
  - TouristAttractionSchema wired to /location page only (appropriate scope)
metrics:
  duration: "~10min"
  completed: "2026-04-08"
  tasks: 2
  files: 7
---

# Phase 04 Plan 02: Structured Data & Breadcrumbs Summary

**One-liner:** JSON-LD ServiceSchema (10 services), TouristAttractionSchema, and BreadcrumbList wired to all 7 public pages using BUSINESS_INFO.url as the single source-of-truth for domain.

## What Was Done

- Wired `generateBreadcrumbSchema` + `StructuredData` to `/services`, `/location`, `/gallery`, `/book`, `/jobs` — all five were previously missing structured data
- Added `generateServiceSchema` to `/services` page — one JSON-LD block per service in `BUSINESS_INFO.services` (10 services)
- Added `generateTouristAttractionSchema` to `/location` page
- Fixed `/` (home) page: replaced hardcoded `'https://www.montanaparasail.com/'` with `${BUSINESS_INFO.url}/` in breadcrumbs
- Fixed `/faq` page: replaced two hardcoded `'https://www.montanaparasail.com/...'` URLs with `BUSINESS_INFO.url` template literals

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add structured data to /services, /location, /gallery, /book, /jobs | e9ffb34 | 5 pages |
| 2 | Fix hardcoded domain URLs in home and FAQ breadcrumbs | ef0e540 | 2 pages |

## Verification

- All 7 public pages emit BreadcrumbList JSON-LD
- /services emits 10 ServiceSchema blocks (one per BUSINESS_INFO.services entry)
- /location emits TouristAttractionSchema
- Zero hardcoded `'https://www.montanaparasail.com/'` strings in breadcrumb arrays
- `npm run build` passed successfully

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

Files verified:
- src/app/services/page.tsx — FOUND, contains generateServiceSchema + generateBreadcrumbSchema
- src/app/location/page.tsx — FOUND, contains generateTouristAttractionSchema + generateBreadcrumbSchema
- src/app/gallery/page.tsx — FOUND, contains generateBreadcrumbSchema
- src/app/book/page.tsx — FOUND, contains generateBreadcrumbSchema
- src/app/jobs/page.tsx — FOUND, contains generateBreadcrumbSchema
- src/app/page.tsx — FOUND, uses BUSINESS_INFO.url
- src/app/faq/page.tsx — FOUND, uses BUSINESS_INFO.url

Commits verified:
- e9ffb34 — FOUND (Task 1)
- ef0e540 — FOUND (Task 2)
