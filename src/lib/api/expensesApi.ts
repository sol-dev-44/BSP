import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Expense {
  id: string
  name: string
  description: string
  amount: number
  category: string
  expense_date: string
  date: string
  vendor: string
  receipt_url: string
  link: string
  created_at: string
}

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Expenses'],
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      query: () => 'expenses',
      providesTags: ['Expenses'],
    }),
    addExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (data) => ({
        url: 'expenses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Expenses'],
    }),
    updateExpense: builder.mutation<Expense, Partial<Expense> & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `expenses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Expenses'],
    }),
    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({
        url: `expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses'],
    }),
  }),
})

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi
