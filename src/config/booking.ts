/**
 * Booking Configuration for Big Sky Parasail
 * Season: May 23rd - September 30th
 */

import { getTimeSlotsForDate, getLastTripSlot } from './solarSchedule';

export const BOOKING_CONFIG = {
    // Season dates (YYYY-MM-DD format)
    seasons: [
        { startDate: '2026-05-23', endDate: '2026-09-30' },
    ],

    // Last day the boat actually runs. The season window above stays open so the
    // calendar can still render September dates — they're shown as closed-for-the-
    // season rather than vanishing. Nothing books on or after the following day.
    SEASON_LAST_DAY: '2026-08-29',

    // Excluded days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Open 7 days/week. Sat/Sun all day. Mon-Fri limited (3 PM - sunset).
    excludedDaysOfWeek: [] as number[],

    // Mon (1), Tue (2), Wed (3), Thu (4), Fri (5): all hourly slots from 3 PM through sunset
    limitedDays: [1, 2, 3, 4, 5] as number[],

    // Specific dates that override limited-day restrictions (full day, e.g. Viator bookings)
    fullDayOverrides: [
        '2026-06-19', // Fri - Father's Day weekend: open midday slots, blocked outside 11-1
        '2026-07-10', // Fri - W Kay Fries (Viator 2 PM)
        '2026-07-15', // Wed - 2 PM trip opened (DATE_BLOCKS limits day to 2 PM only)
        '2026-07-28', // Tue - Michael Thurman Reynolds moved to 12 PM
        '2026-07-29', // Wed - Tyler Stanhope 10 AM trip runs (slot closed to new bookings)
        '2026-08-03', // Mon - full day opened for the 10 AM trip (the Godshall Viator 2 PM party cancelled)
        '2026-08-10', // Mon - Alison Hoffer 1 PM trip runs
        '2026-08-11', // Tue - Heather Vest (Viator 2 PM)
        '2026-08-12', // Wed - Danielle Karpel Liel 10 AM trip runs
        '2026-08-28', // Fri - 2 PM opened; a limited Friday would start at 3 PM
    ] as string[],

    // Max passengers per boat (Cloud Dancer holds 10)
    MAX_PASSENGERS: 10,

    // Time slots are dynamic based on Montana solar calendar.
    // Use getTimeSlotsForDate(dateStr) from solarSchedule.ts for date-specific slots.
    // This static list is kept as a Sat/Sun reference only (full 10 AM schedule).
    timeSlots: {
        daily: [
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '1:00 PM',
            '2:00 PM',
            '3:00 PM',
            '4:00 PM',
            '5:00 PM',
            '6:00 PM',
            '7:00 PM',
        ],
    },

    // Location schedule (for display purposes). End date tracks SEASON_LAST_DAY —
    // keep the two in sync if the season is ever extended again.
    locationSchedule: [
        { location: 'Flathead Harbor Marina', startDate: '2026-05-23', endDate: '2026-08-29' },
    ],
};

/**
 * True once the season has wrapped — any date after the last operating day.
 * Takes a YYYY-MM-DD string so the comparison stays timezone-free.
 */
export function isAfterSeasonEnd(dateStr: string): boolean {
    return dateStr > BOOKING_CONFIG.SEASON_LAST_DAY;
}

/**
 * True for the final operating day of the season — used to flag it on the calendar.
 */
export function isSeasonLastDay(dateStr: string): boolean {
    return dateStr === BOOKING_CONFIG.SEASON_LAST_DAY;
}

/**
 * Helper function to check if a date is within the booking season
 */
export function isWithinSeason(date: Date): boolean {
    return BOOKING_CONFIG.seasons.some(season => {
        const startParts = season.startDate.split('-');
        const endParts = season.endDate.split('-');

        const seasonStart = new Date(
            parseInt(startParts[0]),
            parseInt(startParts[1]) - 1,
            parseInt(startParts[2])
        );

        const seasonEnd = new Date(
            parseInt(endParts[0]),
            parseInt(endParts[1]) - 1,
            parseInt(endParts[2])
        );

        // Set hours to ignore time component issues
        seasonStart.setHours(0, 0, 0, 0);
        seasonEnd.setHours(23, 59, 59, 999);
        const checkDate = new Date(date);
        checkDate.setHours(12, 0, 0, 0);

        return checkDate >= seasonStart && checkDate <= seasonEnd;
    });
}

/**
 * Helper function to check if a day of the week is allowed for bookings
 */
export function isDayOfWeekAllowed(dayOfWeek: number, date?: Date): boolean {
    if (!BOOKING_CONFIG.excludedDaysOfWeek.includes(dayOfWeek)) return true;

    // Allow excluded days that have a full-day override (e.g. existing Viator bookings)
    if (date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        return BOOKING_CONFIG.fullDayOverrides.includes(dateStr);
    }

    return false;
}

/**
 * Helper function to get time slots for a specific date.
 * Uses the Montana solar calendar to determine available slots.
 * Limited days (Mon-Fri) get all hourly slots from 3 PM through sunset.
 */
export function getTimeSlotsForDayOfWeek(dayOfWeek: number, dateStr?: string): string[] {
    const slots = dateStr ? getTimeSlotsForDate(dateStr) : BOOKING_CONFIG.timeSlots.daily;

    // Limited days: all hourly slots from 3 PM through sunset (unless date has a full-day override)
    if (BOOKING_CONFIG.limitedDays.includes(dayOfWeek) && dateStr && !BOOKING_CONFIG.fullDayOverrides.includes(dateStr)) {
        return slots.filter(s => {
            const hour = parseInt(s);
            const isPM = s.includes('PM');
            const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 12 : hour);
            return hour24 >= 15; // 3 PM and later
        });
    }

    return slots;
}
