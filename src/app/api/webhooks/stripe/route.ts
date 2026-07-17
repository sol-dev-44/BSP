import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { BUSINESS_INFO } from '@/config/business';

// Allow time for the post-payment grace period before checking for the booking row
export const maxDuration = 30;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// The customer's browser normally POSTs /api/bookings within a second or two of
// payment success. Wait before checking so a healthy checkout never triggers an alert.
const BOOKING_GRACE_PERIOD_MS = 8000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET not configured');
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        const rawBody = await request.text();
        event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[STRIPE WEBHOOK] Signature verification failed:', message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type !== 'payment_intent.succeeded') {
        return NextResponse.json({ received: true });
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata || {};

    // Website checkouts always carry trip metadata; manual invoices and other
    // charges don't, and legitimately have no booking row — skip those.
    if (!metadata.trip_date) {
        console.log(`[STRIPE WEBHOOK] ${paymentIntent.id} has no trip metadata (manual charge?) — skipping`);
        return NextResponse.json({ received: true });
    }

    await sleep(BOOKING_GRACE_PERIOD_MS);

    try {
        const { data: booking, error } = await supabase
            .from('bsp_bookings')
            .select('id, customer_name, status')
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .maybeSingle();

        if (error) {
            // Can't tell whether the booking exists — make Stripe retry rather than miss an orphan
            console.error('[STRIPE WEBHOOK] Booking lookup failed:', error.message);
            return NextResponse.json({ error: 'Booking lookup failed' }, { status: 500 });
        }

        if (booking) {
            console.log(`[STRIPE WEBHOOK] ${paymentIntent.id} matched booking ${booking.id} (${booking.customer_name}) — OK`);
            return NextResponse.json({ received: true });
        }

        // Orphaned charge: money captured, no booking row. Alert the owner immediately.
        console.warn(`[STRIPE WEBHOOK] ORPHANED CHARGE: ${paymentIntent.id} $${(paymentIntent.amount / 100).toFixed(2)} — no booking row found`);

        const amount = (paymentIntent.amount / 100).toFixed(2);
        const isDev = process.env.NODE_ENV === 'development';
        const hasVerifiedDomain = !!process.env.RESEND_VERIFIED_DOMAIN;
        const fromAddress = (!isDev || hasVerifiedDomain)
            ? 'Big Sky Parasail <bookings@montanaparasail.com>'
            : 'Big Sky Parasail <onboarding@resend.dev>';
        const adminTo = isDev && !hasVerifiedDomain
            ? (process.env.RESEND_ACCOUNT_EMAIL || BUSINESS_INFO.email)
            : BUSINESS_INFO.email;

        await resend.emails.send({
            from: fromAddress,
            to: [adminTo],
            subject: `⚠️ Payment captured but NO booking saved — $${amount} for ${metadata.trip_date}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <h2 style="color:#dc2626">Orphaned charge — customer paid but booking failed to save</h2>
                    <p>A customer's card was just charged, but their booking never made it into the system.
                    They likely saw an error and may try to pay again (double charge) or assume the booking failed.</p>
                    <table style="width:100%;border-collapse:collapse">
                        <tr><td style="padding:6px 0"><strong>Amount</strong></td><td>$${amount}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Trip date</strong></td><td>${metadata.trip_date}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Trip time</strong></td><td>${metadata.trip_time || '?'}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Party size</strong></td><td>${metadata.party_size || '?'}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Slot type</strong></td><td>${metadata.slot_type || '?'}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Tip</strong></td><td>$${metadata.tip_amount || '0'}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Discount</strong></td><td>${metadata.discount_code || 'none'}</td></tr>
                        <tr><td style="padding:6px 0"><strong>Payment intent</strong></td><td>${paymentIntent.id}</td></tr>
                    </table>
                    <p style="margin-top:16px">
                        <a href="https://dashboard.stripe.com/payments/${paymentIntent.id}"
                           style="background:#635bff;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">
                           Open in Stripe (customer card details here)</a>
                    </p>
                    <p><strong>What to do:</strong> check the admin dashboard for a matching booking first
                    (this alert can rarely fire if the booking saved slowly). If there's truly no booking,
                    the customer paid without a reservation — reach out via the card details in Stripe,
                    and either book them manually or refund.</p>
                </div>
            `,
        });

        return NextResponse.json({ received: true, alerted: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[STRIPE WEBHOOK] Handler error:', message);
        // Non-200 makes Stripe retry later — better a duplicate alert than a silent miss
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
