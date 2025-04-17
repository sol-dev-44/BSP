import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavState {
  mobileMenuOpen: boolean;
  currentRoute: string;
}

const initialState: NavState = {
  mobileMenuOpen: false,
  currentRoute: '/'
};

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    toggleNavMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setNavMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    }
  }
});

export const { toggleNavMenu, setNavMenuOpen, setCurrentRoute } = navSlice.actions;

export default navSlice.reducer;