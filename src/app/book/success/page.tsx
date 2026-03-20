'use client'

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BUSINESS_INFO, getMapLink } from '@/config/business';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, CheckCircle, Home, Printer, DollarSign } from 'lucide-react';

interface BookingDetails {
    id: string;
    customer_name: string;
    customer_email: string;
    trip_date: string;
    trip_time: string;
    party_size: number;
    total_amount: number;
    add_ons: {
        photo_package?: number;
        gopro_package?: number;
        observer_package?: number;
        tip_amount?: number;
    };
    created_at: string;
}

/** Format 24h DB time "20:00:00" to "8:00 PM" */
function formatTime(timeStr: string): string {
    if (!timeStr) return timeStr;
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${suffix}`;
}

/** Format date "2026-05-01" to "Thursday, May 1, 2026" */
function formatDate(dateStr: string): string {
    if (!dateStr) return dateStr;
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function BookingContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('booking_id');
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchBooking() {
            if (!bookingId) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('bsp_bookings')
                    .select('*')
                    .eq('id', bookingId)
                    .single();

                if (error) throw error;
                if (data) setBooking(data);
            } catch (err) {
                console.error('Error fetching booking:', err);
                setError('Could not load booking details. Please check your email for confirmation.');
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return <div className="text-[#fbbb45] animate-pulse">Loading ticket details...</div>;
    }

    if (!booking) {
        return (
            <p className="text-[#ddc0bd] mb-8 max-w-md">
                Thank you for booking with Big Sky Parasail. A confirmation email has been sent to you.
                {bookingId && <span className="block mt-2 text-sm text-[#a58b88]">Booking Reference: {bookingId}</span>}
                {error && <span className="block mt-2 text-red-400 text-sm">{error}</span>}
            </p>
        );
    }

    const { add_ons } = booking;
    const perPerson = BUSINESS_INFO.pricing.parasail;
    const flightSubtotal = booking.party_size * perPerson;
    const photoTotal = (add_ons?.photo_package || 0) * BUSINESS_INFO.pricing.photos;
    const goproTotal = (add_ons?.gopro_package || 0) * BUSINESS_INFO.pricing.gopro;
    const observerTotal = (add_ons?.observer_package || 0) * BUSINESS_INFO.pricing.observer;
    const tipTotal = add_ons?.tip_amount || 0;

    const displayTime = formatTime(booking.trip_time);
    const displayDate = formatDate(booking.trip_date);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-[#2c1c11] text-[#fbddca] rounded-xl shadow-2xl overflow-hidden mb-8"
        >
            {/* Header */}
            <div className="p-6 text-[#640c0f] text-center bg-gradient-to-r from-[#ffb3ad] via-[#fbbb45] to-[#f4ba96]">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#640c0f]/80" />
                <h2 className="text-3xl font-black uppercase tracking-tighter font-[family-name:var(--font-headline)]">Booking Confirmed!</h2>
                <div className="bg-[#640c0f]/20 inline-block px-4 py-1 rounded-full mb-3 backdrop-blur-sm mt-2">
                    <p className="text-sm font-medium tracking-wider">REF: <span className="font-mono font-bold text-lg">{booking.id.split('-')[0].toUpperCase()}</span></p>
                </div>
                <p className="opacity-90">Ready for takeoff, {booking.customer_name.split(' ')[0]}!</p>
            </div>

            {/* Ticket Details */}
            <div className="p-8 space-y-6">

                {/* Primary Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#564240]/30">
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#ffb3ad]/10 p-3 rounded-full">
                            <Calendar className="w-6 h-6 text-[#ffb3ad]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#a58b88] uppercase font-semibold">Date</p>
                            <p className="font-bold text-lg">{displayDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#fbbb45]/10 p-3 rounded-full">
                            <Clock className="w-6 h-6 text-[#fbbb45]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#a58b88] uppercase font-semibold">Time</p>
                            <p className="font-bold text-lg">{displayTime} <span className="text-sm font-normal text-[#a58b88]">(Mountain)</span></p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#f4ba96]/10 p-3 rounded-full">
                            <Users className="w-6 h-6 text-[#f4ba96]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#a58b88] uppercase font-semibold">Party Size</p>
                            <p className="font-bold text-lg">{booking.party_size} {booking.party_size === 1 ? 'Person' : 'People'}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#ffb3ad]/10 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-[#ffb3ad]" />
                        </div>
                        <div>
                            <p className="text-xs text-[#a58b88] uppercase font-semibold">Rate</p>
                            <p className="font-bold text-lg">${perPerson}/person{booking.party_size >= 2 ? ' (group)' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Itemized Receipt */}
                <div className="pb-6 border-b border-[#564240]/30">
                    <h3 className="text-[#fbddca] font-bold mb-3 flex items-center gap-2">
                        Itemized Receipt
                    </h3>
                    <div className="bg-[#38261a] rounded-xl p-4 space-y-3 text-sm">
                        {/* Base flight */}
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[#fbddca] font-medium">Parasail Flight x {booking.party_size}</span>
                                <span className="block text-xs text-[#a58b88]">${perPerson}/person</span>
                            </div>
                            <span className="font-medium text-[#fbddca]">${flightSubtotal.toFixed(2)}</span>
                        </div>

                        {/* Add-ons */}
                        {(add_ons?.photo_package || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-[#ddc0bd]">Photo Package x {add_ons.photo_package}</span>
                                <span className="font-medium text-[#fbddca]">${photoTotal.toFixed(2)}</span>
                            </div>
                        )}
                        {(add_ons?.gopro_package || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-[#ddc0bd]">GoPro Rental x {add_ons.gopro_package}</span>
                                <span className="font-medium text-[#fbddca]">${goproTotal.toFixed(2)}</span>
                            </div>
                        )}
                        {(add_ons?.observer_package || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-[#ddc0bd]">Observer / Boat Rider x {add_ons.observer_package}</span>
                                <span className="font-medium text-[#fbddca]">${observerTotal.toFixed(2)}</span>
                            </div>
                        )}
                        {tipTotal > 0 && (
                            <div className="flex justify-between text-[#f4ba96] font-medium">
                                <span>Crew Gratuity</span>
                                <span>${tipTotal.toFixed(2)}</span>
                            </div>
                        )}

                        {/* Divider + Total */}
                        <div className="border-t-2 border-[#564240]/30 pt-3 mt-3 flex justify-between items-center">
                            <span className="font-bold text-[#fbddca] text-base">Total Paid</span>
                            <span className="font-bold text-[#ffb3ad] text-xl">${booking.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Email Confirmation Notice */}
                <div className="bg-[#fbbb45]/10 rounded-xl p-4 mb-6 text-sm text-[#fbddca]">
                    <p className="font-medium flex items-center gap-2">
                        Check your inbox!
                    </p>
                    <p className="mt-1 text-[#ddc0bd]">
                        We&apos;ve sent a confirmation email to the contact info provided. If you don&apos;t receive it, please <strong className="text-[#fbddca]">print this page</strong> or save a screenshot.
                    </p>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                    <div className="bg-[#ffb3ad]/10 p-3 rounded-full shrink-0">
                        <MapPin className="w-6 h-6 text-[#ffb3ad]" />
                    </div>
                    <div>
                        <p className="text-xs text-[#a58b88] uppercase font-semibold">Location</p>
                        <p className="font-bold text-lg">{BUSINESS_INFO.address.name}</p>
                        <p className="text-[#ddc0bd] text-sm mt-1">
                            {BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state} {BUSINESS_INFO.address.zip}
                        </p>
                        <a
                            href={getMapLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ffb3ad] hover:text-[#e46c65] text-sm font-medium underline mt-1 inline-block"
                        >
                            View on Google Maps &rarr;
                        </a>
                        <p className="text-xs text-[#f4ba96] mt-2 font-medium">Please arrive 15 minutes before departure.</p>
                        <p className="text-xs text-[#a58b88] mt-2 italic">
                            * Confirmation not required to board the boat.
                        </p>
                    </div>
                </div>

                {/* Print Action */}
                <div className="pt-4 flex justify-center">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 bg-[#ffb3ad] hover:bg-[#e46c65] text-[#640c0f] px-6 py-3 rounded-full transition-all font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Printer className="w-5 h-5" />
                        <span>Print Trip Details</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#38261a] p-4 text-center text-xs text-[#a58b88]">
                Booking Reference: {booking.id}
            </div>
        </motion.div>
    );
}

export default function BookingSuccessPage() {
    return (
        <div className="min-h-screen bg-[#1e1006] flex flex-col items-center justify-center p-4">
            <Suspense fallback={<p className="text-[#fbbb45] mb-8 max-w-md">Processing booking details...</p>}>
                <BookingContent />
            </Suspense>

            <Link href="/" className="flex items-center space-x-2 text-[#a58b88] hover:text-[#fbddca] transition-colors">
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
            </Link>
        </div>
    );
}
