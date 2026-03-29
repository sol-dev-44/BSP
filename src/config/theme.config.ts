/**
 * Theme Configuration
 *
 * Cyberpunk Neon Theme
 * Deep dark blue-black surfaces, neon cyan primary, magenta secondary, lime accents.
 * Glowing neon effects, futuristic typography, high contrast.
 *
 * This is the single source of truth for all brand colors and theme settings.
 */

export const themeConfig = {
    brand: {
        name: 'Big Sky Parasail',
        colors: {
            primary: '#00f0ff',
            primaryContainer: '#0099bb',
            secondary: '#ff00ff',
            secondaryContainer: '#aa00aa',
            tertiary: '#b8ff00',
            tertiaryContainer: '#7acc00',
            surface: '#0a0a14',
            surfaceContainerLowest: '#050510',
            surfaceContainerLow: '#0d0d1f',
            surfaceContainer: '#111128',
            surfaceContainerHigh: '#1a1a3e',
            surfaceContainerHighest: '#1e1e45',
            onSurface: '#e0f0ff',
            onSurfaceVariant: '#b0c4de',
            outline: '#5a6a8a',
            outlineVariant: '#2a2a4a',
        },
    },

    gradients: {
        primary: {
            from: '#00f0ff',
            to: '#0099bb',
            direction: 'to-r'
        },
        secondary: {
            from: '#ff00ff',
            to: '#aa00aa',
            direction: 'to-r'
        },
        cta: {
            from: '#00f0ff',
            to: '#ff00ff',
            direction: 'to-r'
        }
    },

    semantic: {
        primary: '#00f0ff',
        secondary: '#ff00ff',
        tertiary: '#b8ff00',
        surface: '#0a0a14',
        onSurface: '#e0f0ff',
    },
} as const

export type ThemeColors = typeof themeConfig.brand.colors
export type SemanticColors = typeof themeConfig.semantic

export const colors = themeConfig.brand.colors
export const semanticColors = themeConfig.semantic
