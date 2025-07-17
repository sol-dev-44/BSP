// stripeActions.ts - Fixed to include tip_amount in payment calculation
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const stripeApiKey = Deno.env.get("STRIPE_SECRET_KEY") || "";

if (!stripeApiKey) {
  console.error("❌ STRIPE_SECRET_KEY not found in environment");
}

console.log("🔑 Stripe configuration: API key is", stripeApiKey ? "set" : "missing");

const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2025-04-30.basil",
  typescript: true,
});

interface ReservationData {
  time_slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  riders?: number;
  photo_package?: boolean;
  go_pro_package?: boolean;
  tshirts?: number;
  tip_amount?: number; // Add tip_amount to interface
}

// Calculate total amount including tip
const calculateTotalAmount = (data: ReservationData): number => {
  const {
    number_of_people = 0,
    riders = 0,
    photo_package = false,
    go_pro_package = false,
    tshirts = 0,
    tip_amount = 0 // 🔥 CRITICAL: Include tip amount
  } = data;

  // NEW PRICING STRUCTURE: $89 for 1 person, $75 per person for 2+
  let parasailingCost = 0;
  if (number_of_people === 1) {
    parasailingCost = 8900; // $89 in cents
  } else if (number_of_people >= 2) {
    parasailingCost = number_of_people * 7500; // $75 per person in cents
  }
  
  const ridersCost = riders * 3000; // $30 per rider
  const photoCost = photo_package ? 3000 : 0; // $30 for photo package
  const goproCost = go_pro_package ? 3000 : 0; // $30 for GoPro package
  const tshirtCost = tshirts * 5000; // $50 per t-shirt
  const tipCost = tip_amount || 0; // Tip amount (already in cents)

  const totalAmount = parasailingCost + ridersCost + photoCost + goproCost + tshirtCost + tipCost;

  // 🔍 Debug logging
  const pricePerPerson = number_of_people === 1 ? 89 : 75;
  console.log('💰 Payment calculation breakdown:', {
    parasailing: `$${parasailingCost / 100} (${number_of_people} × $${pricePerPerson})`,
    riders: `$${ridersCost / 100} (${riders} × $30)`,
    photo: `$${photoCost / 100}`,
    gopro: `$${goproCost / 100}`,
    tshirts: `$${tshirtCost / 100} (${tshirts} × $50)`,
    tip: `$${tipCost / 100}`, // 🔥 Make sure this shows up!
    total: `$${totalAmount / 100}`
  });

  return totalAmount;
};

export const createPaymentIntent = async (
  reservationData: ReservationData,
): Promise<{ clientSecret: string; amount: number } | string> => {
  try {
    console.log("Creating payment intent for:", reservationData);

    // 🔥 CRITICAL FIX: Use the calculateTotalAmount function that includes tip
    const totalAmount = calculateTotalAmount(reservationData);

    console.log(`Creating Stripe payment intent for amount: ${totalAmount}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount, // 🔥 Now includes tip!
      currency: "usd",
      description: `Parasailing reservation for ${reservationData.customer_name} (${reservationData.number_of_people} ${reservationData.number_of_people === 1 ? 'person' : 'people'})`,
      metadata: {
        time_slot_id: reservationData.time_slot_id,
        customer_name: reservationData.customer_name,
        customer_email: reservationData.customer_email,
        number_of_people: reservationData.number_of_people.toString(),
        riders: (reservationData.riders || 0).toString(),
        photo_package: (reservationData.photo_package || false).toString(),
        go_pro_package: (reservationData.go_pro_package || false).toString(),
        tshirts: (reservationData.tshirts || 0).toString(),
        tip_amount: (reservationData.tip_amount || 0).toString(), // Include tip in metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("Stripe payment intent created:", {
      id: paymentIntent.id,
      clientSecret: "exists",
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      amount: totalAmount, // 🔥 Return total including tip
    };
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);
    return `Failed to create payment intent: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
};

export const confirmPaymentIntent = async (
  paymentIntentId: string,
): Promise<{ paymentIntent: Stripe.PaymentIntent; paymentMethod: Stripe.PaymentMethod } | string> => {
  try {
    console.log("Confirming payment intent:", paymentIntentId);

    // Retrieve the payment intent to confirm it was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return `Payment not successful. Status: ${paymentIntent.status}`;
    }

    // Get payment method details for the receipt
    let paymentMethod: Stripe.PaymentMethod | null = null;
    if (paymentIntent.payment_method) {
      try {
        paymentMethod = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string,
        );
      } catch (error) {
        console.warn("Could not retrieve payment method details:", error);
      }
    }

    console.log("Payment intent confirmed successfully");

    return {
      paymentIntent,
      paymentMethod: paymentMethod!,
    };
  } catch (error) {
    console.error("❌ Error confirming payment intent:", error);
    return `Failed to confirm payment intent: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
};

export const processStripeRefund = async (
  paymentIntentId: string,
  amount?: number,
): Promise<{ refund: Stripe.Refund } | string> => {
  try {
    console.log("Processing refund for payment intent:", paymentIntentId);

    const refundData: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundData.amount = amount;
    }

    const refund = await stripe.refunds.create(refundData);

    console.log("Refund processed successfully:", refund.id);

    return { refund };
  } catch (error) {
    console.error("❌ Error processing refund:", error);
    return `Failed to process refund: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
};