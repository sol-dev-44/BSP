// Components/TipComponent.tsx - Simple tip component using your existing Stripe setup
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { stripePromise } from "../stripeConfig.ts";

interface TipFormProps {
  onSuccess: (amount: number) => void;
  onCancel: () => void;
}

const TipForm: React.FC<TipFormProps> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Predefined tip amounts in cents
  const tipAmounts = [500, 1000, 1500, 2000, 2500]; // $5, $10, $15, $20, $25

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(Math.round(numValue * 100));
    } else {
      setSelectedAmount(null);
    }
  };

  const getCurrentAmount = (): number => {
    return selectedAmount || 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !customerName) {
      setPaymentError('Please fill in your name');
      return;
    }

    const amount = getCurrentAmount();
    if (amount < 100) {
      setPaymentError('Minimum tip amount is $1.00');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
        billing_details: {
          name: customerName,
        },
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
        return;
      }

      // Create tip payment intent using your backend
      const response = await fetch('/api/tips/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customer_name: customerName,
        }),
      });

      const { clientSecret } = await response.json();
      
      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (confirmError) {
        setPaymentError(confirmError.message || 'Payment failed');
      } else {
        onSuccess(amount);
      }
    } catch (error) {
      setPaymentError('An unexpected error occurred');
      console.error('Tip payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Tip Our Crew! 🚤</h3>
        <p className="text-gray-600">Show your appreciation for great service</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          required
        />

        {/* Tip Amount Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Select Tip Amount</label>
          
          <div className="grid grid-cols-3 gap-2">
            {tipAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`p-3 rounded-lg border-2 transition-all font-medium ${
                  selectedAmount === amount && !customAmount
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300 bg-white text-gray-900'
                }`}
              >
                ${(amount / 100).toFixed(0)}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              min="1"
              step="0.01"
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Card Element */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Card Details</label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardElement
              onChange={handleCardChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#374151', // gray-700
                    '::placeholder': { color: '#9CA3AF' }, // gray-400
                  },
                },
              }}
            />
          </div>
        </div>

        {paymentError && (
          <div className="text-red-600 text-sm text-center">{paymentError}</div>
        )}

        {getCurrentAmount() > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <span className="text-lg font-semibold text-blue-800">
              Tip Amount: ${(getCurrentAmount() / 100).toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing || !cardComplete || getCurrentAmount() < 100 || !customerName}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Send Tip'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

interface TipComponentProps {
  mode?: 'standalone' | 'reservation';
  onClose?: () => void;
  className?: string;
}

const TipComponent: React.FC<TipComponentProps> = ({ 
  mode = 'standalone', 
  onClose,
  className = ''
}) => {
  const [showTipForm, setShowTipForm] = useState(mode === 'reservation');
  const [tipSuccess, setTipSuccess] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  const handleTipSuccess = (amount: number) => {
    setTipAmount(amount);
    setTipSuccess(true);
    setTimeout(() => {
      setShowTipForm(false);
      setTipSuccess(false);
      onClose?.();
    }, 3000);
  };

  const handleCancel = () => {
    setShowTipForm(false);
    onClose?.();
  };

  if (mode === 'standalone' && !showTipForm) {
    return (
      <motion.button
        onClick={() => setShowTipForm(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all ${className}`}
      >
        💰 Tip Your Crew
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {showTipForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <Elements stripe={stripePromise}>
            {tipSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-xl text-center max-w-md mx-auto"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-4">
                  Your ${(tipAmount / 100).toFixed(2)} tip has been sent to our crew.
                  They really appreciate it!
                </p>
                <div className="text-4xl">🚤⚓</div>
              </motion.div>
            ) : (
              <TipForm onSuccess={handleTipSuccess} onCancel={handleCancel} />
            )}
          </Elements>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TipComponent;