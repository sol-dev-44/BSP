// store/slices/bookingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimeSlot, Reservation } from '../../types.ts';

// Define the booking step type
export type BookingStep = 'select-time' | 'customer-info' | 'payment' | 'confirmation';

// Define the state shape
interface BookingState {
  currentStep: BookingStep;
  selectedSlot: string | null;
  selectedTimeSlot: TimeSlot | null;
  formData: Partial<Reservation>;
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
    tshirts: 0
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
      state.formData = {
        ...state.formData,
        [name]: value
      };
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