import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  DateLocalizer,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";
import { format, parseISO } from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Create a default localizer using moment.js
const defaultLocalizer = momentLocalizer(moment);

// Define types for our data structures
interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  status: "available" | "partially_booked" | "fully_booked";
  weather_status: string | null;
  created_at: string;
  updated_at: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  status: string;
  capacity: number;
  booked_count: number;
  weather_status: string | null;
  resource: TimeSlot;
}

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  riders: number;
  tshirts: number;
  photo_package: boolean;
  go_pro_package: boolean;
  time_slot_id: string;
}

interface ApiResponse {
  payment_amount: number;
  expires_at: string;
  [key: string]: any; // Allow for other properties
}

interface ParasailCalendarProps {
  localizer?: DateLocalizer;
}

const ParasailCalendar: React.FC<ParasailCalendarProps> = (
  { localizer = defaultLocalizer },
) => {
  // Verify the localizer is valid
  useEffect(() => {
    if (!localizer || !localizer.formats) {
      console.error(
        "Invalid localizer provided to ParasailCalendar component. Using default localizer.",
      );
    }
  }, [localizer]);
  // State management
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // Refs for scrolling
  const formRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    number_of_people: 1,
    riders: 0,
    tshirts: 0,
    photo_package: false,
    go_pro_package: false,
    time_slot_id: "",
  });

  const fixTimezonesToMountain = (utcDateString:string) => {
    // Parse the date string
    const date = new Date(utcDateString);

    // Create a formatter that will display the time in Mountain Time
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Denver",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Get the formatted date/time string
    const mountainTimeString = formatter.format(date);

    // For debugging
    console.log(`UTC: ${utcDateString} → Mountain: ${mountainTimeString}`);

    return date;
  };

  // Fetch time slots (mock implementation - replace with your actual API call)
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        // Simulating API call - replace with your actual fetch
        const response = await fetch("/api/time-slots");
        if (!response.ok) throw new Error("Failed to fetch time slots");
        const data = await response.json();
        setTimeSlots(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load time slots",
        );
        console.error("Error fetching time slots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSlots();
  }, []);

  // Convert UTC dates to local dates properly
  const convertUTCToLocal = (utcDateString: string) => {
    return fixTimezonesToMountain(utcDateString);
  };

  // Format time slots into calendar events
  useEffect(() => {
    if (timeSlots.length > 0) {
      const events = formatCalendarEvents(timeSlots);
      setCalendarEvents(events);
    }
  }, [timeSlots]);

  // Format calendar events from API data
  const formatCalendarEvents = (slots: TimeSlot[]): CalendarEvent[] => {
    if (!slots || slots.length === 0) return [];

    return slots.map((slot) => {
      // Convert UTC times to local time
      const startDate = convertUTCToLocal(slot.start_time);
      const endDate = convertUTCToLocal(slot.end_time);

      // Determine color based on status
      let backgroundColor: string;
      switch (slot.status) {
        case "available":
          backgroundColor = "#4ade80"; // green
          break;
        case "partially_booked":
          backgroundColor = "#facc15"; // yellow
          break;
        case "fully_booked":
          backgroundColor = "#f87171"; // red
          break;
        default:
          backgroundColor = slot.weather_status ? "#94a3b8" : "#4ade80"; // grey for weather blocked, green default
      }

      // Determine title based on status and availability
      let title: string;
      if (slot.weather_status) {
        title = "Weather Blocked";
      } else if (slot.status === "fully_booked") {
        title = "Fully Booked";
      } else {
        const availableSpots = slot.capacity - slot.booked_count;
        title = `${availableSpots} spots available`;
      }

      return {
        id: slot.id,
        title: title,
        start: startDate,
        end: endDate,
        backgroundColor,
        status: slot.status,
        capacity: slot.capacity,
        booked_count: slot.booked_count,
        weather_status: slot.weather_status,
        resource: slot, // Keep the original slot data for reference
      };
    });
  };

  // Event handler when slot is selected
  const handleSelectEvent = (event: CalendarEvent): void => {
    // The event contains the full data from the original time slot
    const selectedTimeSlot = event.resource;

    if (
      selectedTimeSlot.status === "fully_booked" ||
      selectedTimeSlot.weather_status
    ) {
      setError("This time slot is not available for booking.");
      setShowForm(false);
      return;
    }

    setSelectedSlot(selectedTimeSlot);
    setShowForm(true);
    setError(null);

    // Reset form data with default values and appropriate limits
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      number_of_people: 1,
      riders: 0,
      tshirts: 0,
      photo_package: false,
      go_pro_package: false,
      time_slot_id: selectedTimeSlot.id,
    });

    // Scroll to form
    if (formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as any;

    setFormData({
      ...formData,
      [name]: type === "checkbox"
        ? (e.target as any).checked
        : type === "number"
        ? parseInt(value, 10)
        : value,
    });
  };

  // Calculate price
  const calculatePrice = (): number => {
    let total = 0;
    total += formData.number_of_people * 99; // $99 per parasailer
    total += formData.riders * 30; // $30 per ride-along
    total += formData.tshirts * 50; // $50 per t-shirt
    if (formData.photo_package) total += 30;
    if (formData.go_pro_package) total += 30;
    return total;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/reservations/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `API Error: ${response.status}`);
      }

      const responseData = await response.json();
      setApiResponse(responseData);

      // Scroll to response using ref
      if (responseRef.current) {
        setTimeout(() => {
          responseRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to create reservation:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Create a formatter for Mountain Time
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Denver",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formatter.format(date);
  };

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.backgroundColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "black",
        border: "0px",
        display: "block",
        fontWeight: "bold",
        fontSize: "14px",
        textAlign: "center" as "center",
        whiteSpace: "nowrap" as "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 mb-8">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-center">
            Big Sky Parasailing Reservations
          </h1>
          <p className="text-xl text-center text-blue-50 max-w-3xl mx-auto">
            Select your preferred time and complete your booking in just a few steps
          </p>
        </div>
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            >
            </path>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow mb-6 flex items-start">
            <svg
              className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Calendar view */}
        <div className="mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                Available Parasailing Times
              </h2>
              <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                <button
                  onClick={() => setCalendarView(Views.DAY)}
                  className={`px-5 py-2 rounded-md font-medium transition-all ${
                    calendarView === Views.DAY
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setCalendarView(Views.WEEK)}
                  className={`px-5 py-2 rounded-md font-medium transition-all ${
                    calendarView === Views.WEEK
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setCalendarView(Views.MONTH)}
                  className={`px-5 py-2 rounded-md font-medium transition-all ${
                    calendarView === Views.MONTH
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            {loading && timeSlots.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-96 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-700">Loading available time slots...</p>
              </div>
            ) : (
              <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
                <Calendar
                  localizer={localizer}
                  getNow={() => new Date()}
                  dayLayoutAlgorithm="no-overlap"
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  views={[Views.DAY, Views.WEEK, Views.MONTH]}
                  view={calendarView}
                  onView={(view: View) => setCalendarView(view)}
                  selectable={false}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  defaultDate={new Date()}
                  min={new Date(new Date().setHours(9, 0, 0))}
                  max={new Date(new Date().setHours(20, 0, 0))}
                  step={60}
                  timeslots={1}
                  toolbar={true}
                  popup={true}
                />
              </div>
            )}

            <div className="flex flex-wrap mt-5 px-2 gap-4">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-md bg-[#4ade80] mr-2"></div>
                <span className="text-gray-700">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-md bg-[#facc15] mr-2"></div>
                <span className="text-gray-700">Partially Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-md bg-[#f87171] mr-2"></div>
                <span className="text-gray-700">Fully Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-md bg-[#94a3b8] mr-2"></div>
                <span className="text-gray-700">Weather Blocked</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-lg inline-flex items-center">
              <svg
                className="w-5 h-5 text-blue-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text-gray-700">Click on an available time slot to make a reservation</p>
            </div>
          </div>
        </div>

        {/* Selected slot info */}
        {selectedSlot && showForm && (
          <div className="mb-8 bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-md">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Selected Time Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Date & Time</p>
                  <p className="text-blue-800 font-medium">
                    {formatDate(selectedSlot.start_time)} to{" "}
                    {new Date(selectedSlot.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Available Spots</p>
                  <p className="text-blue-800 font-medium">
                    {selectedSlot.capacity - selectedSlot.booked_count} of{" "}
                    {selectedSlot.capacity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reservation form */}
        {selectedSlot && showForm && (
          <div
            ref={formRef}
            className="mb-12 bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Make Your Reservation</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Customer info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Full Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      required
                      placeholder="(555) 555-5555"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

              {/* Parasail options */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      ></path>
                    </svg>
                  </div>
                  Parasailing Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-gray-700 mb-1.5 font-semibold">
                      Parasailers
                    </label>
                    <div className="flex items-center mb-2">
                      <span className="text-amber-500 font-bold mr-2">$99</span>
                      <span className="text-gray-500 text-sm">per person</span>
                    </div>
                    <input
                      type="number"
                      name="number_of_people"
                      value={formData.number_of_people}
                      onChange={handleInputChange}
                      min="1"
                      max={selectedSlot.capacity - selectedSlot.booked_count}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      People who will parasail
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-gray-700 mb-1.5 font-semibold">
                      Riders
                    </label>
                    <div className="flex items-center mb-2">
                      <span className="text-amber-500 font-bold mr-2">$30</span>
                      <span className="text-gray-500 text-sm">per person</span>
                    </div>
                    <input
                      type="number"
                      name="riders"
                      value={formData.riders}
                      onChange={handleInputChange}
                      min="0"
                      max={selectedSlot.capacity - selectedSlot.booked_count -
                        formData.number_of_people}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      People who will ride along in boat
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-gray-700 mb-1.5 font-semibold">
                      T-shirts
                    </label>
                    <div className="flex items-center mb-2">
                      <span className="text-amber-500 font-bold mr-2">$50</span>
                      <span className="text-gray-500 text-sm">per shirt</span>
                    </div>
                    <input
                      type="number"
                      name="tshirts"
                      value={formData.tshirts}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Big Sky Parasail T-shirts
                    </p>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  Add-ons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        name="photo_package"
                        checked={formData.photo_package}
                        onChange={handleInputChange}
                        className="h-6 w-6 mt-1 mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-800">Photo Package</span>
                          <span className="ml-2 text-amber-500 font-bold">$30</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Professional photos of your parasailing experience
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        name="go_pro_package"
                        checked={formData.go_pro_package}
                        onChange={handleInputChange}
                        className="h-6 w-6 mt-1 mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-800">GoPro Package</span>
                          <span className="ml-2 text-amber-500 font-bold">$30</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Video recording of your parasailing adventure
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price calculation */}
              <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  Reservation Summary
                </h3>
                <div className="divide-y divide-blue-200">
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-700">Parasailers ({formData.number_of_people} × $99)</span>
                    <span className="font-medium">${formData.number_of_people * 99}</span>
                  </div>
                  {formData.riders > 0 && (
                    <div className="py-3 flex justify-between">
                      <span className="text-gray-700">Riders ({formData.riders} × $30)</span>
                      <span className="font-medium">${formData.riders * 30}</span>
                    </div>
                  )}
                  {formData.photo_package && (
                    <div className="py-3 flex justify-between">
                      <span className="text-gray-700">Photo Package</span>
                      <span className="font-medium">$30</span>
                    </div>
                  )}
                  {formData.go_pro_package && (
                    <div className="py-3 flex justify-between">
                      <span className="text-gray-700">GoPro Package</span>
                      <span className="font-medium">$30</span>
                    </div>
                  )}
                  {formData.tshirts > 0 && (
                    <div className="py-3 flex justify-between">
                      <span className="text-gray-700">T-shirts ({formData.tshirts} × $50)</span>
                      <span className="font-medium">${formData.tshirts * 50}</span>
                    </div>
                  )}
                  <div className="py-3 flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">${calculatePrice()}</span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:bg-gray-400 text-lg transition-all transform hover:-translate-y-1"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Continue to Payment
                      <svg
                        className="w-5 h-5 ml-2 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* API Response */}
        {apiResponse && (
          <div
            ref={responseRef}
            className="mb-8 bg-white p-6 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 -m-6 mb-6 p-6">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Reservation Created</h2>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200 mb-6">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-lg">
                    Your reservation is being held for 15 minutes while you complete
                    payment.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(apiResponse.payment_amount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expires at</p>
                      <p className="text-lg font-medium text-gray-800">
                        {apiResponse.expires_at
                          ? new Date(apiResponse.expires_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Complete your booking by proceeding to payment</p>
                <p className="text-gray-700">Your reservation will be confirmed once payment is processed.</p>
              </div>
              <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all whitespace-nowrap flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
                Proceed to Payment
              </button>
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                View API Response Details
              </summary>
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-80 mt-2 text-sm font-mono">
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParasailCalendar;