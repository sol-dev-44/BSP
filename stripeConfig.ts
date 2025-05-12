// stripeConfig.ts
import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

console.log(`Initializing Stripe with ${publishableKey ? 'valid publishable key' : 'missing key'}`);

// Initialize Stripe once and export it
export const stripePromise = loadStripe(publishableKey);