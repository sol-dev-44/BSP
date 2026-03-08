import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Soft delete by marking as cancelled
        const { error } = await supabaseAdmin
            .from('bsp_bookings')
            .update({ status: 'cancelled' })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to cancel booking' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Allowed fields to update
        const { trip_date, trip_time, notes, status, customer_name, customer_email, customer_phone, party_size } = body;

        const updates: any = {};
        if (trip_date) updates.trip_date = trip_date;
        if (trip_time) updates.trip_time = trip_time;
        if (notes !== undefined) updates.notes = notes;
        if (status) updates.status = status;
        if (customer_name) updates.customer_name = customer_name;
        if (customer_email) updates.customer_email = customer_email;
        if (customer_phone) updates.customer_phone = customer_phone;
        if (party_size) updates.party_size = party_size;

        const { data, error } = await supabaseAdmin
            .from('bsp_bookings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, booking: data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to update booking' },
            { status: 500 }
        );
    }
}
