// store/apis/reservationsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Reservation } from "../../types.ts";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Reservation", "TimeSlot"],
  endpoints: (builder) => ({
    // Create a pending reservation (initiates payment intent)
    createReservation: builder.mutation<
      {
        clientSecret: string;
        amount: number;
        reservationData: Partial<Reservation>;
      },
      Partial<Reservation>
    >({
      query: (reservationData) => ({
        url: "api/reservations/pending",
        method: "POST",
        body: reservationData,
      }),
      // Add a transformResponse function to handle and log the response
      transformResponse: (response: any, meta, arg) => {
        console.log("API Response from createReservation:", response);
        console.log("API Response meta:", meta);

        // Handle non-object responses
        if (typeof response !== "object" || response === null) {
          console.error("Invalid response type:", typeof response);
          throw new Error("Server returned invalid response format");
        }

        // Key change: Don't create mock client secrets!
        // If we're getting the old response format with 'reservation' and 'payment_amount'
        if (response.reservation && response.payment_amount && !response.clientSecret) {
          console.error("Backend returned old format response without a valid Stripe client secret");
          throw new Error("The server did not provide a valid payment client secret. Please check your server configuration.");
        }

        // Handle the standard Stripe format
        if (!response.clientSecret) {
          console.error("Missing clientSecret in response:", Object.keys(response));
          throw new Error("No payment information received from server");
        }

        // Log the client secret format (first few characters)
        console.log("Client secret format check:", {
          prefix: response.clientSecret.substring(0, 10),
          isValid: response.clientSecret.includes("_secret_"),
        });

        // Return the properly formatted object
        return {
          clientSecret: response.clientSecret,
          amount: response.amount || 0,
          reservationData: response.reservationData || arg,
        };
      },
      transformErrorResponse: (
        response: { status: number; data: any },
      ) => {
        console.error("API Error:", response);
        return response;
      },
    }),

    // Confirm a reservation after payment
    confirmReservation: builder.mutation<
      { success: boolean; reservation: Reservation; message: string },
      { paymentIntentId: string; reservationData: Partial<Reservation> }
    >({
      query: (data) => ({
        url: "api/reservations/confirm",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reservation", "TimeSlot"],
    }),

    // Get reservations by email
    getReservationsByEmail: builder.query<Reservation[], string>({
      query: (email) => `api/reservations/lookup/${email}`,
      providesTags: ["Reservation"],
    }),

    // Admin: Get all reservations
    getAllReservations: builder.query<Reservation[], void>({
      query: () => ({
        url: "api/admin/reservations",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      providesTags: ["Reservation"],
    }),

    // Admin: Get today's reservations
    getTodaysReservations: builder.query<Reservation[], void>({
      query: () => ({
        url: "api/admin/reservations/today",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      providesTags: ["Reservation"],
    }),

    // Admin: Cancel a reservation
    cancelReservation: builder.mutation<
      { success: boolean; reservation: Reservation },
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `api/admin/reservations/cancel/${id}`,
        method: "POST",
        body: { reason },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      invalidatesTags: ["Reservation", "TimeSlot"],
    }),

    // Admin: Process a refund
    processRefund: builder.mutation<
      { success: boolean; reservation: Reservation },
      { id: string; refundId: string; refundAmount: number }
    >({
      query: ({ id, ...data }) => ({
        url: `api/admin/reservations/refund/${id}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      invalidatesTags: ["Reservation"],
    }),

    // Admin: Mark a reservation as completed
    completeReservation: builder.mutation<
      { success: boolean; reservation: Reservation },
      string
    >({
      query: (id) => ({
        url: `api/admin/reservations/complete/${id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      invalidatesTags: ["Reservation"],
    }),

    // Admin: Clean up expired reservations
    cleanupExpiredReservations: builder.mutation<
      { expired: number },
      void
    >({
      query: () => ({
        url: "api/admin/reservations/cleanup",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      invalidatesTags: ["Reservation", "TimeSlot"],
    }),
  }),
});