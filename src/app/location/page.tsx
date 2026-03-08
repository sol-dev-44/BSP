import { generatePageMetadata } from '@/config/seo'
import LocationClient from './LocationClient'

export const metadata = generatePageMetadata(
    'Location & Directions | Big Sky Parasail - Flathead Lake',
    'Find us at Flathead Harbor Marina in Lakeside, Montana. Get directions, parking info, and discover nearby attractions like Glacier National Park.',
    '/location'
)

export default function LocationPage() {
    return <LocationClient />
}
