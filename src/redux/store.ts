import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themes.ts';
import navReducer from './slices/navSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    nav: navReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware()
    .concat(
    ),
});

export type RootState = ReturnType<typeof store.getState>;