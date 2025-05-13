// components/admin/ReservationDetail.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { reservationsApi } from '../../redux/apis/reservationsApi.ts';
import { formatDateTimeRange, formatDate } from '../../utils/dateFormatters.ts';
import ReservationActionModal from './ReservationActionModal.tsx';
import { Reservation, TimeSlot } from '../../types.ts';

// Extended type for reservations with joined time slot data
interface ReservationWithTimeSlot extends Reservation {
  time_slot?: TimeSlot;
  time_slots?: TimeSlot;
}

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

const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | 'complete' | null>(null);
  
  const { data: reservations = [] } = reservationsApi.useGetAllReservationsQuery();
  const [cancelReservation, { isLoading: isCancelling }] = reservationsApi.useCancelReservationMutation();
  const [completeReservation, { isLoading: isCompleting }] = reservationsApi.useCompleteReservationMutation();
  const [processRefund] = reservationsApi.useProcessRefundMutation();
  
  // Find the reservation by ID
  const reservation = reservations.find(res => res.id === id) as ReservationWithTimeSlot | undefined;
  
  const handleCancelInitiate = () => {
    setActionType('cancel');
    setModalOpen(true);
  };
  
  const handleCompleteInitiate = () => {
    setActionType('complete');
    setModalOpen(true);
  };
  
  const handleCancel = async (reason: string) => {
    if (!id) return;
    
    try {
      await cancelReservation({ 
        id, 
        reason 
      }).unwrap();
      
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to cancel reservation', error);
      alert('Failed to cancel reservation');
    }
  };
  
  const handleComplete = async () => {
    if (!id) return;
    
    try {
      await completeReservation(id).unwrap();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to complete reservation', error);
      alert('Failed to mark reservation as completed');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(null);
  };
  
  const handleProcessRefund = async () => {
    if (!id || !reservation?.payment_intent_id) return;
    
    if (!window.confirm("Process a refund for this reservation? This action cannot be undone.")) {
      return;
    }
    
    try {
      await processRefund({
        id,
        refundId: `manual_${Date.now()}`,
        refundAmount: reservation.payment_amount || 0
      }).unwrap();
      
      alert('Refund processed successfully');
    } catch (error) {
      console.error('Failed to process refund', error);
      alert('Failed to process refund');
    }
  };
  
  if (!reservation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <div className="py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-base font-medium text-gray-900">Reservation not found</h3>
          <p className="mt-1 text-sm text-gray-500">The reservation you're looking for does not exist or has been removed.</p>
          <div className="mt-6">
            <Link
              to="/management-console/reservations"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go back to reservations
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Reservation Details</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/management-console/reservations/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </Link>
          {(reservation.status === 'confirmed') && (
            <button
              onClick={handleCompleteInitiate}
              disabled={isCompleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </button>
          )}
          {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
            <button
              onClick={handleCancelInitiate}
              disabled={isCancelling}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main reservation details */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Reservation Information</h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClasses(reservation.status)}`}>
                {reservation.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Reservation ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{reservation.id}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">
                  {(reservation.time_slot || reservation.time_slots) && formatDateTimeRange(
                    reservation.time_slot?.start_time || reservation.time_slots?.start_time || '',
                    reservation.time_slot?.end_time || reservation.time_slots?.end_time || ''
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{reservation.customer_name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`mailto:${reservation.customer_email}`} className="text-blue-600 hover:text-blue-800">
                    {reservation.customer_email}
                  </a>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`tel:${reservation.customer_phone}`} className="text-blue-600 hover:text-blue-800">
                    {reservation.customer_phone}
                  </a>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {reservation.created_at && formatDate(reservation.created_at)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Parasailers</dt>
                <dd className="mt-1 text-sm text-gray-900">{reservation.number_of_people}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Riders</dt>
                <dd className="mt-1 text-sm text-gray-900">{reservation.riders || 0}</dd>
              </div>
              
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Add-ons</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {reservation.photo_package && <li>Photo Package</li>}
                    {reservation.go_pro_package && <li>GoPro Package</li>}
                    {reservation.tshirts && reservation.tshirts > 0 && (
                      <li>{reservation.tshirts} T-shirt{reservation.tshirts > 1 ? 's' : ''}</li>
                    )}
                    {!reservation.photo_package && !reservation.go_pro_package && (!reservation.tshirts || reservation.tshirts <= 0) && (
                      <li className="text-gray-500">No add-ons</li>
                    )}
                  </ul>
                </dd>
              </div>
              
              {reservation.notes && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{reservation.notes}</dd>
                </div>
              )}
              
              {reservation.cancellation_reason && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Cancellation Reason</dt>
                  <dd className="mt-1 text-sm text-red-600">{reservation.cancellation_reason}</dd>
                </div>
              )}
            </dl>
          </div>
        </motion.div>
        
        {/* Payment information */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
          </div>
          
          <div className="px-6 py-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${reservation.payment_intent_id 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'}`
                  }>
                    {reservation.payment_intent_id ? 'PAID' : 'PENDING'}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-xl font-bold text-gray-900">
                  ${((reservation.payment_amount || 0) / 100).toFixed(2)}
                </dd>
              </div>
              
              {reservation.payment_intent_id && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                    {reservation.payment_intent_id}
                  </dd>
                </div>
              )}
              
              {reservation.refund_id && (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">Refund ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                      {reservation.refund_id}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Refund Amount</dt>
                    <dd className="mt-1 text-sm font-medium text-red-600">
                      -${((reservation.refund_amount || 0) / 100).toFixed(2)}
                    </dd>
                  </div>
                </>
              )}
              
              {/* Payment actions */}
              {(reservation.status === 'confirmed' || reservation.status === 'completed') && reservation.payment_intent_id && (
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleProcessRefund}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Process Refund
                  </button>
                </div>
              )}
            </dl>
          </div>
        </motion.div>
      </div>
      
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

export default ReservationDetail;