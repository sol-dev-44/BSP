'use client'

import { RetroStripes } from './RetroStripes'

interface SectionDividerProps {
    withStripes?: boolean
    spacing?: 'sm' | 'md' | 'lg'
    className?: string
}

/**
 * SectionDivider Component
 *
 * Provides consistent visual separation between major page sections.
 * Can optionally include retro stripe pattern.
 *
 * @param withStripes - Whether to include the retro stripe pattern (default: true)
 * @param spacing - Vertical spacing around divider: 'sm' | 'md' | 'lg' (default: 'md')
 * @param className - Additional CSS classes
 */
export function SectionDivider({
    withStripes = true,
    spacing = 'md',
    className = ''
}: SectionDividerProps) {
    const spacingClasses = {
        sm: 'py-8',
        md: 'py-12',
        lg: 'py-16',
    }

    return (
        <div className={`${spacingClasses[spacing]} ${className}`}>
            {withStripes && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <RetroStripes />
                </div>
            )}
        </div>
    )
}
