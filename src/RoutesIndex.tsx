// RoutesIndex.tsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import StylishLoader from "./Components/StylishLoader.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";

// Public components
import Navbar from "./Components/Nav-bar.tsx";
import ScrollToTop from "./Components/ScrollToTop.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Parasailing from "./pages/Parasailing.tsx";
import TheBoat from "./pages/TheBoat.tsx";
// import TheCrew from "./pages/TheCrew.tsx";
import FAQ from "./pages/FAQ.tsx";
import Location from "./pages/Location.tsx";
import ReservationsLanding from './pages/Reservations/ReservationsLanding.tsx';
import ReservationCalendar from './pages/Reservations/ReservationCalendar.tsx';
import MarinaMap from './Components/MarinaMap.tsx';

// Admin components
import AdminLogin from './pages/Admin/AdminLogin.tsx';
import AdminNav from './pages/Admin/AdminNav.tsx';
import AdminDashboard from './pages/Admin/AdminDashboard.tsx';
import ReservationManagement from './pages/Admin/ReservationManagement.tsx';
import ReservationDetail from './pages/Admin/ReservationDetail.tsx';
import ReservationForm from './pages/Admin/ReservationForm.tsx';
import TimeSlotManagement from './pages/Admin/TimeSlotManagement.tsx';
import TimeSlotForm from './pages/Admin/TimeSlotForm.tsx';
import WeatherBlock from './pages/Admin/WeatherBlock.tsx';
import Settings from './pages/Admin/Settings.tsx';
import ProtectedRoute from './pages/Admin/ProtectedRoute.tsx';

// Create a wrapper component for content that needs conditional Navbar
const AppContent = () => {
  const location = useLocation();
  
  // Check if current path is an admin route
  const isAdminRoute = 
    location.pathname.startsWith('/management-console') || 
    location.pathname === '/management-console-login';
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<StylishLoader />}>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
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
          
          {/* Admin Login Route */}
          <Route path="/management-console-login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/management-console" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <AdminDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/reservations" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <ReservationManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/reservations/:id" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <ReservationDetail />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/reservations/create" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <ReservationForm />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/reservations/:id/edit" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <ReservationForm />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/time-slots" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <TimeSlotManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/time-slots/create" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <TimeSlotForm />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/time-slots/weather" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <WeatherBlock />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/management-console/settings" element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <AdminNav fixed={true} />
                <div className="pt-16">
                  <Settings />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
};

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
          <AppContent />
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default RoutesIndex;