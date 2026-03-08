import { generatePageMetadata } from '@/config/seo'
import JobsClient from './JobsClient'

export const metadata = generatePageMetadata(
    'Jobs | Big Sky Parasail - Flathead Lake, Montana',
    'Join the Big Sky Parasail crew on Flathead Lake. We\'re hiring for Dock Sales, Boat Crew, and coding internship roles for the 2026 season.',
    '/jobs'
)

export default function JobsPage() {
    return <JobsClient />
}
