// components/admin/WeatherBlock.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { timeSlotsApi } from '../../redux/apis/timeSlotsApi.ts';
import { TimeSlot } from '../../types.ts';
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

// Group time slots by date
const groupSlotsByDate = (timeSlots: TimeSlot[]) => {
  const grouped: Record<string, TimeSlot[]> = {};
  
  // Create a copy of the array to avoid mutating the frozen original
  [...timeSlots].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .forEach(slot => {
      const date = new Date(slot.start_time).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
  
  return grouped;
};

const WeatherBlock: React.FC = () => {
  const navigate = useNavigate();
  const [weatherStatus, setWeatherStatus] = useState('Weather conditions unsuitable for parasailing');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const { data: timeSlots = [], isLoading } = timeSlotsApi.useGetTimeSlotsQuery();
  const [blockTimeSlots, { isLoading: isBlocking }] = timeSlotsApi.useBlockTimeSlotsDueToWeatherMutation();

  useEffect(() => {
    if (timeSlots.length > 0) {
      console.log("Sample time slot:", {
        id: timeSlots[0].id,
        startTime: new Date(timeSlots[0].start_time).toLocaleString(),
        endTime: new Date(timeSlots[0].end_time).toLocaleString(),
        raw: timeSlots[0]
      });
    }
  }, [timeSlots]);
  
  // Filter time slots - keep only those that are not already weather-blocked
  const availableTimeSlots = timeSlots.filter(slot => 
    slot.status !== 'weather_blocked' &&
    (!dateFilter || new Date(slot.start_time).toLocaleDateString() === dateFilter)
  );
  
  // Group available slots by date
  const groupedTimeSlots = groupSlotsByDate(availableTimeSlots);
  
  // Get unique dates for filter
  const uniqueDates = Object.keys(groupSlotsByDate(timeSlots)).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  // Toggle a time slot selection
  const toggleSlotSelection = (slotId: string) => {
    if (selectedSlotIds.includes(slotId)) {
      setSelectedSlotIds(selectedSlotIds.filter(id => id !== slotId));
    } else {
      setSelectedSlotIds([...selectedSlotIds, slotId]);
    }
  };
  
  // Toggle all slots for a date
  const toggleDateSelection = (date: string, slots: TimeSlot[]) => {
    const slotIds = slots.map(slot => slot.id);
    
    // Check if all slots for this date are already selected
    const allSelected = slotIds.every(id => selectedSlotIds.includes(id));
    
    if (allSelected) {
      // Remove all slots for this date
      setSelectedSlotIds(selectedSlotIds.filter(id => !slotIds.includes(id)));
    } else {
      // Add all unselected slots for this date
      const newSelections = [...selectedSlotIds];
      slotIds.forEach(id => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      setSelectedSlotIds(newSelections);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSlotIds.length === 0) {
      alert('Please select at least one time slot to block');
      return;
    }
    
    try {
      await blockTimeSlots({
        slotIds: selectedSlotIds,
        weatherStatus
      }).unwrap();
      
      alert(`Successfully blocked ${selectedSlotIds.length} time slot(s) due to weather conditions`);
      navigate('/management-console/time-slots');
    } catch (error) {
      console.error('Failed to block time slots:', error);
      alert('Failed to block time slots. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-900">Weather Block</h1>
        </div>
      </div>
      
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Use this feature to block time slots due to adverse weather conditions.
              This will prevent customers from booking these slots and notify existing bookings.
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.form
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
          onSubmit={handleSubmit}
        >
          {/* Weather Status Input */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Weather Status</h2>
            </div>
            
            <div className="px-6 py-4">
              <label htmlFor="weatherStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Weather condition message
              </label>
              <input
                type="text"
                id="weatherStatus"
                value={weatherStatus}
                onChange={(e:any) => setWeatherStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="E.g., High winds and rain expected"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                This message will be displayed to customers who have booked these time slots.
              </p>
            </div>
          </div>
          
          {/* Time Slot Selection */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Select Time Slots to Block</h2>
              
              <div>
                <select
                  value={dateFilter}
                  onChange={(e:any) => setDateFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Dates</option>
                  {uniqueDates.map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-500">Loading time slots...</p>
                </div>
              ) : Object.keys(groupedTimeSlots).length === 0 ? (
                <div className="py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-base font-medium text-gray-900">No available time slots</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All time slots have already been blocked or are fully booked.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {Object.entries(groupedTimeSlots).map(([date, slots]) => (
                    <div key={date} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggleDateSelection(date, slots)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          {slots.every(slot => selectedSlotIds.includes(slot.id)) ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`rounded-md border p-3 cursor-pointer transition-colors
                              ${selectedSlotIds.includes(slot.id) 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                              }`
                            }
                            onClick={() => toggleSlotSelection(slot.id)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedSlotIds.includes(slot.id)}
                                onChange={() => toggleSlotSelection(slot.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDateTimeRange(slot.start_time, slot.end_time).split(',')[1].trim()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {slot.booked_count} of {slot.capacity} booked
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                disabled={isBlocking || selectedSlotIds.length === 0}
              >
                {isBlocking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Block Selected Time Slots'
                )}
              </button>
            </div>
          </div>
        </motion.form>
        
        {/* Weather Info Panel */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden h-fit"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Weather Information</h2>
          </div>
          
          <div className="px-6 py-4">
            {/* Weather forecast widget */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg overflow-hidden text-white mb-4">
              <div className="p-4">
                <h3 className="font-bold text-xl">Flathead Lake</h3>
                <p className="text-sm text-blue-100">Current Conditions</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <svg className="w-12 h-12 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-3xl font-bold">72°F</span>
                      <p className="text-sm">Sunny</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Wind: <span className="font-bold">8 mph</span></p>
                    <p className="text-sm">Humidity: <span className="font-bold">45%</span></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-700 bg-opacity-30 px-4 py-2 flex justify-between text-sm">
                <a href="https://weather.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white">
                  View Forecast
                </a>
                <span className="text-blue-100">Updated: Just now</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Selected Time Slots</h3>
                <p className="mt-1 text-2xl font-bold text-yellow-600">
                  {selectedSlotIds.length}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">What happens when you block time slots?</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2">These time slots will no longer be available for booking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2">Existing bookings will be marked as "weather cancelled"</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2">Customers will receive an email notification</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-4 w-4 text-yellow-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="ml-2">You'll need to manually issue refunds if needed</span>
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

export default WeatherBlock;