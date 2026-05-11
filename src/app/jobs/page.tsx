import { generatePageMetadata } from '@/config/seo'
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import JobsClient from './JobsClient'

export const metadata = generatePageMetadata(
    'Crew Member Wanted | Big Sky Parasail - Flathead Lake, Montana',
    'Join the Big Sky Parasail crew on Flathead Lake. Hiring parasail crew members for the 2026 season -- full or part time, no experience needed. Apply now!',
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
