import { generatePageMetadata } from '@/config/seo'
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import BSPChatClient from './BSPChatClient'

export const metadata = generatePageMetadata(
    'Ask Jerry Bear | Big Sky Parasail AI Chat',
    'Get instant answers about parasailing on Flathead Lake from Jerry Bear, our AI assistant. Ask about pricing, safety, weather, and booking.',
    '/bsp-chat'
)

export default function BSPChatPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Ask Jerry Bear', url: `${BUSINESS_INFO.url}/bsp-chat` },
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <BSPChatClient />
        </>
    )
}
