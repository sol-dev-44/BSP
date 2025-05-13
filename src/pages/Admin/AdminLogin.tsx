// components/admin/AdminLogin.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../../redux/slices/adminAuthSlice.ts'
import { RootState } from '../../redux/store.ts';

const AdminLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.adminAuth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get the admin PIN from environment variables
    const adminPin = import.meta.env.VITE_ADMIN_PIN;
    
    if (pin === adminPin) {
      // set it on local storage: adminApiKey
      localStorage.setItem('adminApiKey', pin);
      dispatch(loginSuccess());
      navigate('/management-console');
    } else {
      dispatch(loginFailure('Invalid PIN. Please try again.'));
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <img 
              src="/JerryBearLogo.png" 
              alt="Big Sky Parasail" 
              className="h-16 mx-auto mb-4"
            />
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-bold text-gray-900"
            >
              Management Console
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 mt-2"
            >
              Enter your PIN to access the management dashboard
            </motion.p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pin">
                Admin PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e:any) => setPin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your PIN"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;