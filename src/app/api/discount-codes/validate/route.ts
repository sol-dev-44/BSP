import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSlotType } from '@/config/solarSchedule';

export async function POST(request: Request) {
    try {
        const { code, trip_date, trip_time } = await request.json();

        if (!code) {
            return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 });
        }

        const normalized = code.trim().toUpperCase();
        console.log('[DISCOUNT] Validating discount code:', normalized);

        const { data, error } = await supabaseAdmin
            .from('bsp_discount_codes')
            .select('id, code_name, amount, is_active, max_redemptions, times_redeemed, excludes_early_bird')
            .eq('code_name', normalized)
            .single();

        if (error || !data) {
            console.log('[DISCOUNT] Code not found:', normalized);
            return NextResponse.json({ valid: false, error: 'Invalid discount code' }, { status: 200 });
        }

        if (!data.is_active) {
            console.log('[DISCOUNT] Code is inactive:', normalized);
            return NextResponse.json({ valid: false, error: 'This discount code is no longer active' }, { status: 200 });
        }

        // D-05 order: cap check before early-bird check
        if (data.max_redemptions > 0 && data.times_redeemed >= data.max_redemptions) {
            console.log('[DISCOUNT] Code at cap:', normalized, data.times_redeemed, '/', data.max_redemptions);
            return NextResponse.json(
                { valid: false, error: 'This discount code has reached its redemption limit' },
                { status: 200 }
            );
        }

        if (data.excludes_early_bird && trip_date && trip_time) {
            const slot = getSlotType(trip_date, trip_time);
            if (slot === 'earlybird') {
                console.log('[DISCOUNT] Code excluded for early bird slot:', normalized, trip_date, trip_time);
                return NextResponse.json(
                    { valid: false, error: 'This code cannot be used with early bird flights' },
                    { status: 200 }
                );
            }
        }

        console.log('[DISCOUNT] Valid code applied:', normalized, 'amount per guest:', data.amount);
        return NextResponse.json(
            { valid: true, code_name: data.code_name, amount: data.amount },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[DISCOUNT] Error validating discount code:', error);
        return NextResponse.json({ valid: false, error: message }, { status: 500 });
    }
}
