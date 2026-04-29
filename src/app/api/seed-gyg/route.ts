import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';

const GYG_BOOKINGS = [
    { name: 'Julie Bomfim', date: '2026-07-30', time: '16:00', size: 4, ref: 'GYGG45W7FGA4', total: 340.00, detail: '2 Adults - $190.00, 2 Children - $150.00 | Booked Apr 22, 2026' },
    { name: 'Jonathan Rose', date: '2026-06-02', time: '16:00', size: 2, ref: 'GYGFWV9H3QA9', total: 190.00, detail: '2 Adults - $190.00 | Booked Apr 17, 2026' },
];

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const results = [];

    for (const b of GYG_BOOKINGS) {
        // Skip if already inserted (idempotent via GYG ref)
        const { data: existing } = await supabase
            .from('bsp_bookings')
            .select('id')
            .eq('stripe_payment_intent_id', 'gyg_' + b.ref)
            .single();

        if (existing) {
            results.push({ status: 'skipped', name: b.name, ref: b.ref, reason: 'already exists' });
            continue;
        }

        const slotType = getSlotType(b.date, b.time);
        const perPerson = getSlotPrice(slotType);

        const { data, error } = await supabase
            .from('bsp_bookings')
            .insert({
                customer_name: b.name,
                customer_email: 'gyg@placeholder.com',
                customer_phone: '',
                trip_date: b.date,
                trip_time: b.time,
                party_size: b.size,
                total_amount: b.total,
                status: 'confirmed',
                stripe_payment_intent_id: 'gyg_' + b.ref,
                notes: 'GYG | ' + b.ref + ' | ' + b.detail,
                add_ons: { source: 'getyourguide', gyg_ref: b.ref },
                slot_type: slotType,
                per_person_rate: perPerson,
            })
            .select('id')
            .single();

        if (error) {
            results.push({ status: 'error', name: b.name, ref: b.ref, error: error.message });
        } else {
            results.push({ status: 'inserted', name: b.name, ref: b.ref, date: b.date, time: b.time, size: b.size, slotType, perPerson, total: b.total, id: data.id });
        }
    }

    return NextResponse.json({ results });
}
