// store/apis/paymentsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    // This is just a placeholder in case we need specific payment endpoints
    // Most payment operations are handled by the Stripe SDK directly or through the reservations API
    
    // Admin-only: Process refund directly (if needed separately)
    processStripeRefund: builder.mutation<
      { success: boolean; refundId: string; refundAmount: number },
      { paymentIntentId: string; amount?: number }
    >({
      query: (data) => ({
        url: 'api/admin/payments/refund',
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminApiKey')}`,
        },
      }),
    }),
  }),
});