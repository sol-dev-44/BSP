import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { code_name, amount, is_active } = body;

        const updates: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (code_name !== undefined) {
            updates.code_name = typeof code_name === 'string' ? code_name.trim().toUpperCase() : code_name;
        }
        if (amount !== undefined) {
            updates.amount = amount;
        }
        if (is_active !== undefined) {
            updates.is_active = is_active;
        }

        const { data: code, error } = await supabaseAdmin
            .from('bsp_discount_codes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[DISCOUNT-CODES] Error updating discount code:', error);
            if (error.code === '23505') {
                return NextResponse.json({ error: 'A discount code with that name already exists' }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json(code);
    } catch (error) {
        console.error('[DISCOUNT-CODES] Unexpected error in PATCH:', error);
        return NextResponse.json({ error: 'Failed to update discount code' }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { error } = await supabaseAdmin
            .from('bsp_discount_codes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[DISCOUNT-CODES] Error deleting discount code:', error);
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[DISCOUNT-CODES] Unexpected error in DELETE:', error);
        return NextResponse.json({ error: 'Failed to delete discount code' }, { status: 500 });
    }
}
