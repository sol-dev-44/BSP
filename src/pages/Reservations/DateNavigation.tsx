// components/DateNavigation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateNavigationProps {
  dates: string[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectDate: (date: string) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  dates,
  currentIndex,
  onPrevious,
  onNext,
  onSelectDate,
}) => {
  // State for modal instead of dropdown
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Close the modal when clicking outside or with escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get current date text
  const currentDateText = dates[currentIndex] ? formatDate(dates[currentIndex]) : "Select Date";
  
  // Group dates by month for better organization and sort within each month
  const groupedDates = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    dates.forEach(date => {
      const dateObj = new Date(date);
      const monthYear = dateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(date);
    });
    
    // Sort dates within each month group
    Object.keys(groups).forEach(monthYear => {
      groups[monthYear].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    });
    
    return groups;
  }, [dates]);

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg overflow-hidden">
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

      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`
              p-2 rounded-full focus:outline-none transition-all duration-200
              ${currentIndex === 0 
                ? "text-blue-200 cursor-not-allowed opacity-50" 
                : "text-white hover:bg-white hover:bg-opacity-20"}
            `}
            aria-label="Previous date"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-800 bg-opacity-30 hover:bg-opacity-40 border border-white border-opacity-30 rounded-full focus:outline-none transition-colors duration-200"
          >
            <span className="font-medium text-white">
              {currentDateText}
            </span>
            <svg className="w-4 h-4 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex >= dates.length - 1}
            className={`
              p-2 rounded-full focus:outline-none transition-all duration-200
              ${currentIndex >= dates.length - 1 
                ? "text-blue-200 cursor-not-allowed opacity-50" 
                : "text-white hover:bg-white hover:bg-opacity-20"}
            `}
            aria-label="Next date"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Date Pills for Larger Screens */}
        <div className="hidden md:flex flex-wrap mt-4 gap-2 pb-1">
          {dates.slice(0, 7).map((date, index) => (
            <button
              key={date}
              onClick={() => onSelectDate(date)}
              className={`
                px-4 py-1.5 text-sm rounded-full transition-colors duration-200
                ${currentIndex === index 
                  ? "bg-amber-500 text-white font-medium shadow-md" 
                  : "bg-blue-800 bg-opacity-30 hover:bg-opacity-50 text-white border border-white border-opacity-30"}
              `}
            >
              {formatDate(date)}
            </button>
          ))}
          {dates.length > 7 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 text-sm rounded-full bg-blue-800 bg-opacity-30 hover:bg-opacity-50 text-white border border-white border-opacity-30"
            >
              More dates...
            </button>
          )}
        </div>
      </div>

      {/* Wave separator */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 40">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,32L80,26.7C160,21,320,11,480,10.7C640,11,800,21,960,21.3C1120,21,1280,11,1360,5.3L1440,0L1440,40L1360,40C1280,40,1120,40,960,40C800,40,640,40,480,40C320,40,160,40,80,40L0,40Z"
          >
          </path>
        </svg>
      </div>

      {/* Date Selection Modal - Replacing the problematic dropdown */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black bg-opacity-50"
            />
            
            {/* Modal content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-900">Select Date</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Scrollable content */}
              <div className="overflow-y-auto p-4 flex-grow">
                {Object.entries(groupedDates).map(([monthYear, monthDates]) => (
                  <div key={monthYear} className="mb-6 last:mb-0">
                    <h4 className="text-md font-medium text-gray-700 mb-2">{monthYear}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {monthDates.map((date) => {
                        const isCurrentDate = dates.indexOf(date) === currentIndex;
                        return (
                          <button
                            key={date}
                            onClick={() => {
                              onSelectDate(date);
                              setIsModalOpen(false);
                            }}
                            className={`
                              px-4 py-3 text-sm rounded-lg transition-colors duration-200 font-medium
                              ${isCurrentDate 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"}
                            `}
                          >
                            {formatDate(date)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateNavigation;