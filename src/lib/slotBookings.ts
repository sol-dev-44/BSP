import type { SupabaseClient } from '@supabase/supabase-js';
import { slotTimeTo24h } from '@/config/solarSchedule';

/**
 * True when the slot already has at least one active (non-cancelled) booking.
 * Used to waive the advance-notice window: once a trip is running anyway,
 * additional riders can book right up until departure.
 * Fails closed (false) on lookup errors so the notice rule stays enforced.
 */
export async function slotHasActiveBooking(
    supabase: SupabaseClient,
    tripDate: string,
    tripTime: string,
): Promise<boolean> {
    const time24 = slotTimeTo24h(tripTime);
    if (!time24) return false;

    const { count, error } = await supabase
        .from('bsp_bookings')
        .select('id', { count: 'exact', head: true })
        .eq('trip_date', tripDate)
        .eq('trip_time', time24)
        .neq('status', 'cancelled');

    if (error) {
        console.error('[SLOT BOOKINGS] Active-booking lookup failed:', error.message);
        return false;
    }
    return (count ?? 0) > 0;
}
