import { generatePageMetadata } from '@/config/seo'
import ServicesClient from './ServicesClient'

export const metadata = generatePageMetadata(
    'Packages & Pricing | Big Sky Parasail - Flathead Lake',
    'Parasailing packages, sunset cruises, and private charters on Flathead Lake. Early bird flights from $99, parasailing from $119, sunset cruises $159. Photo packages, GoPro rentals, private tubing, Wild Horse Island adventures, and 4th of July fireworks charters.',
    '/services'
)

export default function ServicesPage() {
    return <ServicesClient />
}
