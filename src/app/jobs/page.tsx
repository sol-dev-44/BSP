import { generatePageMetadata } from '@/config/seo'
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import JobsClient from './JobsClient'

export const metadata = generatePageMetadata(
    'Jobs | Big Sky Parasail - Flathead Lake, Montana',
    'Join the Big Sky Parasail crew on Flathead Lake. We\'re hiring for Dock Sales, Boat Crew, and coding internship roles for the 2026 season.',
    '/jobs'
)

export default function JobsPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Jobs', url: `${BUSINESS_INFO.url}/jobs` },
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <JobsClient />
        </>
    )
}
