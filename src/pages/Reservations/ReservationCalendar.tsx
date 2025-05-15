// ReservationCalendar.tsx
import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../redux/store.ts";
import { Elements } from "@stripe/react-stripe-js";
import { timeSlotsApi } from "../../redux/apis/timeSlotsApi.ts";
import { reservationsApi } from "../../redux/apis/reservationsApi.ts";
import {
  BookingStep,
  resetBooking,
  setConfirmationDetails,
  setCurrentStep,
  setError,
  setPaymentInfo,
  setSelectedSlot,
  setSelectedTimeSlot,
  updateFormData,
} from "../../redux/slices/bookingSlice.ts";
import TimeSlotsList from "./TimeSlotsList.tsx";
import CustomerForm from "./CustomerForm.tsx";
import PaymentForm from "./PaymentForm.tsx";
import { formatDateTimeRange } from "../../utils/dateFormatters.ts";
import { stripePromise } from "../../stripeConfig.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../../Components/Footer.tsx";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const ReservationCalendar: React.FC = () => {
  // Refs for scrolling
  const selectedTimeRef = useRef<any>(null);

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Redux hooks
  const dispatch = useAppDispatch();
  const {
    currentStep,
    selectedSlot,
    selectedTimeSlot,
    formData,
    paymentInfo,
    confirmationDetails,
    error,
  } = useAppSelector((state) => state.booking);

  // RTK Query hooks
  const { data: timeSlots = [], isLoading, refetch } = timeSlotsApi
    .useGetTimeSlotsQuery();
  const [createReservation, { isLoading: isCreatingReservation }] =
    reservationsApi.useCreateReservationMutation();
  const [confirmReservation, { isLoading: isConfirmingReservation }] =
    reservationsApi.useConfirmReservationMutation();

  // Scroll to selected time section when a time slot is selected
  useEffect(() => {
    if (selectedSlot && selectedTimeRef.current) {
      selectedTimeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedSlot, selectedTimeSlot]);

  // Sync URL with booking step
  useEffect(() => {
    // Extract step from URL
    const path = location.pathname;
    const pathParts = path.split("/");

    if (pathParts.includes("book")) {
      const stepIndex = pathParts.indexOf("book") + 1;
      const step = pathParts[stepIndex];

      // Map URL path to booking step
      if (step === "time") {
        dispatch(setCurrentStep("select-time"));
      } else if (step === "info") {
        dispatch(setCurrentStep("customer-info"));
      } else if (step === "payment") {
        dispatch(setCurrentStep("payment"));
      } else if (step === "confirmation") {
        dispatch(setCurrentStep("confirmation"));
      }

      // Extract slot ID from query params
      const searchParams = new URLSearchParams(location.search);
      const slotId = searchParams.get("slot");
      if (slotId && slotId !== selectedSlot) {
        dispatch(setSelectedSlot(slotId));
      }
    }
  }, [location.pathname, location.search]);

  // Update selected time slot when selectedSlot changes
  useEffect(() => {
    if (selectedSlot) {
      const timeSlot = timeSlots.find((slot) => slot.id === selectedSlot);
      dispatch(setSelectedTimeSlot(timeSlot || null));
    } else {
      dispatch(setSelectedTimeSlot(null));
    }
  }, [selectedSlot, timeSlots, dispatch]);

  // Handle URL changes based on booking step
  useEffect(() => {
    let path = "/reservations/book";
    let query = "";

    switch (currentStep) {
      case "select-time":
        path += "/time";
        break;
      case "customer-info":
        path += "/info";
        if (selectedSlot) {
          query = `?slot=${selectedSlot}`;
        }
        break;
      case "payment":
        path += "/payment";
        if (selectedSlot) {
          query = `?slot=${selectedSlot}`;
        }
        break;
      case "confirmation":
        path += "/confirmation";
        break;
    }

    const fullPath = path + query;
    if (location.pathname + location.search !== fullPath) {
      navigate(fullPath, { replace: true });
    }
  }, [currentStep, selectedSlot]);

  const handleSelectSlot = (id: string) => {
    dispatch(setSelectedSlot(id));
    dispatch(setCurrentStep("select-time"));
  };

  const handleFormInputChange = (
    name: string,
    value: string | number | boolean,
  ) => {
    dispatch(updateFormData({ name, value }));
  };

  const handleCustomerFormSubmit = async () => {
    dispatch(setError(null));

    try {
      console.log("Submitting customer form data:", formData);

      // Create a pending reservation
      const result = await createReservation({
        ...formData,
      }).unwrap();

      console.log("Received response from API call:", result);

      // Check if we received a valid response with clientSecret
      if (!result || typeof result !== "object") {
        console.error("Invalid result type:", typeof result);
        throw new Error("Empty or invalid response from server");
      }

      // Move to payment step with the client secret
      dispatch(setPaymentInfo({
        clientSecret: result.clientSecret,
        amount: result.amount,
      }));

      dispatch(setCurrentStep("payment"));
    } catch (err) {
      console.error("Error creating reservation:", err);
      // Handle RTK Query error format
      if (typeof err === "object" && err !== null && "status" in err) {
        if (err.status === 404) {
          dispatch(
            setError(
              "Server endpoint not found. Please check your API configuration.",
            ),
          );
        } else {
          dispatch(
            setError(`Server error (${err.status}). Please try again later.`),
          );
        }
      } else {
        dispatch(
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred",
          ),
        );
      }
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    dispatch(setError(null));

    try {
      console.log("Payment successful with ID:", paymentIntentId);

      // Confirm the reservation with the payment intent ID
      const result = await confirmReservation({
        paymentIntentId,
        reservationData: formData,
      }).unwrap();

      // Store confirmation details and move to confirmation step
      dispatch(setConfirmationDetails(result));
      dispatch(setCurrentStep("confirmation"));

      // Refresh available time slots
      refetch();
    } catch (err) {
      console.error("Error confirming reservation:", err);

      // More detailed error handling
      if (typeof err === "object" && err !== null && "status" in err) {
        if (err.status === 404) {
          dispatch(
            setError(
              "Server endpoint not found. Please check your API configuration.",
            ),
          );
        } else {
          dispatch(
            setError(`Server error (${err.status}). Please try again later.`),
          );
        }
      } else {
        dispatch(setError(
          "The payment was successful, but we had trouble confirming your reservation. " +
            "Please contact us with your payment ID: " + paymentIntentId,
        ));
      }
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    dispatch(setError(`Payment error: ${errorMessage}`));
  };

  const handleStepChange = (step: BookingStep) => {
    dispatch(setCurrentStep(step));
  };

  const handleRestart = () => {
    // Reset all state and start over
    dispatch(resetBooking());
    // Refresh available time slots
    refetch();
  };

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "select-time":
        return (
          <motion.div
            key="select-time"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-bold text-blue-900 mb-6 text-center"
            >
              Select Your Parasailing Time
            </motion.h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <TimeSlotsList
              timeSlots={timeSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSelectSlot}
              isLoading={isLoading}
            />

            {selectedTimeSlot && (
              <motion.div
                ref={selectedTimeRef}
                className="mt-6 bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-bold text-xl text-blue-900 mb-3">
                  Selected Time:
                </h3>
                <p className="text-blue-800 mb-3 text-lg">
                  {formatDateTimeRange(
                    selectedTimeSlot.start_time,
                    selectedTimeSlot.end_time,
                  )}
                </p>
                <p className="text-blue-700 mb-5">
                  {selectedTimeSlot.capacity - selectedTimeSlot.booked_count}
                  {" "}
                  spots available
                </p>
                <motion.button
                  className="w-full py-4 px-6 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md hover:shadow-lg transition-all"
                  onClick={() => handleStepChange("customer-info")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue with This Time
                  <svg
                    className="ml-2 -mr-1 h-5 w-5 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        );

      case "customer-info":
        return (
          <motion.div
            key="customer-info"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-bold text-blue-900 mb-6 text-center"
            >
              Book Your Parasailing Adventure
            </motion.h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedTimeSlot && (
              <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-5 flex flex-wrap items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Selected Time:
                  </h3>
                  <p className="text-blue-800 font-semibold">
                    {formatDateTimeRange(
                      selectedTimeSlot.start_time,
                      selectedTimeSlot.end_time,
                    )}
                  </p>
                </div>
                <motion.button
                  className="mt-2 sm:mt-0 py-2 px-4 border border-blue-300 text-sm font-semibold rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                  onClick={() => handleStepChange("select-time")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-4 h-4 mr-1 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Change Time
                </motion.button>
              </div>
            )}

            <CustomerForm
              formData={formData}
              onChange={handleFormInputChange}
              onSubmit={handleCustomerFormSubmit}
              isProcessing={isCreatingReservation}
              availableCapacity={selectedTimeSlot
                ? (selectedTimeSlot.capacity - selectedTimeSlot.booked_count)
                : 0}
            />
          </motion.div>
        );

      case "payment":
        if (!paymentInfo || !paymentInfo.clientSecret) {
          return (
            <div className="p-6 text-center">
              <p className="text-red-600">
                Payment information not available. Please try again.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleStepChange("customer-info")}
              >
                Go Back
              </button>
            </div>
          );
        }

        // Log for debugging
        console.log("Rendering payment step with:", {
          hasClientSecret: !!paymentInfo.clientSecret,
          amount: paymentInfo.amount,
          stripePromise:  stripePromise,
        });

        return (
          <motion.div
            key="payment"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-bold text-blue-900 mb-6 text-center"
            >
              Complete Your Booking
            </motion.h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedTimeSlot && (
              <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  Booking Summary:
                </h3>
                <div className="border-t border-gray-200 pt-3">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Date/Time:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2 font-medium">
                        {formatDateTimeRange(
                          selectedTimeSlot.start_time,
                          selectedTimeSlot.end_time,
                        )}
                      </dd>
                    </div>
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Name:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {formData.customer_name}
                      </dd>
                    </div>
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Email:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {formData.customer_email}
                      </dd>
                    </div>
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Parasailers:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {formData.number_of_people}{" "}
                        (${Number(formData.number_of_people) * 99})
                      </dd>
                    </div>
                    {formData.riders && formData.riders > 0 && (
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Boat Riders:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {formData.riders} (${Number(formData.riders) * 30})
                        </dd>
                      </div>
                    )}
                    {formData.photo_package && (
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Photo Package:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          $30
                        </dd>
                      </div>
                    )}
                    {formData.go_pro_package && (
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          GoPro Package:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          $30
                        </dd>
                      </div>
                    )}
                    {formData.tshirts && formData.tshirts > 0 && (
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          T-Shirts:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {formData.tshirts} (${Number(formData.tshirts) * 50})
                        </dd>
                      </div>
                    )}
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Total:
                      </dt>
                      <dd className="text-base font-bold text-blue-800 col-span-2">
                        ${paymentInfo
                          ? (paymentInfo.amount / 100).toFixed(2)
                          : 0}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Stripe Elements Provider */}
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: paymentInfo?.clientSecret || "" }}
            >
              <PaymentForm
                clientSecret={paymentInfo.clientSecret}
                amount={paymentInfo.amount}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                onCancel={() => handleStepChange("customer-info")}
              />
            </Elements>
          </motion.div>
        );

      case "confirmation":
        return (
          <motion.div
            key="confirmation"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-bold text-blue-900 mb-6 text-center"
            >
              Booking Confirmed!
            </motion.h2>

            <motion.div
              className="w-20 h-20 rounded-full bg-green-500 mx-auto mb-6 flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            {confirmationDetails && selectedTimeSlot && (
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-800 mb-6">
                  Thank you,{" "}
                  {formData.customer_name}! Your parasailing adventure is
                  booked.
                </p>

                <motion.div
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">
                    Booking Details:
                  </h3>
                  <dl className="divide-y divide-gray-200 text-left">
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Date/Time:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2 font-semibold">
                        {formatDateTimeRange(
                          selectedTimeSlot.start_time,
                          selectedTimeSlot.end_time,
                        )}
                      </dd>
                    </div>
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Confirmation #:
                      </dt>
                      <dd className="text-sm font-mono text-gray-900 col-span-2 font-semibold">
                        {confirmationDetails.reservation.id.substring(0, 8)
                          .toUpperCase()}
                      </dd>
                    </div>
                    <div className="py-3 grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Paid:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2 font-semibold">
                        ${paymentInfo
                          ? (paymentInfo.amount / 100).toFixed(2)
                          : 0}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      What's Next:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-3">
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div>
                          <span>A confirmation email has been sent to</span>
                          &nbsp;
                          <span className="font-semibold">
                            {formData.customer_email}
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div>
                          <span>Please arrive</span>
                          &nbsp;
                          <span className="font-semibold">30 minutes</span>
                          &nbsp;
                          <span>before your scheduled time</span>
                        </div>
                      </li>

                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Bring swimwear, a towel, and sunscreen
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Our staff will provide all necessary safety equipment
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.button
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  onClick={handleRestart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Book Another Adventure
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
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
                </motion.button>
              </div>
            )}
          </motion.div>
        );

      default:
        return <div>Something went wrong. Please refresh the page.</div>;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Mini Banner Section */}

      {/* Mini Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 md:py-20 mb-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-full h-full bg-black opacity-30"></div>
          {/* Background image */}
          <img
            src="/FlatheadAerial.jpg"
            alt="Parasailing on Flathead Lake"
            className="w-full h-full object-cover"
          />
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
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-amber-400 font-bold uppercase tracking-widest mb-2"
            >
              Parasailing Reservations
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-3"
            >
              Book Your Adventure
            </motion.h1>
          </motion.div>
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
      {/* Progress indicator */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <nav aria-label="Progress" className="mb-8">
          <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {[
              { name: "Select Time", step: "select-time", number: 1 },
              { name: "Your Details", step: "customer-info", number: 2 },
              { name: "Payment", step: "payment", number: 3 },
              { name: "Confirmation", step: "confirmation", number: 4 },
            ].map((stepItem) => {
              const isCurrent = currentStep === stepItem.step;
              const isComplete = (stepItem.step === "select-time" &&
                currentStep !== "select-time") ||
                (stepItem.step === "customer-info" &&
                  (currentStep === "payment" ||
                    currentStep === "confirmation")) ||
                (stepItem.step === "payment" && currentStep === "confirmation");

              return (
                <li key={stepItem.name} className="md:flex-1">
                  <div
                    className={`
                    group pl-4 py-2 flex flex-col border-l-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0
                    ${
                      isCurrent
                        ? "border-blue-600"
                        : isComplete
                        ? "border-green-500"
                        : "border-gray-200"
                    }
                  `}
                  >
                    <span
                      className={`
                      text-xs font-semibold tracking-wide uppercase
                      ${
                        isCurrent
                          ? "text-blue-600"
                          : isComplete
                          ? "text-green-500"
                          : "text-gray-500"
                      }
                    `}
                    >
                      Step {stepItem.number}
                    </span>
                    <span className="text-sm font-medium">
                      {stepItem.name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Current step content */}
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default ReservationCalendar;
