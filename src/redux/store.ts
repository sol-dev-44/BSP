 // redux/store.ts (updated)
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import themeReducer from './slices/themes.ts'
import navReducer from './slices/navSlice.ts';
import bookingReducer from './slices/bookingSlice.ts';
import adminAuthReducer from './slices/adminAuthSlice.ts';
import { timeSlotsApi } from './apis/timeSlotsApi.ts';
import { reservationsApi } from './apis/reservationsApi.ts';
import { paymentsApi } from './apis/paymentsApi.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    // Existing reducers
    theme: themeReducer,
    nav: navReducer,
    booking: bookingReducer,
    
    // New admin reducer
    adminAuth: adminAuthReducer,
    
    // RTK Query API slices
    [timeSlotsApi.reducerPath]: timeSlotsApi.reducer,
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        timeSlotsApi.middleware,
        reservationsApi.middleware,
        paymentsApi.middleware,
      ),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks for easy access to dispatch and state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

