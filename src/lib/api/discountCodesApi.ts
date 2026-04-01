import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface DiscountCode {
    id: string
    code_name: string
    amount: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export const discountCodesApi = createApi({
    reducerPath: 'discountCodesApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['DiscountCodes'],
    endpoints: (builder) => ({
        getDiscountCodes: builder.query<DiscountCode[], void>({
            query: () => 'discount-codes',
            providesTags: ['DiscountCodes'],
        }),
        addDiscountCode: builder.mutation<DiscountCode, { code_name: string; amount: number }>({
            query: (data) => ({
                url: 'discount-codes',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['DiscountCodes'],
        }),
        updateDiscountCode: builder.mutation<DiscountCode, Partial<DiscountCode> & { id: string }>({
            query: ({ id, ...data }) => ({
                url: `discount-codes/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['DiscountCodes'],
        }),
        deleteDiscountCode: builder.mutation<void, string>({
            query: (id) => ({
                url: `discount-codes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DiscountCodes'],
        }),
    }),
})

export const {
    useGetDiscountCodesQuery,
    useAddDiscountCodeMutation,
    useUpdateDiscountCodeMutation,
    useDeleteDiscountCodeMutation,
} = discountCodesApi
