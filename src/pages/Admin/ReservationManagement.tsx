// components/admin/ReservationManagement.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDateTimeRange } from "../../utils/dateFormatters.ts";
import { reservationsApi } from "../../redux/apis/reservationsApi.ts";
import { Reservation, ReservationStatus, TimeSlot } from "../../types.ts";
import ReservationActionModal from "./ReservationActionModal.tsx";

type FilterStatus = ReservationStatus | "all";

// Extended type for reservations with joined time slot data
interface ReservationWithTimeSlot extends Reservation {
  time_slot?: TimeSlot;
  time_slots?: TimeSlot;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
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

const ReservationManagement: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(
    null,
  );
  const [actionType, setActionType] = useState<"cancel" | "complete" | null>(
    null,
  );

  const itemsPerPage = 10;

  const { data: reservations = [], isLoading, refetch } = reservationsApi
    .useGetAllReservationsQuery();
  const [cancelReservation, { isLoading: isCancelling }] = reservationsApi
    .useCancelReservationMutation();
  const [completeReservation, { isLoading: isCompleting }] = reservationsApi
    .useCompleteReservationMutation();

  // Filter and search reservations
  const filteredReservations = (reservations as ReservationWithTimeSlot[])
    .filter((res) => filter === "all" || res.status === filter)
    .filter((res) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        res.customer_name?.toLowerCase().includes(term) ||
        res.customer_email?.toLowerCase().includes(term) ||
        res.id?.toLowerCase().includes(term)
      );
    });

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log('Reservation data structure:', paginatedReservations[0]);

  const handleCancelInitiate = (id: string) => {
    setSelectedReservation(id);
    setActionType("cancel");
    setModalOpen(true);
  };

  const handleCompleteInitiate = (id: string) => {
    setSelectedReservation(id);
    setActionType("complete");
    setModalOpen(true);
  };

  const handleCancel = async (reason: string) => {
    if (!selectedReservation) return;

    try {
      await cancelReservation({
        id: selectedReservation,
        reason,
      }).unwrap();

      setModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to cancel reservation", error);
      alert("Failed to cancel reservation");
    }
  };

  const handleComplete = async () => {
    if (!selectedReservation) return;

    try {
      await completeReservation(selectedReservation).unwrap();
      setModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to complete reservation", error);
      alert("Failed to mark reservation as completed");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReservation(null);
    setActionType(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Reservation Management
        </h1>
        <Link
          to="/management-console/reservations/create"
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
          Create Reservation
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-1/3">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name or email"
                type="search"
                value={searchTerm}
                onChange={(e: any) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "confirmed"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
              onClick={() => setFilter("confirmed")}
            >
              Confirmed
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "cancelled"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
              onClick={() => setFilter("cancelled")}
            >
              Cancelled
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          {isLoading
            ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2">
                </div>
                <p className="text-gray-500">Loading reservations...</p>
              </div>
            )
            : filteredReservations.length === 0
            ? (
              <div className="py-12 text-center">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="mt-2 text-base font-medium text-gray-900">
                  No reservations found
                </p>
                <p className="text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No reservations match the selected filter"}
                </p>
              </div>
            )
            : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      People
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
            
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTimeRange(
                          reservation.time_slot?.start_time ||
                            reservation.time_slots?.start_time ||
                            new Date().toISOString(), // Fallback to prevent error
                          reservation.time_slot?.end_time ||
                            reservation.time_slots?.end_time ||
                            new Date().toISOString(), // Fallback to prevent error
                        )}
                      </td>

                   
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.customer_email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{reservation.number_of_people} parasailers</div>
                        {(reservation?.riders ||
                          0) > 0 && <div>{reservation.riders} riders</div>}
                        {(reservation.photo_package ||
                          reservation.go_pro_package || reservation.tshirts) &&
                          (
                            <div className="text-xs text-gray-500 mt-1">
                              {reservation.photo_package && "Photo pkg, "}
                              {reservation.go_pro_package && "GoPro pkg, "}
                              {(reservation?.tshirts ||
                                0) > 0 && `${reservation.tshirts} t-shirts`}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${
                            reservation.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : reservation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : reservation.status === "completed"
                              ? "bg-purple-100 text-purple-800"
                              : reservation.status === "refunded"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reservation.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${((reservation.payment_amount || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/management-console/reservations/${reservation.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </Link>
                        {(reservation.status === "confirmed") && (
                          <button
                            className="text-green-600 hover:text-green-900 mr-3"
                            onClick={() =>
                              handleCompleteInitiate(reservation.id || "")}
                            disabled={isCompleting}
                          >
                            Complete
                          </button>
                        )}
                        {(reservation.status === "confirmed" ||
                          reservation.status === "pending") && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() =>
                              handleCancelInitiate(reservation.id || "")}
                            disabled={isCancelling}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        {/* Pagination */}
        {filteredReservations.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredReservations.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredReservations.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate page numbers to show (centered around current page)
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                          ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Modal */}
      <ReservationActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        actionType={actionType}
        onCancel={handleCancel}
        onComplete={handleComplete}
        isLoading={isCancelling || isCompleting}
      />
    </div>
  );
};

export default ReservationManagement;
