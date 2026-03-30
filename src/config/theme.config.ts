/**
 * Theme Configuration
 *
 * Montana '95 Throwback Theme
 * Bright warm cream surfaces, vivid orange primary, bright gold secondary, white accents.
 * Bold collegiate typography, retro warmth, high energy.
 *
 * This is the single source of truth for all brand colors and theme settings.
 */

export const themeConfig = {
    brand: {
        name: 'Big Sky Parasail',
        colors: {
            primary: '#FF9500',
            primaryContainer: '#E07B00',
            secondary: '#FFD700',
            secondaryContainer: '#B8860B',
            tertiary: '#FFFFFF',
            tertiaryContainer: '#F0E6D3',
            surface: '#FFF8EE',
            surfaceContainerLowest: '#FFFFFF',
            surfaceContainerLow: '#FFFBF5',
            surfaceContainer: '#FFEACC',
            surfaceContainerHigh: '#FFD699',
            surfaceContainerHighest: '#FFCC80',
            onSurface: '#2D1600',
            onSurfaceVariant: '#614020',
            outline: '#A07840',
            outlineVariant: '#DCC8A0',
        },
    },

    gradients: {
        primary: {
            from: '#FF9500',
            to: '#E07B00',
            direction: 'to-r'
        },
        secondary: {
            from: '#FFD700',
            to: '#B8860B',
            direction: 'to-r'
        },
        cta: {
            from: '#FF9500',
            to: '#FFD700',
            direction: 'to-r'
        }
    },

    semantic: {
        primary: '#FF9500',
        secondary: '#FFD700',
        tertiary: '#FFFFFF',
        surface: '#FFF8EE',
        onSurface: '#2D1600',
    },
} as const

export type ThemeColors = typeof themeConfig.brand.colors
export type SemanticColors = typeof themeConfig.semantic

export const colors = themeConfig.brand.colors
export const semanticColors = themeConfig.semantic
