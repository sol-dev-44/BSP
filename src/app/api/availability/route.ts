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
            // Fri — closed all day (red flag warning: wind)
            '2026-07-24': () => true,
            // Sat — only the 8 PM sunset runs (Sharry + Gragery, moved from 12 PM); rest closed
            '2026-07-25': (t) => { const h = to24Hour(t); return h !== 20; },
            // Sun — 1 PM reopened; block 2-8 PM (morning open)
            '2026-07-26': (t) => { const h = to24Hour(t); return h !== null && h >= 14 && h <= 20; },
            // Mon — block 5-8 PM (3 PM bookings run)
            '2026-07-27': (t) => { const h = to24Hour(t); return h !== null && h >= 17 && h <= 20; },
            // Tue — only 12 PM (Reynolds, moved from 4 PM) runs; 4 PM and 5 PM closed
            '2026-07-28': (t) => { const h = to24Hour(t); return h !== 12; },
            // Wed — 4, 5 and 6 PM open. 10 AM closed to new bookings; Stanhope's
            // 2-rider trip still runs at 10 AM (kept as a Closed tile, not removed).
            '2026-07-29': (t) => { const h = to24Hour(t); return h !== 16 && h !== 17 && h !== 18; },
            // Thu — block 6 and 8 PM (3, 4, 5 and 7 PM run)
            '2026-07-30': (t) => { const h = to24Hour(t); return h === 18 || h === 20; },
            // Fri — block 6-8 PM (3, 4 and 5 PM stay open; 5 PM has a 15-min notice window)
            '2026-07-31': (t) => { const h = to24Hour(t); return h !== null && h >= 18 && h <= 20; },
            // Sat — only the 10 AM trip (Elliston) runs; rest of the day closed
            // (Croft moved to 8/8, Mattsson to 8/2)
            '2026-08-01': (t) => { const h = to24Hour(t); return h !== 10; },
            // Sun — block 10 AM-3 PM and 6-7 PM (4 and 5 PM run). The 3 PM trip is
            // pulled: the big group (Moss, 6 riders) is rescheduling, and Mattsson's
            // 2 riders are on that slot too and still need a new time.
            '2026-08-02': (t) => { const h = to24Hour(t); return h !== null && (h <= 15 || h >= 18); },
            // Owner out of town Aug 4-7. Mon 8/3: only the 10 AM trip runs; block
            // everything else. (The Godshall Viator party that held 2 PM cancelled
            // Aug 2 and the afternoon was pulled.)
            '2026-08-03': (t) => { const h = to24Hour(t); return h !== 10; },
            // Tue 8/4: 4 PM and 5 PM open, rest of the day stays closed
            '2026-08-04': (t) => { const h = to24Hour(t); return h !== 16 && h !== 17; },
            // Wed 8/5: 4 PM and 5 PM open, rest of the day stays closed
            '2026-08-05': (t) => { const h = to24Hour(t); return h !== 16 && h !== 17; },
            // Thu 8/6: 4 PM (Helmer + Barnes Viator parties, 5 riders) and 5 PM run; rest closed
            '2026-08-06': (t) => { const h = to24Hour(t); return h !== 16 && h !== 17; },
            // Fri 8/7: 5, 6 and 7 PM stay open (8 PM isn't offered in August)
            '2026-08-07': (t) => { const h = to24Hour(t); return h !== null && h !== 17 && h !== 18 && h !== 19 && h !== 20; },
            // Sat 8/8: 10 AM (Lanza), 6 PM and 7 PM (Aguero + Croft, moved off the
            // pulled 3 PM trip) open; everything else closed.
            '2026-08-08': (t) => { const h = to24Hour(t); return h !== 10 && h !== 18 && h !== 19; },
            // Sun 8/9: only 10 AM (Lehman) and 7 PM (Odom) run; block 11 AM-6 PM
            '2026-08-09': (t) => { const h = to24Hour(t); return h !== null && h >= 11 && h <= 18; },
            // Mon 8/10: 1 PM (Hoffer) and 3 PM (Jenkins + Caron) open; block the rest.
            // The midday slots only exist because 8/10 is in fullDayOverrides —
            // added so Hoffer's 1 PM trip shows on the grid.
            '2026-08-10': (t) => { const h = to24Hour(t); return h !== 13 && h !== 15; },
            // Tue 8/11: 5 PM (Jackson, 4 riders, moved off the pulled 12 PM trip)
            // and 6 PM open; block everything else. 6 PM is the Zink group of 10
            // moved over from 8/12 — at 10/10, so it renders Sold Out.
            '2026-08-11': (t) => { const h = to24Hour(t); return h !== 17 && h !== 18; },
            // Wed 8/12: closed. The 11 AM (Karpel Liel, moved off 10 AM) trip ran;
            // 6 PM (Harold) was cancelled for wind and refunded, so nothing is left
            // to book. 7 PM was vacated when the Zink group of 10 moved to 8/11 6 PM.
            '2026-08-12': () => true,
            // Thu 8/13: closed. The 3 PM trip is pulled — Flake's 2-rider booking
            // stays on the row and gets rescheduled by hand.
            '2026-08-13': () => true,
            // Fri 8/14: closed — the whole day was pulled and its three parties
            // moved to 8/15 (Guggisberg to noon, Flake and Mayhew to 6 PM).
            '2026-08-14': () => true,
            // Sat 8/15: 12 PM (Guggisberg), 5 PM and 6 PM (Flake + Mayhew) open
            '2026-08-15': (t) => { const h = to24Hour(t); return h !== 12 && h !== 17 && h !== 18; },
            // Sun 8/16: 5 PM (Davy) and 6 PM open; 4 PM closed
            '2026-08-16': (t) => { const h = to24Hour(t); return h !== 17 && h !== 18; },
            // Mon 8/17: closed all day — 5 PM pulled (it was the only open slot)
            '2026-08-17': () => true,
            // Tue 8/18: closed — 3 PM pulled; Blackburn moved to 8/19 5 PM and
            // Onthank to 8/22 10 AM.
            '2026-08-18': () => true,
            // Wed 8/19: 5 PM open (reopened); rest of the day closed
            '2026-08-19': (t) => { const h = to24Hour(t); return h !== 17; },
            // Thu 8/20: closed all day — 3 PM pulled (it was the only open slot);
            // the Cowgill Viator party moved to 8/21 4 PM.
            '2026-08-20': () => true,
            // Fri 8/21: 3 PM (Utter + Stenstrom + Bench, 9/10) and 4 PM (Cowgill,
            // Viator, moved off the pulled 8/20 3 PM trip) run
            '2026-08-21': (t) => { const h = to24Hour(t); return h !== 15 && h !== 16; },
            // Sat 8/22: 11 AM and 3 PM (Singleterry + Lars + Onthank, 6/10 — Salehin
            // moved to 8/25 4 PM, Onthank moved in off the pulled 10 AM) run.
            // 10 AM and 4 PM pulled; 4 PM's Wilkey party still needs a move.
            '2026-08-22': (t) => { const h = to24Hour(t); return h !== 11 && h !== 15; },
            // Sun 8/23: closed all day for wind — 10 AM pulled (it was the only open
            // slot); the Andersen party of 2 gets rescheduled by hand. Also listed in
            // WEATHER_BLOCKED_DATES so the day renders the red flag / wind card.
            '2026-08-23': () => true,
            // Mon 8/24: 5 PM (Burns GYG + Georgeson Viator + Larrick GYG, 7/10) and
            // 6 PM run. 4 PM closed — it had no bookings; 6 PM opened in its place.
            '2026-08-24': (t) => { const h = to24Hour(t); return h !== 17 && h !== 18; },
            // Season extended through 8/30. Tue 8/25: 4 PM and 5 PM.
            // 8/25 4 PM: Royal + Salehin (moved off 8/22 3 PM), 8/10. 5 PM opened
            // for overflow once 4 PM was down to two seats.
            '2026-08-25': (t) => { const h = to24Hour(t); return h !== 16 && h !== 17; },
            // Wed 8/26: 4 PM (Peterson + McLaughlin), 5 PM and 6 PM
            '2026-08-26': (t) => { const h = to24Hour(t); return h !== 16 && h !== 17 && h !== 18; },
            // Thu 8/27: closed all day — 5 PM and 6 PM both pulled. Kindt's 2 stay on
            // the 6 PM row and get shuffled by hand.
            '2026-08-27': () => true,
            // Fri 8/28: 2 PM, 3 PM and 6 PM (Kannel) run; 5 PM pulled. The midday
            // slots only exist because 8/28 is in fullDayOverrides — a limited
            // Friday would otherwise start at 3 PM. Morning slots stay closed.
            '2026-08-28': (t) => { const h = to24Hour(t); return h !== 14 && h !== 15 && h !== 18; },
            // Sat 8/29: closed all day — 10 AM and 11 AM both pulled. Abraham's 4 and
            // Williams' 1 stay on their rows and get shuffled by hand. Still the
            // season's last calendar day (see SEASON_LAST_DAY).
            '2026-08-29': () => true,
            // Sun 8/30: closed — 10 AM pulled (no bookings). 8/29 is the last day the
            // boat runs, so this and everything after it falls under the season cutoff.
            '2026-08-30': () => true,
        };

        // Hard season cutoff: every slot on or after this date is closed, so the
        // calendar takes no new bookings for the rest of the season. Bookings that
        // already exist past this date are handled manually in the admin console.
        // 8/29 is the final operating day, so the cutoff starts the morning after.
        const CLOSED_FROM_DATE = '2026-08-30';
        const afterSeasonCutoff = date >= CLOSED_FROM_DATE;

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
            // Sun — 4 PM at 10/10 once Mattsson moved over from the pulled 3 PM trip
            '2026-08-02': {
                match: (t) => to24Hour(t) === 16,
                reason: 'Fully booked',
            },
            // Tue — 6 PM is the Zink group of 10, at 10/10 (5 PM stays open)
            '2026-08-11': {
                match: (t) => to24Hour(t) === 18,
                reason: 'Fully booked',
            },
        };

        // Per-slot capacity caps. Overrides the boat's normal 10-passenger limit for
        // a single trip — used when a run is held to a smaller load. Keyed by date,
        // then by display time; anything not listed uses BOOKING_CONFIG.MAX_PASSENGERS.
        const SLOT_CAPACITY_OVERRIDES: Record<string, Record<string, number>> = {
            // Thu 8/27: 6 PM held to 8 aboard (Kindt's 2 count toward the cap)
            '2026-08-27': { '6:00 PM': 8 },
        };

        // Weather closures — block the entire day AND surface a structured notice
        // so the UI can show a "Too Windy to Operate" card with a wind icon
        // instead of a row of disabled time tiles.
        const WEATHER_BLOCKED_DATES: Record<string, { type: 'weather'; message: string }> = {
            '2026-06-16': { type: 'weather', message: 'Too Windy to Operate' },
            '2026-07-04': { type: 'weather', message: '🚩 Red Flag Warning — High Wind 💨' },
            '2026-07-08': { type: 'weather', message: '💨 Wind Advisory — All Flights Cancelled' },
            '2026-08-23': { type: 'weather', message: '🚩 Red Flag Warning — Too Windy to Fly 💨' },
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
        // Season-over notice. Deliberately quiet — the season ended on schedule, so
        // this reads as a sign-off rather than a closure warning. It sits last in the
        // chain so a weather or event notice on a specific date still wins.
        const seasonNotice = afterSeasonCutoff
            ? {
                type: 'season' as const,
                message: 'That\'s a wrap on the 2026 season',
                detail: `Our last flight of the year was ${new Date(BOOKING_CONFIG.SEASON_LAST_DAY + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}. We're back on the water next May — thanks for a great season!`,
            }
            : null;
        const dateNotice = WEATHER_BLOCKED_DATES[date] || EVENT_DATES[date] || seasonNotice;

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
            capacity: number;
            soldOut?: boolean;
            soldOutReason?: string;
        };
        const slots: SlotOut[] = dailySlots.map((time) => {
            const used = capacityMap[time] || 0;
            const blockPredicate = DATE_BLOCKS[date];
            const slotBlocked = (blockPredicate ? blockPredicate(time) : false) || dayWideBlock || afterSeasonCutoff;
            const soldOutBlock = SOLD_OUT_BLOCKS[date];
            const slotSoldOut = soldOutBlock ? soldOutBlock.match(time) : false;
            const availability = getSlotAvailability(date, time, nowMs, used > 0);
            const noticeBlocked = availability !== 'bookable';
            const capacity = SLOT_CAPACITY_OVERRIDES[date]?.[time] ?? BOOKING_CONFIG.MAX_PASSENGERS;
            const remaining = (slotBlocked || slotSoldOut || noticeBlocked)
                ? 0
                : Math.max(0, capacity - used);
            const type = getSlotType(date, time);
            const price = getSlotPrice(type);
            return {
                time,
                remaining,
                type,
                price,
                availability,
                blocked: slotBlocked,
                capacity,
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
                capacity: BOOKING_CONFIG.MAX_PASSENGERS,
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
