import { generatePageMetadata } from '@/config/seo'
import { generateTouristAttractionSchema, generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import LocationClient from './LocationClient'

export const metadata = generatePageMetadata(
    'Location & Directions | Big Sky Parasail - Flathead Lake',
    'Find us at Flathead Harbor Marina in Lakeside, Montana. Get directions, parking info, and discover nearby attractions like Glacier National Park.',
    '/location'
)

export default function LocationPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Location & Directions', url: `${BUSINESS_INFO.url}/location` },
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <StructuredData data={generateTouristAttractionSchema()} />
            <LocationClient />
        </>
    )
}
