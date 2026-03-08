import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabaseAdmin
        .from('bsp_supplies')
        .select('*')
        .order('created_at', { ascending: false });

    if (category) {
        query = query.eq('category', category);
    }
    if (search) {
        query = query.or(`name.ilike.%${search}%,reason.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching supplies:', error);
        return NextResponse.json({ error: 'Failed to fetch supplies' }, { status: 500 });
    }

    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, reason } = body;

        if (!name?.trim() || !category?.trim() || !reason?.trim()) {
            return NextResponse.json(
                { error: 'name, category, and reason are all required' },
                { status: 400 }
            );
        }

        const { data: supply, error } = await supabaseAdmin
            .from('bsp_supplies')
            .insert([{ name: name.trim(), category: category.trim(), reason: reason.trim() }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(supply, { status: 201 });
    } catch (error) {
        console.error('Error creating supply:', error);
        return NextResponse.json({ error: 'Failed to create supply' }, { status: 500 });
    }
}
