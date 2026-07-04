'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Drop-in <img> replacement that lazy-loads and fades in once loaded,
 * so below-fold imagery blooms in instead of popping.
 *
 * Callers keep full control of styling via className — include `opacity`
 * in the element's transition property (e.g. `transition-[transform,opacity]`)
 * for the fade to animate.
 */
export function FadeInImage({ className = '', onLoad, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    const ref = useRef<HTMLImageElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Cached images can be complete before hydration and never fire onLoad
    useEffect(() => {
        if (ref.current?.complete) setIsLoaded(true)
    }, [])

    return (
        <img
            {...props}
            ref={ref}
            alt={props.alt ?? ''}
            loading={props.loading ?? 'lazy'}
            onLoad={(e) => {
                setIsLoaded(true)
                onLoad?.(e)
            }}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
    )
}
