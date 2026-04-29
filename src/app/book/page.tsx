import { generatePageMetadata } from '@/config/seo';
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data';
import { BUSINESS_INFO } from '@/config/business';
import BookingClient from './BookingClient';

export const metadata = generatePageMetadata(
    'Book Parasailing - Big Sky Parasail | Instant Confirmation',
    'Book your Flathead Lake parasailing adventure! May 16 - Sep 30 season. Instant online booking, real-time availability. Reserve now!',
    '/book'
);

export default function BookingPage() {
    const breadcrumbs = [
        { name: 'Home', url: `${BUSINESS_INFO.url}/` },
        { name: 'Book Now', url: `${BUSINESS_INFO.url}/book` },
    ];
    return (
        <>
            <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
            <BookingClient />
        </>
    );
}
