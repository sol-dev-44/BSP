import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { BUSINESS_INFO } from '@/config/business';
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

/** Determine per-person price server-side based on slot type (early bird / standard / sunset) */
function getPerPersonPrice(tripDate: string, tripTime: string): number {
    const slotType = getSlotType(tripDate, tripTime);
    return getSlotPrice(slotType);
}

export async function POST(request: Request) {
    try {
        const { party_size, trip_date, trip_time, add_ons, discount_code, boat_riders } = await request.json();

        const observerCount = boat_riders || parseInt(add_ons?.observer_count || add_ons?.observer_package || 0);
        const totalPassengers = (party_size || 0) + observerCount;

        if (totalPassengers <= 0 || !trip_date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn("STRIPE_SECRET_KEY is missing.");
            return NextResponse.json({ error: 'Stripe configuration missing on server' }, { status: 500 });
        }

        // Server-side price calculation - tiered pricing based on time slot
        const perPerson = getPerPersonPrice(trip_date, trip_time || '');
        let amount = (party_size || 0) * perPerson;

        // Observers
        amount += (observerCount * BUSINESS_INFO.pricing.observer);

        // Add-ons
        if (add_ons) {
            const comboCount = parseInt(add_ons.combo_package || 0);
            const photoCount = parseInt(add_ons.photo_package || 0);
            const goproCount = parseInt(add_ons.gopro_package || 0);
            const tip = parseFloat(add_ons.tip_amount || 0);

            amount += (comboCount * BUSINESS_INFO.pricing.combo);
            amount += (photoCount * BUSINESS_INFO.pricing.photos);
            amount += (goproCount * BUSINESS_INFO.pricing.gopro);
            amount += tip;
        }

        const slotType = getSlotType(trip_date, trip_time || '');

        // Apply discount code if provided
        let discountAmount = 0;
        let appliedDiscountCode = '';

        if (discount_code) {
            const normalizedCode = discount_code.trim().toUpperCase();
            const { data: discountData, error: discountError } = await supabaseAdmin
                .from('bsp_discount_codes')
                .select('amount, is_active, code_name')
                .eq('code_name', normalizedCode)
                .single();

            if (discountError || !discountData) {
                console.warn('[BSP PAYMENT] Discount code not found:', normalizedCode);
            } else if (!discountData.is_active) {
                console.warn('[BSP PAYMENT] Discount code inactive:', normalizedCode);
            } else {
                discountAmount = discountData.amount;
                appliedDiscountCode = discountData.code_name;
                amount = Math.max(0, amount - discountAmount);
                console.log('[DISCOUNT] Applied discount code', normalizedCode, 'amount', discountAmount);
            }
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                trip_date,
                trip_time: trip_time || '',
                party_size,
                slot_type: slotType,
                per_person_rate: perPerson,
                observer_count: observerCount,
                combo_package: add_ons?.combo_package || 0,
                photo_package: add_ons?.photo_package || 0,
                gopro_package: add_ons?.gopro_package || 0,
                tip_amount: add_ons?.tip_amount || 0,
                discount_code: appliedDiscountCode || '',
                discount_amount: discountAmount || 0,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            discountApplied: discountAmount > 0,
            discountAmount: discountAmount || 0,
        });
    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
