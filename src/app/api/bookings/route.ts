import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { BUSINESS_INFO } from '@/config/business';
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customer_name,
            customer_email,
            customer_phone,
            trip_date,
            trip_time,
            party_size,
            payment_intent_id,
            notes,
            add_ons,
        } = body;

        // 1. Validate Payment Intent ID with Stripe
        if (!payment_intent_id) {
            return NextResponse.json({ error: 'Missing payment intent ID' }, { status: 400 });
        }

        let total_amount = 0;
        let paymentStatus = 'pending';

        if (payment_intent_id.startsWith('pi_mock')) {
            console.warn("Using mock payment intent", payment_intent_id);
            total_amount = 100;
            paymentStatus = 'confirmed';
        } else {
            if (!process.env.STRIPE_SECRET_KEY) {
                return NextResponse.json({ error: 'Server Stripe config missing' }, { status: 500 });
            }

            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
            if (paymentIntent.status !== 'succeeded') {
                return NextResponse.json({ error: `Payment not successful. Status: ${paymentIntent.status}` }, { status: 400 });
            }
            total_amount = paymentIntent.amount / 100;
            paymentStatus = 'confirmed';
        }

        // Compute slot pricing for storage (authoritative values for success page and receipts)
        const slotType = getSlotType(trip_date, trip_time || '');
        const perPerson = getSlotPrice(slotType);

        // 2. Insert into Supabase (idempotent via Stripe PI ID)
        const { data: existingBooking } = await supabase
            .from('bsp_bookings')
            .select('id')
            .eq('stripe_payment_intent_id', payment_intent_id)
            .single();

        if (existingBooking) {
            return NextResponse.json({ message: 'Booking already exists', id: existingBooking.id });
        }

        const { data, error } = await supabase
            .from('bsp_bookings')
            .insert([
                {
                    customer_name,
                    customer_email,
                    customer_phone,
                    trip_date,
                    trip_time,
                    party_size,
                    total_amount,
                    status: paymentStatus,
                    stripe_payment_intent_id: payment_intent_id,
                    notes,
                    add_ons,
                    slot_type: slotType,
                    per_person_rate: perPerson,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error('Failed to save booking');
        }

        // 3. Send Confirmation Emails
        const isDev = process.env.NODE_ENV === 'development';
        const hasVerifiedDomain = !!process.env.RESEND_VERIFIED_DOMAIN;
        const fromAddress = (!isDev || hasVerifiedDomain)
            ? 'Big Sky Parasail <bookings@montanaparasail.com>'
            : 'Big Sky Parasail <onboarding@resend.dev>';
        // In dev without a verified domain, Resend only delivers to the account owner email
        const adminTo = isDev && !hasVerifiedDomain
            ? (process.env.RESEND_ACCOUNT_EMAIL || BUSINESS_INFO.email)
            : BUSINESS_INFO.email;

        console.log(`[EMAIL] env=${process.env.NODE_ENV}, from=${fromAddress}, customerTo=${customer_email}, adminTo=${adminTo}`);

        // Tiered pricing: Early Bird $99, Standard $119, Sunset $159
        const flightSubtotal = party_size * perPerson;
        const observerTotal = (add_ons?.observer_count || add_ons?.observer_package || 0) * BUSINESS_INFO.pricing.observer;
        const comboTotal = (add_ons?.combo_package || 0) * BUSINESS_INFO.pricing.combo;
        const photoTotal = (add_ons?.photo_package || 0) * BUSINESS_INFO.pricing.photos;
        const goproTotal = (add_ons?.gopro_package || 0) * BUSINESS_INFO.pricing.gopro;
        const tipTotal = add_ons?.tip_amount || 0;

        // Format date/time for display
        const formatDate = (d: string) => {
            const [y, m, day] = d.split('-').map(Number);
            return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };
        const formatTime12 = (t: string) => {
            if (!t) return t;
            const [h, m] = t.split(':');
            const hour = parseInt(h);
            return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
        };
        const displayDate = formatDate(trip_date);
        const displayTime = formatTime12(trip_time);

        // Build add-on rows for email
        let addOnRows = '';
        if ((add_ons?.observer_count || 0) > 0) {
            addOnRows += `<tr><td style="padding:6px 0;color:#555">Boat Rider x ${add_ons.observer_count}</td><td style="padding:6px 0;text-align:right;font-weight:600">$${observerTotal.toFixed(2)}</td></tr>`;
        }
        if ((add_ons?.combo_package || 0) > 0) {
            addOnRows += `<tr><td style="padding:6px 0;color:#555">Media Combo (Photos + Video) x ${add_ons.combo_package}</td><td style="padding:6px 0;text-align:right;font-weight:600">$${comboTotal.toFixed(2)}</td></tr>`;
        }
        if ((add_ons?.photo_package || 0) > 0) {
            addOnRows += `<tr><td style="padding:6px 0;color:#555">Photo Package x ${add_ons.photo_package}</td><td style="padding:6px 0;text-align:right;font-weight:600">$${photoTotal.toFixed(2)}</td></tr>`;
        }
        if ((add_ons?.gopro_package || 0) > 0) {
            addOnRows += `<tr><td style="padding:6px 0;color:#555">GoPro Rental x ${add_ons.gopro_package}</td><td style="padding:6px 0;text-align:right;font-weight:600">$${goproTotal.toFixed(2)}</td></tr>`;
        }
        if (tipTotal > 0) {
            addOnRows += `<tr><td style="padding:6px 0;color:#16a34a">Crew Gratuity</td><td style="padding:6px 0;text-align:right;color:#16a34a;font-weight:600">$${tipTotal.toFixed(2)}</td></tr>`;
        }

        const slotTypeLabel = slotType === 'earlybird' ? 'Early Bird' : slotType === 'sunset' ? 'Sunset' : 'Standard';
        const tripLabel = `Parasail Flight (${slotTypeLabel})`;
        const priceNote = `$${perPerson}/person (${slotTypeLabel.toLowerCase()} rate)`;

        // 3a. Customer confirmation email
        let customerEmailStatus = { sent: false, error: null as string | null, id: null as string | null };
        let adminEmailStatus = { sent: false, error: null as string | null, id: null as string | null };

        try {
            const customerResult = await resend.emails.send({
                from: fromAddress,
                to: [customer_email],
                subject: `Booking Confirmed - Parasail Flight on ${displayDate}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
                        <div style="background:linear-gradient(135deg,#2563eb,#0ea5e9);padding:24px;text-align:center;border-radius:12px 12px 0 0">
                            <h1 style="color:#fff;margin:0 0 4px">Booking Confirmed!</h1>
                            <p style="color:#dbeafe;margin:0;font-size:14px">Big Sky Parasail - Flathead Lake</p>
                        </div>

                        <div style="padding:24px">
                            <p>Hi ${customer_name.split(' ')[0]},</p>
                            <p>Your parasailing adventure is confirmed! Here are your details:</p>

                            <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:16px 0">
                                <h3 style="margin:0 0 12px;color:#374151">Trip Details</h3>
                                <table style="width:100%;border-collapse:collapse">
                                    <tr><td style="padding:6px 0;color:#666">Date</td><td style="padding:6px 0;font-weight:bold;text-align:right">${displayDate}</td></tr>
                                    <tr><td style="padding:6px 0;color:#666">Time</td><td style="padding:6px 0;font-weight:bold;text-align:right">${displayTime} (Mountain)</td></tr>
                                    <tr><td style="padding:6px 0;color:#666">Group Size</td><td style="padding:6px 0;font-weight:bold;text-align:right">${party_size} ${party_size === 1 ? 'person' : 'people'}</td></tr>
                                </table>
                            </div>

                            <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:16px 0">
                                <h3 style="margin:0 0 12px;color:#374151">Itemized Receipt</h3>
                                <table style="width:100%;border-collapse:collapse">
                                    <tr>
                                        <td style="padding:6px 0;color:#111;font-weight:600">${tripLabel} x ${party_size}</td>
                                        <td style="padding:6px 0;text-align:right;font-weight:600">$${flightSubtotal.toFixed(2)}</td>
                                    </tr>
                                    <tr><td colspan="2" style="padding:0 0 6px;font-size:12px;color:#888">${priceNote}</td></tr>
                                    ${addOnRows}
                                    <tr style="border-top:2px solid #d1d5db">
                                        <td style="padding:12px 0 0;font-weight:bold;font-size:16px">Total Paid</td>
                                        <td style="padding:12px 0 0;text-align:right;font-weight:bold;font-size:18px;color:#2563eb">$${total_amount.toFixed(2)}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="margin:16px 0">
                                <h3 style="color:#374151">Location</h3>
                                <p style="margin:4px 0"><strong>${BUSINESS_INFO.address.name}</strong><br/>
                                ${BUSINESS_INFO.address.street}<br/>
                                ${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.stateCode} ${BUSINESS_INFO.address.zip}</p>
                                <p style="font-size:13px;color:#2563eb;font-weight:600">Please arrive 15 minutes before departure.</p>
                            </div>

                            <p style="font-size:13px;color:#888;font-style:italic">This email confirmation is NOT required to board the boat. We have your name on the manifest.</p>

                            <p>Questions? Contact us at <a href="mailto:${BUSINESS_INFO.email}">${BUSINESS_INFO.email}</a> or call <a href="tel:406-270-6256">${BUSINESS_INFO.displayPhone}</a>.</p>
                            <p>See you on the water!</p>
                            <p style="color:#888;font-size:12px">Big Sky Parasail LLC - Booking #${data.id.split('-')[0].toUpperCase()}</p>
                        </div>
                    </div>
                `,
            });
            customerEmailStatus = { sent: true, error: null, id: customerResult.data?.id || null };
            console.log('[EMAIL] Customer email sent:', customerResult);
        } catch (emailError: any) {
            customerEmailStatus = { sent: false, error: emailError?.message || 'Unknown error', id: null };
            console.error('[EMAIL] Customer email FAILED:', emailError?.message || emailError);
            console.error('[EMAIL] Customer email error details:', JSON.stringify(emailError, null, 2));
        }

        // 3b. Admin notification email
        try {
            const adminResult = await resend.emails.send({
                from: fromAddress,
                to: [adminTo],
                subject: `New Booking: ${customer_name} - ${displayDate} at ${displayTime}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                        <h1 style="color:#2563eb">New Booking Received</h1>
                        <div style="background:#eff6ff;padding:16px;border-radius:8px;margin:16px 0">
                            <h3 style="margin-top:0">Customer Info</h3>
                            <p><strong>Name:</strong> ${customer_name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${customer_email}">${customer_email}</a></p>
                            <p><strong>Phone:</strong> ${customer_phone || 'Not provided'}</p>
                        </div>
                        <div style="background:#eff6ff;padding:16px;border-radius:8px;margin:16px 0">
                            <h3 style="margin-top:0">Booking Details</h3>
                            <p><strong>Booking ID:</strong> ${data.id}</p>
                            <p><strong>Date:</strong> ${displayDate}</p>
                            <p><strong>Time:</strong> ${displayTime} (Mountain)</p>
                            <p><strong>Party Size:</strong> ${party_size}</p>
                            <p><strong>Notes:</strong> ${notes || 'None'}</p>
                        </div>
                        <div style="background:#eff6ff;padding:16px;border-radius:8px;margin:16px 0">
                            <h3 style="margin-top:0">Receipt</h3>
                            <table style="width:100%;border-collapse:collapse">
                                <tr><td style="padding:4px 0">${tripLabel} x ${party_size} @ ${priceNote}</td><td style="text-align:right;font-weight:bold">$${flightSubtotal.toFixed(2)}</td></tr>
                                ${addOnRows}
                                <tr style="border-top:2px solid #d1d5db"><td style="padding:8px 0;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold;font-size:16px;color:#2563eb">$${total_amount.toFixed(2)}</td></tr>
                            </table>
                        </div>
                        <p><strong>Stripe Payment ID:</strong> ${payment_intent_id}</p>
                    </div>
                `,
            });
            adminEmailStatus = { sent: true, error: null, id: adminResult.data?.id || null };
            console.log('[EMAIL] Admin email sent:', adminResult);
        } catch (emailError: any) {
            adminEmailStatus = { sent: false, error: emailError?.message || 'Unknown error', id: null };
            console.error('[EMAIL] Admin email FAILED:', emailError?.message || emailError);
            console.error('[EMAIL] Admin email error details:', JSON.stringify(emailError, null, 2));
        }

        return NextResponse.json({
            success: true,
            booking: data,
            emails: {
                customer: customerEmailStatus,
                admin: adminEmailStatus,
            },
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
