// components/admin/AdminDashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/adminAuthSlice.ts';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { reservationsApi } from '../../redux/apis/reservationsApi.ts';
import { formatDateTimeRange } from '../../utils/dateFormatters.ts';
import { TimeSlot } from '../../types.ts';
// Extended type for reservations with time slot data
interface ReservationWithTimeSlot {
  id?: string;
  time_slot_id: string;
  time_slot?: TimeSlot;
  time_slots?: TimeSlot;
  customer_name: string;
  customer_email: string;
  status: string;
  payment_amount?: number;
  number_of_people: number;
  riders?: number;
  [key: string]: any;
}

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: todayReservations = [], isLoading } = reservationsApi.useGetTodaysReservationsQuery();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/management-console-login');
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Calculate statistics
  const totalRevenue = todayReservations.reduce((total, res) => total + (res.payment_amount || 0), 0) / 100;
  const confirmedReservations = todayReservations.filter(res => res.status === 'confirmed').length;
  const totalPeople = todayReservations.reduce((total, res) => 
    total + (res.number_of_people || 0) + (res.riders || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      {/* <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/JerryBearLogo.png" 
              alt="Big Sky Parasail" 
              className="h-10 mr-3"
            />
            <h1 className="text-xl font-bold text-gray-900">Management Console</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              View Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </header> */}

      {/* Admin Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex overflow-x-auto space-x-4 border-b border-gray-200 mb-6">
          <Link
            to="/management-console"
            className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${location.pathname === '/management-console' ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            Dashboard
          </Link>
          <Link
            to="/management-console/reservations"
            className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${location.pathname.includes('/reservations') ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            Reservations
          </Link>
          <Link
            to="/management-console/time-slots"
            className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${location.pathname.includes('/time-slots') ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            Time Slots
          </Link>
          <Link
            to="/management-console/settings"
            className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${location.pathname.includes('/settings') ? 'text-blue-600 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            Settings
          </Link>
        </div>

        {/* Dashboard Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Today's Reservations</h3>
              <span className="inline-flex items-center justify-center p-2 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{todayReservations.length}</p>
            <p className="text-sm text-gray-500 mt-1">{confirmedReservations} confirmed</p>
          </motion.div>
          
          <motion.div
            variants={fadeInUp}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Today's Revenue</h3>
              <span className="inline-flex items-center justify-center p-2 rounded-full bg-green-100 text-green-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">From {todayReservations.length} reservations</p>
          </motion.div>
          
          <motion.div
            variants={fadeInUp}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Total Guests</h3>
              <span className="inline-flex items-center justify-center p-2 rounded-full bg-amber-100 text-amber-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{totalPeople}</p>
            <p className="text-sm text-gray-500 mt-1">Expected today</p>
          </motion.div>
        </motion.div>

        {/* Today's Reservations */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Today's Reservations</h2>
            <Link 
              to="/management-console/reservations"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-500">Loading reservations...</p>
              </div>
            ) : todayReservations.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No reservations scheduled for today.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      People
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(todayReservations as unknown as ReservationWithTimeSlot[]).map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTimeRange(
                          reservation.time_slot?.start_time || reservation.time_slots?.start_time || '',
                          reservation.time_slot?.end_time || reservation.time_slots?.end_time || ''
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.customer_name}</div>
                        <div className="text-sm text-gray-500">{reservation.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.number_of_people} parasailers
                        {reservation?.riders || 0 > 0 && `, ${reservation.riders} riders`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                          ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            reservation.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'}`
                        }>
                          {reservation.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${((reservation.payment_amount || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/management-console/reservations/${reservation.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </Link>
                        {reservation.status === 'confirmed' && (
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            Complete
                          </button>
                        )}
                        {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
                          <button className="text-red-600 hover:text-red-900">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/management-console/reservations/create"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Create Reservation</h3>
                <p className="text-xs text-gray-500">Add a new booking</p>
              </div>
            </Link>
            
            <Link
              to="/management-console/time-slots/create"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mr-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Create Time Slots</h3>
                <p className="text-xs text-gray-500">Add available times</p>
              </div>
            </Link>
            
            <Link
              to="/management-console/time-slots/weather"
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Weather Block</h3>
                <p className="text-xs text-gray-500">Manage weather cancellations</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default AdminDashboard;