import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BUSINESS_INFO } from '@/config/business';

const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/test-email?to=your@email.com
// Sends a test email to verify Resend is working
export async function GET(request: Request) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Test endpoint disabled in production' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const accountEmail = process.env.RESEND_ACCOUNT_EMAIL || BUSINESS_INFO.email;
    const testTo = searchParams.get('to') || accountEmail;

    const hasVerifiedDomain = !!process.env.RESEND_VERIFIED_DOMAIN;
    const fromAddress = hasVerifiedDomain
        ? 'Big Sky Parasail <bookings@montanaparasail.com>'
        : 'Big Sky Parasail <onboarding@resend.dev>';

    const results: Record<string, any> = {
        apiKeyPresent: !!process.env.RESEND_API_KEY,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) + '...',
        fromAddress,
        env: process.env.NODE_ENV,
    };

    // Test 1: Customer-style email
    try {
        const customerResult = await resend.emails.send({
            from: fromAddress,
            to: [testTo],
            subject: `[TEST] Booking Confirmation - ${new Date().toLocaleString()}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
                    <h1 style="color:#2563eb">Test Customer Email</h1>
                    <p>This is a test of the customer confirmation email.</p>
                    <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
                    <p><strong>From:</strong> ${fromAddress}</p>
                    <p><strong>To:</strong> ${testTo}</p>
                    <p style="color:#16a34a;font-weight:bold">If you see this, customer emails are working.</p>
                </div>
            `,
        });
        results.customerEmail = { success: true, data: customerResult.data, error: customerResult.error };
    } catch (err: any) {
        results.customerEmail = { success: false, error: err.message };
    }

    // Test 2: Admin-style email to bigskyparasailing@gmail.com
    const adminTo = hasVerifiedDomain ? BUSINESS_INFO.email : accountEmail;
    try {
        const adminResult = await resend.emails.send({
            from: fromAddress,
            to: [adminTo],
            subject: `[TEST] Admin Notification - ${new Date().toLocaleString()}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
                    <h1 style="color:#2563eb">Test Admin Email</h1>
                    <p>This is a test of the admin notification email (would go to <strong>${BUSINESS_INFO.email}</strong> in production).</p>
                    <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
                    <p><strong>From:</strong> ${fromAddress}</p>
                    <p style="color:#16a34a;font-weight:bold">If you see this, admin emails are working.</p>
                </div>
            `,
        });
        results.adminEmail = { success: true, data: adminResult.data, error: adminResult.error };
    } catch (err: any) {
        results.adminEmail = { success: false, error: err.message };
    }

    console.log('[TEST-EMAIL] Results:', JSON.stringify(results, null, 2));

    return NextResponse.json(results);
}
