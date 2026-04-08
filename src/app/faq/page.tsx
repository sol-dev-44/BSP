import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { FAQ } from '@/components/FAQ'
import { generatePageMetadata } from '@/config/seo'
import { generateFAQSchema, generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import { PARASAILING_FAQS } from '@/config/faq'

export const metadata = generatePageMetadata(
    'Big Sky Parasail FAQ | Common Questions Answered',
    'Get answers to common questions about parasailing on Flathead Lake, Montana. Learn about pricing, safety, requirements, what to expect, and more.',
    '/faq'
)

export default function FAQPage() {
    const faqSchemaData = PARASAILING_FAQS.map(faq => ({
        question: faq.question,
        answer: faq.answer
    }))

    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'FAQ', url: `${BUSINESS_INFO.url}/faq` }
    ]

    return (
        <main className="min-h-screen bg-surface text-on-surface">
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <StructuredData data={generateFAQSchema(faqSchemaData)} />
            <Navbar />
            <FAQ />
            <Footer />
            <ChatCTA />
        </main>
    )
}
