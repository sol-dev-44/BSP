// redux/slices/adminAuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
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
    },
  },
});

export const { loginSuccess, loginFailure, logout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;