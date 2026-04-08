import { generatePageMetadata } from '@/config/seo'
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import GalleryClient from './GalleryClient'

export const metadata = generatePageMetadata(
    'Photo Gallery | Parasailing Adventures on Flathead Lake',
    "See what it's like to soar above Flathead Lake, Montana. Browse photos of our happy customers, stunning mountain views, and aerial adventures.",
    '/gallery'
)

export default function GalleryPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Photo Gallery', url: `${BUSINESS_INFO.url}/gallery` },
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <GalleryClient />
        </>
    )
}
