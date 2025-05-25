// reservationRoutes.ts - Updated with SMS notifications
import { Router } from "@oak/oak";
import {
  cancelReservation,
  cleanupExpiredReservations,
  completeReservation,
  createReservation,
  fetchAllReservations,
  fetchReservationsByEmail,
  fetchTodaysReservations,
  processRefund,
} from "./supabase/reservationActions.ts";
import {
  confirmPaymentIntent,
  createPaymentIntent,
  processStripeRefund,
} from "./supabase/stripeActions.ts";
import { sendReservationAlert, logReservationAlert } from "./smsService.ts";
import { supabase } from "./supabase/client.ts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const adminPin = process.env.ADMIN_API_KEY || "";

const router = new Router();

// Helper function to get time slot details for SMS
const getTimeSlotForSMS = async (timeSlotId: string) => {
  try {
    const { data, error } = await supabase
      .from("time_slots")
      .select("start_time, end_time")
      .eq("id", timeSlotId)
      .single();
    
    if (error || !data) {
      console.error("Failed to fetch time slot for SMS:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching time slot for SMS:", error);
    return null;
  }
};

router
  // Create a pending reservation with payment intent
  .post("/api/reservations/pending", async (ctx) => {
    try {
      if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "No data provided" };
        return;
      }

      const value = await ctx.request.body.json();
      console.log("Received pending reservation request:", value);

      // Create payment intent with Stripe first (this is the critical part for getting a client secret)
      const paymentIntentResult = await createPaymentIntent({
        time_slot_id: value.time_slot_id,
        customer_name: value.customer_name,
        customer_email: value.customer_email,
        customer_phone: value.customer_phone,
        number_of_people: value.number_of_people,
        riders: value.riders || 0,
        photo_package: value.photo_package || false,
        go_pro_package: value.go_pro_package || false,
        tshirts: value.tshirts || 0,
      });

      // If createPaymentIntent returns a string, it's an error message
      if (typeof paymentIntentResult === "string") {
        console.error("Payment intent error:", paymentIntentResult);
        ctx.response.status = 400;
        ctx.response.body = { error: paymentIntentResult };
        return;
      }

      // Log the successful result
      console.log("Payment intent created:", {
        hasClientSecret: Boolean(paymentIntentResult.clientSecret),
        amount: paymentIntentResult.amount,
        clientSecretStart: paymentIntentResult.clientSecret
          ? paymentIntentResult.clientSecret.substring(0, 10) + "..."
          : "none",
      });

      // Return the payment intent result directly to the client
      // Critical: This must include the client_secret from Stripe
      ctx.response.status = 201;
      ctx.response.body = {
        clientSecret: paymentIntentResult.clientSecret,
        amount: paymentIntentResult.amount,
        reservationData: value,
      };
    } catch (error) {
      console.error("❌ Error creating pending reservation:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Failed to create reservation: " +
          (error instanceof Error ? error.message : "Unknown error"),
      };
    }
  })
  
  // Confirm a reservation after payment - UPDATED WITH SMS
  .post("/api/reservations/confirm", async (ctx) => {
    try {
      if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "No data provided" };
        return;
      }

      const value = await ctx.request.body.json();

      if (!value.paymentIntentId || !value.reservationData) {
        ctx.response.status = 400;
        ctx.response.body = {
          error: "Payment intent ID and reservation data are required",
        };
        return;
      }

      // First confirm the payment with Stripe
      const paymentConfirmation = await confirmPaymentIntent(
        value.paymentIntentId,
      );

      if (typeof paymentConfirmation === "string") {
        ctx.response.status = 400;
        ctx.response.body = { error: paymentConfirmation };
        return;
      }

      // Then create the confirmed reservation
      const result = await createReservation({
        ...value.reservationData,
        payment_intent_id: value.paymentIntentId,
        status: "confirmed",
      });

      if (typeof result === "string") {
        ctx.response.status = 400;
        ctx.response.body = { error: result };
        return;
      }

      // 🎯 NEW: Send SMS notification after successful reservation confirmation
      try {
        const timeSlot = await getTimeSlotForSMS(value.reservationData.time_slot_id);
        
        if (timeSlot) {
          const smsData = {
            customerName: value.reservationData.customer_name,
            numberOfPeople: value.reservationData.number_of_people,
            riders: value.reservationData.riders || 0,
            timeSlot: timeSlot,
            customerEmail: value.reservationData.customer_email,
            customerPhone: value.reservationData.customer_phone,
            totalAmount: paymentConfirmation.paymentIntent.amount,
            // Add-on fields
            photo_package: value.reservationData.photo_package || false,
            go_pro_package: value.reservationData.go_pro_package || false,
            tshirts: value.reservationData.tshirts || 0
          };

          // Try to send SMS, fallback to console log if it fails
          const smsSent = await sendReservationAlert(smsData);
          if (!smsSent) {
            logReservationAlert(smsData);
          }
        } else {
          // Fallback if we can't get time slot details
          logReservationAlert({
            customerName: value.reservationData.customer_name,
            numberOfPeople: value.reservationData.number_of_people,
            riders: value.reservationData.riders || 0,
            timeSlot: { start_time: "Unknown", end_time: "Unknown" },
            customerEmail: value.reservationData.customer_email,
            customerPhone: value.reservationData.customer_phone,
            totalAmount: paymentConfirmation.amount,
            // Add-on fields
            photo_package: value.reservationData.photo_package || false,
            go_pro_package: value.reservationData.go_pro_package || false,
            tshirts: value.reservationData.tshirts || 0
          });
        }
      } catch (smsError) {
        console.error("❌ Error sending reservation SMS alert:", smsError);
        // Don't fail the reservation if SMS fails
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error confirming reservation:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to confirm reservation" };
    }
  })
  
  // Get reservations by customer email
  .get("/api/reservations/lookup/:email", async (ctx) => {
    try {
      const email = ctx.params.email;
      if (!email) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email is required" };
        return;
      }

      const result = await fetchReservationsByEmail(email);

      if (typeof result === "string") {
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error fetching reservations by email:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to fetch reservations" };
    }
  })
  
  // Get all reservations (admin)
  .get("/api/admin/reservations", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${adminPin}`) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const result = await fetchAllReservations();

      if (typeof result === "string") {
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error fetching reservations:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to fetch reservations" };
    }
  })
  
  // Get today's reservations (admin)
  .get("/api/admin/reservations/today", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (
        !authHeader || authHeader !== `Bearer ${Deno.env.get("ADMIN_API_KEY")}`
      ) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const result = await fetchTodaysReservations();

      if (typeof result === "string") {
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error fetching today's reservations:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to fetch today's reservations" };
    }
  })
  
  // Cancel a reservation (admin only)
  .post("/api/admin/reservations/cancel/:id", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${adminPin}`) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const id = ctx.params.id;
      if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Reservation ID is required" };
        return;
      }

      const body = await ctx.request.body.json();
      const reason = body.reason || "Cancelled by admin";

      const result = await cancelReservation(id, reason);

      if (typeof result === "string") {
        ctx.response.status = 400;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error cancelling reservation:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to cancel reservation" };
    }
  })
  
  // Process a refund (admin only)
  .post("/api/admin/reservations/refund/:id", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${adminPin}`) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const id = ctx.params.id;
      if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Reservation ID is required" };
        return;
      }

      const body = await ctx.request.body.json();

      // In a real app, you would:
      // 1. Get the reservation to find the payment_intent_id
      // 2. Call Stripe to process the refund
      // 3. Update the reservation status

      // For simplicity in this demo:
      const result = await processRefund(
        id,
        body.refundId || "manual_refund",
        body.refundAmount || 0,
      );

      if (typeof result === "string") {
        ctx.response.status = 400;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error processing refund:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to process refund" };
    }
  })
  
  // Mark a reservation as completed (admin only)
  .post("/api/admin/reservations/complete/:id", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${adminPin}`) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const id = ctx.params.id;
      if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Reservation ID is required" };
        return;
      }

      const result = await completeReservation(id);

      if (typeof result === "string") {
        ctx.response.status = 400;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error completing reservation:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to complete reservation" };
    }
  })
  
  // Clean up expired reservations (should be done with a cron job in production)
  .post("/api/admin/reservations/cleanup", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${adminPin}`) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const result = await cleanupExpiredReservations();

      if (typeof result === "string") {
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error cleaning up expired reservations:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to clean up expired reservations" };
    }
  })
  
  // Admin reservation creation - UPDATED WITH SMS
  .post("/api/admin/reservations/create", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      const adminKey = Deno.env.get("ADMIN_API_KEY") ||
        process.env.ADMIN_API_KEY || "";

      if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
        console.error(
          "❌ Admin authentication failed for reservation creation",
        );
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      console.log(
        "✅ Admin authentication successful for reservation creation",
      );

      if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "No data provided" };
        return;
      }

      const value = await ctx.request.body.json();
      console.log("📝 Received admin reservation data:", value);

      // Use the direct createReservation function which can create confirmed reservations
      const result = await createReservation({
        ...value,
        status: value.status || "confirmed", // Default to confirmed for admin
      });

      if (typeof result === "string") {
        console.error("❌ Error creating reservation:", result);
        ctx.response.status = 400;
        ctx.response.body = { error: result };
        return;
      }

      console.log("✅ Reservation created:", result);

      // 🎯 NEW: Send SMS notification for admin-created reservations
      try {
        const timeSlot = await getTimeSlotForSMS(value.time_slot_id);
        
        if (timeSlot) {
          const smsData = {
            customerName: value.customer_name,
            numberOfPeople: value.number_of_people,
            riders: value.riders || 0,
            timeSlot: timeSlot,
            customerEmail: value.customer_email,
            customerPhone: value.customer_phone,
            totalAmount: value.payment_amount,
            // Add-on fields
            photo_package: value.photo_package || false,
            go_pro_package: value.go_pro_package || false,
            tshirts: value.tshirts || 0
          };

          // Try to send SMS, fallback to console log if it fails
          const smsSent = await sendReservationAlert(smsData);
          if (!smsSent) {
            logReservationAlert(smsData);
          }
        } else {
          // Fallback if we can't get time slot details
          logReservationAlert({
            customerName: value.customer_name,
            numberOfPeople: value.number_of_people,
            riders: value.riders || 0,
            timeSlot: { start_time: "Unknown", end_time: "Unknown" },
            customerEmail: value.customer_email,
            customerPhone: value.customer_phone,
            totalAmount: value.payment_amount,
            // Add-on fields
            photo_package: value.photo_package || false,
            go_pro_package: value.go_pro_package || false,
            tshirts: value.tshirts || 0
          });
        }
      } catch (smsError) {
        console.error("❌ Error sending admin reservation SMS alert:", smsError);
        // Don't fail the reservation if SMS fails
      }

      ctx.response.status = 201;
      ctx.response.body = result;
    } catch (error) {
      console.error("❌ Error creating admin reservation:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Failed to create reservation: " +
          (error instanceof Error ? error.message : String(error)),
      };
    }
  });

export default router;