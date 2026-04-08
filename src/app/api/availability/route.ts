import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTimeSlotsForDate, getSlotType, getSlotPrice, RESTRICTED_START_HOUR } from '@/config/solarSchedule';
import { BOOKING_CONFIG, isRestrictedDay } from '@/config/booking';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        console.log('Checking availability for date:', date);

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        // Fetch bookings for the date
        const { data: bookings, error } = await supabase
            .from('bsp_bookings')
            .select('trip_time, party_size, add_ons')
            .eq('trip_date', date)
            .neq('status', 'cancelled')
            .neq('status', 'Cancelled');

        if (error) {
            console.error('Supabase availability error:', error);
            throw new Error('Failed to fetch availability');
        }

        console.log('Found bookings:', bookings);

        // Helper to convert DB time (HH:MM:SS) to Config time (h:mm AM/PM)
        const to12Hour = (time24: string) => {
            const [hours, minutes] = time24.split(':');
            let h = parseInt(hours);
            const suffix = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return `${h}:${minutes} ${suffix}`;
        };

        // Calculate used capacity per time slot (flyers + observers = total passengers)
        const capacityMap: Record<string, number> = {};
        bookings?.forEach((booking) => {
            const timeKey = to12Hour(booking.trip_time);
            const observers = booking.add_ons?.observer_count || booking.add_ons?.observer_package || 0;
            const totalOnBoat = booking.party_size + observers;
            capacityMap[timeKey] = (capacityMap[timeKey] || 0) + totalOnBoat;
            console.log(`Mapped ${booking.trip_time} -> ${timeKey} (Flyers: ${booking.party_size}, Observers: ${observers})`);
        });

        // Use solar-calendar-based time slots for the requested date
        // Wed/Fri (restricted days) start at 3 PM; Sat/Sun start at 10 AM
        const dateObj = new Date(date + 'T12:00:00');
        const dayOfWeek = dateObj.getDay();
        const startHour = isRestrictedDay(dayOfWeek) ? RESTRICTED_START_HOUR : undefined;
        const dailySlots = getTimeSlotsForDate(date, startHour);

        // Build response with slot type and tiered pricing
        const slots = dailySlots.map((time) => {
            const used = capacityMap[time] || 0;
            const remaining = Math.max(0, BOOKING_CONFIG.MAX_PASSENGERS - used);
            const type = getSlotType(date, time);
            const price = getSlotPrice(type);
            return {
                time,
                remaining,
                type,
                price,
            };
        });

        return NextResponse.json({ slots }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
