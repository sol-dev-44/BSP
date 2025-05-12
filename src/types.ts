// types.ts
export type TimeSlotStatus = 'available' | 'partially_booked' | 'fully_booked' | 'weather_blocked';

export type ReservationStatus = 'confirmed' | 'cancelled' | 'refunded' | 'completed' | 'weather_cancelled' | 'pending';

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  status: TimeSlotStatus;
  weather_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  id?: string;
  time_slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  riders?: number; 
  photo_package?: boolean;
  go_pro_package?: boolean;
  tshirts?: number;
  status: ReservationStatus;
  payment_intent_id?: string;
  payment_amount?: number;
  refund_id?: string;
  refund_amount?: number;
  cancellation_reason?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}