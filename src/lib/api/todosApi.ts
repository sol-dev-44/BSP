import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Todo {
  id: string
  title: string
  text: string
  is_completed: boolean
  completed: boolean
  task_date: string
  date: string
  rank: number
  order: number
  created_at: string
}

export type AdminTodo = Todo

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodosByDate: builder.query<Todo[], string>({
      query: (date) => `todos?date=${date}`,
      providesTags: ['Todos'],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (data) => ({
        url: 'todos',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Todos'],
    }),
    updateTodo: builder.mutation<Todo, Partial<Todo> & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `todos/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
    reorderTodos: builder.mutation<void, { todos: Todo[] } | { ids: string[] }>({
      query: (data) => ({
        url: 'todos',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
})

export const {
  useGetTodosByDateQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useReorderTodosMutation,
} = todosApi
