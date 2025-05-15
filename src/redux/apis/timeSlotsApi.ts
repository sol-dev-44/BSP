// Enhanced timeSlotsApi.ts - Fetch all time slots for admin
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TimeSlot } from "../../types.ts";

export const timeSlotsApi = createApi({
  reducerPath: "timeSlotsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["TimeSlot"],
  endpoints: (builder) => ({
    // Get available time slots (with days limit for normal user view)
    getTimeSlots: builder.query<TimeSlot[], number | void>({
      query: (days = 365) => `api/time-slots?days=${days}&includeBooked=true`,
      providesTags: ["TimeSlot"],
    }),

    // Get ALL time slots with no date limit (for admin)
    getAllTimeSlots: builder.query<TimeSlot[], void>({
      query: () => ({
        url: "api/time-slots?includeBooked=true&days=365",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      providesTags: ["TimeSlot"],
    }),

    // Get only available time slots (excluding fully booked slots)
    getAvailableTimeSlots: builder.query<TimeSlot[], number | void>({
      query: (days = 365) => `api/time-slots?days=${days}&includeBooked=false`,
      providesTags: ["TimeSlot"],
    }),

    // Admin: Create time slots
    createTimeSlots: builder.mutation<
      { message: string; slots: TimeSlot[] },
      {
        slots?: Partial<TimeSlot>[];
        startDate?: string;
        endDate?: string;
        startHour?: number;
        endHour?: number;
        slotDuration?: number;
        capacity?: number;
        skipDays?: number[];
      }
    >({
      query: (data) => {
        const token = localStorage.getItem("adminApiKey");
        console.log('Creating time slots with auth token:', token ? 'present' : 'missing');
        
        return {
          url: "api/admin/time-slots",
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
          },
        };
      },
      invalidatesTags: ["TimeSlot"],
    }),

    deleteTimeSlot: builder.mutation<
      { success: boolean; message: string },
      string // Time slot ID
    >({
      query: (id) => ({
        url: `api/admin/time-slots/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      invalidatesTags: ["TimeSlot"],
    }),

    // Admin: Block time slots due to weather
    blockTimeSlotsDueToWeather: builder.mutation<
      { message: string; slots: TimeSlot[] },
      { slotIds: string[]; weatherStatus?: string }
    >({
      query: (data) => ({
        url: "api/admin/time-slots/weather-block",
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminApiKey")}`,
        },
      }),
      invalidatesTags: ["TimeSlot"],
    }),
  }),
});