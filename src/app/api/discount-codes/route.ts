import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data: codes, error } = await supabaseAdmin
            .from('bsp_discount_codes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[DISCOUNT-CODES] Error fetching discount codes:', error);
            return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 });
        }

        return NextResponse.json(codes || []);
    } catch (error) {
        console.error('[DISCOUNT-CODES] Unexpected error in GET:', error);
        return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code_name, amount } = body;

        if (!code_name || typeof code_name !== 'string' || !code_name.trim()) {
            return NextResponse.json({ error: 'code_name is required and must be a non-empty string' }, { status: 400 });
        }

        if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: 'amount is required and must be a positive number' }, { status: 400 });
        }

        const normalizedName = code_name.trim().toUpperCase();

        const { data: code, error } = await supabaseAdmin
            .from('bsp_discount_codes')
            .insert([{ code_name: normalizedName, amount }])
            .select()
            .single();

        if (error) {
            console.error('[DISCOUNT-CODES] Error creating discount code:', error);
            if (error.code === '23505') {
                return NextResponse.json({ error: 'A discount code with that name already exists' }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json(code, { status: 201 });
    } catch (error) {
        console.error('[DISCOUNT-CODES] Unexpected error in POST:', error);
        return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 });
    }
}
