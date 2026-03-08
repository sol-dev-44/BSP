import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const { data: log, error } = await supabaseAdmin
        .from('bsp_maintenance')
        .select('*')
        .eq('log_date', date)
        .maybeSingle();

    if (error) {
        console.error('Error fetching maintenance log:', error);
        return NextResponse.json({ error: 'Failed to fetch maintenance log' }, { status: 500 });
    }

    return NextResponse.json(log || { log_date: date, fluids_data: {}, inspections_data: [], custom_entries: [] });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { log_date, inspector_name, engine_hours, fuel_gallons, fluids_data, inspections_data, custom_entries } = body;

        if (!log_date) {
            return NextResponse.json({ error: 'log_date is required' }, { status: 400 });
        }

        // Upsert based on the log_date (requires log_date to be unique)
        const { data: log, error } = await supabaseAdmin
            .from('bsp_maintenance')
            .upsert({
                log_date,
                inspector_name,
                engine_hours,
                fuel_gallons,
                fluids_data: fluids_data || {},
                inspections_data: inspections_data || [],
                custom_entries: custom_entries || [],
                updated_at: new Date().toISOString()
            }, { onConflict: 'log_date' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(log);
    } catch (error) {
        console.error('Error saving maintenance log:', error);
        return NextResponse.json({ error: 'Failed to save maintenance log' }, { status: 500 });
    }
}
