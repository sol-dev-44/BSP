'use client'

interface RetroStripesProps {
    orientation?: 'horizontal' | 'vertical'
    className?: string
}

// Retro sunset stripe colors
const STRIPE_COLORS = {
    stripe1: '#B5383B', // Deep red
    stripe2: '#00f0ff', // Coral
    stripe3: '#E07840', // Burnt orange
    stripe4: '#ff00ff', // Golden amber
}

const STRIPE_HEIGHT = '6px'

/**
 * RetroStripes Component
 *
 * Renders the signature three-stripe pattern using '74 Montana retro colors.
 * Burnt orange, mustard gold, and saddle brown.
 *
 * @param orientation - 'horizontal' (default) or 'vertical'
 * @param className - Additional CSS classes to apply
 */
export function RetroStripes({ orientation = 'horizontal', className = '' }: RetroStripesProps) {
    const isHorizontal = orientation === 'horizontal'

    return (
        <div
            className={`flex ${isHorizontal ? 'flex-row w-full' : 'flex-col h-full'} gap-0 ${className}`}
            style={{
                [isHorizontal ? 'height' : 'width']: STRIPE_HEIGHT,
            }}
        >
            {/* First stripe - Deep Red */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe1 }}
            />
            {/* Second stripe - Coral */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe2 }}
            />
            {/* Third stripe - Burnt Orange */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe3 }}
            />
            {/* Fourth stripe - Golden Amber */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe4 }}
            />
        </div>
    )
}

export default RetroStripes
