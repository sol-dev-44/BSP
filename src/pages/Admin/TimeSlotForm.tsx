// components/admin/TimeSlotForm.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { timeSlotsApi } from '../../redux/apis/timeSlotsApi.ts';
import { formatDate } from '../../utils/dateFormatters.ts';

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

interface TimeSlotFormData {
  startDate: string;
  endDate: string;
  startHour: number;
  endHour: number;
  slotDuration: number;
  capacity: number;
  skipDays: number[];
}

const TimeSlotForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TimeSlotFormData>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startHour: 9,
    endHour: 17,
    slotDuration: 60,
    capacity: 10,
    skipDays: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewCount, setPreviewCount] = useState(0);
  
  const [createTimeSlots, { isLoading: isCreating }] = timeSlotsApi.useCreateTimeSlotsMutation();
  
  // Calculate preview count when form data changes
  useEffect(() => {
    calculatePreviewCount();
  }, [formData]);
  
  // Calculate how many time slots will be created with current settings
  const calculatePreviewCount = () => {
    const { startDate, endDate, startHour, endHour, slotDuration, skipDays } = formData;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let count = 0;
    const hoursPerDay = (endHour - startHour) * (60 / slotDuration);
    
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      // Skip specified days
      if (!skipDays.includes(day.getDay())) {
        count += hoursPerDay;
      }
    }
    
    setPreviewCount(count);
  };
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent< any >
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox changes (skipDays)
    if (name === 'skipDay') {
      const dayNumber = parseInt(value);
      const newSkipDays = [...formData.skipDays];
      
      if ((e.target as any).checked) {
        if (!newSkipDays.includes(dayNumber)) {
          newSkipDays.push(dayNumber);
        }
      } else {
        const index = newSkipDays.indexOf(dayNumber);
        if (index !== -1) {
          newSkipDays.splice(index, 1);
        }
      }
      
      setFormData({
        ...formData,
        skipDays: newSkipDays,
      });
    } else {
      // Handle other inputs
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) : value,
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
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.startHour >= formData.endHour) {
      newErrors.startHour = 'Start hour must be before end hour';
    }
    
    if (formData.slotDuration <= 0) {
      newErrors.slotDuration = 'Duration must be greater than 0';
    }
    
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
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
      const result = await createTimeSlots({
        startDate: formData.startDate,
        endDate: formData.endDate,
        startHour: formData.startHour,
        endHour: formData.endHour,
        slotDuration: formData.slotDuration,
        capacity: formData.capacity,
        skipDays: formData.skipDays,
      }).unwrap();
      
      navigate('/management-console/time-slots');
    } catch (error) {
      console.error('Failed to create time slots:', error);
      alert('Failed to create time slots. Please try again.');
    }
  };
  
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
          <h1 className="text-2xl font-bold text-gray-900">Create Time Slots</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.form
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Time Slot Generator</h2>
          </div>
          
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date*
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
            
            {/* Time Range */}
            <div>
              <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-1">
                Start Hour*
              </label>
              <input
                type="number"
                id="startHour"
                name="startHour"
                min="0"
                max="23"
                value={formData.startHour}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.startHour ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.startHour && (
                <p className="mt-1 text-sm text-red-600">{errors.startHour}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endHour" className="block text-sm font-medium text-gray-700 mb-1">
                End Hour*
              </label>
              <input
                type="number"
                id="endHour"
                name="endHour"
                min="0"
                max="23"
                value={formData.endHour}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.endHour ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.endHour && (
                <p className="mt-1 text-sm text-red-600">{errors.endHour}</p>
              )}
            </div>
            
            {/* Slot Duration */}
            <div>
              <label htmlFor="slotDuration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)*
              </label>
              <select
                id="slotDuration"
                name="slotDuration"
                value={formData.slotDuration}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.slotDuration ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>2 hours</option>
              </select>
              {errors.slotDuration && (
                <p className="mt-1 text-sm text-red-600">{errors.slotDuration}</p>
              )}
            </div>
            
            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity*
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.capacity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
              )}
            </div>
            
            {/* Skip Days */}
            <div className="md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Skip Days (don't create slots on these days)
                </legend>
                <div className="grid grid-cols-7 gap-2">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <div key={day} className="flex items-center">
                      <input
                        id={`skip-${day}`}
                        name="skipDay"
                        type="checkbox"
                        value={index}
                        checked={formData.skipDays.includes(index)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`skip-${day}`} className="ml-2 block text-sm text-gray-700">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 text-right flex justify-end space-x-3">
            <Link
              to="/management-console/time-slots"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Time Slots'
              )}
            </button>
          </div>
        </motion.form>
        
        {/* Preview panel */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden h-fit"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          </div>
          
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date Range</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(formData.startDate)} to {formatDate(formData.endDate)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Time Range</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formData.startHour}:00 to {formData.endHour}:00
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formData.slotDuration} minutes per slot
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formData.capacity} people per slot
                </p>
              </div>
              
              {formData.skipDays.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Skipped Days</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formData.skipDays.map(day => (
                      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
                    )).join(', ')}
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Total Time Slots</h3>
                <p className="mt-1 text-xl font-bold text-blue-600">
                  {previewCount}
                </p>
              </div>
              
              <div className="pt-4 text-sm text-gray-500 italic">
                This will create {previewCount} new time slots with the specified settings.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeSlotForm;