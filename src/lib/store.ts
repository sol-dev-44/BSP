import { configureStore } from '@reduxjs/toolkit'
import { reservationsApi } from './api/reservationsApi'
import { todosApi } from './api/todosApi'
import { expensesApi } from './api/expensesApi'
import { maintenanceApi } from './api/maintenanceApi'
import { suppliesApi } from './api/suppliesApi'
import { discountCodesApi } from './api/discountCodesApi'

export const store = configureStore({
  reducer: {
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [suppliesApi.reducerPath]: suppliesApi.reducer,
    [discountCodesApi.reducerPath]: discountCodesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      reservationsApi.middleware,
      todosApi.middleware,
      expensesApi.middleware,
      maintenanceApi.middleware,
      suppliesApi.middleware,
      discountCodesApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
