// components/DateNavigation.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface DateNavigationProps {
  dates: string[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectDate: (date: string) => void;
}

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

const DateNavigation: React.FC<DateNavigationProps> = ({
  dates,
  currentIndex,
  onPrevious,
  onNext,
  onSelectDate,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<any>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as any)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Convert date strings to Date objects for the calendar
  const dateObjects = dates.map((dateStr) => new Date(dateStr));

  // Get the current date for highlighting
  const currentDate = dates[currentIndex]
    ? new Date(dates[currentIndex])
    : new Date();

  // Find min and max dates for the calendar
  const minDate = dateObjects.length > 0
    ? new Date(Math.min(...dateObjects.map((d) => d.getTime())))
    : new Date();
  const maxDate = dateObjects.length > 0
    ? new Date(Math.max(...dateObjects.map((d) => d.getTime())))
    : new Date();

  return (
    <motion.div
      className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
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
              ${
              currentIndex === 0
                ? "text-blue-200 cursor-not-allowed opacity-50"
                : "text-white hover:bg-white hover:bg-opacity-20"
            }
            `}
            aria-label="Previous date"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center px-5 py-2.5 bg-blue-800 bg-opacity-30 hover:bg-opacity-40 border border-white border-opacity-30 rounded-full focus:outline-none transition-colors duration-200"
            >
              <span className="font-medium text-white">
                {dates[currentIndex]
                  ? new Date(dates[currentIndex]).toLocaleDateString(
                    undefined,
                    { weekday: "short", month: "short", day: "numeric" },
                  )
                  : "Select Date"}
              </span>
              <svg
                className="w-4 h-4 ml-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Calendar Dropdown */}
            // Replace the entire calendar dropdown code in DateNavigation.tsx
            with this:

            {isCalendarOpen && (
              <div
                ref={calendarRef}
                className="absolute z-20 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 right-0 w-64"
                style={{
                  maxHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="p-3 text-sm font-medium text-center border-b border-gray-200 text-gray-700 bg-white">
                  Select a date
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: "350px" }}>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {dates.map((date, index) => (
                      <button
                        key={date}
                        onClick={() => {
                          onSelectDate(date);
                          setIsCalendarOpen(false);
                        }}
                        className={`
              px-3 py-2.5 text-sm rounded-md transition-colors duration-200
              ${
                          currentIndex === index
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }
            `}
                      >
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={currentIndex >= dates.length - 1}
            className={`
              p-2 rounded-full focus:outline-none transition-all duration-200
              ${
              currentIndex >= dates.length - 1
                ? "text-blue-200 cursor-not-allowed opacity-50"
                : "text-white hover:bg-white hover:bg-opacity-20"
            }
            `}
            aria-label="Next date"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Date Pills for Desktop */}
        <div className="hidden md:flex flex-wrap mt-4 gap-2 pb-1">
          {dates.map((date, index) => (
            <button
              key={date}
              onClick={() => onSelectDate(date)}
              className={`
        px-4 py-1.5 text-sm rounded-full transition-colors duration-200
        ${
                currentIndex === index
                  ? "bg-amber-500 text-white font-medium shadow-md"
                  : "bg-blue-800 bg-opacity-30 hover:bg-opacity-50 text-white border border-white border-opacity-30"
              }
      `}
            >
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </button>
          ))}
          {dates.length > 7 && (
            <button
              onClick={() => setIsCalendarOpen(true)}
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
    </motion.div>
  );
};

export default DateNavigation;
