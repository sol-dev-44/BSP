import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';

const VIATOR_BOOKINGS = [
    { name: 'Tammy Harris', date: '2026-06-26', time: '13:00', size: 7, ref: 'BR-1390677817', detail: '2 children, 5 adults | Submitted Apr 28, 2026', statusOverride: 'confirmed' as const },
    { name: 'Heather Vest', date: '2026-08-11', time: '14:00', size: 4, ref: 'BR-1387393903', detail: '1 child, 3 adults | Submitted Apr 20, 2026' },
    { name: 'Ruben Vela', date: '2026-07-03', time: '15:00', size: 3, ref: 'BR-1361898681', detail: '3 adults | Submitted Feb 11, 2026' },
    { name: 'W Kay Fries', date: '2026-07-10', time: '14:00', size: 3, ref: 'BR-1360545033', detail: '3 adults | Amended | Submitted Feb 7, 2026' },
    { name: 'Brian Godshall', date: '2026-08-03', time: '14:00', size: 4, ref: 'BR-1348307231', detail: '4 adults | Submitted Dec 30, 2025' },
    { name: 'Tyler Stanhope', date: '2026-07-28', time: '17:00', size: 2, ref: 'BR-1348083443', detail: '2 adults | Submitted Dec 29, 2025' },
    { name: 'Brian Godshall', date: '2026-08-03', time: '14:00', size: 4, ref: 'BR-1334202287', detail: '4 adults | Submitted Nov 10, 2025' },
    { name: 'Brian Godshall', date: '2026-08-03', time: '14:00', size: 5, ref: 'BR-1334201497', detail: '5 adults | Submitted Nov 10, 2025' },
    { name: 'Brian Godshall', date: '2026-08-03', time: '14:00', size: 9, ref: 'BR-1334200299', detail: '9 adults | Submitted Nov 10, 2025 | CANCELLED', statusOverride: 'cancelled' as const },
];

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const results = [];

    for (const b of VIATOR_BOOKINGS) {
        // Skip if already inserted (idempotent via viator ref)
        const { data: existing } = await supabase
            .from('bsp_bookings')
            .select('id')
            .eq('stripe_payment_intent_id', 'viator_' + b.ref)
            .single();

        if (existing) {
            results.push({ status: 'skipped', name: b.name, ref: b.ref, reason: 'already exists' });
            continue;
        }

        const slotType = getSlotType(b.date, b.time);
        const perPerson = getSlotPrice(slotType);
        const total = b.size * perPerson;

        const { data, error } = await supabase
            .from('bsp_bookings')
            .insert({
                customer_name: b.name,
                customer_email: 'viator@placeholder.com',
                customer_phone: '',
                trip_date: b.date,
                trip_time: b.time,
                party_size: b.size,
                total_amount: total,
                status: b.statusOverride || 'confirmed',
                stripe_payment_intent_id: 'viator_' + b.ref,
                notes: 'VIATOR | ' + b.ref + ' | ' + b.detail,
                add_ons: { source: 'viator', viator_ref: b.ref },
                slot_type: slotType,
                per_person_rate: perPerson,
            })
            .select('id')
            .single();

        if (error) {
            results.push({ status: 'error', name: b.name, ref: b.ref, error: error.message });
        } else {
            results.push({ status: 'inserted', name: b.name, ref: b.ref, date: b.date, time: b.time, size: b.size, slotType, perPerson, total, id: data.id });
        }
    }

    return NextResponse.json({ results });
}
