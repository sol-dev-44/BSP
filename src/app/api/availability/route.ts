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
            // Father's Day weekend — Fri open midday only, Sat/Sun fully closed.
            // (Jun 19 also added to BOOKING_CONFIG.fullDayOverrides so the midday
            // slots are even generated for a normally restricted Friday.)
            '2026-06-19': (t) => { const h = to24Hour(t); return h !== null && (h < 11 || h > 13); },
            '2026-06-20': () => true,
            '2026-06-21': () => true,
            // Mon — block 3, 4, 5 PM (keep 6 PM through sunset)
            '2026-06-22': (t) => { const h = to24Hour(t); return h !== null && h >= 15 && h <= 17; },
            // Thu — closed for the rest of the day; block all slots
            '2026-07-02': () => true,
            // Sat — block 4, 5, 6 PM (keep earlier and sunset slots open)
            '2026-07-05': (t) => { const h = to24Hour(t); return h !== null && h >= 16 && h <= 18; },
            // Tue — high wind moving in; block afternoon (4 PM onward), keep morning open
            '2026-07-07': (t) => { const h = to24Hour(t); return h !== null && h >= 16; },
            // Mon — only the 6 PM trip runs; block everything else
            '2026-07-13': (t) => { const h = to24Hour(t); return h !== null && h !== 18; },
            // Tue — closed all day
            '2026-07-14': () => true,
            // Wed — only the 2 PM trip runs; block everything else (7 PM pulled)
            '2026-07-15': (t) => { const h = to24Hour(t); return h !== null && h !== 14; },
            // Fri — only the 7 PM and 8 PM sunset trips run; block everything else
            '2026-07-17': (t) => { const h = to24Hour(t); return h !== null && h !== 19 && h !== 20; },
            // Sun — block 10 AM (Murphy party moved to 11 AM) and 2-8 PM; 11 AM-1 PM stay open
            '2026-07-19': (t) => { const h = to24Hour(t); return h !== null && (h === 10 || (h >= 14 && h <= 20)); },
            // Sat — only the 12 PM trip (booked) runs; block everything else including 8 PM sunset
            '2026-07-18': (t) => { const h = to24Hour(t); return h !== null && h !== 12; },
            // Mon — block 6, 7, 8 PM (afternoon bookings run)
            '2026-07-20': (t) => { const h = to24Hour(t); return h !== null && h >= 18 && h <= 20; },
            // Tue — block 5-8 PM (3 and 4 PM open)
            '2026-07-21': (t) => { const h = to24Hour(t); return h !== null && h >= 17 && h <= 20; },
            // Wed — block 4-8 PM (3 PM booking runs)
            '2026-07-22': (t) => { const h = to24Hour(t); return h !== null && h >= 16 && h <= 20; },
            // Thu — block 6-8 PM (3 PM and 5 PM bookings run)
            '2026-07-23': (t) => { const h = to24Hour(t); return h !== null && h >= 18 && h <= 20; },
        };

        // Per-date sold-out overrides. Unlike DATE_BLOCKS ("Closed" tiles), these
        // render as red "Sold Out" tiles. Predicate returns true for sold-out slots.
        const SOLD_OUT_BLOCKS: Record<string, { match: (time: string) => boolean; reason: string }> = {
            // Sat — 10 AM, 2 PM, and 3 PM through end of day sold out
            '2026-07-11': {
                match: (t) => { const h = to24Hour(t); return h !== null && (h === 10 || h >= 14); },
                reason: 'Fully booked',
            },
            // Sun — 12 PM through end of day sold out
            '2026-07-12': {
                match: (t) => { const h = to24Hour(t); return h !== null && h >= 12; },
                reason: 'Fully booked',
            },
        };

        // Weather closures — block the entire day AND surface a structured notice
        // so the UI can show a "Too Windy to Operate" card with a wind icon
        // instead of a row of disabled time tiles.
        const WEATHER_BLOCKED_DATES: Record<string, { type: 'weather'; message: string }> = {
            '2026-06-16': { type: 'weather', message: 'Too Windy to Operate' },
            '2026-07-04': { type: 'weather', message: '🚩 Red Flag Warning — High Wind 💨' },
            '2026-07-08': { type: 'weather', message: '💨 Wind Advisory — All Flights Cancelled' },
        };

        // Event notices — paired with DATE_BLOCKS above. When the day is partly
        // open (e.g. Fri 6/19), this renders as a banner above the slot grid.
        // When the day is fully blocked, the UI promotes it to a full closed-day
        // card instead.
        const EVENT_DATES: Record<string, { type: 'event'; emoji: string; title: string; message: string }> = {
            '2026-06-19': {
                type: 'event',
                emoji: '👨‍👦',
                title: "Father's Day Weekend",
                message: 'Limited Friday hours — open 11 AM, 12 PM, and 1 PM only.',
            },
            '2026-06-20': {
                type: 'event',
                emoji: '👨‍👦',
                title: "Closed for Father's Day Weekend",
                message: "Spending the day with the mini-me — we'll see you Monday!",
            },
            '2026-06-21': {
                type: 'event',
                emoji: '👨‍👦',
                title: "Closed for Father's Day",
                message: "Happy Father's Day! We're off the water — back Monday.",
            },
            '2026-07-07': {
                type: 'event',
                emoji: '💨',
                title: 'Wind Advisory — Afternoon Closed',
                message: 'High wind is moving in this afternoon — 4 PM and later flights are cancelled. Morning trips are still on, so grab an earlier slot!',
            },
        };
        const dateNotice = WEATHER_BLOCKED_DATES[date] || EVENT_DATES[date] || null;

        // Build response with slot type, tiered pricing, and time-based availability.
        // Past slots and slots within the minimum-notice window are marked unbookable
        // so the UI can disable them without showing misleading "10 of 10" capacity.
        const nowMs = Date.now();
        // Weather notices apply to the entire day; event notices only block the
        // specific slots covered by DATE_BLOCKS.
        const dayWideBlock = dateNotice?.type === 'weather';
        type SlotOut = {
            time: string;
            remaining: number;
            type: 'earlybird' | 'sunset' | 'standard';
            price: number;
            availability: 'past' | 'too-soon' | 'bookable';
            blocked: boolean;
            soldOut?: boolean;
            soldOutReason?: string;
        };
        const slots: SlotOut[] = dailySlots.map((time) => {
            const used = capacityMap[time] || 0;
            const blockPredicate = DATE_BLOCKS[date];
            const slotBlocked = (blockPredicate ? blockPredicate(time) : false) || dayWideBlock;
            const soldOutBlock = SOLD_OUT_BLOCKS[date];
            const slotSoldOut = soldOutBlock ? soldOutBlock.match(time) : false;
            const availability = getSlotAvailability(date, time, nowMs);
            const noticeBlocked = availability !== 'bookable';
            const remaining = (slotBlocked || slotSoldOut || noticeBlocked)
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
                blocked: slotBlocked,
                ...(slotSoldOut ? { soldOut: true, soldOutReason: soldOutBlock!.reason } : {}),
            };
        });

        // July 3 (Fri) — a private charter occupies the 2 PM slot. Surface it as a
        // disabled "Sold out for Private" tile before the normal 3 PM public slot.
        // The 3 PM–sunset public slots are untouched; the 10 AM–1 PM morning slots
        // stay closed (this is a limited Friday).
        if (date === '2026-07-03') {
            const privateTime = '2:00 PM';
            const privateType = getSlotType(date, privateTime);
            slots.unshift({
                time: privateTime,
                remaining: 0,
                type: privateType,
                price: getSlotPrice(privateType),
                availability: 'bookable',
                blocked: false,
                soldOut: true,
                soldOutReason: 'Sold out for Private',
            });
        }

        return NextResponse.json({ slots, dateNotice }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
