// components/CustomerForm.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Reservation } from '../../types.ts';

interface CustomerFormProps {
  formData: Partial<Reservation>;
  onChange: (name: string, value: string | number | boolean) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  formData, 
  onChange, 
  onSubmit,
  isProcessing
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      const checked = (e.target as any).checked;
      onChange(name, checked);
    } else if (type === 'number') {
      onChange(name, parseInt(value, 10) || 0);
    } else {
      onChange(name, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.form 
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
    >
      {/* Form Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-5">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <circle cx="25" cy="25" r="10" fill="currentColor" />
            </pattern>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#pattern-circles)"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold relative z-10">Customer Information</h3>
        <p className="text-blue-100 mt-1 relative z-10">Please enter your details below</p>
      </div>
      
      <div className="p-6">
        <motion.div className="mb-5" variants={inputVariants}>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="customer_name"
            type="text"
            name="customer_name"
            value={formData.customer_name || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div variants={inputVariants}>
            <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="customer_email"
              type="email"
              name="customer_email"
              value={formData.customer_email || ''}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </motion.div>
          
          <motion.div variants={inputVariants}>
            <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="customer_phone"
              type="tel"
              name="customer_phone"
              value={formData.customer_phone || ''}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </motion.div>
        </div>
      </div>
      
      <div className="bg-blue-50 px-6 py-5 border-t border-blue-100">
        <h4 className="text-lg font-bold text-blue-900 mb-4">Booking Options</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <motion.div variants={inputVariants}>
            <label htmlFor="number_of_people" className="block text-sm font-medium text-gray-700 mb-1">
              Parasailers
            </label>
            <div className="relative">
              <select
                id="number_of_people"
                name="number_of_people"
                value={formData.number_of_people || 1}
                onChange={handleInputChange}
                required
                className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-sm text-blue-600 font-medium mt-1.5 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                $99 per person
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={inputVariants}>
            <label htmlFor="riders" className="block text-sm font-medium text-gray-700 mb-1">
              Boat Riders (Non-parasailing)
            </label>
            <div className="relative">
              <select
                id="riders"
                name="riders"
                value={formData.riders || 0}
                onChange={handleInputChange}
                className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-sm text-blue-600 font-medium mt-1.5 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                $30 per person
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Add-ons</h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div variants={inputVariants}>
              <div className="relative flex items-start">
                <div className="flex items-center h-6">
                  <input
                    id="photo_package"
                    type="checkbox"
                    name="photo_package"
                    checked={formData.photo_package || false}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="photo_package" className="font-medium text-gray-700">
                    Photo Package
                  </label>
                  <p className="text-gray-500">Professional photos of your adventure</p>
                  <p className="text-blue-600 font-medium">$30</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={inputVariants}>
              <div className="relative flex items-start">
                <div className="flex items-center h-6">
                  <input
                    id="go_pro_package"
                    type="checkbox"
                    name="go_pro_package"
                    checked={formData.go_pro_package || false}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="go_pro_package" className="font-medium text-gray-700">
                    GoPro Package
                  </label>
                  <p className="text-gray-500">First-person video of your experience</p>
                  <p className="text-blue-600 font-medium">$30</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div className="mb-6" variants={inputVariants}>
          <label htmlFor="tshirts" className="block text-sm font-medium text-gray-700 mb-1">
            Big Sky Parasail T-Shirts
          </label>
          <div className="relative">
            <select
              id="tshirts"
              name="tshirts"
              value={formData.tshirts || 0}
              onChange={handleInputChange}
              className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'shirt' : 'shirts'}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="text-sm text-blue-600 font-medium mt-1.5 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              $50 each - High-quality souvenir
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <motion.button 
          type="submit" 
          className={`
            inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-md 
            text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
            ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          disabled={isProcessing}
          whileHover={{ scale: isProcessing ? 1 : 1.03 }}
          whileTap={{ scale: isProcessing ? 1 : 0.97 }}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default CustomerForm;