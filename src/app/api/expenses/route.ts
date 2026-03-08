import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
    const { data: expenses, error } = await supabaseAdmin
        .from('bsp_expenses')
        .select('*')
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }

    return NextResponse.json(expenses || []);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, expense_date, amount, category, link } = body;

        if (!name || !expense_date || !amount || !category) {
            return NextResponse.json({ error: 'Name, date, amount, and category are required' }, { status: 400 });
        }

        const { data: expense, error } = await supabaseAdmin
            .from('bsp_expenses')
            .insert([{ name, description, expense_date, amount, category, link }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(expense);
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
}
