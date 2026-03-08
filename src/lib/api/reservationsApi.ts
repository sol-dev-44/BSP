import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  AvailabilityResponse,
  Booking,
  CreateBookingRequest,
} from '@/types/reservations'

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Bookings', 'Availability'],
  endpoints: (builder) => ({
    checkAvailability: builder.query<AvailabilityResponse, string>({
      query: (date) => `availability?date=${date}`,
      providesTags: ['Availability'],
    }),
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (data) => ({
        url: 'bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bookings', 'Availability'],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `bookings/${id}`,
      providesTags: ['Bookings'],
    }),
  }),
})

export const {
  useCheckAvailabilityQuery,
  useCreateBookingMutation,
  useGetBookingQuery,
} = reservationsApi
