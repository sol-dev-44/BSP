import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';

/**
 * POST /api/viator/sync
 *
 * Fetches upcoming confirmed bookings from the Viator Supplier API
 * and upserts them into bsp_bookings. Idempotent via booking ref.
 *
 * Requires VIATOR_API_KEY env var.
 * Can be called manually or on a cron schedule.
 */

const VIATOR_API_BASE = 'https://api.viator.com/partner';
const SUPPLIER_ID = '5593492';

interface ViatorBooking {
    bookingRef: string;
    status: string;
    travelDate: string;
    startTime?: string;
    leadTraveler: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
    };
    numAdults: number;
    numChildren: number;
    productName: string;
    totalPrice: number;
    currency: string;
}

interface ViatorSearchResponse {
    bookings: ViatorBooking[];
    totalCount: number;
    nextCursor?: string;
}

export async function POST(request: Request) {
    const apiKey = process.env.VIATOR_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: 'VIATOR_API_KEY not configured. See /api/viator/sync README for setup.' },
            { status: 500 }
        );
    }

    // Optional: protect with a shared secret for cron calls
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const bookings = await fetchViatorBookings(apiKey);
        const results = await upsertBookings(bookings);

        return NextResponse.json({
            synced: results.filter(r => r.status === 'inserted').length,
            skipped: results.filter(r => r.status === 'skipped').length,
            updated: results.filter(r => r.status === 'updated').length,
            errors: results.filter(r => r.status === 'error').length,
            results,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[VIATOR SYNC] Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// Also support GET for easy manual triggering from browser
export async function GET(request: Request) {
    return POST(request);
}

async function fetchViatorBookings(apiKey: string): Promise<ViatorBooking[]> {
    const allBookings: ViatorBooking[] = [];
    let cursor: string | undefined;

    // Fetch upcoming confirmed bookings
    const today = new Date().toISOString().split('T')[0];

    do {
        const body: Record<string, unknown> = {
            supplierId: SUPPLIER_ID,
            statuses: ['CONFIRMED', 'AMENDED'],
            travelDateFrom: today,
            sortBy: 'TRAVEL_DATE',
            sortOrder: 'ASC',
            limit: 50,
        };
        if (cursor) body.cursor = cursor;

        const res = await fetch(`${VIATOR_API_BASE}/bookings/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'exp-api-key': apiKey,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Viator API ${res.status}: ${text}`);
        }

        const data: ViatorSearchResponse = await res.json();
        allBookings.push(...data.bookings);
        cursor = data.nextCursor;
    } while (cursor);

    return allBookings;
}

async function upsertBookings(bookings: ViatorBooking[]) {
    const results = [];

    for (const b of bookings) {
        const viatorRef = b.bookingRef;
        const paymentId = 'viator_' + viatorRef;
        const partySize = b.numAdults + b.numChildren;
        const tripTime = b.startTime || '14:00';

        // Check if already exists
        const { data: existing } = await supabaseAdmin
            .from('bsp_bookings')
            .select('id, status')
            .eq('stripe_payment_intent_id', paymentId)
            .single();

        const slotType = getSlotType(b.travelDate, tripTime);
        const perPerson = getSlotPrice(slotType);

        const bookingData = {
            customer_name: `${b.leadTraveler.firstName} ${b.leadTraveler.lastName}`.trim(),
            customer_email: b.leadTraveler.email || 'viator@placeholder.com',
            customer_phone: b.leadTraveler.phone || '',
            trip_date: b.travelDate,
            trip_time: tripTime,
            party_size: partySize,
            total_amount: b.totalPrice || partySize * perPerson,
            status: mapViatorStatus(b.status),
            stripe_payment_intent_id: paymentId,
            notes: `VIATOR | ${viatorRef} | ${b.numAdults} adults${b.numChildren > 0 ? `, ${b.numChildren} children` : ''}`,
            add_ons: { source: 'viator', viator_ref: viatorRef },
            slot_type: slotType,
            per_person_rate: perPerson,
            booking_source: 'viator',
        };

        if (existing) {
            // Update if status changed
            const { error } = await supabaseAdmin
                .from('bsp_bookings')
                .update(bookingData)
                .eq('id', existing.id);

            if (error) {
                results.push({ status: 'error', ref: viatorRef, error: error.message });
            } else {
                results.push({ status: 'updated', ref: viatorRef, name: bookingData.customer_name });
            }
        } else {
            const { error } = await supabaseAdmin
                .from('bsp_bookings')
                .insert(bookingData)
                .select('id')
                .single();

            if (error) {
                results.push({ status: 'error', ref: viatorRef, error: error.message });
            } else {
                results.push({ status: 'inserted', ref: viatorRef, name: bookingData.customer_name, date: b.travelDate });
            }
        }
    }

    return results;
}

function mapViatorStatus(viatorStatus: string): string {
    switch (viatorStatus.toUpperCase()) {
        case 'CONFIRMED':
        case 'AMENDED':
            return 'confirmed';
        case 'CANCELLED':
        case 'REJECTED':
            return 'cancelled';
        case 'COMPLETED':
            return 'completed';
        default:
            return 'pending';
    }
}
