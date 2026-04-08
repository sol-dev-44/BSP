/**
 * Booking Configuration for Big Sky Parasail
 * Season: May 1st - September 30th
 */

import { getTimeSlotsForDate, RESTRICTED_START_HOUR } from './solarSchedule';

export const BOOKING_CONFIG = {
    // Season dates (YYYY-MM-DD format)
    seasons: [
        { startDate: '2026-05-01', endDate: '2026-09-30' },
    ],

    // Excluded days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Closed Monday, Tuesday, Thursday — open Wednesday, Friday, Saturday, Sunday
    excludedDaysOfWeek: [1, 2, 4] as number[],

    // Days with restricted hours (3 PM start instead of 10 AM)
    // 3 = Wednesday, 5 = Friday
    restrictedDaysOfWeek: [3, 5] as number[],

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
    return !BOOKING_CONFIG.excludedDaysOfWeek.includes(dayOfWeek);
}

/**
 * Helper function to check if a day of the week has restricted hours (3 PM start).
 * Wednesday (3) and Friday (5) only offer 3 PM through sunset.
 */
export function isRestrictedDay(dayOfWeek: number): boolean {
    return BOOKING_CONFIG.restrictedDaysOfWeek.includes(dayOfWeek);
}

/**
 * Helper function to get time slots for a specific date.
 * Uses the Montana solar calendar to determine available slots.
 * Passes RESTRICTED_START_HOUR for Wednesday and Friday.
 */
export function getTimeSlotsForDayOfWeek(dayOfWeek: number, dateStr?: string): string[] {
    if (dateStr) {
        const startHour = isRestrictedDay(dayOfWeek) ? RESTRICTED_START_HOUR : undefined;
        return getTimeSlotsForDate(dateStr, startHour);
    }
    // Fallback to static daily slots if no date provided
    return BOOKING_CONFIG.timeSlots.daily;
}
