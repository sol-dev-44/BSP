import { supabaseAdmin } from '@/lib/supabaseAdmin';
import CancelBookingButton from '@/components/admin/CancelBookingButton';
import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';

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

                {/* Bookings Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold">Date & Time</th>
                                    <th className="p-4 font-semibold">Customer</th>
                                    <th className="p-4 font-semibold">Notes</th>
                                    <th className="p-4 font-semibold">Party</th>
                                    <th className="p-4 font-semibold">Amount</th>
                                    <th className="p-4 font-semibold">Booked On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {displayedBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="p-4 font-mono text-sm font-bold text-gray-500">
                                            {booking.id.split('-')[0].toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold">{booking.trip_date}</div>
                                            <div className="text-sm text-gray-500 font-mono">
                                                {formatTime(booking.trip_time)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{booking.customer_name}</div>
                                            <div className="text-sm text-gray-500">{booking.customer_email}</div>
                                            <div className="text-xs text-gray-400">{booking.customer_phone}</div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="text-sm text-gray-600 truncate" title={booking.notes}>
                                                {booking.notes || '-'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 font-semibold">
                                                {booking.party_size}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-medium">
                                            ${booking.total_amount}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            {booking.status !== 'cancelled' && (
                                                <CancelBookingButton bookingId={booking.id} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {displayedBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-gray-500">
                                            No bookings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}

function formatTime(timeStr: string) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${suffix}`;
}
