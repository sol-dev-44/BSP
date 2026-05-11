'use client';

import { useState, useMemo } from 'react';

interface Booking {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    trip_date: string;
    trip_time: string;
    party_size: number;
    total_amount: number;
    status: string;
    notes: string | null;
    booking_source?: string;
    add_ons?: Record<string, unknown>;
}

interface CalendarClientProps {
    bookings: Booking[];
}

export default function CalendarClient({ bookings }: CalendarClientProps) {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Group bookings by date
    const bookingsByDate = useMemo(() => {
        const map: Record<string, Booking[]> = {};
        for (const b of bookings) {
            if (!map[b.trip_date]) map[b.trip_date] = [];
            map[b.trip_date].push(b);
        }
        return map;
    }, [bookings]);

    // Calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const selectedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : [];
    const totalPaxForDay = selectedBookings.reduce((sum, b) => sum + b.party_size, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <ChevronLeft />
                    </button>
                    <h2 className="text-xl font-bold">{monthLabel}</h2>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <ChevronRight />
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        if (day === null) return <div key={`empty-${i}`} />;

                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayBookings = bookingsByDate[dateStr] || [];
                        const hasBookings = dayBookings.length > 0;
                        const isToday = dateStr === today;
                        const isSelected = dateStr === selectedDate;
                        const pax = dayBookings.reduce((sum, b) => sum + b.party_size, 0);

                        // Source colors
                        const hasViator = dayBookings.some(b => b.booking_source === 'viator' || b.notes?.startsWith('VIATOR'));
                        const hasGyg = dayBookings.some(b => b.booking_source === 'gyg' || b.notes?.startsWith('GYG'));
                        const hasWebsite = dayBookings.some(b => !b.booking_source || b.booking_source === 'website');

                        return (
                            <button
                                key={dateStr}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`relative p-2 min-h-[80px] rounded-lg text-left transition-all ${
                                    isSelected
                                        ? 'bg-sky-100 dark:bg-sky-900/40 ring-2 ring-sky-500'
                                        : hasBookings
                                            ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                }`}
                            >
                                <span className={`text-sm font-medium ${
                                    isToday ? 'bg-sky-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''
                                }`}>
                                    {day}
                                </span>

                                {hasBookings && (
                                    <div className="mt-1">
                                        <div className="text-xs font-bold text-green-700 dark:text-green-400">
                                            {pax} pax
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {dayBookings.length} trip{dayBookings.length > 1 ? 's' : ''}
                                        </div>
                                        {/* Source indicators */}
                                        <div className="flex gap-1 mt-1">
                                            {hasWebsite && <span className="w-2 h-2 rounded-full bg-sky-500" title="Website" />}
                                            {hasViator && <span className="w-2 h-2 rounded-full bg-orange-500" title="Viator" />}
                                            {hasGyg && <span className="w-2 h-2 rounded-full bg-purple-500" title="GetYourGuide" />}
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Website</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Viator</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> GetYourGuide</span>
                </div>
            </div>

            {/* Day detail panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                {selectedDate ? (
                    <>
                        <h3 className="text-lg font-bold mb-1">
                            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h3>
                        {selectedBookings.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {selectedBookings.length} booking{selectedBookings.length > 1 ? 's' : ''} &middot; {totalPaxForDay} passengers
                                </p>
                                <div className="space-y-3">
                                    {selectedBookings
                                        .sort((a, b) => a.trip_time.localeCompare(b.trip_time))
                                        .map(booking => (
                                            <BookingCard key={booking.id} booking={booking} />
                                        ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No bookings for this day.</p>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-400 dark:text-gray-500 py-12">
                        <p className="text-lg font-medium">Select a day</p>
                        <p className="text-sm mt-1">Click a date to see bookings</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function BookingCard({ booking }: { booking: Booking }) {
    const source = booking.booking_source
        || (booking.notes?.startsWith('VIATOR') ? 'viator' : null)
        || (booking.notes?.startsWith('GYG') ? 'gyg' : null)
        || 'website';

    const sourceColors: Record<string, string> = {
        website: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
        viator: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        gyg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        manual: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };

    const sourceLabels: Record<string, string> = {
        website: 'Website',
        viator: 'Viator',
        gyg: 'GYG',
        manual: 'Manual',
    };

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold">{booking.customer_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {formatTime(booking.trip_time)}
                    </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sourceColors[source]}`}>
                    {sourceLabels[source] || source}
                </span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span>{booking.party_size} pax</span>
                <span className="font-mono">${booking.total_amount}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                    booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                    {booking.status}
                </span>
            </div>
            {booking.customer_email && booking.customer_email !== 'viator@placeholder.com' && (
                <p className="text-xs text-gray-400 mt-1">{booking.customer_email}</p>
            )}
        </div>
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

function ChevronLeft() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRight() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
