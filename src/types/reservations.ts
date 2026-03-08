export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  trip_date: string
  trip_time: string
  party_size: number
  riders: number
  total_amount: number
  status: BookingStatus
  stripe_payment_intent_id: string
  notes: string | null
  add_ons: {
    photo_package?: boolean
    gopro_package?: boolean
    tip_amount?: number
  } | null
  created_at: string
}

export interface CreateBookingRequest {
  customer_name: string
  customer_email: string
  customer_phone: string
  trip_date: string
  trip_time: string
  party_size: number
  riders: number
  add_ons: {
    photo_package?: boolean
    gopro_package?: boolean
    tip_amount?: number
  }
  stripe_payment_intent_id: string
  total_amount: number
}

export interface AvailabilitySlot {
  time: string
  remaining: number
  price: number
}

export interface AvailabilityResponse {
  date: string
  slots: AvailabilitySlot[]
}
