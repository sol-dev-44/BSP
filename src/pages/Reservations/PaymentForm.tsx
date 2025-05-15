// components/PaymentForm.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

// Stripe checkout form component
const PaymentForm: React.FC<PaymentFormProps> = ({ 
  clientSecret, 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  
  // Debug output
  useEffect(() => {
    console.log("PaymentForm initialized with:", { 
      clientSecretPrefix: clientSecret ? clientSecret.substring(0, 10) + '...' : 'none',
      clientSecretValid: clientSecret?.includes('_secret_'),
      amount,
      stripeLoaded: !!stripe
    });
  }, [clientSecret, amount, stripe]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Payment form submitted");

    if (!stripe || !elements) {
      setPaymentError("Payment processing is not available. Please try again later.");
      return;
    }

    if (!cardComplete) {
      setPaymentError("Please complete your card information before submitting.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      console.log("Confirming payment with Stripe...");
      
      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        setPaymentError(result.error.message || "An error occurred with your payment");
        onPaymentError(result.error.message || "An error occurred with your payment");
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded:", result.paymentIntent);
        onPaymentSuccess(result.paymentIntent.id);
      } else {
        console.error("Payment not successful:", result.paymentIntent);
        setPaymentError("Payment not successful. Please try again.");
        onPaymentError("Payment not successful. Please try again.");
      }
    } catch (err) {
      console.error("Exception during payment:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle card input changes
  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError(null);
    }
  };

  // Format price for display
  const formatPrice = (amount: number): string => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Helper text for test cards
  const testCardInfo = (
    <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded">
      <p className="font-medium">Test Mode: Use these cards:</p>
      <p>Success: 4242 4242 4242 4242</p>
      <p>Decline: 4000 0000 0000 0002</p>
      <p>Any future date, any 3 digits for CVC, any zip code</p>
    </div>
  );

  return (
    <motion.form 
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Complete Your Payment</h3>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-md mb-6">
          <span className="text-gray-700 font-medium">Total:</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(amount)}</span>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className={`p-3 border rounded-md bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors
            ${cardComplete ? 'border-green-300' : 'border-gray-300'}
            ${paymentError ? 'border-red-300' : ''}
          `}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    iconColor: '#6772e5',
                  },
                  invalid: {
                    color: '#9e2146',
                    iconColor: '#e25950',
                  },
                },
                hidePostalCode: true, // Optional: remove if you want to collect postal code
              }}
              onChange={handleCardChange}
            />
          </div>
          
          {/* Show test card info */}
          {/* {testCardInfo} */}
          
          <p className="mt-2 text-xs text-gray-500">
            Your card information is encrypted and secure. We do not store your card details.
          </p>
        </div>
        
        <AnimatePresence>
          {paymentError && (
            <motion.div 
              className="text-red-600 bg-red-50 rounded-md p-3 mb-4 text-sm"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{paymentError}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between space-x-4">
          <motion.button 
            type="button" 
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onCancel}
            disabled={isProcessing}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          >
            Back
          </motion.button>
          <motion.button 
            type="submit" 
            className={`
              flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${(!stripe || isProcessing || !cardComplete) ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            disabled={!stripe || isProcessing || !cardComplete}
            whileHover={{ scale: (!stripe || isProcessing || !cardComplete) ? 1 : 1.02 }}
            whileTap={{ scale: (!stripe || isProcessing || !cardComplete) ? 1 : 0.98 }}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : `Pay ${formatPrice(amount)}`}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default PaymentForm;