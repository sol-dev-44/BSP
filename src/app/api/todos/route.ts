import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const { data: todos, error } = await supabaseAdmin
        .from('bsp_todos')
        .select('*')
        .eq('task_date', date)
        .order('rank', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }

    return NextResponse.json(todos || []);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, task_date, rank } = body;

        if (!title || !task_date) {
            return NextResponse.json({ error: 'Title and task_date are required' }, { status: 400 });
        }

        const { data: todo, error } = await supabaseAdmin
            .from('bsp_todos')
            .insert([{ title, task_date, rank: rank || 0 }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        // Support bulk reordering when an array is sent
        if (Array.isArray(body)) {
            const { error } = await supabaseAdmin
                .from('bsp_todos')
                .upsert(body);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid request format for bulk update' }, { status: 400 });
    } catch (error) {
        console.error('Error updating todos:', error);
        return NextResponse.json({ error: 'Failed to update todos' }, { status: 500 });
    }
}
