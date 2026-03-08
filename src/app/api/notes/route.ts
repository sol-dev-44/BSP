import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('bsp_notes')
            .select('*')
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin notes:', error);
            return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET /api/notes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, category, is_pinned } = body;

        if (!content || !category) {
            return NextResponse.json({ error: 'Content and category are required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('bsp_notes')
            .insert([{ content, category, is_pinned: is_pinned || false }])
            .select()
            .single();

        if (error) {
            console.error('Error creating admin note:', error);
            return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/notes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, is_pinned } = body;

        if (!id || is_pinned === undefined) {
            return NextResponse.json({ error: 'ID and is_pinned are required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('bsp_notes')
            .update({ is_pinned })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating admin note:', error);
            return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in PATCH /api/notes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('bsp_notes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting admin note:', error);
            return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE /api/notes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
