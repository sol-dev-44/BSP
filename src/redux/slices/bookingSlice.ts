// store/slices/bookingSlice.ts - Updated with tip functionality
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimeSlot, Reservation } from '../../types.ts';

// Define the booking step type
export type BookingStep = 'select-time' | 'customer-info' | 'payment' | 'confirmation';

// Define the state shape
interface BookingState {
  currentStep: BookingStep;
  selectedSlot: string | null;
  selectedTimeSlot: TimeSlot | null;
  formData: Partial<Reservation> & {
    tip_amount?: number; // Add tip amount to form data
  };
  paymentInfo: {
    clientSecret: string;
    amount: number;
  } | null;
  confirmationDetails: any | null;
  error: string | null;
}

// Initial state
const initialState: BookingState = {
  currentStep: 'select-time',
  selectedSlot: null,
  selectedTimeSlot: null,
  formData: {
    time_slot_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_people: 1,
    riders: 0,
    photo_package: false,
    go_pro_package: false,
    tshirts: 0,
    tip_amount: 0 // Initialize tip amount
  },
  paymentInfo: null,
  confirmationDetails: null,
  error: null
};

// Create the slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<BookingStep>) {
      state.currentStep = action.payload;
    },
    setSelectedSlot(state, action: PayloadAction<string | null>) {
      state.selectedSlot = action.payload;
      if (action.payload) {
        state.formData.time_slot_id = action.payload;
      }
    },
    setSelectedTimeSlot(state, action: PayloadAction<TimeSlot | null>) {
      state.selectedTimeSlot = action.payload;
    },
    updateFormData(state, action: PayloadAction<{ name: string; value: string | number | boolean }>) {
      const { name, value } = action.payload;
      
      // FIXED: Ensure numeric fields remain numbers in state
      if (name === 'number_of_people' || name === 'riders' || name === 'tshirts' || name === 'tip_amount') {
        // Parse strings to numbers if necessary
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        state.formData = {
          ...state.formData,
          [name]: numericValue
        };
      } else {
        state.formData = {
          ...state.formData,
          [name]: value
        };
      }
    },
    setPaymentInfo(state, action: PayloadAction<{ clientSecret: string; amount: number } | null>) {
      state.paymentInfo = action.payload;
    },
    setConfirmationDetails(state, action: PayloadAction<any>) {
      state.confirmationDetails = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetBooking() {
      return {
        ...initialState,
        // Preserve some values if needed when resetting
      };
    }
  }
});

// Export actions and reducer
export const {
  setCurrentStep,
  setSelectedSlot,
  setSelectedTimeSlot,
  updateFormData,
  setPaymentInfo,
  setConfirmationDetails,
  setError,
  resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;