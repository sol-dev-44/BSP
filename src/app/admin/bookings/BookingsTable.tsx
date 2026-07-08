'use client';

import { Fragment, useMemo, useState } from 'react';
import { ArrowUpDown, Search, ChevronDown, ChevronRight, ExternalLink, Copy, Check } from 'lucide-react';
import CancelBookingButton from '@/components/admin/CancelBookingButton';
import CompleteBookingButton from '@/components/admin/CompleteBookingButton';

interface BookingAddOns {
    tip_amount?: number;
    photo_package?: number;
    gopro_package?: number;
    combo_package?: number;
    observer_count?: number;
    observer_package?: number;
}

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
    stripe_payment_intent_id?: string | null;
    add_ons?: BookingAddOns | null;
    discount_code?: string | null;
    discount_amount?: number | null;
    per_person_rate?: number | null;
    slot_type?: string | null;
}

interface BookingsTableProps {
    bookings: Booking[];
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
    const [query, setQuery] = useState('');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const toggleExpanded = (id: string) => {
        setExpandedId((current) => (current === id ? null : id));
    };

    const handleCopyPi = async (pi: string, id: string) => {
        try {
            await navigator.clipboard.writeText(pi);
            setCopiedId(id);
            setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
        } catch (error) {
            console.error('Failed to copy Stripe PI:', error);
        }
    };

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
                                const isExpanded = expandedId === booking.id;
                                return (
                                    <Fragment key={booking.id}>
                                    <tr
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
                                                <button
                                                    onClick={() => toggleExpanded(booking.id)}
                                                    title="Toggle details"
                                                    aria-label="Toggle details"
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </button>
                                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                    <CompleteBookingButton bookingId={booking.id} />
                                                )}
                                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                    <CancelBookingButton bookingId={booking.id} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-gray-50 dark:bg-gray-900/40">
                                            <td colSpan={9} className="p-4">
                                                <BookingDetailsPanel
                                                    booking={booking}
                                                    copied={copiedId === booking.id}
                                                    onCopyPi={(pi) => handleCopyPi(pi, booking.id)}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    </Fragment>
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

interface BookingDetailsPanelProps {
    booking: Booking;
    copied: boolean;
    onCopyPi: (pi: string) => void;
}

function BookingDetailsPanel({ booking, copied, onCopyPi }: BookingDetailsPanelProps) {
    const pi = booking.stripe_payment_intent_id;
    const hasRealPi = !!pi && pi.startsWith('pi_');
    const addOns = booking.add_ons || {};
    const observerCount = addOns.observer_count ?? addOns.observer_package ?? 0;

    const addOnRows: { label: string; value: number; isDollar: boolean }[] = [
        { label: 'Tip', value: addOns.tip_amount || 0, isDollar: true },
        { label: 'Photo Package', value: addOns.photo_package || 0, isDollar: true },
        { label: 'GoPro Package', value: addOns.gopro_package || 0, isDollar: true },
        { label: 'Combo Package', value: addOns.combo_package || 0, isDollar: true },
        { label: 'Observers', value: observerCount, isDollar: false },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                    Booking Reference
                </div>
                <div className="font-mono font-bold text-gray-900 dark:text-gray-100">
                    {booking.id.split('-')[0].toUpperCase()}
                </div>
                <div className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {booking.id}
                </div>
            </div>

            <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                    Stripe Payment
                </div>
                {hasRealPi ? (
                    <div className="space-y-1.5">
                        <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all select-all">
                            {pi}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onCopyPi(pi as string)}
                                title="Copy Stripe payment intent ID"
                                className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <a
                                href={`https://dashboard.stripe.com/payments/${pi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Stripe Dashboard
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                        No Stripe payment (OTA / mock)
                    </div>
                )}
            </div>

            <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                    Add-ons
                </div>
                <div className="space-y-1 text-sm">
                    {addOnRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-3">
                            <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                            <span
                                className={
                                    row.value > 0
                                        ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                }
                            >
                                {row.value > 0
                                    ? row.isDollar
                                        ? `$${row.value}`
                                        : row.value
                                    : '—'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {(booking.discount_code || booking.slot_type || booking.per_person_rate) && (
                <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1 lg:col-span-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {booking.discount_code && (
                        <div>
                            Discount: <span className="font-mono">{booking.discount_code}</span>
                            {booking.discount_amount ? ` (-$${booking.discount_amount})` : ''}
                        </div>
                    )}
                    {booking.slot_type && <div>Slot type: {booking.slot_type}</div>}
                    {booking.per_person_rate && <div>Rate: ${booking.per_person_rate}/person</div>}
                </div>
            )}
        </div>
    );
}
