
// TimeSlotForm.tsx with date handling fix
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
  startHour: number;
  capacity: number;
  skipDays: number[];
  // New fields for simplified and repeating time slots
  isRepeating: boolean;
  repeatUntil: string;
  singleDay: boolean;
}

const TimeSlotForm: React.FC = () => {
  const navigate = useNavigate();
  // Initialize with today's date in local timezone without time component
  const today = new Date();
  const localDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const [formData, setFormData] = useState<TimeSlotFormData>({
    startDate: localDateString,
    startHour: 9,
    capacity: 10,
    skipDays: [],
    isRepeating: false,
    repeatUntil: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    singleDay: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewCount, setPreviewCount] = useState(0);
  
  // Use the getAllTimeSlots query to get the admin view of all time slots
  const [createTimeSlots, { isLoading: isCreating }] = timeSlotsApi.useCreateTimeSlotsMutation();
  const { refetch } = timeSlotsApi.useGetTimeSlotsQuery();
  
  // Calculate preview count when form data changes
  useEffect(() => {
    calculatePreviewCount();
  }, [formData]);
  
  // Calculate how many time slots will be created with current settings
  const calculatePreviewCount = () => {
    const { startDate, startHour, skipDays, isRepeating, repeatUntil, singleDay } = formData;
    
    if (singleDay) {
      // Just one slot for single day mode
      setPreviewCount(1);
      return;
    }
    
    // Create dates using correct local interpretation
    const start = parseLocalDate(startDate);
    const end = isRepeating ? parseLocalDate(repeatUntil) : parseLocalDate(startDate);
    
    let count = 0;
    
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      // Skip specified days
      if (!skipDays.includes(day.getDay())) {
        count += 1; // Just one slot per day at the specified hour
      }
    }
    
    setPreviewCount(count);
  };
  
  // Parse a date string into a local date (avoiding timezone issues)
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Format date consistently for display
  const formatDateForDisplay = (dateString: string): string => {
    try {
      // Create date from the date string correctly in local timezone
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<any>
  ) => {
    const { name, value, type } = e.target as any;
    
    // Handle checkbox changes
    if (type === 'checkbox') {
      if (name === 'isRepeating') {
        setFormData({
          ...formData,
          isRepeating: e.target.checked,
          // If turning off repeating, also set singleDay to true
          singleDay: e.target.checked ? formData.singleDay : true,
        });
      } else if (name === 'singleDay') {
        setFormData({
          ...formData,
          singleDay: e.target.checked,
        });
      } else if (name === 'skipDay') {
        const dayNumber = parseInt(value);
        const newSkipDays = [...formData.skipDays];
        
        if (e.target.checked) {
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
      }
    } else {
      // Handle other inputs - ensure we properly convert to number for numeric fields
      if (name === 'startHour') {
        // Make sure to actually parse the value as a number!
        const numericValue = parseInt(value, 10);
        console.log(`Setting startHour to: ${numericValue} (from ${value})`);
        
        setFormData({
          ...formData,
          startHour: numericValue,
        });
      } else if (name === 'capacity') {
        // Make sure to actually parse the value as a number!
        const numericValue = parseInt(value, 10);
        
        setFormData({
          ...formData,
          capacity: numericValue,
        });
      } else {
        // For other fields, just set the value directly
        setFormData({
          ...formData,
          [name]: value,
        });
      }
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
    
    if (formData.isRepeating && !formData.repeatUntil) {
      newErrors.repeatUntil = 'End date is required for repeating time slots';
    } else if (formData.isRepeating) {
      // Compare dates correctly using our local date parsing
      const startDate = parseLocalDate(formData.startDate);
      const endDate = parseLocalDate(formData.repeatUntil);
      
      if (endDate < startDate) {
        newErrors.repeatUntil = 'End date must be after start date';
      }
    }
    
    if (formData.startHour < 0 || formData.startHour > 23) {
      newErrors.startHour = 'Start hour must be between 0 and 23';
    }
    
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Create an ISO string date with the correct time and timezone offset
  const createLocalDateTimeISO = (dateStr: string, hour: number): string => {
    // Parse the date string to get correct local components
    const [year, month, day] = dateStr.split('-').map(Number);
    // Create date using local components (month is 0-indexed in JS)
    const date = new Date(year, month - 1, day, hour, 0, 0, 0);
    
    // Log for debugging
    console.log("Creating datetime with input:", { 
      dateStr, 
      hour, 
      localDate: date.toString(),
      isoDate: date.toISOString() 
    });
    
    return date.toISOString();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log("⏳ Creating time slots...");
      
      // For single day mode, just create one time slot
      if (formData.singleDay) {
        // Create proper datetime strings with timezone handling
        const startTime = createLocalDateTimeISO(formData.startDate, formData.startHour);
        const endTime = createLocalDateTimeISO(formData.startDate, formData.startHour + 1);
        
        console.log("Creating single time slot:", {
          start_time: startTime,
          end_time: endTime,
          displayStartDate: new Date(startTime).toLocaleString(),
          displayEndDate: new Date(endTime).toLocaleString()
        });
        
        const singleSlot = {
          start_time: startTime,
          end_time: endTime,
          capacity: formData.capacity,
          status: 'available' as const,
        };
        
        const result = await createTimeSlots({
          slots: [singleSlot],
        }).unwrap();
        
        console.log("✅ Time slot created:", result);
        
        // Force refresh time slots
        await refetch();
        
        alert(`Successfully created 1 time slot`);
        
        // Navigate with a slight delay to ensure data is refreshed
        setTimeout(() => {
          navigate('/management-console/time-slots');
        }, 500);
        
        return;
      }
      
      // For repeating slots, create slots from range
      // Use proper date parsing to avoid timezone issues
      const startDate = parseLocalDate(formData.startDate);
      const endDate = formData.isRepeating 
        ? parseLocalDate(formData.repeatUntil) 
        : parseLocalDate(formData.startDate);
      
      console.log("Creating time slots from range:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        displayStartDate: startDate.toLocaleString(),
        displayEndDate: endDate.toLocaleString()
      });
      
      // Call the API with date range parameters
      const result = await createTimeSlots({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startHour: formData.startHour,
        endHour: formData.startHour + 1, // Always 1 hour duration
        slotDuration: 60,
        capacity: formData.capacity,
        skipDays: formData.skipDays,
      }).unwrap();
      
      console.log("✅ Time slots created:", result);
      
      // Force refresh time slots
      await refetch();
      
      alert(`Successfully created ${result.slots.length} time slots`);
      
      // Navigate with a slight delay to ensure data is refreshed
      setTimeout(() => {
        navigate('/management-console/time-slots');
      }, 500);
      
    } catch (err) {
      console.error("❌ Failed to create time slots:", err);
      alert('Failed to create time slots. Please try again. Error: ' + (err instanceof Error ? err.message : String(err)));
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
            <h2 className="text-lg font-semibold text-gray-900">Simplified Time Slot Creator</h2>
          </div>
          
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date*
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
            
            {/* Time Selection */}
            <div>
              <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time*
              </label>
              <select
                id="startHour"
                name="startHour"
                value={formData.startHour}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${errors.startHour ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i;
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const hour12 = hour % 12 || 12;
                  return (
                    <option key={hour} value={hour}>
                      {hour12}:00 {ampm}
                    </option>
                  );
                })}
              </select>
              <p className="mt-1 text-xs text-blue-600">
                This will create a 1-hour time slot
              </p>
              {errors.startHour && (
                <p className="mt-1 text-sm text-red-600">{errors.startHour}</p>
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
            
            {/* Single Day or Repeating */}
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="singleDay"
                    name="singleDay"
                    type="checkbox"
                    checked={formData.singleDay}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="singleDay" className="font-medium text-gray-700">
                    Single Day Only
                  </label>
                  <p className="text-gray-500">Create just one time slot for the selected date and time</p>
                </div>
              </div>
              
              {!formData.singleDay && (
                <div className="mt-3 border-t border-blue-200 pt-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isRepeating"
                        name="isRepeating"
                        type="checkbox"
                        checked={formData.isRepeating}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isRepeating" className="font-medium text-gray-700">
                        Repeating Time Slot
                      </label>
                      <p className="text-gray-500">Create this time slot for multiple days</p>
                    </div>
                  </div>
                  
                  {formData.isRepeating && (
                    <div className="mt-3 pl-7">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label htmlFor="repeatUntil" className="block text-sm font-medium text-gray-700 mb-1">
                            Repeat Until
                          </label>
                          <input
                            type="date"
                            id="repeatUntil"
                            name="repeatUntil"
                            value={formData.repeatUntil}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-2 border ${errors.repeatUntil ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            required={formData.isRepeating}
                          />
                          {errors.repeatUntil && (
                            <p className="mt-1 text-sm text-red-600">{errors.repeatUntil}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skip Days
                          </label>
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
                                <label htmlFor={`skip-${day}`} className="ml-2 block text-xs text-gray-700">
                                  {day.substring(0, 3)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                'Create Time Slot'
              )}
            </button>
          </div>
        </motion.form>
        
        {/* Preview panel - Fixed with proper date display */}
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
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formData.singleDay ? (
                    formatDateForDisplay(formData.startDate)
                  ) : formData.isRepeating ? (
                    `${formatDateForDisplay(formData.startDate)} to ${formatDateForDisplay(formData.repeatUntil)}`
                  ) : (
                    formatDateForDisplay(formData.startDate)
                  )}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Time</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {/* Add explicit debugging info */}
                  <span className="text-blue-600 font-mono text-xs block mb-1">
                    (Debug: startHour={formData.startHour})
                  </span>
                  {formData.startHour === 9 && "9:00 AM - 10:00 AM"}
                  {formData.startHour === 10 && "10:00 AM - 11:00 AM"}
                  {formData.startHour === 11 && "11:00 AM - 12:00 PM"}
                  {formData.startHour === 12 && "12:00 PM - 1:00 PM"}
                  {formData.startHour === 13 && "1:00 PM - 2:00 PM"}
                  {formData.startHour === 14 && "2:00 PM - 3:00 PM"}
                  {formData.startHour === 15 && "3:00 PM - 4:00 PM"}
                  {formData.startHour === 16 && "4:00 PM - 5:00 PM"}
                  {formData.startHour === 17 && "5:00 PM - 6:00 PM"}
                  {formData.startHour === 18 && "6:00 PM - 7:00 PM"}
                  {formData.startHour === 19 && "7:00 PM - 8:00 PM"}
                  {formData.startHour === 20 && "8:00 PM - 9:00 PM"}
                  {formData.startHour === 21 && "9:00 PM - 10:00 PM"}
                  {formData.startHour === 22 && "10:00 PM - 11:00 PM"}
                  {formData.startHour === 23 && "11:00 PM - 12:00 AM"}
                  {formData.startHour === 0 && "12:00 AM - 1:00 AM"}
                  {formData.startHour === 1 && "1:00 AM - 2:00 AM"}
                  {formData.startHour === 2 && "2:00 AM - 3:00 AM"}
                  {formData.startHour === 3 && "3:00 AM - 4:00 AM"}
                  {formData.startHour === 4 && "4:00 AM - 5:00 AM"}
                  {formData.startHour === 5 && "5:00 AM - 6:00 AM"}
                  {formData.startHour === 6 && "6:00 AM - 7:00 AM"}
                  {formData.startHour === 7 && "7:00 AM - 8:00 AM"}
                  {formData.startHour === 8 && "8:00 AM - 9:00 AM"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="mt-1 text-sm text-gray-900">
                  1 hour per slot
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formData.capacity} people per slot
                </p>
              </div>
              
              {!formData.singleDay && formData.isRepeating && formData.skipDays.length > 0 && (
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
                {formData.singleDay ? (
                  "This will create 1 new time slot at the specified date and time."
                ) : formData.isRepeating ? (
                  `This will create ${previewCount} new time slots from ${formatDateForDisplay(formData.startDate)} to ${formatDateForDisplay(formData.repeatUntil)}.`
                ) : (
                  "This will create 1 new time slot at the specified date and time."
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeSlotForm;