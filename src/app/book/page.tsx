import BookingClient from './BookingClient';
import { generatePageMetadata } from '@/config/seo';

export const metadata = generatePageMetadata(
    'Book Parasailing - Big Sky Parasail | Instant Confirmation',
    'Book your Flathead Lake parasailing adventure! May 1 - Sep 30 season. Instant online booking, real-time availability. Reserve now!',
    '/book'
);

export default function BookingPage() {
    return <BookingClient />;
}
