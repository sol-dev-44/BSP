---
quick_id: 260606-dhm
type: execute
mode: quick
wave: 1
depends_on: []
files_modified:
    - src/lib/useIsMobile.ts
    - src/components/Hero.tsx
    - src/components/Stats.tsx
    - src/components/VesselShowcase.tsx
    - src/components/ExperienceGallery.tsx
    - src/components/Testimonials.tsx
    - src/components/InstagramFeed.tsx
    - src/components/LocationHighlights.tsx
autonomous: false
requirements:
    - QUICK-260606-DHM
must_haves:
    truths:
        - "On mobile (<768px), homepage scrolling does not flash or flicker cards/images as the URL bar collapses or expands"
        - "On desktop (>=768px), all existing entrance animations and hero parallax continue to play exactly as before"
        - "Tapping an ExperienceGallery image on touch devices does not leave a stuck hover/zoom state during scroll"
    artifacts:
        - path: "src/lib/useIsMobile.ts"
          provides: "SSR-safe useIsMobile() hook backed by matchMedia change events (not window.resize)"
        - path: "src/components/Hero.tsx"
          provides: "Hero with parallax disabled on mobile (motion.div wrapper swapped for plain div)"
        - path: "src/components/Stats.tsx"
          provides: "whileInView entrance animations gated on !isMobile"
        - path: "src/components/VesselShowcase.tsx"
          provides: "whileInView entrance animations gated on !isMobile (all 8+ motion.divs)"
        - path: "src/components/ExperienceGallery.tsx"
          provides: "whileInView gated + hover effects gated on (hover: hover) media query"
        - path: "src/components/Testimonials.tsx"
          provides: "Header whileInView gated on !isMobile"
        - path: "src/components/InstagramFeed.tsx"
          provides: "whileInView entrance animations gated on !isMobile"
        - path: "src/components/LocationHighlights.tsx"
          provides: "whileInView entrance animations gated on !isMobile"
    key_links:
        - from: "all six section components + Hero.tsx"
          to: "src/lib/useIsMobile.ts"
          via: "import { useIsMobile } from '@/lib/useIsMobile'"
          pattern: "useIsMobile\\(\\)"
        - from: "Hero.tsx"
          to: "motion.div parallax wrapper"
          via: "conditional render — plain div when isMobile, motion.div with style={{ y }} otherwise"
          pattern: "isMobile \\?"
---

<objective>
Eliminate mobile-only flicker on the homepage caused by (1) hero parallax repainting on iOS Safari URL bar collapse, (2) dense `whileInView` IntersectionObserver re-fires across 6 section components when viewport height changes, and (3) sticky `group-hover` states on the ExperienceGallery cards being triggered by touch.

Purpose: Mobile users currently see cards and images "flash" repeatedly while scrolling the homepage. Other pages don't suffer this because they don't stack a video parallax hero with 6 staggered card-grid sections in sequence. The fix gates all entrance animations and parallax on a single SSR-safe `useIsMobile()` hook so desktop behavior is untouched while mobile gets a calm, static render.

Output:
- New hook `src/lib/useIsMobile.ts` (matchMedia-backed, NOT resize-backed)
- Hero parallax conditionally disabled on mobile
- Six section components have `whileInView` gated on `!isMobile`
- ExperienceGallery hover effects gated on `(hover: hover)` so touch never triggers zoom/overlay
</objective>

<context>
@CLAUDE.md
@src/app/page.tsx
@src/components/Hero.tsx
@src/components/Stats.tsx
@src/components/VesselShowcase.tsx
@src/components/ExperienceGallery.tsx
@src/components/Testimonials.tsx
@src/components/InstagramFeed.tsx
@src/components/LocationHighlights.tsx

<conventions>
- 4-space indentation (per CLAUDE.md), single quotes for imports, semicolons consistent
- `@/*` alias for all internal imports — NEVER use relative paths
- `'use client'` at top of any file using hooks or browser APIs
- Tailwind v4 (no custom config beyond darkMode/content); arbitrary variants like `[@media(hover:hover)]:` are supported
- Brand palette already inline as hex literals — do not change any visual styling
</conventions>

<interfaces>
The new hook signature that all six components + Hero will import:

```ts
// src/lib/useIsMobile.ts
export function useIsMobile(query?: string): boolean
```

Default query: `'(max-width: 767px)'` (matches Tailwind's `md:` breakpoint at 768px).
Returns `false` during SSR and initial client paint, then `true`/`false` after `useEffect` runs based on matchMedia. Subscribes to matchMedia `change` events — NOT `window.resize` — because iOS Safari fires `resize` on URL bar collapse but does not fire matchMedia `change` unless the breakpoint actually crosses. This is the entire point of the fix.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create useIsMobile hook</name>
  <files>src/lib/useIsMobile.ts</files>
  <action>
Create a new file `src/lib/useIsMobile.ts` with the exact contents below. Use 4-space indentation, single quotes, semicolons (per CLAUDE.md project conventions).

```ts
'use client'

import { useEffect, useState } from 'react'

/**
 * SSR-safe hook that returns true when the viewport matches the given media query.
 *
 * IMPORTANT: This subscribes to matchMedia `change` events, NOT `window.resize`.
 * On iOS Safari and mobile Chrome the URL bar collapse/expand fires `resize`
 * but does NOT fire matchMedia `change` unless the breakpoint actually crosses.
 * Using matchMedia is what prevents re-renders (and animation re-fires) during
 * normal mobile scrolling.
 *
 * Default query: `(max-width: 767px)` — matches everything below Tailwind's `md:` breakpoint.
 *
 * SSR: returns `false` on the server and during the first client paint to avoid
 * hydration mismatches. Real value is set inside `useEffect`.
 */
export function useIsMobile(query: string = '(max-width: 767px)'): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(query);
        setIsMobile(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [query]);

    return isMobile;
}
```

Do NOT add a default export. Do NOT use `window.resize`. Do NOT use a `useLayoutEffect` (it doesn't run on the server and would cause a hydration warning).
  </action>
  <verify>
    <automated>npx tsc --noEmit -p . 2>&amp;1 | grep -E "(useIsMobile|error TS)" || echo "OK - no TS errors related to new hook"</automated>
  </verify>
  <done>File exists at src/lib/useIsMobile.ts; exports named `useIsMobile`; uses matchMedia + change event (not resize); SSR-safe initial value of `false`; passes `tsc --noEmit`.</done>
</task>

<task type="auto">
  <name>Task 2: Gate Hero parallax + all six section whileInView animations on !isMobile</name>
  <files>src/components/Hero.tsx, src/components/Stats.tsx, src/components/VesselShowcase.tsx, src/components/ExperienceGallery.tsx, src/components/Testimonials.tsx, src/components/InstagramFeed.tsx, src/components/LocationHighlights.tsx</files>
  <action>
For each of the seven files below, import `useIsMobile` from `@/lib/useIsMobile` and call it inside the component body: `const isMobile = useIsMobile();`. Then apply the gating pattern described per file. Use Approach B (conditional initial/whileInView/viewport/transition) — when `initial={false}` and `whileInView` is omitted, Framer skips the entrance animation entirely and renders at the final visual state. This is exactly the desired mobile behavior. Hooks MUST be called unconditionally (top of component) — do NOT wrap in `if`.

CRITICAL: Do NOT change any visual styling, classes, hex colors, layout, spacing, or business logic. Only the motion props change. Do NOT touch:
- Stats.tsx `AnimatedCounter` / `useInView(ref, ...)` — this is a counter, not an entrance animation, and `once: true` already prevents re-fires
- VesselShowcase.tsx two ambient glow `motion.div`s with `animate={{ scale, opacity }}` and `repeat: Infinity` — these are decorative loops, opacity-10, won't flicker
- Testimonials.tsx `AnimatePresence` slider + `motion.button` whileHover/whileTap — those are user-driven, not scroll-triggered
- ExperienceGallery.tsx lightbox modal `motion.div` — only fires when an image is clicked
- LocationHighlights.tsx card `whileHover={{ y: -5 }}` — that's a desktop hover; touch won't fire it meaningfully and disabling would break desktop

### File 1: src/components/Hero.tsx

Add the import at the top of the existing imports:

```tsx
import { useIsMobile } from '@/lib/useIsMobile'
```

Inside `Hero()`, after the existing `useScroll`/`useTransform` lines (these MUST stay — hooks called unconditionally), add:

```tsx
const isMobile = useIsMobile();
```

Then replace the existing `<motion.div style={{ y }} className="absolute inset-0 w-full h-full">` wrapper (lines 13-38) with a conditional render. The cleanest pattern: extract its children to a const, then render either the motion wrapper (desktop) or a plain `<div>` (mobile). Example structure:

```tsx
const heroBackground = (
    <>
        <video ... >...</video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D1C00]/30 via-[#3D1C00]/60 to-[#FFF8EE]" />
        <div className="absolute inset-0 bg-[#FF9500]/15 mix-blend-multiply" />
    </>
);

{isMobile ? (
    <div className="absolute inset-0 w-full h-full">
        {heroBackground}
    </div>
) : (
    <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        {heroBackground}
    </motion.div>
)}
```

Why a plain `<div>` and not `<motion.div style={{ y: 0 }}>`: even `y: 0` creates a compositor transform layer that iOS Safari treats specially. A plain div has zero transform overhead.

Leave the lower content section (lines 41-90: the `<motion.div>` with `initial`/`animate` headline + buttons) UNCHANGED. Those use `animate` (one-time mount), not `whileInView`, so they fire once and never re-trigger. Not the cause of flicker.

### File 2: src/components/Stats.tsx

Add: `import { useIsMobile } from '@/lib/useIsMobile'` and `const isMobile = useIsMobile();` at the top of the `Stats()` function body (BEFORE `const stats = [...]`).

Gate the header `motion.p` (lines 52-60) and each stat card `motion.div` inside `stats.map` (lines 63-70). Pattern for every gated motion element:

```tsx
<motion.p
    initial={isMobile ? false : { opacity: 0, y: 10 }}
    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
    viewport={isMobile ? undefined : { once: true }}
    transition={isMobile ? undefined : { duration: 0.6 }}
    className="..."  // unchanged
>
```

Apply identically to the stat card `motion.div` (preserve its existing `transition={{ duration: 0.5, delay: index * 0.1 }}` for desktop). Do NOT touch the inner `AnimatedCounter` or `StarRating`.

### File 3: src/components/VesselShowcase.tsx

Add: `import { useIsMobile } from '@/lib/useIsMobile'` and `const isMobile = useIsMobile();` at the top of the `VesselShowcase()` function body (BEFORE `const highlights = [...]`).

Gate ALL of the following `motion.div`s using the same conditional pattern as Stats:
- Editorial Header (lines 65-71)
- Main Cloud Dancer image card (lines 89-94)
- First-row highlight cards inside `highlights.slice(0, 2).map` (lines 113-119)
- Second-row highlight cards inside `highlights.slice(2).map` (lines 141-147)
- Leroy image card (lines 163-168)
- Vessel Specs card (lines 184-189)
- Bottom safety badge (lines 207-212)

For each, preserve the desktop `transition` (durations and delays) inside the `isMobile ? undefined : { ... }` branch.

Do NOT touch the two ambient glow motion.divs (lines 45-60) — these have `animate` (continuous loop), not `whileInView`, and they're decorative at opacity-10. Leaving them avoids visual change for desktop.

### File 4: src/components/ExperienceGallery.tsx

Add: `import { useIsMobile } from '@/lib/useIsMobile'` and `const isMobile = useIsMobile();` at the top of the `ExperienceGallery()` function body (BEFORE `const [selectedImage, ...]`).

Gate the section header `motion.div` (lines 60-65), each gallery card `motion.div` inside `images.map` (lines 78-87), and the "View All CTA" `motion.div` (lines 109-114). Pattern same as Stats.

For gallery cards specifically, the initial state is `{ opacity: 0, scale: 0.8 }` and whileInView is `{ opacity: 1, scale: 1 }`. Preserve `transition={{ duration: 0.5, delay: index * 0.05 }}` for desktop only.

Do NOT touch the lightbox modal `<motion.div>` (lines 124+) — only fires on image click.

Hover gating for this file is Task 3 (separate task, separate commit). Leave hover classes untouched in this task.

### File 5: src/components/Testimonials.tsx

Add: `import { useIsMobile } from '@/lib/useIsMobile'` and `const isMobile = useIsMobile();` at the top of the `Testimonials()` function body (BEFORE `const [currentIndex, ...]`).

Gate ONLY the header `motion.div` (lines 122-127). The testimonial card inside `AnimatePresence` (lines 141-164) is a user-driven slider — leave it untouched. The `StarRating` motion.divs animate on mount of each star — leave untouched. The navigation `motion.button` whileHover/whileTap — leave untouched.

### File 6: src/components/InstagramFeed.tsx

Add: `import { useIsMobile } from '@/lib/useIsMobile'` and `const isMobile = useIsMobile();` at the top of the `InstagramFeed()` function body.

Gate the header `motion.div` (lines 25-30), each grid item `motion.a` inside `INSTAGRAM_POSTS.map` (lines 49-58), and the "Follow CTA" `motion.div` (lines 80-85).

For the `motion.a` items, preserve `transition={{ duration: 0.5, delay: index * 0.1 }}` for desktop only.

### File 7: src/components/LocationHighlights.tsx

Add: `import { useIsMobile } from '@/lib/useIsMobile'` and `const isMobile = useIsMobile();` at the top of the `LocationHighlights()` function body.

Gate the header `motion.div` (lines 39-44), each location card `motion.div` inside `highlights.map` (lines 57-64), and the CTA `motion.div` (lines 98-103).

For the location cards, preserve `whileHover={{ y: -5 }}` UNCONDITIONALLY (do not gate on mobile) — it only fires on hover, touch won't meaningfully trigger it, and disabling would change desktop UX. Only gate the entrance: `initial`, `whileInView`, `viewport`, `transition`.

### Self-check before completing this task

For each of the seven files, confirm:
- [ ] `import { useIsMobile } from '@/lib/useIsMobile'` added (single quotes, semicolon, alias path)
- [ ] `const isMobile = useIsMobile();` called at top of component body, before any other state
- [ ] No `if`-wrapped hook calls (hooks must be unconditional)
- [ ] Only motion props changed — zero changes to className, hex colors, layout, text content, business logic
- [ ] Desktop `transition` durations and delays preserved inside the `isMobile ? undefined : {...}` branch
- [ ] 4-space indentation maintained throughout
  </action>
  <verify>
    <automated>npx tsc --noEmit -p . 2>&amp;1 | grep -E "error TS" | head -20 || echo "OK - no TS errors"</automated>
    <automated>npm run lint 2>&amp;1 | tail -20</automated>
    <automated>grep -l "useIsMobile" src/components/Hero.tsx src/components/Stats.tsx src/components/VesselShowcase.tsx src/components/ExperienceGallery.tsx src/components/Testimonials.tsx src/components/InstagramFeed.tsx src/components/LocationHighlights.tsx | wc -l | grep -q "^7$" &amp;&amp; echo "OK - all 7 files import useIsMobile" || echo "FAIL - not all 7 files import useIsMobile"</automated>
  </verify>
  <done>All 7 files import and call `useIsMobile`. All `whileInView` entrance animations described above are gated on `!isMobile`. Hero parallax `motion.div` is conditionally swapped for a plain `<div>` on mobile. TypeScript compiles, ESLint passes, no visual class/style changes.</done>
</task>

<task type="auto">
  <name>Task 3: Gate ExperienceGallery hover effects on (hover: hover) media query</name>
  <files>src/components/ExperienceGallery.tsx</files>
  <action>
On touch devices, tapping a gallery card currently fires `group-hover` and the image zooms / overlay appears, then sticks during scroll — contributing to flicker. Tailwind v4 supports the arbitrary variant `[@media(hover:hover)]:` which only applies the modifier on devices that genuinely support hover (i.e. real mice). The two existing `hover:` border/shadow utilities on the wrapper card are fine (they require an actual pointer event and won't fire on tap-then-scroll), but the three `group-hover:*` classes need gating because they cascade from a parent group state that mobile Safari latches.

### Changes (three lines only)

Locate the gallery card `motion.div` (around line 84) and the children `<img>` (line 92) and overlay `<div>` (line 96). Make these targeted edits:

**Line ~92 — image element:** change
```tsx
className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
```
to
```tsx
className="w-full h-full object-cover [@media(hover:hover)]:group-hover:scale-110 transition-transform duration-700"
```

**Line ~96 — overlay div:** change
```tsx
className="absolute inset-0 bg-gradient-to-t from-[#3D1C00]/80 via-[#3D1C00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
```
to
```tsx
className="absolute inset-0 bg-gradient-to-t from-[#3D1C00]/80 via-[#3D1C00]/20 to-transparent opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-300"
```

**Line ~84 — wrapper card `motion.div`:** the `hover:border-[#FF9500]/40` and `hover:shadow-[...]` classes can stay — those are direct `hover:` (not `group-hover:`) and require an actual pointer hover event; mobile tap won't latch them. Leave the wrapper `className` untouched apart from any motion-prop changes already made in Task 2.

That's it. No other lines change. Do NOT touch:
- The `transition-all duration-500` on the wrapper (still useful for desktop border/shadow transitions)
- The lightbox modal hover classes
- Any other component file (the issue is specifically the dense bento grid in ExperienceGallery; the InstagramFeed `group-hover:scale-110` and `group-hover:opacity-100` are on a simpler 2-col grid and the user did not report flicker there; we could gate them too as a precaution, but the brief says ExperienceGallery is the culprit and we want surgical changes)

### Self-check

- [ ] Exactly two class strings modified — both inside ExperienceGallery.tsx gallery card map
- [ ] `[@media(hover:hover)]:` prefix added BEFORE `group-hover:` (Tailwind variant order matters)
- [ ] No other files touched
- [ ] No new imports needed
  </action>
  <verify>
    <automated>npx tsc --noEmit -p . 2>&amp;1 | grep -E "error TS" | head -10 || echo "OK - no TS errors"</automated>
    <automated>npm run lint 2>&amp;1 | tail -10</automated>
    <automated>grep -c "\[@media(hover:hover)\]:group-hover:" src/components/ExperienceGallery.tsx | grep -q "^2$" &amp;&amp; echo "OK - exactly 2 hover gates present" || echo "FAIL - expected 2 occurrences of [@media(hover:hover)]:group-hover:"</automated>
  </verify>
  <done>Both `group-hover:scale-110` (on `<img>`) and `group-hover:opacity-100` (on overlay `<div>`) inside ExperienceGallery.tsx are prefixed with `[@media(hover:hover)]:`. TypeScript compiles. ESLint passes. Touch devices no longer trigger the zoom or overlay.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Mobile verification on real device</name>
  <what-built>
- `src/lib/useIsMobile.ts` — SSR-safe matchMedia hook
- Hero parallax disabled on mobile (plain div wrapper instead of `motion.div style={{ y }}`)
- All `whileInView` entrance animations on Stats, VesselShowcase, ExperienceGallery, Testimonials header, InstagramFeed, and LocationHighlights gated on `!isMobile`
- ExperienceGallery card image zoom and overlay gated on `(hover: hover)` so touch never triggers them
  </what-built>
  <how-to-verify>
1. Start the dev server:
   ```bash
   npm run dev
   ```
2. **Desktop check (Chrome at normal window size):**
   - Visit http://localhost:3000
   - Scroll the full homepage top to bottom
   - Hero video should still parallax as you scroll
   - Stats counter still animates to its final value when it scrolls into view
   - Each section's cards still fade/slide in as you scroll past them
   - Hover the ExperienceGallery cards: image still zooms, overlay with caption still appears
   - Hover the LocationHighlights cards: they still lift (`y: -5`)
3. **Mobile check (Chrome DevTools mobile emulation — iPhone 14 Pro or similar, then refresh page):**
   - Visit http://localhost:3000
   - Scroll the full homepage top to bottom slowly, then quickly
   - Hero video should NOT parallax (it's a static layer)
   - Stats, vessel cards, gallery images, testimonial header, instagram tiles, location cards should appear instantly at final position (no fade-in) and stay there — no flashing as you scroll up/down
   - Tap an ExperienceGallery image: it opens the lightbox (it should NOT zoom in place or show a sticky caption overlay before opening)
4. **Real iOS Safari check (if available):**
   - Open the dev URL on an actual iPhone over the network
   - Scroll up and down — pay attention to the moment when the URL bar collapses (scrolling down) and expands (scrolling up)
   - Confirm cards/images do NOT flash during URL bar transitions
   - This is the failure mode the user originally reported; desktop emulation cannot fully reproduce iOS Safari's URL bar behavior
5. **Other pages check (regression):**
   - Visit /book, /faq, /gallery, /services, /location on both desktop and mobile
   - Confirm no visual regressions — these pages don't use `useIsMobile` so they should be identical to before
  </how-to-verify>
  <resume-signal>Type "approved" when mobile flicker is gone and desktop behavior is unchanged, or describe any remaining issues.</resume-signal>
</task>

</tasks>

<verification>
- TypeScript compiles cleanly: `npx tsc --noEmit -p .`
- ESLint passes: `npm run lint`
- Dev build succeeds: `npm run dev` boots without runtime errors
- Visual: desktop animations unchanged; mobile shows static cards (no entrance fades) and no parallax; ExperienceGallery cards don't zoom or show caption overlay on tap
- Hydration: no React hydration mismatch warning in browser console (the hook's default-false initial state ensures SSR/client agreement on first paint)
</verification>

<success_criteria>
- Mobile homepage scrolls smoothly with no card/image flashing during URL bar collapse/expand
- Desktop homepage entrance animations and hero parallax are visually identical to before
- ExperienceGallery cards do not exhibit sticky hover state on touch devices
- No TypeScript errors, no ESLint errors, no console hydration warnings
- Other pages (/book, /faq, /gallery, /services, /location) are unaffected
</success_criteria>

<output>
This is a quick task — no SUMMARY.md required. Commit each task atomically:
- Task 1: `feat(quick/260606-dhm): add useIsMobile hook for SSR-safe mobile breakpoint detection`
- Task 2: `fix(quick/260606-dhm): gate homepage entrance animations + hero parallax on !isMobile`
- Task 3: `fix(quick/260606-dhm): gate ExperienceGallery hover effects on (hover: hover) media query`

After Task 4 approval, update `.planning/STATE.md` Quick Tasks Completed table with row: `| 260606-dhm | Fix mobile homepage scroll flickering | 2026-06-06 | {commit-sha} | [260606-dhm-fix-mobile-homepage-scroll-flickering](./quick/260606-dhm-fix-mobile-homepage-scroll-flickering/) |`
</output>
