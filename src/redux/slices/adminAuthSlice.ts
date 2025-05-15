// redux/slices/adminAuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  isAuthenticated: boolean;
  error: string | null;
}

// Check if admin is authenticated in localStorage
const checkInitialAuthState = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const adminApiKey = localStorage.getItem('adminApiKey');
  return !!adminApiKey;
};

const initialState: AdminAuthState = {
  isAuthenticated: checkInitialAuthState(),
  error: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage when logging out
      localStorage.removeItem('adminApiKey');
    },
  },
});

export const { loginSuccess, loginFailure, logout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;