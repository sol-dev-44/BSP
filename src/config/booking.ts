/**
 * Booking Configuration for Big Sky Parasail
 * Season: May 1st - September 30th
 */

import { getTimeSlotsForDate, getLastTripSlot } from './solarSchedule';

export const BOOKING_CONFIG = {
    // Season dates (YYYY-MM-DD format)
    seasons: [
        { startDate: '2026-05-01', endDate: '2026-09-30' },
    ],

    // Excluded days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Mon & Wed off. Sat/Sun all day. Tue/Thu/Fri limited slots.
    excludedDaysOfWeek: [1, 3] as number[],

    // Tue (2), Thu (4), Fri (5): only 3 PM, 4 PM, and sunset
    limitedDays: [2, 4, 5] as number[],

    // Specific dates that override limited-day restrictions (full day, e.g. Viator bookings)
    fullDayOverrides: [
        '2026-07-10', // Fri - W Kay Fries (Viator 2 PM)
        '2026-07-28', // Tue - Tyler Stanhope (Viator 5 PM)
        '2026-08-03', // Mon - Brian Godshall x3 (Viator 2 PM)
        '2026-08-11', // Tue - Heather Vest (Viator 2 PM)
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

    // Location schedule (for display purposes)
    locationSchedule: [
        { location: 'Flathead Harbor Marina', startDate: '2026-05-01', endDate: '2026-09-30' },
    ],
};

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
 * Limited days (Mon/Tue/Thu/Fri) get only 3 PM, 4 PM, and sunset.
 */
export function getTimeSlotsForDayOfWeek(dayOfWeek: number, dateStr?: string): string[] {
    const slots = dateStr ? getTimeSlotsForDate(dateStr) : BOOKING_CONFIG.timeSlots.daily;

    // Limited days: only 3 PM, 4 PM, and sunset (unless date has a full-day override)
    if (BOOKING_CONFIG.limitedDays.includes(dayOfWeek) && dateStr && !BOOKING_CONFIG.fullDayOverrides.includes(dateStr)) {
        const sunsetSlot = getLastTripSlot(dateStr);
        const limitedSlots = ['3:00 PM', '4:00 PM'];
        if (sunsetSlot !== '3:00 PM' && sunsetSlot !== '4:00 PM') {
            limitedSlots.push(sunsetSlot);
        }
        return limitedSlots.filter(s => slots.includes(s));
    }

    return slots;
}
