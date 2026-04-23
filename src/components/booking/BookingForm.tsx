"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Loader2, Calendar, ShieldCheck, CreditCard } from 'lucide-react';
import { BUSINESS_INFO } from '@/config/business';
import { BOOKING_CONFIG, getTimeSlotsForDayOfWeek } from '@/config/booking';
import { getSlotType, getSlotPrice } from '@/config/solarSchedule';
import DateSelector from './DateSelector';
import TimeSlotPicker from './TimeSlotPicker';
import GuestForm from './GuestForm';
import PaymentForm from './PaymentForm';
import PriceBreakdown from './PriceBreakdown';
import * as gtag from '@/lib/gtag';

interface BookingFormProps {
    className?: string;
}

export default function BookingForm({ className }: BookingFormProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        party_size: 2,
        boat_riders: 0,
        notes: '',
        add_ons: {
            photo_package: 0,
            gopro_package: 0,
            tip_amount: 0,
        }
    });

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (!selectedDate) setSelectedDate(today);
    }, []);

    // Availability
    const [availableSlots, setAvailableSlots] = useState<{ time: string, remaining: number, type: string, price: number }[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            setIsLoadingSlots(true);
            setTimeout(() => {
                const parts = selectedDate.split('-');
                const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                const dayOfWeek = dateObj.getDay();
                const solarSlots = getTimeSlotsForDayOfWeek(dayOfWeek, selectedDate);
                const slots = solarSlots.map(time => {
                    const type = getSlotType(selectedDate, time);
                    return {
                        time,
                        remaining: BOOKING_CONFIG.MAX_PASSENGERS,
                        type,
                        price: getSlotPrice(type),
                    };
                });
                setAvailableSlots(slots);
                setIsLoadingSlots(false);
            }, 500);
        }
    }, [selectedDate]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(null);
        setClientSecret(null);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('add_ons.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                add_ons: {
                    ...prev.add_ons,
                    [field]: parseInt(value) || 0
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: (name === 'party_size' || name === 'boat_riders') ? parseInt(value) || 0 : value
            }));
        }
    };

    const isFormValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const totalPassengers = formData.party_size + formData.boat_riders;
        return (
            formData.customer_name.length > 2 &&
            emailRegex.test(formData.customer_email) &&
            formData.customer_phone.length > 9 &&
            totalPassengers > 0 &&
            totalPassengers <= BOOKING_CONFIG.MAX_PASSENGERS
        );
    };

    const handleProceedToPayment = async () => {
        if (!isFormValid()) return;
        setLoading(true);

        const slotType = selectedDate && selectedTime ? getSlotType(selectedDate, selectedTime) : 'standard';
        gtag.trackBeginCheckout(calculateTotal(), formData.party_size, formData.boat_riders, slotType);

        try {
            const res = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trip_date: selectedDate,
                    trip_time: selectedTime,
                    party_size: formData.party_size,
                    boat_riders: formData.boat_riders,
                    add_ons: {
                        ...formData.add_ons,
                        observer_count: formData.boat_riders,
                    },
                }),
            });
            const data = await res.json();

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                setStep(3);
            } else {
                alert('Error initializing payment: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_phone: formData.customer_phone,
                    party_size: formData.party_size,
                    boat_riders: formData.boat_riders,
                    notes: formData.notes,
                    add_ons: {
                        ...formData.add_ons,
                        observer_count: formData.boat_riders,
                    },
                    trip_date: selectedDate,
                    trip_time: selectedTime,
                    payment_intent_id: paymentIntentId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                const slotType = selectedDate && selectedTime ? getSlotType(selectedDate, selectedTime) : 'standard';
                gtag.trackPurchase(paymentIntentId, calculateTotal(), formData.party_size, formData.boat_riders, slotType);
                setStep(4);
            } else {
                alert('Booking creation failed: ' + data.error);
            }
        } catch (error) {
            alert('Error creating booking record. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    const getSelectedSlotPrice = (): number => {
        if (!selectedTime || !selectedDate) return BUSINESS_INFO.pricing.parasail;
        const slotType = getSlotType(selectedDate, selectedTime);
        return getSlotPrice(slotType);
    };

    const calculateTotal = () => {
        const size = formData.party_size || 0;
        const pricePerPerson = getSelectedSlotPrice();
        let base = size * pricePerPerson;
        base += (formData.boat_riders || 0) * BUSINESS_INFO.pricing.observer;
        base += ((formData.add_ons as any).combo_package || 0) * BUSINESS_INFO.pricing.combo;
        base += (formData.add_ons.photo_package || 0) * BUSINESS_INFO.pricing.photos;
        base += (formData.add_ons.gopro_package || 0) * BUSINESS_INFO.pricing.gopro;
        base += (formData.add_ons.tip_amount || 0);
        return base;
    };

    // Step 4: Success
    if (step === 4) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-lg mx-auto border-2 border-[#FF9500]">
                <div className="w-20 h-20 bg-[#FF9500]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-[#FF9500]" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 font-serif">Booking Confirmed!</h3>
                <p className="text-foreground/70 mb-6">
                    Thank you, {formData.customer_name}. Your reservation for {selectedDate} at {selectedTime} is confirmed.
                    Check your email for details.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-[#FF9500] hover:bg-[#E07B00] text-white font-bold py-3 px-6 rounded-lg transition-colors uppercase tracking-wider"
                >
                    Book Another
                </button>
            </div>
        );
    }

    return (
        <div className={`max-w-6xl mx-auto rounded-3xl ${className}`}>
            {/* Progress Steps */}
            <div className="flex justify-center items-center space-x-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`flex flex-col items-center gap-2 ${step >= s ? 'text-[#FF9500]' : 'text-stone-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-[#FF9500] text-white' : 'bg-stone-200'}`}>
                                {s}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                                {s === 1 ? 'Date & Time' : s === 2 ? 'Details' : 'Payment'}
                            </span>
                        </div>
                        {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-[#FF9500]' : 'bg-stone-200'}`} />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground font-serif">
                                        <Calendar className="text-[#FF9500]" /> Select Date
                                    </h3>
                                    <DateSelector
                                        selectedDate={selectedDate}
                                        onSelectDate={handleDateSelect}
                                        minDate={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {selectedDate && (
                                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200">
                                        <TimeSlotPicker
                                            slots={availableSlots}
                                            selectedTime={selectedTime}
                                            onSelectTime={handleTimeSelect}
                                            isLoading={isLoadingSlots}
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            if (selectedTime && selectedDate) {
                                                const slotType = getSlotType(selectedDate, selectedTime);
                                                gtag.trackSlotSelected(selectedDate, selectedTime, slotType, getSlotPrice(slotType));
                                            }
                                            setStep(2);
                                        }}
                                        disabled={!selectedTime}
                                        className="bg-[#FF9500] hover:bg-[#E07B00] text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#FF9500]/20 uppercase tracking-wider"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200 mb-6">
                                    <GuestForm
                                        formData={formData}
                                        onChange={handleFormChange}
                                        maxPartySize={BOOKING_CONFIG.MAX_PASSENGERS}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        pricePerPerson={getSelectedSlotPrice()}
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <button onClick={() => setStep(1)} className="text-foreground/60 hover:text-foreground font-semibold px-4">Back</button>
                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={!isFormValid() || loading}
                                        className="bg-[#FF9500] hover:bg-[#E07B00] text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#FF9500]/20 flex items-center gap-2 uppercase tracking-wider"
                                    >
                                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                                        Proceed to Payment
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && clientSecret && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200 mb-6">
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                        <PaymentForm
                                            amount={calculateTotal()}
                                            onSuccess={handlePaymentSuccess}
                                            onError={(err) => alert(err)}
                                        />
                                    </Elements>
                                </div>
                                <button onClick={() => setStep(2)} className="text-foreground/60 hover:text-foreground font-semibold px-4">Back to Details</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar / Price Breakdown */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-4">
                        <PriceBreakdown
                            partySize={formData.party_size}
                            boatRiders={formData.boat_riders}
                            basePricePerPerson={getSelectedSlotPrice()}
                            slotType={selectedDate && selectedTime ? getSlotType(selectedDate, selectedTime) : 'standard'}
                            addOns={formData.add_ons}
                        />
                        <div className="bg-[#FF9500]/10 p-4 rounded-xl border border-[#FF9500]/20 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#FF9500] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-foreground">
                                    Payment Protection
                                </p>
                                <p className="text-xs text-foreground/70 mt-1">
                                    Secure, encrypted transaction. Instant confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
