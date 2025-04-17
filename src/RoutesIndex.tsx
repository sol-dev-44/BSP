import React, { Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, } from "react-router-dom";
import StylishLoader from "./Components/StylishLoader.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";

import Navbar from "./Components/Nav-bar.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Parasailing from "./pages/Parasailing.tsx";

const RoutesIndex: React.FC = () => {
  const reduxTheme = useSelector((state: any) => state.theme);

  const theme = createTheme({
    ...reduxTheme,
    palette: {
      ...(reduxTheme?.palette?.mode && { mode: reduxTheme.palette.mode }),
      ...(reduxTheme?.palette?.primary &&
        { primary: reduxTheme.palette.primary }),
      ...(reduxTheme?.palette?.secondary &&
        { secondary: reduxTheme.palette.secondary }),
    },
    typography: {
      ...(reduxTheme?.typography && { ...reduxTheme.typography }),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
        <Navbar theme={theme} />
          {/* Add Suspense with a fallback UI while components are loading */}
          <Suspense fallback={<StylishLoader />}>
            <Routes>

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/parasailing"
                element={<Parasailing />}
              />

              <Route
                path="*"
                element={<Navigate to="/" />}
              />
            </Routes>
          </Suspense>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default RoutesIndex;
