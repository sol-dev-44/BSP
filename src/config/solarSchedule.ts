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
    /** Approximate sunrise hour (24h, local MDT) */
    sunriseHour: number;
    sunriseMinute: number;
    /** Approximate sunset hour (24h, local MDT) */
    sunsetHour: number;
    sunsetMinute: number;
    /** Last trip start hour (24h) */
    lastTripHour: number;
    lastTripMinute: number;
}

/**
 * Representative mid-month solar data for Flathead Lake, Montana.
 * All times are local (MDT for May-Sep).
 *
 * May:   sunrise ~6:00, sunset ~8:45 PM  -> last trip 7:00 PM
 * Jun:   sunrise ~5:30, sunset ~9:30 PM  -> last trip 7:00 PM
 * Jul:   sunrise ~5:45, sunset ~9:20 PM  -> last trip 7:00 PM
 * Aug:   sunrise ~6:20, sunset ~8:30 PM  -> last trip 7:00 PM
 * Sep:   sunrise ~7:00, sunset ~7:30 PM  -> last trip 6:00 PM
 */
const SOLAR_TABLE: SolarEntry[] = [
    { month: 5, sunriseHour: 6, sunriseMinute: 0, sunsetHour: 20, sunsetMinute: 45, lastTripHour: 19, lastTripMinute: 0 },
    { month: 6, sunriseHour: 5, sunriseMinute: 30, sunsetHour: 21, sunsetMinute: 30, lastTripHour: 19, lastTripMinute: 0 },
    { month: 7, sunriseHour: 5, sunriseMinute: 45, sunsetHour: 21, sunsetMinute: 20, lastTripHour: 19, lastTripMinute: 0 },
    { month: 8, sunriseHour: 6, sunriseMinute: 20, sunsetHour: 20, sunsetMinute: 30, lastTripHour: 19, lastTripMinute: 0 },
    { month: 9, sunriseHour: 7, sunriseMinute: 0, sunsetHour: 19, sunsetMinute: 30, lastTripHour: 18, lastTripMinute: 0 },
];

/**
 * First trip of the day - 9:00 AM
 */
const FIRST_TRIP_HOUR = 9;

/**
 * Get the solar entry for a given month (1-12).
 * Falls back to the closest available month if somehow out of season.
 */
function getSolarEntry(month: number): SolarEntry {
    const entry = SOLAR_TABLE.find(e => e.month === month);
    if (entry) return entry;

    // Fallback: clamp to nearest in-season month
    if (month < 5) return SOLAR_TABLE[0];
    return SOLAR_TABLE[SOLAR_TABLE.length - 1];
}

/**
 * Get the approximate sunset time string for a date (e.g. "8:45 PM").
 */
export function getMontanaSunset(dateStr: string): string {
    const month = parseInt(dateStr.split('-')[1]);
    const entry = getSolarEntry(month);
    return formatTime(entry.sunsetHour, entry.sunsetMinute);
}

/**
 * Get the last trip slot label for a date (e.g. "7:00 PM").
 */
export function getLastTripSlot(dateStr: string): string {
    const month = parseInt(dateStr.split('-')[1]);
    const entry = getSolarEntry(month);
    return formatTime(entry.lastTripHour, entry.lastTripMinute);
}

/**
 * Generate the full array of available time slot display strings for a given date.
 * Hourly from 9:00 AM through the last trip time for that month.
 *
 * Example for a June date: ["9:00 AM", "10:00 AM", ..., "6:00 PM", "7:00 PM"]
 * Pricing: 9-10 AM = Early Bird ($99), last slot = Sunset ($159), all others = Standard ($119).
 */
export function getTimeSlotsForDate(dateStr: string): string[] {
    const month = parseInt(dateStr.split('-')[1]);
    const entry = getSolarEntry(month);

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
