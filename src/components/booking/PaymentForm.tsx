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
            <div className="bg-[#111128] p-6 rounded-xl border border-[#2a2a4a]">
                <h3 className="text-xl font-semibold mb-4 text-[#e0f0ff] font-serif">Payment Details</h3>
                <p className="text-[#5a6a8a] mb-6">Total to pay: <span className="font-bold text-[#00f0ff] text-lg">${amount.toFixed(2)}</span></p>

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
                className="w-full bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] hover:opacity-90 text-[#001a1f] font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#00f0ff]/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center uppercase tracking-wider"
            >
                {isProcessing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#001a1f]"></div>
                ) : (
                    `Pay $${amount.toFixed(2)}`
                )}
            </button>
        </form>
    );
}
