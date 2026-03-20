interface SectionDividerProps {
    spacing?: 'sm' | 'md' | 'lg'
    className?: string
}

/**
 * SectionDivider Component
 *
 * Provides consistent vertical spacing between major page sections.
 * The Elevated Horizon design uses background color shifts between
 * sections rather than visual divider elements.
 *
 * @param spacing - Vertical spacing: 'sm' | 'md' | 'lg' (default: 'md')
 * @param className - Additional CSS classes
 */
export function SectionDivider({
    spacing = 'md',
    className = ''
}: SectionDividerProps) {
    const spacingClasses = {
        sm: 'py-8',
        md: 'py-16',
        lg: 'py-24',
    }

    return (
        <div className={`${spacingClasses[spacing]} ${className}`} />
    )
}
