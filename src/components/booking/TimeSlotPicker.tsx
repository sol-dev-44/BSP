import { motion } from 'framer-motion';
import { Phone, Wind } from 'lucide-react';
import { BOOKING_CONFIG } from '@/config/booking';
import { BUSINESS_INFO } from '@/config/business';
import { MIN_BOOKING_NOTICE_HOURS } from '@/config/solarSchedule';

interface TimeSlot {
    time: string;
    remaining: number;
    type: string;
    price: number;
    availability?: 'past' | 'too-soon' | 'bookable';
    blocked?: boolean;
}

type DateNotice =
    | { type: 'weather'; message: string }
    | { type: 'event'; emoji: string; title: string; message: string };

interface TimeSlotPickerProps {
    slots: TimeSlot[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    isLoading: boolean;
    dateNotice?: DateNotice | null;
}

const slotTypeConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string; badgeBg: string }> = {
    earlybird: {
        label: 'Early Bird',
        color: 'text-[#B8860B]',
        bgColor: 'bg-[#FFD699]',
        borderColor: 'border-[#DCC8A0]',
        badgeBg: 'bg-[#FFD700]/15 text-[#3D1C00]',
    },
    standard: {
        label: 'Standard',
        color: 'text-[#3D1C00]',
        bgColor: 'bg-[#FFD699]',
        borderColor: 'border-[#DCC8A0]',
        badgeBg: 'bg-[#FF9500]/15 text-[#3D1C00]',
    },
    sunset: {
        label: 'Sunset',
        color: 'text-[#FF9500]',
        bgColor: 'bg-[#FFD699]',
        borderColor: 'border-[#DCC8A0]',
        badgeBg: 'bg-[#FF9500]/15 text-[#FF9500]',
    },
};

export default function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading, dateNotice }: TimeSlotPickerProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9500]"></div>
            </div>
        );
    }

    if (dateNotice?.type === 'weather') {
        return (
            <div className="w-full">
                <h3 className="text-xl font-semibold mb-4 text-[#2D1600] font-serif">Select a Time</h3>
                <div className="relative overflow-hidden rounded-2xl border border-[#7BA7C7]/40 bg-gradient-to-br from-[#E8F1F8] via-[#F0F5FA] to-[#E8F1F8] p-8 text-center">
                    <div className="absolute -top-6 -right-6 opacity-20">
                        <Wind className="w-32 h-32 text-[#5A8BA8]" strokeWidth={1.25} />
                    </div>
                    <div className="relative">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5A8BA8] text-white mb-4 shadow-lg shadow-[#5A8BA8]/30">
                            <Wind className="w-8 h-8" strokeWidth={2} />
                        </div>
                        <h4 className="text-2xl font-bold text-[#2D1600] mb-2 font-serif">
                            {dateNotice.message}
                        </h4>
                        <p className="text-sm text-[#5A6B7A] max-w-sm mx-auto">
                            Conditions on Flathead Lake aren&apos;t safe for parasailing today.
                            Please pick another date — we&apos;ll see you on the water soon!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="text-center p-8 bg-[#FFFFFF] rounded-xl">
                <p className="text-[#8B6914]">No available slots for this date.</p>
            </div>
        );
    }

    const hasTooSoon = slots.some(s => s.availability === 'too-soon');
    const allUnbookable = slots.every(s => s.availability === 'past' || s.availability === 'too-soon');
    const eventNotice = dateNotice?.type === 'event' ? dateNotice : null;
    const allBlocked = slots.every(s => s.blocked);

    // Fully closed day with an event notice — promote the banner to a full
    // closed-day card so the customer isn't staring at a grid of struck-through
    // tiles wondering if any of them are still bookable.
    if (eventNotice && allBlocked) {
        return (
            <div className="w-full">
                <h3 className="text-xl font-semibold mb-4 text-[#2D1600] font-serif">Select a Time</h3>
                <div className="relative overflow-hidden rounded-2xl border border-[#FF9500]/40 bg-gradient-to-br from-[#FFEACC] via-[#FFD699] to-[#FFEACC] p-8 text-center">
                    <div className="relative">
                        <div className="text-6xl mb-4 leading-none" aria-hidden="true">
                            {eventNotice.emoji}
                        </div>
                        <h4 className="text-2xl font-bold text-[#2D1600] mb-2 font-serif">
                            {eventNotice.title}
                        </h4>
                        <p className="text-sm text-[#614020] max-w-sm mx-auto">
                            {eventNotice.message}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-2 text-[#2D1600] font-serif">Select a Time</h3>
            <p className="text-sm text-[#8B6914] mb-4">
                Early Bird (10 AM) $99 | Standard $119 | Sunset (last flight) $159
            </p>

            {eventNotice && (
                <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-gradient-to-r from-[#FFEACC] via-[#FFD699] to-[#FFEACC] border border-[#FF9500]/40">
                    <span className="text-3xl shrink-0 leading-none" aria-hidden="true">{eventNotice.emoji}</span>
                    <div className="text-left">
                        <p className="font-bold text-[#2D1600] text-base">{eventNotice.title}</p>
                        <p className="text-sm text-[#614020] mt-0.5">{eventNotice.message}</p>
                    </div>
                </div>
            )}

            {(hasTooSoon || allUnbookable) && (
                <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-gradient-to-r from-[#FF9500]/10 to-[#FFD700]/10 border border-[#FF9500]/30 hover:border-[#FF9500] hover:shadow-md transition-all group"
                >
                    <span className="bg-[#FF9500] text-white p-2 rounded-lg shrink-0">
                        <Phone className="w-4 h-4" />
                    </span>
                    <div className="text-left">
                        <p className="font-bold text-[#2D1600] text-sm">
                            Need to fly within {MIN_BOOKING_NOTICE_HOURS} hours?
                        </p>
                        <p className="text-xs text-[#614020] mt-0.5">
                            Online booking requires {MIN_BOOKING_NOTICE_HOURS}-hour notice. Call us at{' '}
                            <span className="font-bold text-[#FF9500] underline group-hover:no-underline">
                                {BUSINESS_INFO.displayPhone}
                            </span>{' '}
                            to check same-day availability.
                        </p>
                    </div>
                </a>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {slots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const config = slotTypeConfig[slot.type] || slotTypeConfig.standard;
                    const isPast = slot.availability === 'past';
                    const isTooSoon = slot.availability === 'too-soon';
                    const isBlocked = slot.blocked && !isPast && !isTooSoon;
                    const isDisabled = isPast || isTooSoon || isBlocked;

                    if (isDisabled) {
                        const badgeText = isPast
                            ? 'Past'
                            : isTooSoon
                            ? 'Call to book'
                            : 'Closed';
                        const subText = isPast
                            ? 'Unavailable'
                            : isTooSoon
                            ? `< ${MIN_BOOKING_NOTICE_HOURS} hr notice`
                            : 'Not available';
                        return (
                            <button
                                key={slot.time}
                                type="button"
                                disabled
                                aria-disabled="true"
                                className="relative py-3 px-4 rounded-xl border border-dashed border-[#DCC8A0] bg-[#FFF8EE] text-[#A8946B] flex flex-col items-center justify-center cursor-not-allowed select-none"
                            >
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-[#DCC8A0]/30 text-[#8B6914]">
                                    {badgeText}
                                </span>
                                <span className="text-lg font-bold line-through decoration-[#A8946B]/60">
                                    {slot.time}
                                </span>
                                <span className="text-[10px] mt-1 text-[#A8946B]">
                                    {subText}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <motion.button
                            key={slot.time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectTime(slot.time)}
                            type="button"
                            className={`
                                relative py-3 px-4 rounded-xl border flex flex-col items-center justify-center transition-all
                                ${isSelected
                                    ? 'bg-[#FF9500] border-[#FF9500] text-[#FFFFFF] shadow-lg shadow-[#FF9500]/30'
                                    : `bg-[#FFD699] ${config.borderColor} text-[#2D1600] hover:shadow-md hover:border-[#FF9500]`
                                }
                            `}
                        >
                            {/* Slot type badge */}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                                isSelected ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : config.badgeBg
                            }`}>
                                {config.label}
                            </span>

                            <span className="text-lg font-bold">
                                {slot.time}
                            </span>

                            {/* Price */}
                            <span className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-[#FFFFFF]/90' : config.color}`}>
                                ${slot.price}/person
                            </span>

                            {/* Spots remaining */}
                            <span className={`text-[10px] mt-1 ${isSelected ? 'text-[#FFFFFF]/70' : 'text-[#8B6914]'}`}>
                                {slot.remaining} of {BOOKING_CONFIG.MAX_PASSENGERS} spots
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
