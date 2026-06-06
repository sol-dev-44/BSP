---
quick_id: 260606-dhm
phase: quick
plan: 260606-dhm
subsystem: marketing-site
tags: [mobile, performance, ios-safari, framer-motion, ux]
requirements: [QUICK-260606-DHM]
key-files:
    created:
        - src/lib/useIsMobile.ts
    modified:
        - src/components/Hero.tsx
        - src/components/Stats.tsx
        - src/components/VesselShowcase.tsx
        - src/components/ExperienceGallery.tsx
        - src/components/Testimonials.tsx
        - src/components/InstagramFeed.tsx
        - src/components/LocationHighlights.tsx
decisions:
    - Used matchMedia + 'change' events (not window.resize) so iOS Safari URL bar collapse never fires the listener
    - Used Approach B (conditional initial/whileInView/viewport/transition each gated on isMobile) instead of unmounting motion.div entirely — keeps DOM stable, only animation orchestration is skipped
    - Hero mobile path uses a plain <div> (not motion.div with y:0) — even an identity transform creates a compositor layer iOS Safari treats specially
    - LocationHighlights cards keep whileHover={{ y: -5 }} unconditionally — touch won't latch it and gating would change desktop UX
    - ExperienceGallery hover gated with Tailwind v4 arbitrary variant [@media(hover:hover)]: rather than JS — pure CSS, no extra renders
metrics:
    duration: "~12 min"
    completed: "2026-06-06"
    tasks_completed: 3
    files_modified: 8
---

# Quick Task 260606-dhm: Fix mobile homepage scroll flickering Summary

One-liner: Added SSR-safe useIsMobile() matchMedia hook and gated all six homepage section `whileInView` entrance animations plus the Hero parallax + ExperienceGallery hover-zoom on it, eliminating iOS Safari URL-bar-collapse flicker without changing any desktop behavior.

## What Was Built

### Task 1 — useIsMobile hook (commit 2ce8191)

New file `src/lib/useIsMobile.ts` exports `useIsMobile(query?: string): boolean`:

- Default query `(max-width: 767px)` matches Tailwind's `md:` breakpoint
- Subscribes to `MediaQueryList.change` (NOT `window.resize`) — iOS Safari fires `resize` on every URL bar collapse but only fires `change` when the breakpoint actually crosses
- SSR-safe: returns `false` on server + first client paint, real value set in `useEffect` to avoid hydration mismatch
- No `useLayoutEffect` (would warn during SSR)

### Task 2 — Gate Hero parallax + section entrance animations (commit 8a29990)

Imported `useIsMobile` in seven components and gated entrance animations:

- **Hero.tsx**: Background wrapper conditionally renders `<motion.div style={{ y }}>` (desktop) or plain `<div>` (mobile). Extracted video/gradient/tint children to a `heroBackground` fragment for reuse. Lower content `<motion.div>` left untouched (uses `animate`, not `whileInView`, fires once on mount).
- **Stats.tsx**: Header `motion.p` and stat-card `motion.div` map gated. AnimatedCounter and StarRating untouched (counter is `useInView`-driven with `once: true`).
- **VesselShowcase.tsx**: All seven scroll-triggered `motion.div`s gated (editorial header, main image, both rows of highlight cards, Leroy card, vessel specs, safety badge). Two ambient glow `motion.div`s with infinite-repeat `animate` left untouched.
- **ExperienceGallery.tsx**: Header, gallery card map (14 images), and "View All CTA" gated. Lightbox modal untouched (click-driven).
- **Testimonials.tsx**: Section header gated. `AnimatePresence` slider + `motion.button` whileHover/whileTap + per-star `StarRating` motion.divs intentionally untouched (all user-driven, not scroll-triggered).
- **InstagramFeed.tsx**: Header, 9-tile grid `motion.a` map, and Follow CTA gated.
- **LocationHighlights.tsx**: Header, 4-card map, and CTA gated. `whileHover={{ y: -5 }}` on cards preserved unconditionally.

Pattern used (Approach B): when `isMobile` is true, all four motion props become falsy (`initial={false}` + `whileInView/viewport/transition={undefined}`) so framer-motion skips the IntersectionObserver entirely and renders at the final visual state. Desktop transitions, durations, and stagger delays are fully preserved inside the `: { ... }` branch.

### Task 3 — Gate ExperienceGallery hover effects (commit 5845ed5)

Two `className` strings inside the gallery card map:

- `<img>`: `group-hover:scale-110` → `[@media(hover:hover)]:group-hover:scale-110`
- Overlay `<div>`: `group-hover:opacity-100` → `[@media(hover:hover)]:group-hover:opacity-100`

Tailwind v4 arbitrary variant `[@media(hover:hover)]:` only applies the cascading `group-hover:*` modifier on devices that truly support hover (real mice). On touch devices the zoom and overlay can no longer be latched by a tap-then-scroll gesture — purely CSS, no JS path, no re-renders.

Direct `hover:` utilities on the wrapper card (`hover:border-[#FF9500]/40`, `hover:shadow-*`) left intact — they require a real pointer hover and won't fire on touch.

## How the Fix Works (Why Mobile No Longer Flickers)

The original flicker had three independent root causes stacking together:

1. **Hero parallax**: `useScroll` + `useTransform` recomputed `y` on every iOS Safari layout shift triggered by URL bar collapse, forcing a transform repaint of the full-bleed video layer. Fixed by removing the `motion.div` wrapper entirely on mobile.
2. **Dense `whileInView`**: Six sections used `IntersectionObserver`-backed entrance animations. When iOS Safari's URL bar changes height, viewport dimensions change, IntersectionObserver re-evaluates entries, and any `motion.div` that briefly leaves the rootMargin window re-fires its entrance animation. With `once: true` only the first fire animates — but `once` is the second-pass guard; the first-pass entry/exit IS visible flicker. Gating on `!isMobile` skips IntersectionObserver registration entirely.
3. **Sticky `group-hover`**: Tapping an ExperienceGallery card on mobile Safari briefly applied `:hover` to the card, latching `group-hover:scale-110` (image zoom) and `group-hover:opacity-100` (overlay) which then persisted during scroll. `[@media(hover:hover)]:` makes those modifiers no-ops on touch.

Other pages (`/book`, `/faq`, `/gallery`, `/services`, `/location`) don't import `useIsMobile`, so they are byte-for-byte unchanged.

## Deviations from Plan

None — plan executed exactly as written. All three task self-checks passed on the first run.

## Verification

- TypeScript: `npx tsc --noEmit -p .` — clean, no errors
- ESLint: project has a pre-existing ESLint v9 config issue (`ESLint couldn't find an eslint.config.(js|mjs|cjs) file`) that prevents `npm run lint` from running. This is **not** caused by this task and exists on the prior `main` HEAD. Reported as informational per task constraints. TypeScript strict-mode compilation is the authoritative type-safety signal here.
- All 7 modified components import `useIsMobile` (verified via grep)
- ExperienceGallery contains exactly 2 occurrences of `[@media(hover:hover)]:group-hover:` (verified via grep)

## Deferred / Out-of-Scope

- **InstagramFeed `group-hover:*` classes**: The brief explicitly limited hover gating to ExperienceGallery (the user-reported culprit; bento grid with 14 dense cards). The InstagramFeed `group-hover:scale-110` and `group-hover:opacity-100` on a simpler 3-col grid were not reported as causing flicker. Could be retrofitted to `[@media(hover:hover)]:` as a defensive measure in a follow-up if needed.
- **Project-wide ESLint v9 migration**: `eslint.config.js` is missing; the project still expects the legacy `.eslintrc.*` format. Surfaced during this task but unrelated to the fix. Belongs in a separate chore commit.

## Self-Check: PASSED

- FOUND: src/lib/useIsMobile.ts
- FOUND: commit 2ce8191 (feat: add useIsMobile hook)
- FOUND: commit 8a29990 (fix: gate entrance animations + hero parallax)
- FOUND: commit 5845ed5 (fix: gate ExperienceGallery hover effects)
- TypeScript compiles cleanly (no errors)
- All 7 target components verified importing useIsMobile
- ExperienceGallery has exactly 2 `[@media(hover:hover)]:group-hover:` occurrences
