'use client'

interface RetroStripesProps {
    orientation?: 'horizontal' | 'vertical'
    className?: string
}

// Montana '95 throwback stripe colors
const STRIPE_COLORS = {
    stripe1: '#FF9500', // Vivid Orange
    stripe2: '#FFD700', // Bright Gold
    stripe3: '#FFFFFF', // White
    stripe4: '#8B4513', // Saddle Brown
}

const STRIPE_HEIGHT = '6px'

/**
 * RetroStripes Component
 *
 * Renders the signature stripe pattern using Montana '95 throwback colors.
 * Vivid orange, bright gold, white, and saddle brown.
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
            {/* First stripe - Vivid Orange */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe1 }}
            />
            {/* Second stripe - Bright Gold */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe2 }}
            />
            {/* Third stripe - White */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe3 }}
            />
            {/* Fourth stripe - Saddle Brown */}
            <div
                className="flex-1"
                style={{ backgroundColor: STRIPE_COLORS.stripe4 }}
            />
        </div>
    )
}

export default RetroStripes
