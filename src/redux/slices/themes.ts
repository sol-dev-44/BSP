import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const muiLightTheme = {
  palette: {
      mode: "light",
      primary: {
          main: "#1976d2", // Default MUI blue
      },
      secondary: {
          main: "#dc004e", // Default MUI pink
      },
  },
  typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
          fontWeight: 500,
      },
  },
};

interface ThemeState {
  palette: {
    mode: string;
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
  };
  typography: {
    fontFamily: string;
    h1: {
      fontWeight: number;
    };
  };
}

const initialState: ThemeState = {
  ...muiLightTheme,
}

const themeSlice = createSlice({  
  name: 'theme',
  initialState,

    reducers: {
      toggleThemeMode: (state, action) => {
        state.palette.mode = action.payload;
      },
      setPrimaryColor: (state, action: PayloadAction<string>) => {
        state.palette.primary.main = action.payload;
      },
      setSecondaryColor: (state, action: PayloadAction<string>) => {
        state.palette.secondary.main = action.payload;
      },
    },
  });

export const { 
  toggleThemeMode, 
  setPrimaryColor, 
  setSecondaryColor
} = themeSlice.actions;

export default themeSlice.reducer;