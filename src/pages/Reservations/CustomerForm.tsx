// components/CustomerForm.tsx - Updated with tip functionality
import React from 'react';
import { motion } from 'framer-motion';
import { Reservation } from '../../types.ts';

interface CustomerFormProps {
  formData: Partial<Reservation> & { tip_amount?: number };
  onChange: (name: string, value: string | number | boolean) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  availableCapacity?: number;
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
  isProcessing,
  availableCapacity = 10
}) => {
  // Calculate dynamic pricing based on number of people
  const numberOfPeople = Number(formData.number_of_people) || 1;
  const pricePerPerson = numberOfPeople >= 2 ? 75 : 89;
  const totalParasailingPrice = numberOfPeople * pricePerPerson;
  
  // Predefined tip amounts in cents - factors of 10
  const tipAmounts = [1000, 2000, 3000, 4000, 5000]; // $10, $20, $30, $40, $50
  
  // Local state for custom tip input to avoid input conflicts
  const [customTipInput, setCustomTipInput] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      const checked = (e.target as any).checked;
      onChange(name, checked);
    } else if (type === 'number' || name === 'number_of_people' || name === 'riders' || name === 'tshirts' || name === 'tip_amount') {
      // Always convert these fields to numbers, even from select elements
      onChange(name, parseInt(value, 10) || 0);
    } else {
      onChange(name, value);
    }
  };

  const handleTipSelect = (amount: number) => {
    onChange('tip_amount', amount);
    // Clear custom input when predefined amount is selected
    setCustomTipInput('');
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTipInput(value);
    
    // Convert to cents and update form data
    const numValue = parseFloat(value) || 0;
    onChange('tip_amount', Math.round(numValue * 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure riders is 0 when submitting
    if (formData.riders !== 0) {
      onChange('riders', 0);
    }
    onSubmit();
  };

  // Generate parasailer options based on available capacity
  const parasailerOptions = [];
  for (let i = 1; i <= Math.min(10, availableCapacity); i++) {
    parasailerOptions.push(
      <option key={i} value={i}>{i} {i === 1 ? 'person' : 'people'}</option>
    );
  }

  // If no spots are available, add a disabled option
  if (parasailerOptions.length === 0) {
    parasailerOptions.push(
      <option key="none" value="0" disabled>No spots available</option>
    );
  }

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
        
        {/* Sale promotion banner */}
        <div className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-4 text-white shadow-lg animate-pulse">
          <div className="flex items-center justify-center">
            <span className="text-2xl mr-2">🎉</span>
            <div className="text-center">
              <p className="font-bold text-lg">LIMITED TIME OFFER!</p>
              <p className="text-sm">Was <span className="line-through">$99</span> → Now only <span className="text-xl font-bold">$89</span>/person</p>
              <p className="text-sm font-semibold">2+ riders just $75/person!</p>
            </div>
            <span className="text-2xl ml-2">🎉</span>
          </div>
        </div>
        
        {/* Show available capacity info */}
        <div className="mb-4 bg-blue-100 rounded-md p-3 text-blue-800 text-sm">
          <p className="font-medium">Available capacity: {availableCapacity} {availableCapacity === 1 ? 'spot' : 'spots'}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-5 mb-6">
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
                {parasailerOptions}
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
                {numberOfPeople === 1 ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">$99</span>
                    <span className="text-green-600 font-bold">$89 per person</span>
                  </>
                ) : (
                  <span className="text-green-600 font-bold">
                    ${pricePerPerson} per person × {numberOfPeople} = ${totalParasailingPrice} total
                  </span>
                )}
              </div>
              {numberOfPeople === 1 && (
                <div className="mt-2 bg-green-100 rounded-md p-2 text-green-800 text-sm font-medium">
                  💰 Add another person and save! 2+ riders only $75/person
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Riders Info Box - replaces the rider selection dropdown */}
          <motion.div 
            variants={inputVariants}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-2"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Want to bring additional boat riders?</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Additional boat riders (non-parasailing guests) can be arranged for <span className="font-semibold">$30 per person</span>, based on availability.
                    Please call <a href="tel:4062706256" className="font-medium underline">406-270-6256</a> or email{" "}
                    <a href="mailto:bigskyparasailing@gmail.com" className="font-medium underline">bigskyparasailing@gmail.com</a> after booking to inquire about adding riders to your reservation.
                  </p>
                </div>
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
        
        <motion.div className="mb-6" variants={inputVariants} style={{ display: 'none' }}>
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

        {/* NEW: Tip Section */}
        <motion.div className="bg-white rounded-lg p-5 mb-6 shadow-sm" variants={inputVariants}>
          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
            <span className="text-lg mr-2">🚤</span>
            Tip Your Crew (Optional)
          </h5>
          <p className="text-sm text-gray-600 mb-4">
            Show appreciation for exceptional service with a tip for your crew!
          </p>
          
          {/* Tip Amount Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleTipSelect(0)}
              className={`p-3 rounded-lg border-2 transition-all font-medium ${
                (formData.tip_amount || 0) === 0
                  ? 'border-gray-400 bg-gray-50 text-gray-700'
                  : 'border-gray-300 hover:border-green-300 bg-white text-gray-900'
              }`}
            >
              No Tip
            </button>
            {tipAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleTipSelect(amount)}
                className={`p-3 rounded-lg border-2 transition-all font-medium ${
                  formData.tip_amount === amount
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300 bg-white text-gray-900'
                }`}
              >
                ${(amount / 100).toFixed(0)}
              </button>
            ))}
          </div>

          {/* Custom Tip Amount */}
          <div className="relative">
            <label htmlFor="custom_tip" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Tip Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="custom_tip"
                type="number"
                placeholder="Enter custom amount"
                min="0"
                step="0.01"
                value={customTipInput}
                onChange={handleCustomTipChange}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Tip Summary */}
          {formData.tip_amount && formData.tip_amount > 0 && (
            <div className="mt-4 bg-green-50 p-3 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm font-semibold text-green-800">
                  Crew Tip: ${(formData.tip_amount / 100).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">Your crew will greatly appreciate this!</p>
            </div>
          )}
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