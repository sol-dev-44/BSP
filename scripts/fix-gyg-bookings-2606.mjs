// One-off reconciliation against GYG supplier dashboard (Jun 9 2026).
// Idempotent: safe to re-run. Reports per-row action.
//
// Fixes:
//   1. Insert Zach Nelson (new Jun 11 booking, ref GYGLMRYXXN2N)
//   2. Backfill Jonathan Rose phone (+18644927997)
//   3. Normalize Alisa Chernack ref: gyg_UHPV... -> gyg_GYG6H79XYFN2
//   4. Correct Vanessa Trahan total_amount 435 -> 340 (matches GYG headline)
//
// Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
for (const line of envFile.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const results = [];

// 1. Zach Nelson — new Jun 11 5PM booking, 2 adults, $258 total, standard slot
{
    const ref = 'GYGLMRYXXN2N';
    const pi = `gyg_${ref}`;
    const { data: existing } = await supabase
        .from('bsp_bookings')
        .select('id')
        .eq('stripe_payment_intent_id', pi)
        .maybeSingle();

    if (existing) {
        results.push({ step: 'zach_insert', status: 'skipped', reason: 'already exists', id: existing.id });
    } else {
        const { data, error } = await supabase
            .from('bsp_bookings')
            .insert({
                customer_name: 'Zach Nelson',
                customer_email: 'gyg@placeholder.com',
                customer_phone: '+14026597533',
                trip_date: '2026-06-11',
                trip_time: '17:00',
                party_size: 2,
                total_amount: 258.00,
                status: 'confirmed',
                stripe_payment_intent_id: pi,
                notes: `GYG | ${ref} | 2 Adults - $258.00 | Booked Jun 9, 2026`,
                add_ons: { source: 'getyourguide', gyg_ref: ref },
                slot_type: 'standard',
                per_person_rate: 119,
            })
            .select('id')
            .single();
        results.push({ step: 'zach_insert', status: error ? 'error' : 'inserted', id: data?.id, error: error?.message });
    }
}

// 2. Jonathan Rose — backfill phone if missing
{
    const pi = 'gyg_GYGFWV9H3QA9';
    const { data: row } = await supabase
        .from('bsp_bookings')
        .select('id, customer_phone')
        .eq('stripe_payment_intent_id', pi)
        .maybeSingle();

    if (!row) {
        results.push({ step: 'jonathan_phone', status: 'not_found' });
    } else if (row.customer_phone) {
        results.push({ step: 'jonathan_phone', status: 'skipped', reason: 'already has phone', phone: row.customer_phone });
    } else {
        const { error } = await supabase
            .from('bsp_bookings')
            .update({ customer_phone: '+18644927997' })
            .eq('id', row.id);
        results.push({ step: 'jonathan_phone', status: error ? 'error' : 'updated', id: row.id, error: error?.message });
    }
}

// 3. Alisa Chernack — rename payment intent ref to canonical short GYG ref
{
    const oldPi = 'gyg_UHPVHID6KG6X8KO4AO3V3ELGSBR5B5BI-1TNSI';
    const newPi = 'gyg_GYG6H79XYFN2';
    const newNotes = 'GYG | GYG6H79XYFN2 | 1 Adult - $129.00 | Reserve Now Pay Later | Booked Jun 6, 2026';

    // Ensure target doesn't already exist (avoid unique-constraint collision)
    const { data: clash } = await supabase
        .from('bsp_bookings')
        .select('id')
        .eq('stripe_payment_intent_id', newPi)
        .maybeSingle();

    if (clash) {
        results.push({ step: 'alisa_ref', status: 'skipped', reason: 'new ref already exists', id: clash.id });
    } else {
        const { data: old } = await supabase
            .from('bsp_bookings')
            .select('id')
            .eq('stripe_payment_intent_id', oldPi)
            .maybeSingle();

        if (!old) {
            results.push({ step: 'alisa_ref', status: 'not_found', reason: 'neither old nor new ref present' });
        } else {
            const { error } = await supabase
                .from('bsp_bookings')
                .update({
                    stripe_payment_intent_id: newPi,
                    notes: newNotes,
                    add_ons: { source: 'getyourguide', gyg_ref: 'GYG6H79XYFN2' },
                })
                .eq('id', old.id);
            results.push({ step: 'alisa_ref', status: error ? 'error' : 'updated', id: old.id, error: error?.message });
        }
    }
}

// 4. Vanessa Trahan — total 435 -> 340 (match GYG headline)
{
    const pi = 'gyg_GYG6H8AMGQNK';
    const { data: row } = await supabase
        .from('bsp_bookings')
        .select('id, total_amount')
        .eq('stripe_payment_intent_id', pi)
        .maybeSingle();

    if (!row) {
        results.push({ step: 'vanessa_total', status: 'not_found' });
    } else if (Number(row.total_amount) === 340) {
        results.push({ step: 'vanessa_total', status: 'skipped', reason: 'already 340' });
    } else {
        const { error } = await supabase
            .from('bsp_bookings')
            .update({ total_amount: 340.00 })
            .eq('id', row.id);
        results.push({ step: 'vanessa_total', status: error ? 'error' : 'updated', id: row.id, from: row.total_amount, to: 340, error: error?.message });
    }
}

console.log(JSON.stringify(results, null, 2));
