import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const validUser = process.env.ADMIN_USER || 'admin';
        const validPass = process.env.ADMIN_PASSWORD || 'bigsky2026';

        if (username === validUser && password === validPass) {
            // Set an HttpOnly cookie that expires in 30 days
            (await cookies()).set({
                name: 'admin_session',
                value: 'authenticated',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
