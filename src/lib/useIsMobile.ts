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
