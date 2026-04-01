/**
 * Montana Solar Schedule (Flathead Lake area)
 *
 * Approximate sunrise/sunset times for Lakeside, MT (48.0°N, 114.2°W)
 * Used to generate dynamic daily time slots from 9 AM through last trip time.
 *
 * Season: May 1 - September 30
 *
 * Big Sky Parasail operates 9:00 AM - 7:00 PM daily with tiered pricing:
 * Early Bird (9-10 AM) = $99, Standard = $119, Sunset (last slot) = $159.
 */

interface SolarEntry {
    /** Month number 1-12 */
    month: number;
    /** Day of month (1 = first half, 16 = second half) */
    day: number;
    /** Approximate sunrise hour (24h, local MDT) */
    sunriseHour: number;
    sunriseMinute: number;
    /** Approximate sunset hour (24h, local MDT) */
    sunsetHour: number;
    sunsetMinute: number;
    /** Last trip start — computed as sunsetHour - 1, floored to :00 */
    lastTripHour: number;
    lastTripMinute: number;
}

/**
 * Bi-weekly solar data for Flathead Lake, Montana (48.0°N, 114.2°W).
 * Two entries per month (day 1 and day 16) covering May through September.
 * All times are local MDT (UTC-6 in summer).
 * lastTripHour is always sunsetHour - 1 (integer), lastTripMinute is always 0.
 *
 * May 1:   sunrise ~6:10, sunset ~8:30 PM  -> last trip 7:00 PM
 * May 16:  sunrise ~5:50, sunset ~8:50 PM  -> last trip 7:00 PM
 * Jun 1:   sunrise ~5:35, sunset ~9:10 PM  -> last trip 8:00 PM
 * Jun 16:  sunrise ~5:28, sunset ~9:30 PM  -> last trip 8:00 PM
 * Jul 1:   sunrise ~5:32, sunset ~9:28 PM  -> last trip 8:00 PM
 * Jul 16:  sunrise ~5:52, sunset ~9:10 PM  -> last trip 8:00 PM
 * Aug 1:   sunrise ~6:15, sunset ~8:45 PM  -> last trip 7:00 PM
 * Aug 16:  sunrise ~6:40, sunset ~8:15 PM  -> last trip 7:00 PM
 * Sep 1:   sunrise ~7:05, sunset ~7:45 PM  -> last trip 6:00 PM
 * Sep 16:  sunrise ~7:30, sunset ~7:10 PM  -> last trip 6:00 PM
 */
const SOLAR_TABLE: SolarEntry[] = [
    // May — early May sunset ~8:30 PM, mid/late May sunset ~8:45 PM
    { month: 5, day:  1, sunriseHour: 6, sunriseMinute: 10, sunsetHour: 20, sunsetMinute: 30, lastTripHour: 19, lastTripMinute: 0 },
    { month: 5, day: 16, sunriseHour: 5, sunriseMinute: 50, sunsetHour: 20, sunsetMinute: 50, lastTripHour: 19, lastTripMinute: 0 },
    // June — sunset reaches max ~9:30 PM around solstice
    { month: 6, day:  1, sunriseHour: 5, sunriseMinute: 35, sunsetHour: 21, sunsetMinute: 10, lastTripHour: 20, lastTripMinute: 0 },
    { month: 6, day: 16, sunriseHour: 5, sunriseMinute: 28, sunsetHour: 21, sunsetMinute: 30, lastTripHour: 20, lastTripMinute: 0 },
    // July — sunset begins retreating after solstice
    { month: 7, day:  1, sunriseHour: 5, sunriseMinute: 32, sunsetHour: 21, sunsetMinute: 28, lastTripHour: 20, lastTripMinute: 0 },
    { month: 7, day: 16, sunriseHour: 5, sunriseMinute: 52, sunsetHour: 21, sunsetMinute: 10, lastTripHour: 20, lastTripMinute: 0 },
    // August — sunset moves back noticeably
    { month: 8, day:  1, sunriseHour: 6, sunriseMinute: 15, sunsetHour: 20, sunsetMinute: 45, lastTripHour: 19, lastTripMinute: 0 },
    { month: 8, day: 16, sunriseHour: 6, sunriseMinute: 40, sunsetHour: 20, sunsetMinute: 15, lastTripHour: 19, lastTripMinute: 0 },
    // September — sunset drops to ~7:30 PM by end of month
    { month: 9, day:  1, sunriseHour: 7, sunriseMinute:  5, sunsetHour: 19, sunsetMinute: 45, lastTripHour: 18, lastTripMinute: 0 },
    { month: 9, day: 16, sunriseHour: 7, sunriseMinute: 30, sunsetHour: 19, sunsetMinute: 10, lastTripHour: 18, lastTripMinute: 0 },
];

/**
 * First trip of the day - 9:00 AM
 */
const FIRST_TRIP_HOUR = 9;

/**
 * Get the solar entry for a given date string (YYYY-MM-DD).
 * Picks the bi-weekly entry whose (month, day) bracket the given date.
 * day 1-15 of month -> use the month/day=1 entry
 * day 16+ of month -> use the month/day=16 entry
 */
function getSolarEntry(dateStr: string): SolarEntry {
    const parts = dateStr.split('-');
    const month = parseInt(parts[1]);
    const dayOfMonth = parseInt(parts[2]);
    const entryDay = dayOfMonth < 16 ? 1 : 16;

    const entry = SOLAR_TABLE.find(e => e.month === month && e.day === entryDay);
    if (entry) return entry;

    // Fallback: clamp to nearest in-season entry
    if (month < 5) return SOLAR_TABLE[0];
    return SOLAR_TABLE[SOLAR_TABLE.length - 1];
}

/**
 * Get the approximate sunset time string for a date (e.g. "8:45 PM").
 */
export function getMontanaSunset(dateStr: string): string {
    const entry = getSolarEntry(dateStr);
    return formatTime(entry.sunsetHour, entry.sunsetMinute);
}

/**
 * Get the last trip slot label for a date (e.g. "7:00 PM").
 */
export function getLastTripSlot(dateStr: string): string {
    const entry = getSolarEntry(dateStr);
    return formatTime(entry.lastTripHour, entry.lastTripMinute);
}

/**
 * Generate the full array of available time slot display strings for a given date.
 * Hourly from 9:00 AM through the last trip time for that date.
 *
 * Example for a June date: ["9:00 AM", "10:00 AM", ..., "7:00 PM", "8:00 PM"]
 * Pricing: 9-10 AM = Early Bird ($99), last slot = Sunset ($159), all others = Standard ($119).
 */
export function getTimeSlotsForDate(dateStr: string): string[] {
    const entry = getSolarEntry(dateStr);

    const slots: string[] = [];

    // Generate hourly slots from 9 AM through last trip time
    for (let hour = FIRST_TRIP_HOUR; hour <= entry.lastTripHour; hour++) {
        if (hour === entry.lastTripHour && entry.lastTripMinute > 0) {
            // Last trip is at :30 - add the half-hour slot
            slots.push(formatTime(hour, entry.lastTripMinute));
        } else if (hour <= entry.lastTripHour) {
            // Regular hourly slot
            slots.push(formatTime(hour, 0));
        }
    }

    return slots;
}

/**
 * Format 24h time to 12h display string.
 * e.g. (13, 0) -> "1:00 PM", (9, 0) -> "9:00 AM"
 */
function formatTime(hour24: number, minute: number): string {
    const suffix = hour24 >= 12 ? 'PM' : 'AM';
    const h = hour24 % 12 || 12;
    const m = String(minute).padStart(2, '0');
    return `${h}:${m} ${suffix}`;
}

/**
 * Get a human-readable schedule description for display.
 * e.g. "9:00 AM - 7:00 PM"
 */
export function getScheduleDescription(dateStr: string): string {
    const lastTrip = getLastTripSlot(dateStr);
    return `9:00 AM - ${lastTrip}`;
}

/**
 * Normalize a time string to "H:MM AM/PM" format.
 * Handles both 12h display ("7:00 PM") and 24h DB ("19:00:00" or "19:00") formats.
 */
function normalizeTime(timeStr: string): string {
    if (!timeStr) return timeStr;

    // Already in 12h format (contains AM/PM)?
    if (/[AP]M/i.test(timeStr)) return timeStr.trim();

    // 24h format: "19:00:00" or "19:00"
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const minute = parseInt(m) || 0;
    return formatTime(hour, minute);
}

/**
 * Early bird slots = 9:00 AM and 10:00 AM.
 * Returns true if the given time string represents a morning early bird slot.
 */
export function isEarlyBirdSlot(timeStr: string): boolean {
    const normalized = normalizeTime(timeStr);
    return normalized === '9:00 AM' || normalized === '10:00 AM';
}

/**
 * Sunset slot = last slot of the day based on Montana solar schedule.
 * Returns true if the given time string matches the last trip slot for the date.
 */
export function isSunsetSlot(dateStr: string, timeStr: string): boolean {
    const normalized = normalizeTime(timeStr);
    const lastSlot = getLastTripSlot(dateStr);
    return normalized === lastSlot;
}

/**
 * Determine the slot type for a given date and time.
 * Returns 'earlybird', 'sunset', or 'standard'.
 */
export function getSlotType(dateStr: string, timeStr: string): 'earlybird' | 'sunset' | 'standard' {
    if (isEarlyBirdSlot(timeStr)) return 'earlybird';
    if (isSunsetSlot(dateStr, timeStr)) return 'sunset';
    return 'standard';
}

/**
 * Get the per-person price for a slot type.
 */
export function getSlotPrice(slotType: 'earlybird' | 'sunset' | 'standard'): number {
    switch (slotType) {
        case 'earlybird': return 99;
        case 'sunset': return 159;
        case 'standard': return 119;
    }
}
