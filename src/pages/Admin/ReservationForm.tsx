// Enhanced ReservationForm with improved number input handling
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { reservationsApi } from '../../redux/apis/reservationsApi.ts';
import { timeSlotsApi } from '../../redux/apis/timeSlotsApi.ts';
import { Reservation, TimeSlot } from '../../types.ts';
import { formatDateTimeRange } from '../../utils/dateFormatters.ts';

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

const ReservationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Initial form state
  const [formData, setFormData] = useState<Partial<Reservation>>({
    time_slot_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_people: 1,
    riders: 0,
    photo_package: false,
    go_pro_package: false,
    tshirts: 0,
    status: 'confirmed',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  // RTK Query hooks - use admin endpoints
  const { data: timeSlots = [], isLoading: isLoadingTimeSlots } = timeSlotsApi.useGetAllTimeSlotsQuery();
  const { data: reservations = [], isLoading: isLoadingReservations } = reservationsApi.useGetAllReservationsQuery();
  const [createReservation, { isLoading: isCreating }] = reservationsApi.useCreateAdminReservationMutation();
  
  // Load existing reservation data if in edit mode
  useEffect(() => {
    if (isEditMode && id && reservations.length > 0) {
      const reservation = reservations.find(res => res.id === id);
      if (reservation) {
        setFormData({
          time_slot_id: reservation.time_slot_id,
          customer_name: reservation.customer_name,
          customer_email: reservation.customer_email,
          customer_phone: reservation.customer_phone,
          number_of_people: reservation.number_of_people,
          riders: reservation.riders || 0,
          photo_package: reservation.photo_package || false,
          go_pro_package: reservation.go_pro_package || false,
          tshirts: reservation.tshirts || 0,
          status: reservation.status,
          notes: reservation.notes || '',
          payment_amount: reservation.payment_amount,
          payment_intent_id: reservation.payment_intent_id,
        });
      }
    }
  }, [isEditMode, id, reservations]);
  
  // Calculate price based on form data
  useEffect(() => {
    setIsCalculatingPrice(true);
    
    // Calculate price based on the same logic as in your API
    let total = 0;
    
    // Convert to numbers if they're strings
    const numPeople = typeof formData.number_of_people === "string"
      ? parseInt(formData.number_of_people, 10)
      : (formData.number_of_people || 0);

    const numRiders = typeof formData.riders === "string"
      ? parseInt(formData.riders, 10)
      : (formData.riders || 0);

    const numTshirts = typeof formData.tshirts === "string"
      ? parseInt(formData.tshirts, 10)
      : (formData.tshirts || 0);

    // Base price: $99 per parasailer
    total += numPeople * 9900;

    // Riders: $30 per ride-along person
    total += numRiders * 3000;

    // Add-ons
    if (formData.photo_package) total += 3000;
    if (formData.go_pro_package) total += 3000;

    // T-shirts: $50 each
    total += numTshirts * 5000;
    
    setCalculatedPrice(total);
    setIsCalculatingPrice(false);
  }, [formData.number_of_people, formData.riders, formData.photo_package, formData.go_pro_package, formData.tshirts]);
  
  // Handle form input changes - enhanced to support direct input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as any).checked,
      });
    } else if (type === 'number' || name === 'number_of_people' || name === 'riders' || name === 'tshirts') {
      // Allow empty string for direct editing
      const newValue = value === '' ? '' : parseInt(value, 10) || 0;
      
      setFormData({
        ...formData,
        [name]: newValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Special handler for number input blur - ensures valid numbers
  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    
    // Convert empty strings to 0 or minimum value
    if (value === '') {
      let defaultValue = 0;
      
      // Minimum value for number_of_people is 1
      if (name === 'number_of_people') {
        defaultValue = 1;
      }
      
      setFormData({
        ...formData,
        [name]: defaultValue,
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.time_slot_id) {
      newErrors.time_slot_id = 'Please select a time slot';
    }
    
    if (!formData.customer_name) {
      newErrors.customer_name = 'Name is required';
    }
    
    if (!formData.customer_email) {
      newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email is invalid';
    }
    
    if (!formData.customer_phone) {
      newErrors.customer_phone = 'Phone number is required';
    }
    
    // Convert to number for validation
    const numPeople = typeof formData.number_of_people === 'string' 
      ? (formData.number_of_people === '' ? 0 : parseInt(formData.number_of_people, 10))
      : (formData.number_of_people || 0);
      
    if (numPeople < 1) {
      newErrors.number_of_people = 'At least 1 parasailer is required';
    }
    
    // Check if the total price is 0
    if (calculatedPrice <= 0) {
      newErrors.general = 'Total price must be greater than $0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Add payment amount to the submission
      const reservationWithPrice = {
        ...formData,
        payment_amount: calculatedPrice,
        // Ensure numeric fields are valid numbers
        number_of_people: typeof formData.number_of_people === 'string' 
          ? parseInt(formData.number_of_people, 10) 
          : (formData.number_of_people || 1),
        riders: typeof formData.riders === 'string' 
          ? parseInt(formData.riders, 10) 
          : (formData.riders || 0),
        tshirts: typeof formData.tshirts === 'string' 
          ? parseInt(formData.tshirts, 10) 
          : (formData.tshirts || 0),
      };
      
      await createReservation(reservationWithPrice).unwrap();
      
      navigate('/management-console/reservations');
    } catch (error) {
      console.error('Failed to create reservation:', error);
      alert('Failed to create reservation. Please try again.');
    }
  };
  
  // Find the selected time slot for display
  const selectedTimeSlot = timeSlots.find(slot => slot.id === formData.time_slot_id);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Reservation' : 'Create Reservation'}
          </h1>
        </div>
      </div>
      
      <motion.form
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md overflow-hidden"
        onSubmit={handleSubmit}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Reservation Information</h2>
        </div>
        
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Slot */}
          <div className="md:col-span-2">
            <label htmlFor="time_slot_id" className="block text-sm font-medium text-gray-700 mb-1">
              Time Slot*
            </label>
            <select
              id="time_slot_id"
              name="time_slot_id"
              value={formData.time_slot_id || ''}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${errors.time_slot_id ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            >
              <option value="">Select a time slot</option>
              {timeSlots
                .filter(slot => slot.status !== 'fully_booked' && slot.status !== 'weather_blocked')
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {formatDateTimeRange(slot.start_time, slot.end_time)} - {slot.capacity - slot.booked_count} spots available
                  </option>
                ))
              }
            </select>
            {errors.time_slot_id && (
              <p className="mt-1 text-sm text-red-600">{errors.time_slot_id}</p>
            )}
            
            {selectedTimeSlot && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                Selected time slot has {selectedTimeSlot.capacity - selectedTimeSlot.booked_count} available spots out of {selectedTimeSlot.capacity} total capacity.
              </div>
            )}
          </div>
          
          {/* Customer Name */}
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name*
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name || ''}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${errors.customer_name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {errors.customer_name && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email || ''}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${errors.customer_email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {errors.customer_email && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_email}</p>
            )}
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone*
            </label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone || ''}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${errors.customer_phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {errors.customer_phone && (
              <p className="mt-1 text-sm text-red-600">{errors.customer_phone}</p>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status*
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || 'confirmed'}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Number of Parasailers - Enhanced with direct input */}
          <div>
            <label htmlFor="number_of_people" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Parasailers*
            </label>
            <div className="flex items-center">
              <input
                type="text"
                inputMode="numeric"
                id="number_of_people"
                name="number_of_people"
                value={formData.number_of_people === 0 ? '' : formData.number_of_people || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border ${errors.number_of_people ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              <div className="flex ml-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = typeof formData.number_of_people === 'string' 
                      ? parseInt(formData.number_of_people || '0', 10) 
                      : (formData.number_of_people || 0);
                    setFormData({
                      ...formData,
                      number_of_people: Math.max(1, currentValue - 1)
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-l-md"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = typeof formData.number_of_people === 'string' 
                      ? parseInt(formData.number_of_people || '0', 10) 
                      : (formData.number_of_people || 0);
                    setFormData({
                      ...formData,
                      number_of_people: currentValue + 1
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
            {errors.number_of_people && (
              <p className="mt-1 text-sm text-red-600">{errors.number_of_people}</p>
            )}
            <p className="mt-1 text-xs text-blue-600">$99 per person</p>
          </div>
          
          {/* Riders - Enhanced with direct input */}
          <div>
            <label htmlFor="riders" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Riders (non-parasailing)
            </label>
            <div className="flex items-center">
              <input
                type="text"
                inputMode="numeric"
                id="riders"
                name="riders"
                value={formData.riders === 0 ? '' : formData.riders || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="flex ml-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = typeof formData.riders === 'string' 
                      ? parseInt(formData.riders || '0', 10) 
                      : (formData.riders || 0);
                    setFormData({
                      ...formData,
                      riders: Math.max(0, currentValue - 1)
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-l-md"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = typeof formData.riders === 'string' 
                      ? parseInt(formData.riders || '0', 10) 
                      : (formData.riders || 0);
                    setFormData({
                      ...formData,
                      riders: currentValue + 1
                    });
                  }}
                  className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-blue-600">$30 per person</p>
          </div>
          
          <div className="md:col-span-2">
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add-ons</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Package */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="photo_package"
                    name="photo_package"
                    checked={formData.photo_package || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="photo_package" className="ml-2">
                    <span className="block text-sm font-medium text-gray-700">Photo Package</span>
                    <span className="block text-xs text-blue-600">$30</span>
                  </label>
                </div>
                
                {/* GoPro Package */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="go_pro_package"
                    name="go_pro_package"
                    checked={formData.go_pro_package || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="go_pro_package" className="ml-2">
                    <span className="block text-sm font-medium text-gray-700">GoPro Package</span>
                    <span className="block text-xs text-blue-600">$30</span>
                  </label>
                </div>
                
                {/* T-shirts - Enhanced with direct input */}
                <div className="md:col-span-2">
                  <label htmlFor="tshirts" className="block text-sm font-medium text-gray-700 mb-1">
                    T-shirts
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      id="tshirts"
                      name="tshirts"
                      value={formData.tshirts === 0 ? '' : formData.tshirts || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="flex ml-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = typeof formData.tshirts === 'string' 
                            ? parseInt(formData.tshirts || '0', 10) 
                            : (formData.tshirts || 0);
                          setFormData({
                            ...formData,
                            tshirts: Math.max(0, currentValue - 1)
                          });
                        }}
                        className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-l-md"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = typeof formData.tshirts === 'string' 
                            ? parseInt(formData.tshirts || '0', 10) 
                            : (formData.tshirts || 0);
                          setFormData({
                            ...formData,
                            tshirts: currentValue + 1
                          });
                        }}
                        className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-blue-600">$50 per shirt</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Any special requests or additional information"
            />
          </div>
          
          {/* Payment Information */}
          <div className="md:col-span-2">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Information</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">Total Amount:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isCalculatingPrice ? 'Calculating...' : `$${(calculatedPrice / 100).toFixed(2)}`}
                  </p>
                </div>
                
                {isEditMode && formData.payment_intent_id && (
                  <div className="text-right">
                    <p className="text-sm text-gray-700">Payment ID:</p>
                    <p className="text-sm font-mono text-gray-900">{formData.payment_intent_id}</p>
                  </div>
                )}
              </div>
              
              {/* Display general validation error */}
              {errors.general && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{errors.general}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 text-right flex justify-end space-x-3">
          <Link
            to="/management-console/reservations"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isCreating || calculatedPrice <= 0}
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              isEditMode ? 'Update Reservation' : 'Create Reservation'
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ReservationForm;