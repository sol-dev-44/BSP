import { supabaseAdmin } from '@/lib/supabaseAdmin';
import CalendarClient from './CalendarClient';
import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
    // Fetch all upcoming bookings
    const today = new Date().toISOString().split('T')[0];
    const { data: bookings, error } = await supabaseAdmin
        .from('bsp_bookings')
        .select('*')
        .gte('trip_date', today)
        .neq('status', 'cancelled')
        .order('trip_date', { ascending: true });

    if (error) {
        return <div className="p-8 text-red-500">Error loading bookings: {error.message}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Booking Calendar</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/bookings" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Bookings
                        </Link>
                        <Link href="/admin/tasks" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Tasks
                        </Link>
                        <Link href="/admin/expenses" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Expenses
                        </Link>
                        <LogoutButton />
                    </div>
                </header>
                <CalendarClient bookings={bookings || []} />
            </div>
        </div>
    );
}
