'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import DateSelector from '@/components/booking/DateSelector';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import GuestForm from '@/components/booking/GuestForm';
import PaymentForm from '@/components/booking/PaymentForm';
import PriceBreakdown from '@/components/booking/PriceBreakdown';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ShieldCheck, Anchor, CreditCard } from 'lucide-react';
import { BUSINESS_INFO } from '@/config/business';
import { BOOKING_CONFIG } from '@/config/booking';

export default function BookingClient() {
    const [step, setStep] = useState(1);

    // Initialize with Mountain Time Date
    const [todayStr] = useState<string>(() => {
        const now = new Date();
        const mtDateString = now.toLocaleDateString('en-US', { timeZone: 'America/Denver' });
        const mtDate = new Date(mtDateString);
        return mtDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
    });

    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const now = new Date();
        const mtDateString = now.toLocaleDateString('en-US', { timeZone: 'America/Denver' });
        const mtDate = new Date(mtDateString);
        const today = mtDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

        // Check against season start
        const seasonStart = BOOKING_CONFIG.seasons[0].startDate; // 2026-05-01
        if (today < seasonStart) {
            return seasonStart;
        }
        return today;
    });
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        party_size: number | '';
        notes: string;
        add_ons: {
            photo_package: number;
            gopro_package: number;
            combo_package: number;
            observer_package: number;
            tip_amount: number;
        }
    }>({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        party_size: 2,
        notes: '',
        add_ons: {
            photo_package: 0,
            gopro_package: 0,
            combo_package: 0,
            observer_package: 0,
            tip_amount: 0,
        }
    });
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    // Availability
    const [availableSlots, setAvailableSlots] = useState<{ time: string, remaining: number, type: string, price: number }[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Tiered pricing based on slot type: Early Bird $99, Standard $119, Sunset $159
    const getBasePricePerPerson = () => {
        const slot = availableSlots.find(s => s.time === selectedTime);
        if (slot) return slot.price;
        return BUSINESS_INFO.pricing.parasail; // default to standard $119
    };

    useEffect(() => {
        if (selectedDate) {
            setIsLoadingSlots(true);
            fetch(`/api/availability?date=${selectedDate}&t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    if (data.slots) {
                        setAvailableSlots(data.slots);
                    } else {
                        console.error('Failed to load slots:', data.error);
                    }
                })
                .catch(err => console.error('Availability fetch error:', err))
                .finally(() => setIsLoadingSlots(false));
        }
    }, [selectedDate]);

    // Derived state for max party size
    const selectedSlotInfo = availableSlots.find(s => s.time === selectedTime);
    const maxPartySize = selectedSlotInfo ? selectedSlotInfo.remaining : BOOKING_CONFIG.MAX_PASSENGERS;

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(null);
        setClientSecret(null);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        const newSlot = availableSlots.find(s => s.time === time);
        if (newSlot && Number(formData.party_size) > newSlot.remaining) {
            setFormData(prev => ({ ...prev, party_size: newSlot.remaining }));
        }
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
                [name]: name === 'party_size' ? (value === '' ? '' : parseInt(value)) : value
            }));
        }
    };

    // Validation Logic
    const isFormValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

        return (
            formData.customer_name.length > 2 &&
            emailRegex.test(formData.customer_email) &&
            phoneRegex.test(formData.customer_phone) &&
            Number(formData.party_size) > 0 &&
            Number(formData.party_size) <= maxPartySize
        );
    };

    // Prepare payment when moving to step 3
    const handleProceedToPayment = async () => {
        if (!isFormValid()) {
            alert("Please fill in a valid email and phone number.");
            return;
        }

        setStep(3);

        try {
            const res = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trip_date: selectedDate,
                    trip_time: selectedTime,
                    party_size: Number(formData.party_size),
                    add_ons: formData.add_ons
                }),
            });
            const data = await res.json();
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                console.error("Failed to get client secret", data);
                alert("Error initializing payment. Please try again.");
                setStep(2);
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
            setStep(2);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    trip_date: selectedDate,
                    trip_time: selectedTime!,
                    payment_intent_id: paymentIntentId,
                    party_size: Number(formData.party_size),
                    add_ons: formData.add_ons,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                window.location.href = `/book/success?booking_id=${result.booking?.id || result.id}`;
            } else {
                alert("Payment successful but booking creation failed. Please contact us.");
            }
        } catch (err) {
            console.error("Booking creation failed", err);
            alert("Payment successful but booking creation failed. Please contact us.");
        }
    };

    const calculateTotal = () => {
        const partySize = Number(formData.party_size) || 0;
        const pricePerPerson = getBasePricePerPerson();
        let base = partySize * pricePerPerson;

        base += (formData.add_ons.combo_package || 0) * BUSINESS_INFO.pricing.combo;
        base += (formData.add_ons.photo_package || 0) * BUSINESS_INFO.pricing.photos;
        base += (formData.add_ons.gopro_package || 0) * BUSINESS_INFO.pricing.gopro;
        base += (formData.add_ons.observer_package || 0) * BUSINESS_INFO.pricing.observer;
        base += (formData.add_ons.tip_amount || 0);

        return base;
    };

    const currentPricePerPerson = getBasePricePerPerson();
    const selectedSlotType = availableSlots.find(s => s.time === selectedTime)?.type || 'standard';

    return (
        <div className="min-h-screen bg-[#FFF8EE] text-[#2D1600] flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FFF8EE]">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section with Trust Badges */}
                    <div className="text-center mb-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9500] to-[#FFD700] text-[#FFFFFF] px-6 py-2.5 rounded-full mb-6 shadow-lg hover:shadow-[#FF9500]/25 transition-shadow"
                        >
                            <Calendar className="h-5 w-5" />
                            <span className="font-bold">Book Your Flight</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[#2D1600] mb-6 font-[family-name:var(--font-headline)]"
                        >
                            Secure Your Spot
                        </motion.h1>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-4 mb-8"
                        >
                            <div className="flex items-center gap-2 bg-[#FF9500]/10 text-[#FF9500] px-4 py-2 rounded-lg">
                                <Anchor className="w-5 h-5" />
                                <span className="font-semibold text-sm">Weather Guarantee</span>
                            </div>
                            <div className="flex items-center gap-2 bg-[#FFFFFF]/10 text-[#FFFFFF] px-4 py-2 rounded-lg">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="font-semibold text-sm">Satisfaction Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] px-4 py-2 rounded-lg">
                                <CreditCard className="w-5 h-5" />
                                <span className="font-semibold text-sm">Secure Payment</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-center items-center space-x-4 mb-12 max-w-lg mx-auto">
                        {[
                            { step: 1, label: 'Date & Time' },
                            { step: 2, label: 'Details' },
                            { step: 3, label: 'Payment' }
                        ].map((s) => (
                            <div key={s.step} className="flex items-center">
                                <div className={`
                                    flex flex-col items-center gap-2
                                    ${step >= s.step ? 'text-[#FF9500]' : 'text-[#8B6914]'}
                                `}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= s.step ? 'bg-[#FF9500] text-[#FFFFFF] shadow-lg shadow-[#FF9500]/30' : 'bg-[#FFD699]'}`}>
                                        {s.step}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">{s.label}</span>
                                </div>
                                {s.step < 3 && (
                                    <div className={`w-12 h-0.5 mx-4 transition-colors duration-300 -translate-y-3 ${step > s.step ? 'bg-[#FF9500]' : 'bg-[#FFD699]'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                            >
                                <div className="lg:col-span-5">
                                    <DateSelector
                                        selectedDate={selectedDate}
                                        onSelectDate={handleDateSelect}
                                        minDate={todayStr}
                                    />
                                </div>

                                <div className="lg:col-span-7 space-y-8">
                                    <div className="bg-[#FFEACC] rounded-xl shadow-xl p-8">
                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#2D1600]">
                                            <span className="bg-[#FF9500]/10 text-[#FF9500] p-2 rounded-xl">&#9201;</span>
                                            Select Time
                                        </h3>
                                        <TimeSlotPicker
                                            slots={availableSlots}
                                            selectedTime={selectedTime}
                                            onSelectTime={handleTimeSelect}
                                            isLoading={isLoadingSlots}
                                        />
                                    </div>

                                    {/* Pricing Info Banner */}
                                    {selectedTime && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 bg-[#FFEACC] rounded-xl p-5"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{selectedSlotType === 'earlybird' ? '\u2600\uFE0F' : selectedSlotType === 'sunset' ? '\uD83C\uDF05' : '\u26F5'}</span>
                                                <div>
                                                    <h4 className="font-bold text-[#2D1600] text-lg">
                                                        {selectedSlotType === 'earlybird' ? 'Early Bird Flight' : selectedSlotType === 'sunset' ? 'Sunset Flight' : 'Standard Flight'} -- ${currentPricePerPerson}/person
                                                    </h4>
                                                    <p className="text-sm text-[#614020] mt-1">
                                                        {selectedSlotType === 'earlybird'
                                                            ? 'Catch the calm morning waters! Best value at $99/person with smooth conditions and serene mountain views.'
                                                            : selectedSlotType === 'sunset'
                                                            ? 'Experience golden hour magic! Premium sunset flight at $159/person with stunning Montana sunset views.'
                                                            : 'Soar 400 feet above Flathead Lake at $119/person with breathtaking mountain views.'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FF9500]/10 text-[#FF9500] px-2.5 py-1 rounded-full">400ft altitude</span>
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FFFFFF]/10 text-[#FFFFFF] px-2.5 py-1 rounded-full">Mountain views</span>
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FFD700]/10 text-[#FFD700] px-2.5 py-1 rounded-full">USCG certified</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => setStep(2)}
                                            disabled={!selectedTime}
                                            className="bg-[#FF9500] hover:bg-[#E07B00] text-[#FFFFFF] text-lg font-bold px-10 py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#FF9500]/25 hover:scale-105"
                                        >
                                            Continue to Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                            >
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="bg-[#FFEACC] rounded-xl shadow-xl overflow-hidden">
                                        <div className="p-8">
                                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#2D1600]">
                                                <span className="bg-[#FF9500]/10 text-[#FF9500] p-2 rounded-xl">&#128100;</span>
                                                Guest Details
                                            </h3>
                                            <GuestForm
                                                formData={formData as any}
                                                onChange={handleFormChange}
                                                maxPartySize={maxPartySize}
                                                selectedDate={selectedDate}
                                                selectedTime={selectedTime}
                                                pricePerPerson={currentPricePerPerson}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-[#8B6914] hover:text-[#2D1600] px-6 py-3 font-semibold transition-colors"
                                        >
                                            &larr; Back
                                        </button>
                                        <button
                                            onClick={handleProceedToPayment}
                                            disabled={!isFormValid()}
                                            className="bg-[#FF9500] hover:bg-[#E07B00] disabled:opacity-50 disabled:cursor-not-allowed text-[#FFFFFF] text-lg px-10 py-4 rounded-full transition-all font-bold shadow-lg hover:shadow-[#FF9500]/25 hover:scale-105"
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <div className="sticky top-32">
                                        <PriceBreakdown
                                            partySize={formData.party_size}
                                            addOns={formData.add_ons}
                                            basePricePerPerson={currentPricePerPerson}
                                            slotType={selectedSlotType}
                                        />
                                        <p className="text-center text-xs text-[#8B6914] mt-4">
                                            You won&apos;t be charged until the next step.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && clientSecret && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                            >
                                <div className="lg:col-span-7">
                                    <div className="bg-[#FFEACC] p-8 rounded-xl shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9500]/5 rounded-bl-full -mr-10 -mt-10" />

                                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#2D1600] relative z-10">
                                            <span className="bg-[#FFFFFF]/10 text-[#FFFFFF] p-2 rounded-xl">&#128274;</span>
                                            Secure Payment
                                        </h3>

                                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', labels: 'floating' } }}>
                                            <PaymentForm
                                                amount={calculateTotal()}
                                                onSuccess={handlePaymentSuccess}
                                                onError={(err) => alert(err)}
                                            />
                                        </Elements>
                                        <div className="mt-6 pt-6 border-t border-[#DCC8A0]/30">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="text-[#8B6914] hover:text-[#2D1600] text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                &larr; Back to Details
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <div className="sticky top-32">
                                        <PriceBreakdown
                                            partySize={formData.party_size}
                                            addOns={formData.add_ons}
                                            basePricePerPerson={currentPricePerPerson}
                                            slotType={selectedSlotType}
                                        />
                                        <div className="mt-4 bg-[#FFFFFF]/10 p-4 rounded-xl flex items-start gap-3">
                                            <ShieldCheck className="w-5 h-5 text-[#FFFFFF] mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-[#2D1600]">
                                                    Payment Protection
                                                </p>
                                                <p className="text-xs text-[#614020] mt-1">
                                                    All transactions are secure and encrypted. You&apos;ll receive an instant confirmation email.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
}
