'use client'

import { useState } from 'react';
import { completeBooking } from '@/app/admin/actions';

export default function CompleteBookingButton({ bookingId }: { bookingId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleComplete = async () => {
        if (!confirm('Mark this trip as completed?')) return;

        setIsLoading(true);
        const result = await completeBooking(bookingId);
        setIsLoading(false);

        if (!result.success) {
            alert('Failed to mark complete: ' + result.error);
        }
    };

    return (
        <button
            onClick={handleComplete}
            disabled={isLoading}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium disabled:opacity-50 transition-colors"
        >
            {isLoading ? 'Saving...' : 'Mark complete'}
        </button>
    );
}
