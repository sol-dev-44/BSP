// components/TimeSlotsList.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeSlot } from '../../types.ts'
import DateNavigation from './DateNavigation.tsx';

interface TimeSlotsListProps {
  timeSlots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (id: string) => void;
  isLoading?: boolean;
}

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const TimeSlotsList: React.FC<TimeSlotsListProps> = ({ 
  timeSlots, 
  selectedSlot, 
  onSelectSlot,
  isLoading = false
}) => {
  // Group time slots by date
  const timeSlotsByDate = timeSlots.reduce((acc, slot) => {
    const date = new Date(slot.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Keep track of visible dates for navigation
  const sortedDates = Object.keys(timeSlotsByDate).sort();
  const [visibleDateIndex, setVisibleDateIndex] = useState(0);
  const visibleDate = sortedDates[visibleDateIndex];

  // Navigation functions
  const goToPreviousDate = () => {
    if (visibleDateIndex > 0) {
      setVisibleDateIndex(visibleDateIndex - 1);
    }
  };

  const goToNextDate = () => {
    if (visibleDateIndex < sortedDates.length - 1) {
      setVisibleDateIndex(visibleDateIndex + 1);
    }
  };

  const goToDate = (date: string) => {
    const index = sortedDates.indexOf(date);
    if (index !== -1) {
      setVisibleDateIndex(index);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading available times...</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-lg shadow-lg">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="mt-4 text-lg text-gray-600 font-medium">No available time slots found.</p>
        <p className="text-gray-500">Please check back later or contact us directly.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg overflow-hidden shadow-lg">      {/* Date Navigation Component */}
      <DateNavigation 
        dates={sortedDates}
        currentIndex={visibleDateIndex} 
        onPrevious={goToPreviousDate}
        onNext={goToNextDate}
        onSelectDate={goToDate}
      />

      <AnimatePresence mode="wait">
        {sortedDates.map((date, dateIndex) => (
          dateIndex === visibleDateIndex && (
            <motion.div 
              key={date}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={fadeIn}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-4 bg-blue-50 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-blue-900">
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6"
                variants={staggerContainer}
              >
                {timeSlotsByDate[date].map(slot => {
                  const startTime = new Date(slot.start_time);
                  const endTime = new Date(slot.end_time);
                  const spotsLeft = slot.capacity - slot.booked_count;
                  const isFullyBooked = spotsLeft <= 0 || slot.status === 'fully_booked';
                  const isLowAvailability = spotsLeft <= 2 && spotsLeft > 0;
                  const isNoBookings = slot.booked_count === 0;
                  const isSelected = selectedSlot === slot.id;
                  const isWeatherBlocked = slot.status === 'weather_blocked';
                  
                  return (
                    <motion.div 
                      key={slot.id} 
                      className={`
                        relative overflow-hidden rounded-lg shadow-sm
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                        ${isFullyBooked ? 'opacity-75' : ''}
                        ${isWeatherBlocked ? 'bg-yellow-50' : 'bg-white'}
                        transition-all duration-200
                      `}
                      variants={fadeInUp}
                      whileHover={!isFullyBooked && !isWeatherBlocked ? { y: -4, scale: 1.02, transition: { duration: 0.2 } } : {}}
                    >
                      {/* Status Badges */}
                      {isFullyBooked && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          SOLD OUT
                        </div>
                      )}
                      {isLowAvailability && (
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          ALMOST FULL
                        </div>
                      )}
                      {isNoBookings && !isFullyBooked && !isWeatherBlocked && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          OPEN
                        </div>
                      )}
                      {isWeatherBlocked && (
                        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          WEATHER
                        </div>
                      )}

                      <div 
                        className={`
                          p-4 cursor-pointer
                          ${isFullyBooked || isWeatherBlocked ? 'cursor-not-allowed' : 'hover:bg-blue-50'}
                        `}
                        onClick={() => !isFullyBooked && !isWeatherBlocked && onSelectSlot(slot.id)}
                      >
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="font-bold text-gray-900">
                            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {" - "}
                            {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        <div className={`
                          flex items-center text-sm mt-2
                          ${isFullyBooked ? 'text-red-600 font-medium' : 
                            isLowAvailability ? 'text-orange-600 font-medium' : 
                            isNoBookings ? 'text-green-600 font-medium' : 
                            'text-gray-600'}
                        `}>
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          
                          {isWeatherBlocked ? (
                            <span>Unavailable</span>
                          ) : isFullyBooked ? (
                            <span>No spots left</span>
                          ) : (
                            <span>{spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} available</span>
                          )}
                        </div>
                        
                        {/* Additional info */}
                        {isWeatherBlocked && (
                          <div className="mt-3 text-xs text-gray-500 italic">
                            {slot.weather_status || "Canceled due to weather conditions"}
                          </div>
                        )}
                        
                        {/* Select Button (only for available slots) */}
                        {!isFullyBooked && !isWeatherBlocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSlot(slot.id);
                            }}
                            className={`
                              mt-3 w-full py-1.5 rounded-md text-sm font-medium transition-colors
                              ${isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                            `}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {/* No slots message when needed */}
              {timeSlotsByDate[date].length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-600">No time slots available for this date.</p>
                </div>
              )}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TimeSlotsList;