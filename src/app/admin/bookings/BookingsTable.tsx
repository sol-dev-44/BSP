'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import CancelBookingButton from '@/components/admin/CancelBookingButton';
import CompleteBookingButton from '@/components/admin/CompleteBookingButton';

interface Booking {
    id: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    trip_date: string;
    trip_time: string;
    party_size: number;
    total_amount: number;
    status: string;
    notes: string | null;
}

interface BookingsTableProps {
    bookings: Booking[];
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
    const [query, setQuery] = useState('');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const todayStr = useMemo(() => {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }));
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, []);

    const processed = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = q
            ? bookings.filter((b) =>
                (b.customer_name || '').toLowerCase().includes(q) ||
                (b.customer_email || '').toLowerCase().includes(q) ||
                (b.customer_phone || '').toLowerCase().includes(q)
            )
            : bookings;

        const compareUpcoming = (a: Booking, b: Booking) => {
            if (a.trip_date !== b.trip_date) {
                return sortDir === 'asc'
                    ? a.trip_date.localeCompare(b.trip_date)
                    : b.trip_date.localeCompare(a.trip_date);
            }
            return a.trip_time.localeCompare(b.trip_time);
        };

        const upcoming = filtered
            .filter((b) => b.trip_date >= todayStr)
            .sort(compareUpcoming);
        const past = filtered
            .filter((b) => b.trip_date < todayStr)
            .sort((a, b) => b.trip_date.localeCompare(a.trip_date) || b.trip_time.localeCompare(a.trip_time));

        return [...upcoming, ...past];
    }, [bookings, query, sortDir, todayStr]);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <button
                    onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title={`Currently ${sortDir === 'asc' ? 'soonest first' : 'latest first'} — click to flip`}
                >
                    <ArrowUpDown className="w-4 h-4" />
                    Date: {sortDir === 'asc' ? 'Soonest first' : 'Latest first'}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Date &amp; Time</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Notes</th>
                                <th className="p-4 font-semibold">Party</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Booked On</th>
                                <th className="p-4 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {processed.map((booking) => {
                                const isPast = booking.trip_date < todayStr;
                                return (
                                    <tr
                                        key={booking.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${isPast ? 'opacity-60' : ''}`}
                                    >
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
                                            <div className="text-sm text-gray-600 truncate" title={booking.notes || ''}>
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
                                            <div className="flex items-center justify-end gap-3">
                                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                    <CompleteBookingButton bookingId={booking.id} />
                                                )}
                                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                    <CancelBookingButton bookingId={booking.id} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {processed.length === 0 && (
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
        </>
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
