'use client'

import { useState } from 'react';
import { cancelBooking } from '@/app/admin/actions';

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

        setIsLoading(true);
        const result = await cancelBooking(bookingId);
        setIsLoading(false);

        if (!result.success) {
            alert('Failed to cancel booking: ' + result.error);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
        >
            {isLoading ? 'Cancelling...' : 'Cancel'}
        </button>
    );
}
