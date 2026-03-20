/**
 * Theme Configuration
 *
 * Elevated Horizon Theme
 * Deep earthy browns, warm peachy pink primary, golden secondary.
 * Inspired by atmospheric kineticism and editorial design.
 *
 * This is the single source of truth for all brand colors and theme settings.
 */

export const themeConfig = {
    brand: {
        name: 'Big Sky Parasail',
        colors: {
            primary: '#ffb3ad',
            primaryContainer: '#e46c65',
            secondary: '#fbbb45',
            secondaryContainer: '#be8607',
            tertiary: '#f4ba96',
            tertiaryContainer: '#b98564',
            surface: '#1e1006',
            surfaceContainerLowest: '#190b03',
            surfaceContainerLow: '#28180d',
            surfaceContainer: '#2c1c11',
            surfaceContainerHigh: '#38261a',
            surfaceContainerHighest: '#433124',
            onSurface: '#fbddca',
            onSurfaceVariant: '#ddc0bd',
            outline: '#a58b88',
            outlineVariant: '#564240',
        },
    },

    gradients: {
        primary: {
            from: '#ffb3ad',
            to: '#e46c65',
            direction: 'to-r'
        },
        secondary: {
            from: '#fbbb45',
            to: '#be8607',
            direction: 'to-r'
        },
        cta: {
            from: '#ffb3ad',
            to: '#fbbb45',
            direction: 'to-r'
        }
    },

    semantic: {
        primary: '#ffb3ad',
        secondary: '#fbbb45',
        tertiary: '#f4ba96',
        surface: '#1e1006',
        onSurface: '#fbddca',
    },
} as const

export type ThemeColors = typeof themeConfig.brand.colors
export type SemanticColors = typeof themeConfig.semantic

export const colors = themeConfig.brand.colors
export const semanticColors = themeConfig.semantic
