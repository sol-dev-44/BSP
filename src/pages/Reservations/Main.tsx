import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import ReservationsLanding from './ReservationsLanding.tsx';
import ReservationCalendar from './ReservationCalendar.tsx';

/**
 * This is the main Reservations component that handles nested routes
 * within the /reservations path from your main routing structure.
 */
const Reservations = () => {
  const location = useLocation();
  
  return (
    <Routes>
      {/* Main reservations landing page */}
      <Route path="/" element={<ReservationsLanding />} />
      
      {/* Booking flow routes */}
      <Route path="book">
        {/* Redirect /reservations/book to time selection */}
        <Route index element={<Navigate to="time" replace />} />
        
        {/* Booking step routes */}
        <Route path="time" element={<ReservationCalendar />} />
        <Route path="info" element={<ReservationCalendar />} />
        <Route path="payment" element={<ReservationCalendar />} />
        <Route path="confirmation" element={<ReservationCalendar />} />
      </Route>
      
      {/* Redirect any unknown paths to the main reservations page */}
      <Route path="*" element={<Navigate to="/reservations" replace />} />
    </Routes>
  );
};

export default Reservations;