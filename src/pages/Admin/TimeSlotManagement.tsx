// components/admin/TimeSlotManagement.tsx - with Delete Functionality
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { timeSlotsApi } from "../../redux/apis/timeSlotsApi.ts";
import { TimeSlot, TimeSlotStatus } from "../../types.ts";
import { formatDateTimeRange } from "../../utils/dateFormatters.ts";

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Group time slots by date
const groupSlotsByDate = (timeSlots: TimeSlot[]) => {
  const grouped: Record<string, TimeSlot[]> = {};

  // Create a copy of the array to avoid mutating the frozen original
  [...timeSlots].sort((a, b) =>
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )
    .forEach((slot) => {
      const date = new Date(slot.start_time).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

  return grouped;
};

// Calculate date range for display
const getDateRangeText = (timeSlots: TimeSlot[]) => {
  if (timeSlots.length === 0) return "No time slots";

  const dates = timeSlots.map((slot) => new Date(slot.start_time).getTime());
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

const TimeSlotManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<TimeSlotStatus | "all">(
    "all",
  );
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [searchDate, setSearchDate] = useState("");
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  const { data: timeSlots = [], isLoading, refetch } = timeSlotsApi
    .useGetTimeSlotsQuery();
  const [blockTimeSlots] = timeSlotsApi.useBlockTimeSlotsDueToWeatherMutation();
  const [deleteTimeSlot, { isLoading: isDeleting }] = timeSlotsApi
    .useDeleteTimeSlotMutation();

  // Filter time slots by status and date
  const filteredTimeSlots = timeSlots
    .filter((slot) => {
      const matchesStatus = selectedStatus === "all" ||
        slot.status === selectedStatus;
      const slotDate = new Date(slot.start_time).toLocaleDateString();
      const matchesDate = selectedDate === "all" || slotDate === selectedDate;

      return matchesStatus && matchesDate;
    });

  // Group filtered slots by date
  const groupedTimeSlots = groupSlotsByDate(filteredTimeSlots);

  // Get unique dates for filter
  const uniqueDates = Object.keys(groupSlotsByDate(timeSlots)).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Modified delete handling for both normal and forced deletion
  const handleDeleteWithOptions = (slotId: string, force = false) => {
    const message = force 
      ? 'WARNING: Force delete will remove this time slot even if it has reservations. This could break data consistency. Are you absolutely sure?'
      : 'Are you sure you want to delete this time slot? This cannot be undone and will fail if there are any active reservations.';
      
    if (!window.confirm(message)) {
      return;
    }
    
    setDeletingSlotId(slotId);
    
    try {
      // Use the API to delete, with force parameter if needed
      const endpoint = force ? `${slotId}?force=true` : slotId;
      
      deleteTimeSlot(endpoint)
        .unwrap()
        .then(result => {
          if (result.success) {
            alert(force ? 'Time slot force deleted successfully' : 'Time slot deleted successfully');
            refetch(); // Make sure to refresh the data
          } else {
            alert(`Failed to delete time slot: ${result.message || 'Unknown error'}`);
          }
        })
        .catch(error => {
          console.error('Error deleting time slot:', error);
          alert('Failed to delete time slot. ' + (error.data?.error || 'Unknown error'));
        })
        .finally(() => {
          setDeletingSlotId(null);
        });
    } catch (error) {
      console.error('Error in delete process:', error);
      setDeletingSlotId(null);
      alert('An unexpected error occurred');
    }
  };

  // Handle weather block for a single time slot
  const handleWeatherBlock = async (slotId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to block this time slot due to weather conditions?",
      )
    ) {
      return;
    }

    try {
      await blockTimeSlots({
        slotIds: [slotId],
        weatherStatus: "Weather conditions unsuitable for parasailing",
      }).unwrap();

      refetch();
    } catch (error) {
      console.error("Failed to block time slot:", error);
      alert("Failed to block time slot");
    }
  };

  // Search for a specific date
  const handleDateSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchDate) {
      setSelectedDate("all");
      return;
    }

    // Try to parse the date
    try {
      const date = new Date(searchDate);
      const formattedDate = date.toLocaleDateString();

      if (uniqueDates.includes(formattedDate)) {
        setSelectedDate(formattedDate);
      } else {
        alert("No time slots found for the selected date");
      }
    } catch (error) {
      alert("Invalid date format");
    }
  };

  // Get badge color class based on time slot status
  const getStatusBadgeClasses = (status: TimeSlotStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "partially_booked":
        return "bg-yellow-100 text-yellow-800";
      case "fully_booked":
        return "bg-red-100 text-red-800";
      case "weather_blocked":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Time Slot Management
        </h1>
        <div className="flex space-x-3">
          <Link
            to="/management-console/time-slots/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Time Slots
          </Link>
          <Link
            to="/management-console/time-slots/weather"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            Weather Block
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e: any) =>
                  setSelectedStatus(e.target.value as TimeSlotStatus | "all")}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="partially_booked">Partially Booked</option>
                <option value="fully_booked">Fully Booked</option>
                <option value="weather_blocked">Weather Blocked</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="date-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <select
                id="date-filter"
                value={selectedDate}
                onChange={(e: any) => setSelectedDate(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form
            onSubmit={handleDateSearch}
            className="flex items-end space-x-2"
          >
            <div>
              <label
                htmlFor="date-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Date
              </label>
              <input
                type="date"
                id="date-search"
                value={searchDate}
                onChange={(e: any) => setSearchDate(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredTimeSlots.length} of {timeSlots.length}{" "}
          time slots. Date range: {getDateRangeText(filteredTimeSlots)}
        </div>
      </div>

      {/* Time Slots List */}
      {isLoading
        ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2">
            </div>
            <p className="text-gray-500">Loading time slots...</p>
          </div>
        )
        : filteredTimeSlots.length === 0
        ? (
          <div className="py-12 text-center bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-base font-medium text-gray-900">
              No time slots found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no time slots matching your filters. Try changing your
              filters or create new time slots.
            </p>
            <div className="mt-6">
              <Link
                to="/management-console/time-slots/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Time Slots
              </Link>
            </div>
          </div>
        )
        : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            {Object.entries(groupedTimeSlots).map(([date, slots]) => (
              <motion.div
                key={date}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {slots.map((slot) => {
                    const startTime = new Date(slot.start_time);
                    const endTime = new Date(slot.end_time);
                    const spotsLeft = slot.capacity - slot.booked_count;
                    const isFullyBooked = spotsLeft <= 0 ||
                      slot.status === "fully_booked";
                    const isLowAvailability = spotsLeft <= 2 && spotsLeft > 0;
                    const isNoBookings = slot.booked_count === 0;
                    const isWeatherBlocked = slot.status === "weather_blocked";

                    // Format the time display correctly
                    const formattedTimeRange = `${
                      startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    } - ${
                      endTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }`;

                    return (
                      <div key={slot.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-3 md:mb-0">
                            <p className="text-base font-medium text-gray-900">
                              {formattedTimeRange}
                            </p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  getStatusBadgeClasses(slot.status)
                                }`}
                              >
                                {slot.status.replace("_", " ").toUpperCase()}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {slot.booked_count} of {slot.capacity}{" "}
                                booked ({slot.capacity - slot.booked_count}{" "}
                                available)
                              </span>
                            </div>
                            {slot.weather_status && (
                              <p className="mt-1 text-sm text-blue-600">
                                {slot.weather_status}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/management-console/time-slots/${slot.id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View Bookings
                            </Link>
                            <Link
                              to={`/management-console/time-slots/${slot.id}/edit`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                            >
                              Edit
                            </Link>
                            {slot.status !== "weather_blocked" && (
                              <button
                                onClick={() => handleWeatherBlock(slot.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Weather Block
                              </button>
                            )}
                            
                            {/* Regular Delete Button */}
                            <button
                              onClick={() => handleDeleteWithOptions(slot.id, false)}
                              disabled={isDeleting && deletingSlotId === slot.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              {isDeleting && deletingSlotId === slot.id ? (
                                <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                              Delete
                            </button>
                            
                            {/* Force Delete Button */}
                            <button
                              onClick={() => handleDeleteWithOptions(slot.id, true)}
                              disabled={isDeleting && deletingSlotId === slot.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-800 hover:bg-red-900"
                              title="Force delete (use with caution)"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Force
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
    </div>
  );
};

export default TimeSlotManagement;