// stripe/stripeActions.ts - Updated to handle potential string values
import Stripe from "stripe";
import { Reservation, calculatePrice } from "../supabase/reservationActions.ts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Stripe with the API key from environment variables
const stripeApiKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
console.log(`Using Stripe API key: ${stripeApiKey ? stripeApiKey.substring(0, 8) + "..." : "MISSING"}`);

// Initialize Stripe with proper API version
const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2025-04-30.basil",
  typescript: true,
});

// Create a payment intent for a reservation
export const createPaymentIntent = async (reservationData: Omit<Reservation, 'id' | 'status' | 'payment_intent_id' | 'payment_amount' | 'created_at' | 'updated_at'>) => {
  try {
    console.log("Creating payment intent for:", reservationData);
    
    // Ensure number fields are properly converted from strings if needed
    const processedData = {
      ...reservationData,
      number_of_people: typeof reservationData.number_of_people === 'string' 
        ? parseInt(reservationData.number_of_people, 10) 
        : (reservationData.number_of_people || 0),
      riders: typeof reservationData.riders === 'string'
        ? parseInt(reservationData.riders, 10)
        : (reservationData.riders || 0),
      tshirts: typeof reservationData.tshirts === 'string'
        ? parseInt(reservationData.tshirts, 10)
        : (reservationData.tshirts || 0)
    };
    
    // Calculate the total price for the reservation using the processed data
    const amount = calculatePrice(processedData);
    
    // Check if amount is valid
    if (amount <= 0) {
      return "Invalid reservation amount";
    }
    
    // Check if we have a valid API key
    if (!stripeApiKey || stripeApiKey.trim() === "") {
      console.error("No Stripe API key provided. Cannot create a payment intent.");
      return "Stripe API key is missing";
    }
    
    // Create a payment intent with Stripe
    try {
      console.log(`Creating Stripe payment intent for amount: ${amount}`);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        description: `Parasailing Reservation for ${processedData.customer_name}`,
        metadata: {
          customer_name: processedData.customer_name,
          customer_email: processedData.customer_email,
          time_slot_id: processedData.time_slot_id,
        },
        receipt_email: processedData.customer_email,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log("Stripe payment intent created:", {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret ? "exists" : "missing",
      });
      
      // Only continue if we have a client secret
      if (!paymentIntent.client_secret) {
        throw new Error("No client secret returned from Stripe");
      }
      
      // Return the client secret and other data
      return {
        clientSecret: paymentIntent.client_secret,
        amount,
        reservationData: processedData
      };
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      return "Error creating payment intent: " + (stripeError instanceof Error ? stripeError.message : "Unknown error");
    }
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return error instanceof Error ? error.message : "Unknown error creating payment intent";
  }
};

// Confirm a payment intent (this is mostly handled client-side with Stripe Elements)
export const confirmPaymentIntent = async (paymentIntentId: string) => {
  try {
    // Check if we have a valid API key
    if (!stripeApiKey || stripeApiKey.trim() === "") {
      console.error("No Stripe API key provided. Cannot confirm the payment intent.");
      return "Stripe API key is missing";
    }
    
    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Check if the payment was successful
    if (paymentIntent.status !== "succeeded") {
      return `Payment not successful. Status: ${paymentIntent.status}`;
    }
    
    return { 
      success: true,
      paymentIntent
    };
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return error instanceof Error ? error.message : "Unknown error confirming payment";
  }
};

// Process a refund for a payment
export const processStripeRefund = async (paymentIntentId: string, amount?: number) => {
  try {
    // Check if we have a valid API key
    if (!stripeApiKey || stripeApiKey.trim() === "") {
      console.error("No Stripe API key provided. Cannot process refund.");
      return "Stripe API key is missing";
    }
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // If not specified, refund the full amount
    });
    
    return {
      success: true,
      refundId: refund.id,
      refundAmount: refund.amount
    };
  } catch (error) {
    console.error("Refund processing error:", error);
    return error instanceof Error ? error.message : "Unknown error processing refund";
  }
};