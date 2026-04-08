import { generatePageMetadata } from '@/config/seo'
import { generateServiceSchema, generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'
import { BUSINESS_INFO } from '@/config/business'
import ServicesClient from './ServicesClient'

export const metadata = generatePageMetadata(
    'Packages & Pricing | Big Sky Parasail - Flathead Lake',
    'Parasailing packages, sunset cruises, and private charters on Flathead Lake. Early bird flights from $99, parasailing from $119, sunset cruises $159. Photo packages, GoPro rentals, private tubing, Wild Horse Island adventures, and 4th of July fireworks charters.',
    '/services'
)

export default function ServicesPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Packages & Pricing', url: `${BUSINESS_INFO.url}/services` },
    ]
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            {BUSINESS_INFO.services.map((service) => (
                <StructuredData key={service.id} data={generateServiceSchema(service)} />
            ))}
            <ServicesClient />
        </>
    )
}
