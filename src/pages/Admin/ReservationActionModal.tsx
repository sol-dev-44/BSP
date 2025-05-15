// components/admin/modals/ReservationActionModal.tsx
import React, { useState } from 'react';

interface ReservationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'cancel' | 'complete' | null;
  onCancel: (reason: string) => void;
  onComplete: () => void;
  isLoading: boolean;
}

const ReservationActionModal: React.FC<ReservationActionModalProps> = ({
  isOpen,
  onClose,
  actionType,
  onCancel,
  onComplete,
  isLoading
}) => {
  const [cancelReason, setCancelReason] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (actionType === 'cancel') {
      onCancel(cancelReason || 'Cancelled by admin');
    } else if (actionType === 'complete') {
      onComplete();
    }
  };
  
  // Prevent event bubbling
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  console.log("Modal rendering with actionType:", actionType);
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
        onClick={stopPropagation}
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                actionType === 'cancel' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {actionType === 'cancel' ? (
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {actionType === 'cancel' ? 'Cancel Reservation' : 'Complete Reservation'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {actionType === 'cancel' 
                      ? 'Are you sure you want to cancel this reservation? This action cannot be undone.'
                      : 'Mark this reservation as completed?'
                    }
                  </p>
                  
                  {actionType === 'cancel' && (
                    <div className="mt-4">
                      <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700">
                        Reason for cancellation
                      </label>
                      <textarea
                        id="cancel-reason"
                        name="cancel-reason"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Please provide a reason for cancellation"
                        value={cancelReason}
                        onChange={(e:any) => setCancelReason(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                ${actionType === 'cancel' 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                actionType === 'cancel' ? 'Cancel Reservation' : 'Complete Reservation'
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationActionModal;