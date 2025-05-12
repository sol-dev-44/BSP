// ./supabase/reservationActions.ts
import { createClient } from "@supabase/supabase-js";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { supabase } from "./client.ts";

// Types to match our new database schema
export type TimeSlotStatus = 'available' | 'partially_booked' | 'fully_booked' | 'weather_blocked';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'completed' | 'weather_cancelled';

export type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  status: TimeSlotStatus;
  weather_status?: string;
  created_at?: string;
  updated_at?: string;
};

export type Reservation = {
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
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
};

// Calculate the total price for a reservation in cents
export const calculatePrice = (reservation: Partial<Reservation>): number => {
  let total = 0;
  
  // Base price: $99 per parasailer
  total += (reservation.number_of_people || 0) * 9900;
  
  // Riders: $30 per ride-along person
  total += (reservation.riders || 0) * 3000;
  
  // Add-ons
  if (reservation.photo_package) total += 3000;
  if (reservation.go_pro_package) total += 3000;
  
  // T-shirts: $50 each
  total += (reservation.tshirts || 0) * 5000;
  
  return total;
};

// Fetch available time slots for the next X days
export const fetchAvailableTimeSlots = async (daysAhead = 7) => {
  try {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);
    
    const { data, error } = await supabase
      .from("time_slots")
      .select("*")
      .gte("start_time", now.toISOString())
      .lte("start_time", future.toISOString())
      .not("status", "eq", "fully_booked") // Get available and partially booked slots
      .not("status", "eq", "weather_blocked") // Exclude weather blocked slots
      .order("start_time", { ascending: true });

    if (error) return error.message;
    return data as TimeSlot[];
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Create a pending reservation (before payment)
export const createPendingReservation = async (reservationData: Omit<Reservation, 'id' | 'status' | 'payment_intent_id' | 'payment_amount' | 'created_at' | 'updated_at'>) => {
  try {
    // First make sure the time slot is not fully booked
    const { data: timeSlot, error: timeSlotError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("id", reservationData.time_slot_id)
      .not("status", "eq", "fully_booked")
      .not("status", "eq", "weather_blocked")
      .single();

    if (timeSlotError) return timeSlotError.message;
    if (!timeSlot) return "Time slot is no longer available";
    
    // Check if there's enough capacity
    const totalPeople = (reservationData.number_of_people || 0) + (reservationData.riders || 0);
    if (timeSlot.booked_count + totalPeople > timeSlot.capacity) {
      return `Not enough capacity. Only ${timeSlot.capacity - timeSlot.booked_count} spots left.`;
    }
    
    // Calculate payment amount
    const payment_amount = calculatePrice(reservationData);
    
    // Set expiration time (5 minutes from now)
    const expires_at = new Date();
    expires_at.setMinutes(expires_at.getMinutes() + 5);
    
    // Create the pending reservation
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        ...reservationData,
        status: 'pending',
        payment_amount,
        expires_at: expires_at.toISOString()
      })
      .select()
      .single();

    if (error) return error.message;
    
    return {
      reservation: data,
      expires_at: expires_at.toISOString(),
      payment_amount
    };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Confirm a reservation after payment
export const confirmReservation = async (reservationId: string, paymentIntentId: string) => {
  try {
    // Update reservation status
    const { data, error } = await supabase
      .from("reservations")
      .update({
        status: 'confirmed',
        payment_intent_id: paymentIntentId
      })
      .eq("id", reservationId)
      .eq("status", "pending")
      .select()
      .single();
      
    if (error) return error.message;
    if (!data) return "Reservation not found or already confirmed";
    
    return { success: true, reservation: data };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Cancel a reservation (admin only)
export const cancelReservation = async (reservationId: string, reason: string) => {
  try {
    // Update reservation status
    const { data, error } = await supabase
      .from("reservations")
      .update({ 
        status: 'cancelled',
        cancellation_reason: reason
      })
      .eq("id", reservationId)
      .select()
      .single();
      
    if (error) return error.message;
    if (!data) return "Reservation not found";
    
    return { success: true, reservation: data };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Process a refund (admin only)
export const processRefund = async (reservationId: string, refundId: string, refundAmount: number) => {
  try {
    // Update reservation with refund info
    const { data, error } = await supabase
      .from("reservations")
      .update({ 
        status: 'refunded',
        refund_id: refundId,
        refund_amount: refundAmount
      })
      .eq("id", reservationId)
      .select()
      .single();
      
    if (error) return error.message;
    if (!data) return "Reservation not found";
    
    return { success: true, reservation: data };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Mark a reservation as completed (admin only)
export const completeReservation = async (reservationId: string) => {
  try {
    // Update reservation status
    const { data, error } = await supabase
      .from("reservations")
      .update({ status: 'completed' })
      .eq("id", reservationId)
      .select()
      .single();
      
    if (error) return error.message;
    if (!data) return "Reservation not found";
    
    return { success: true, reservation: data };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Get all reservations (admin)
export const fetchAllReservations = async () => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        time_slots (*)
      `)
      .order("created_at", { ascending: false });
      
    if (error) return error.message;
    return data;
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Get today's reservations (admin)
export const fetchTodaysReservations = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        time_slots (*)
      `)
      .gte("time_slots.start_time", today.toISOString())
      .lt("time_slots.start_time", tomorrow.toISOString())
      .in("status", ["confirmed", "pending"])
      .order("time_slots.start_time", { ascending: true });
      
    if (error) return error.message;
    return data;
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Get reservations for a specific customer by email
export const fetchReservationsByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        time_slots (*)
      `)
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
      
    if (error) return error.message;
    return data;
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Manually clean up expired pending reservations (should be done with a cron job in production)
export const cleanupExpiredReservations = async () => {
  try {
    // Call the database function
    const { data, error } = await supabase
      .rpc('expire_pending_reservations');
      
    if (error) return error.message;
    return { expired: data };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Create multiple time slots (admin)
export const createTimeSlots = async (timeSlots: Omit<TimeSlot, 'id' | 'booked_count' | 'created_at' | 'updated_at'>[]) => {
  try {
    // Add default booked_count = 0
    const slotsWithDefaults = timeSlots.map(slot => ({
      ...slot,
      booked_count: 0
    }));
    
    const { data, error } = await supabase
      .from("time_slots")
      .insert(slotsWithDefaults)
      .select();
      
    if (error) return error.message;
    return data as TimeSlot[];
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Block time slots due to weather (admin)
export const blockTimeSlotsDueToWeather = async (slotIds: string[], weatherStatus: string) => {
  try {
    const { data, error } = await supabase
      .from("time_slots")
      .update({ 
        status: 'weather_blocked',
        weather_status: weatherStatus
      })
      .in("id", slotIds)
      .select();
      
    if (error) return error.message;
    return data as TimeSlot[];
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};

// Generate time slots from range (admin utility)
export const generateTimeSlotsFromRange = (
  startDate: Date,
  endDate: Date,
  startHour = 9,
  endHour = 17,
  durationMinutes = 60,
  capacity = 10,
  skipDays: number[] = [] // e.g., [0, 6] to skip Sunday and Saturday
): Omit<TimeSlot, 'id' | 'booked_count' | 'created_at' | 'updated_at'>[] => {
  const slots: Omit<TimeSlot, 'id' | 'booked_count' | 'created_at' | 'updated_at'>[] = [];
  
  for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
    // Skip specified days of week (0 = Sunday, 6 = Saturday)
    if (skipDays.includes(day.getDay())) continue;
    
    for (let hour = startHour; hour < endHour; hour += durationMinutes / 60) {
      const slotStart = new Date(day);
      slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      
      const slotEnd = new Date(day);
      const endTimeHour = hour + (durationMinutes / 60);
      slotEnd.setHours(Math.floor(endTimeHour), (endTimeHour % 1) * 60, 0, 0);
      
      slots.push({
        start_time: slotStart.toISOString(),
        end_time: slotEnd.toISOString(),
        capacity,
        status: 'available'
      });
    }
  }
  
  return slots;
};

// Create a reservation directly with confirmed status
export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // First make sure the time slot is not fully booked
    const { data: timeSlot, error: timeSlotError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("id", reservationData.time_slot_id)
      .not("status", "eq", "fully_booked")
      .not("status", "eq", "weather_blocked")
      .single();

    if (timeSlotError) return timeSlotError.message;
    if (!timeSlot) return "Time slot is no longer available";
    
    // Check if there's enough capacity
    const totalPeople = (reservationData.number_of_people || 0) + (reservationData.riders || 0);
    if (timeSlot.booked_count + totalPeople > timeSlot.capacity) {
      return `Not enough capacity. Only ${timeSlot.capacity - timeSlot.booked_count} spots left.`;
    }
    
    // Set status if not provided (default to confirmed)
    const status = reservationData.status || 'confirmed';
    
    // Start a transaction
    // Note: Supabase JS client doesn't support transactions directly, so we use a stored procedure here
    // If your DB supports it, you could implement a transaction here to ensure atomicity
    
    // 1. Create the reservation with confirmed status
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert({
        ...reservationData,
        status,
        payment_amount: reservationData.payment_amount || calculatePrice(reservationData),
      })
      .select()
      .single();

    if (reservationError) return reservationError.message;
    
    // 2. Update the time slot capacity
    const newBookedCount = timeSlot.booked_count + totalPeople;
    const newStatus = newBookedCount >= timeSlot.capacity ? 'fully_booked' : 'partially_booked';
    
    const { error: updateError } = await supabase
      .from("time_slots")
      .update({ 
        booked_count: newBookedCount,
        status: newStatus
      })
      .eq("id", reservationData.time_slot_id);
      
    if (updateError) {
      console.error("Failed to update time slot capacity:", updateError);
      // In a real transaction, we would roll back here, but since we can't easily do that,
      // we'll just log the error and return the reservation anyway
    }
    
    return { 
      success: true, 
      reservation,
      message: "Reservation confirmed successfully"
    };
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};