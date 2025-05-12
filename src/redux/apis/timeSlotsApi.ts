// store/apis/timeSlotsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TimeSlot } from '../../types.ts';

export const timeSlotsApi = createApi({
  reducerPath: 'timeSlotsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['TimeSlot'],
  endpoints: (builder) => ({
    // Get available time slots (including fully booked slots now)
    getTimeSlots: builder.query<TimeSlot[], number | void>({
      query: (days = 30) => `api/time-slots?days=${days}&includeBooked=true`,
      providesTags: ['TimeSlot'],
    }),

    // Get only available time slots (excluding fully booked slots)
    getAvailableTimeSlots: builder.query<TimeSlot[], number | void>({
      query: (days = 30) => `api/time-slots?days=${days}&includeBooked=false`,
      providesTags: ['TimeSlot'],
    }),

    // Admin: Create time slots
    createTimeSlots: builder.mutation<
      { message: string; slots: TimeSlot[] },
      { slots?: Partial<TimeSlot>[]; startDate?: string; endDate?: string; startHour?: number; endHour?: number; slotDuration?: number; capacity?: number; skipDays?: number[] }
    >({
      query: (data) => ({
        url: 'api/admin/time-slots',
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminApiKey')}`,
        },
      }),
      invalidatesTags: ['TimeSlot'],
    }),

    // Admin: Block time slots due to weather
    blockTimeSlotsDueToWeather: builder.mutation<
      { message: string; slots: TimeSlot[] },
      { slotIds: string[]; weatherStatus?: string }
    >({
      query: (data) => ({
        url: 'api/admin/time-slots/weather-block',
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminApiKey')}`,
        },
      }),
      invalidatesTags: ['TimeSlot'],
    }),
  }),
});