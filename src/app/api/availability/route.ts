import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSlotType, getSlotPrice, getSlotAvailability } from '@/config/solarSchedule';
import { BOOKING_CONFIG, getTimeSlotsForDayOfWeek } from '@/config/booking';

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
        // Respects day-of-week restrictions (limited days get 3 PM, 4 PM, sunset only)
        const parts = date.split('-');
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const dayOfWeek = dateObj.getDay();
        const dailySlots = getTimeSlotsForDayOfWeek(dayOfWeek, date);

        // Parse "H:MM AM/PM" display string back to 24h hour (0-23).
        const to24Hour = (time: string): number | null => {
            const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/);
            if (!match) return null;
            let hour = parseInt(match[1]);
            const period = match[3];
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            return hour;
        };

        // Per-date manual blackouts. Predicate returns true for slots to block.
        const DATE_BLOCKS: Record<string, (time: string) => boolean> = {
            // All slots before 5 PM unavailable
            '2026-05-23': (t) => { const h = to24Hour(t); return h !== null && h < 17; },
            // Keep only the trip before sunset (7 PM); block everything else
            '2026-06-13': (t) => { const h = to24Hour(t); return h !== null && h !== 19; },
            // Block 10 AM, 11 AM, 12 PM, 1 PM (everything at or before 1 PM)
            '2026-06-14': (t) => { const h = to24Hour(t); return h !== null && h <= 13; },
        };

        // Build response with slot type, tiered pricing, and time-based availability.
        // Past slots and slots within the minimum-notice window are marked unbookable
        // so the UI can disable them without showing misleading "10 of 10" capacity.
        const nowMs = Date.now();
        const slots = dailySlots.map((time) => {
            const used = capacityMap[time] || 0;
            const blockPredicate = DATE_BLOCKS[date];
            const blocked = blockPredicate ? blockPredicate(time) : false;
            const availability = getSlotAvailability(date, time, nowMs);
            const noticeBlocked = availability !== 'bookable';
            const remaining = (blocked || noticeBlocked)
                ? 0
                : Math.max(0, BOOKING_CONFIG.MAX_PASSENGERS - used);
            const type = getSlotType(date, time);
            const price = getSlotPrice(type);
            return {
                time,
                remaining,
                type,
                price,
                availability,
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
