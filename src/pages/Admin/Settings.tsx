// components/admin/Settings.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { reservationsApi } from '../../redux/apis/reservationsApi.ts';

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

const Settings: React.FC = () => {
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [cleanupReservations] = reservationsApi.useCleanupExpiredReservationsMutation();
  
  // Handle cleanup expired reservations
  const handleCleanupReservations = async () => {
    if (!window.confirm('Are you sure you want to clean up expired reservations? This will remove all pending reservations that have expired.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await cleanupReservations().unwrap();
      setCleanupResult(`Successfully cleaned up ${result.expired} expired reservations.`);
    } catch (error) {
      console.error('Failed to clean up reservations:', error);
      setCleanupResult('Failed to clean up reservations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Actions */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Actions</h2>
          </div>
          
          <div className="px-6 py-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Cleanup Expired Reservations</h3>
              <p className="text-sm text-gray-500 mb-4">
                This will remove all pending reservations that have expired (after their 5-minute payment window).
                This action is typically handled automatically by a scheduled task, but you can run it manually if needed.
              </p>
              
              <button
                onClick={handleCleanupReservations}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cleaning up...
                  </>
                ) : (
                  'Run Cleanup'
                )}
              </button>
              
              {cleanupResult && (
                <div className={`mt-3 p-3 rounded-md ${cleanupResult.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {cleanupResult}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Administrator PIN</h3>
              <p className="text-sm text-gray-500 mb-4">
                To change the administrator PIN, edit the <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_ADMIN_PIN</code> value in your environment variables.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* System Information */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
          </div>
          
          <div className="px-6 py-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Version</dt>
                <dd className="mt-1 text-sm text-gray-900">1.0.0</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Environment</dt>
                <dd className="mt-1 text-sm text-gray-900">{process.env.NODE_ENV || 'development'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Server Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleString()}</dd>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500">APIs Status</dt>
                <dd className="mt-1">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-gray-900">Supabase: Connected</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-gray-900">Stripe: Connected</span>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>
        
        {/* Email Templates */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Email Templates</h2>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-sm text-gray-500 mb-4">
              Customize the email templates sent to customers at different stages of the booking process.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Confirmation Email</h3>
                  <p className="text-xs text-gray-500">Sent when a booking is confirmed</p>
                </div>
                <button 
                  className="px-3 py-1 text-xs font-medium rounded-md bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                  onClick={() => alert('Email template editor would open here')}
                >
                  Edit
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Reminder Email</h3>
                  <p className="text-xs text-gray-500">Sent 24 hours before reservation</p>
                </div>
                <button 
                  className="px-3 py-1 text-xs font-medium rounded-md bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                  onClick={() => alert('Email template editor would open here')}
                >
                  Edit
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Cancellation Email</h3>
                  <p className="text-xs text-gray-500">Sent when a booking is cancelled</p>
                </div>
                <button 
                  className="px-3 py-1 text-xs font-medium rounded-md bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                  onClick={() => alert('Email template editor would open here')}
                >
                  Edit
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Weather Cancellation Email</h3>
                  <p className="text-xs text-gray-500">Sent when a booking is cancelled due to weather</p>
                </div>
                <button 
                  className="px-3 py-1 text-xs font-medium rounded-md bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                  onClick={() => alert('Email template editor would open here')}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Help & Resources */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Help & Resources</h2>
          </div>
          
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                <h3 className="text-base font-medium text-blue-800 mb-2">Quick Help</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800">System Documentation</h4>
                      <p className="text-blue-600">View the full system documentation for detailed usage instructions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800">Frequently Asked Questions</h4>
                      <p className="text-blue-600">Find answers to common questions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800">Contact Support</h4>
                      <p className="text-blue-600">support@company.com</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Admin Resources</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Link would open here'); }}>
                      Weather Forecast for Flathead Lake
                    </a>
                  </li>
                  <li className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Link would open here'); }}>
                      Stripe Dashboard
                    </a>
                  </li>
                  <li className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Link would open here'); }}>
                      Supabase Dashboard
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;