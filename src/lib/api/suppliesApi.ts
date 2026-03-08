import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Supply {
  id: string
  name: string
  reason: string
  quantity: number
  unit: string
  category: string
  reorder_threshold: number | null
  created_at: string
}

export type AdminSupply = Supply

export interface GetSuppliesParams {
  category?: string
  search?: string
}

export const suppliesApi = createApi({
  reducerPath: 'suppliesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Supplies'],
  endpoints: (builder) => ({
    getSupplies: builder.query<Supply[], GetSuppliesParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params?.category) searchParams.set('category', params.category)
        if (params?.search) searchParams.set('search', params.search)
        const queryString = searchParams.toString()
        return `supplies${queryString ? `?${queryString}` : ''}`
      },
      providesTags: ['Supplies'],
    }),
    addSupply: builder.mutation<Supply, Partial<Supply>>({
      query: (data) => ({
        url: 'supplies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Supplies'],
    }),
    deleteSupply: builder.mutation<void, string>({
      query: (id) => ({
        url: `supplies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplies'],
    }),
  }),
})

export const {
  useGetSuppliesQuery,
  useAddSupplyMutation,
  useDeleteSupplyMutation,
} = suppliesApi
