'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function cancelBooking(bookingId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('bsp_bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);

        if (error) {
            console.error('Error cancelling booking:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { success: false, error: 'Unexpected error occurred' };
    }
}
