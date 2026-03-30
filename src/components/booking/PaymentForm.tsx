import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

interface PaymentFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (error: string) => void;
}

export default function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/book/success`,
            },
            redirect: 'if_required',
        });

        if (error) {
            onError(error.message || 'Payment failed');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        } else {
            onError("Payment status unknown. Please contact support.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#FFEACC] p-6 rounded-xl border border-[#DCC8A0]">
                <h3 className="text-xl font-semibold mb-4 text-[#2D1600] font-serif">Payment Details</h3>
                <p className="text-[#8B6914] mb-6">Total to pay: <span className="font-bold text-[#FF9500] text-lg">${amount.toFixed(2)}</span></p>

                <PaymentElement
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
                    }}
                    onChange={(event) => {
                        setIsReady(event.complete);
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing || !isReady}
                className="w-full bg-gradient-to-r from-[#FF9500] to-[#FFD700] hover:opacity-90 text-[#FFFFFF] font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#FF9500]/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center uppercase tracking-wider"
            >
                {isProcessing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFFFFF]"></div>
                ) : (
                    `Pay $${amount.toFixed(2)}`
                )}
            </button>
        </form>
    );
}
