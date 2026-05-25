import { supabaseAdmin } from '@/lib/supabaseAdmin';
import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';
import BookingsTable from './BookingsTable';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const filter = params?.filter as string || 'all';
    // Fetch all bookings
    const { data: bookings, error } = await supabaseAdmin
        .from('bsp_bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading bookings: {error.message}</div>;
    }

    // Calculate Stats
    const activeBookings = bookings.filter(b => b.status !== 'cancelled');

    const totalBookings = activeBookings.length;
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const totalPax = activeBookings.reduce((sum, b) => sum + (Number(b.party_size) || 0), 0);
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

    let displayedBookings = bookings;
    if (filter === 'active') {
        displayedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    } else if (filter === 'completed') {
        displayedBookings = bookings.filter(b => b.status === 'completed');
    } else if (filter === 'cancelled') {
        displayedBookings = bookings.filter(b => b.status === 'cancelled');
    }

    const tabs = [
        { id: 'all', label: 'All Bookings' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
    ];
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Big Sky Parasail Admin</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('en-US', { timeZone: 'America/Denver', dateStyle: 'full' })}
                        </div>
                        <Link href="/admin/calendar" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Calendar
                        </Link>
                        <Link href="/admin/tasks" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Tasks
                        </Link>
                        <Link href="/admin/expenses" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Expenses
                        </Link>
                        <Link href="/admin/maintenance" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Maintenance
                        </Link>
                        <Link href="/admin/notes" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Notes
                        </Link>
                        <LogoutButton />
                    </div>
                </header>

                {/* Stats Grid */}
                {/* ADMIN-02: Resend has no usage/analytics API — email monitoring is out of scope */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="bg-green-500" />
                    <StatCard label="Confirmed" value={confirmedBookings.toString()} color="bg-sky-500" />
                    <StatCard label="Passengers" value={totalPax.toString()} color="bg-purple-500" />
                    <StatCard label="Transactions" value={totalBookings.toString()} color="bg-orange-500" />
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-px">
                    {tabs.map(tab => (
                        <Link
                            key={tab.id}
                            href={`/admin/bookings?filter=${tab.id}`}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${filter === tab.id
                                ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <BookingsTable bookings={displayedBookings} />
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-black mt-1">{value}</p>
            </div>
            <div className={`w-2 h-12 rounded-full ${color}`}></div>
        </div>
    );
}
