import { configureStore } from '@reduxjs/toolkit'
import { reservationsApi } from './api/reservationsApi'
import { todosApi } from './api/todosApi'
import { expensesApi } from './api/expensesApi'
import { maintenanceApi } from './api/maintenanceApi'
import { suppliesApi } from './api/suppliesApi'

export const store = configureStore({
  reducer: {
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [suppliesApi.reducerPath]: suppliesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      reservationsApi.middleware,
      todosApi.middleware,
      expensesApi.middleware,
      maintenanceApi.middleware,
      suppliesApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
