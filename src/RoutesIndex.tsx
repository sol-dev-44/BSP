import React, { Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, } from "react-router-dom";
import StylishLoader from "./Components/StylishLoader.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";

import Navbar from "./Components/Nav-bar.tsx";
import ScrollToTop from "./Components/ScrollToTop.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Parasailing from "./pages/Parasailing.tsx";
import TheBoat from "./pages/TheBoat.tsx";
import TheCrew from "./pages/TheCrew.tsx";
import FAQ from "./pages/FAQ.tsx";
import Location from "./pages/Location.tsx";
import ReservationsLanding from './pages/Reservations/ReservationsLanding.tsx';
import ReservationCalendar from './pages/Reservations/ReservationCalendar.tsx';

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
        <Navbar />
          {/* Add Suspense with a fallback UI while components are loading */}
          <Suspense fallback={<StylishLoader />}>

          <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<Parasailing />} />
              <Route path="/theboat" element={<TheBoat />} />
              <Route path="/location" element={<Location />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Reservations routes */}
              <Route path="/reservations" element={<ReservationsLanding />} />
              <Route path="/reservations/book/time" element={<ReservationCalendar />} />
              <Route path="/reservations/book/info" element={<ReservationCalendar />} />
              <Route path="/reservations/book/payment" element={<ReservationCalendar />} />
              <Route path="/reservations/book/confirmation" element={<ReservationCalendar />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default RoutesIndex;