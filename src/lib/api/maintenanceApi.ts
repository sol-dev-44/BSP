import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface FluidItem {
  status: string
  amountAdded: string
  checked?: boolean
  level?: string
  notes?: string
}

export interface InspectionItem {
  status: string
  checked?: boolean
  notes?: string
}

export interface CustomEntry {
  id: string
  category: string
  value: string
  title?: string
  description?: string
  status?: string
}

export interface AdminMaintenanceLog {
  id: string
  log_date: string
  inspector_name: string
  engine_hours: number | null
  fuel_gallons: number | null
  fluids_data: Record<string, FluidItem>
  inspections_data: Record<string, InspectionItem>
  custom_entries: CustomEntry[]
  notes: string | null
  created_at: string
  updated_at: string
}

export const maintenanceApi = createApi({
  reducerPath: 'maintenanceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Maintenance'],
  endpoints: (builder) => ({
    getLogByDate: builder.query<AdminMaintenanceLog, string>({
      query: (date) => `maintenance?date=${date}`,
      providesTags: ['Maintenance'],
    }),
    saveLog: builder.mutation<AdminMaintenanceLog, Partial<AdminMaintenanceLog>>({
      query: (data) => ({
        url: 'maintenance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Maintenance'],
    }),
  }),
})

export const {
  useGetLogByDateQuery,
  useSaveLogMutation,
} = maintenanceApi
