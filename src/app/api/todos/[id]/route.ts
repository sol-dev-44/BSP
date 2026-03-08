import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { data: todo, error } = await supabaseAdmin
            .from('bsp_todos')
            .update(body)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const { error } = await supabaseAdmin
            .from('bsp_todos')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}
