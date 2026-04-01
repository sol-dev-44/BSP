import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        // 1. Validate input
        if (!code) {
            return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 });
        }

        // 2. Normalize code
        const normalized = code.trim().toUpperCase();
        console.log('[DISCOUNT] Validating discount code:', normalized);

        // 3. Query Supabase
        const { data, error } = await supabaseAdmin
            .from('bsp_discount_codes')
            .select('id, code_name, amount, is_active')
            .eq('code_name', normalized)
            .single();

        // 4. Code not found
        if (error || !data) {
            console.log('[DISCOUNT] Code not found:', normalized);
            return NextResponse.json({ valid: false, error: 'Invalid discount code' }, { status: 200 });
        }

        // 5. Code is inactive
        if (!data.is_active) {
            console.log('[DISCOUNT] Code is inactive:', normalized);
            return NextResponse.json({ valid: false, error: 'This discount code is no longer active' }, { status: 200 });
        }

        // 6. Valid and active
        console.log('[DISCOUNT] Valid code applied:', normalized, 'amount:', data.amount);
        return NextResponse.json({ valid: true, code_name: data.code_name, amount: data.amount }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[DISCOUNT] Error validating discount code:', error);
        return NextResponse.json({ valid: false, error: message }, { status: 500 });
    }
}
