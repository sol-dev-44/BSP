import { generatePageMetadata } from '@/config/seo';
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data';
import { BUSINESS_INFO } from '@/config/business';
import BookingClient from './BookingClient';

// The booking calendar derives "today" (Mountain Time) at render. Without this,
// Next.js statically prerenders /book at build time and freezes the build date
// into the HTML — the calendar then defaults to the deploy date and greys out
// every day before it, no matter how much later the customer visits.
export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata(
    'Book Parasailing - Big Sky Parasail | Instant Confirmation',
    'Book your Flathead Lake parasailing adventure! May 23 - Sep 30 season. Instant online booking, real-time availability. Reserve now!',
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
