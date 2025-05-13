// pages/admin/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin.tsx';
import AdminNav from './AdminNav.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import ReservationManagement from './ReservationManagement.tsx';
import ReservationDetail from './ReservationDetail.tsx';
import ReservationForm from './ReservationForm.tsx';
import TimeSlotManagement from './TimeSlotManagement.tsx';
import TimeSlotForm from './TimeSlotForm.tsx';
import WeatherBlock from './WeatherBlock.tsx';
import Settings from './Settings.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';


const AdminRoutes: React.FC = () => {
  console.log("AdminRoutes rendered");
  return (
    <Routes>
      {/* Admin Login Route */}
      <Route path="management-console-login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="management-console" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <AdminDashboard />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/reservations" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <ReservationManagement />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/reservations/:id" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <ReservationDetail />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/reservations/create" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <ReservationForm />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/reservations/:id/edit" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <ReservationForm />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/time-slots" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <TimeSlotManagement />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/time-slots/create" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <TimeSlotForm />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/time-slots/weather" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <WeatherBlock />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="management-console/settings" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <AdminNav fixed={true} />
            <div className="pt-16">
              <Settings />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Redirect any unknown admin routes to the admin dashboard */}
      <Route path="management-console/*" element={
        <ProtectedRoute>
          <Navigate to="/management-console" replace />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;