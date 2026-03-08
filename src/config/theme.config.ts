/**
 * Theme Configuration
 *
 * Retro Sunset Theme
 * Deep reds, corals, burnt orange, golden amber + blue accent.
 *
 * This is the single source of truth for all brand colors and theme settings.
 * To rebrand for a sister site, simply update the colors in this file.
 *
 * Usage:
 * - Import this config in components that need theme colors
 * - CSS variables are generated from these values in globals.css
 * - Tailwind classes are generated from these values in tailwind.config.ts
 */

export const themeConfig = {
    brand: {
        name: 'Big Sky Parasail',
        colors: {
            // Retro Sunset Color Palette
            stripe1: '#B5383B', // Deep Red - First stripe color
            stripe2: '#D4605A', // Coral - Second stripe color
            stripe3: '#E07840', // Burnt Orange - Third stripe color
            stripe4: '#E5A832', // Golden Amber - Fourth stripe color
            accent: '#3B6BA5', // Blue Accent
        },
    },

    stripes: {
        height: '3px',
        spacing: '0px',
    },

    gradients: {
        primary: {
            from: 'stripe2',  // Coral
            to: 'stripe4',    // Golden Amber
            direction: 'to-r'
        },
        heading: {
            from: 'stripe1',  // Deep Red
            to: 'stripe4',    // Golden Amber
            direction: 'to-r'
        },
        accent: {
            from: 'stripe4',  // Golden Amber
            to: 'stripe2',    // Coral
            direction: 'to-r'
        }
    },

    semantic: {
        primary: '#D4605A',      // Coral
        secondary: '#E5A832',    // Golden Amber
        accent: '#3B6BA5',       // Blue Accent
        highlight: '#B5383B',    // Deep Red
    },
} as const

// Type-safe color access
export type ThemeColors = typeof themeConfig.brand.colors
export type SemanticColors = typeof themeConfig.semantic

// Helper function to get CSS variable name
export const getCSSVar = (colorKey: keyof ThemeColors | keyof SemanticColors) => {
    return `var(--color-${colorKey.replace(/([A-Z])/g, '-$1').toLowerCase()})`
}

// Export individual colors for convenience
export const colors = themeConfig.brand.colors
export const semanticColors = themeConfig.semantic
export const stripeConfig = themeConfig.stripes
