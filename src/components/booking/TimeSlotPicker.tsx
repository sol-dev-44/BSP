import { motion } from 'framer-motion';
import { BOOKING_CONFIG } from '@/config/booking';

interface TimeSlot {
    time: string;
    remaining: number;
    type: string;
    price: number;
}

interface TimeSlotPickerProps {
    slots: TimeSlot[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    isLoading: boolean;
}

const slotTypeConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string; badgeBg: string }> = {
    earlybird: {
        label: 'Early Bird',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        badgeBg: 'bg-amber-100 text-amber-800',
    },
    standard: {
        label: 'Standard',
        color: 'text-sky-700',
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-200',
        badgeBg: 'bg-sky-100 text-sky-800',
    },
    sunset: {
        label: 'Sunset',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        badgeBg: 'bg-orange-100 text-orange-800',
    },
};

export default function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading }: TimeSlotPickerProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4605A]"></div>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="text-center p-8 bg-stone-50 dark:bg-[#1A130E] rounded-xl">
                <p className="text-foreground/60">No available slots for this date.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-2 text-foreground font-serif">Select a Time</h3>
            <p className="text-sm text-foreground/60 mb-4">
                Early Bird (9 AM) $99 | Standard $119 | Sunset (last flight) $159
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {slots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const config = slotTypeConfig[slot.type] || slotTypeConfig.standard;

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
                                    ? 'bg-[#D4605A] border-[#D4605A] text-white shadow-lg shadow-[#D4605A]/30'
                                    : `bg-white dark:bg-[#2A1F17] ${config.borderColor} text-foreground hover:shadow-md hover:border-[#D4605A]`
                                }
                            `}
                        >
                            {/* Slot type badge */}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                                isSelected ? 'bg-white/20 text-white' : config.badgeBg
                            }`}>
                                {config.label}
                            </span>

                            <span className="text-lg font-bold">
                                {slot.time}
                            </span>

                            {/* Price */}
                            <span className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-white/90' : config.color}`}>
                                ${slot.price}/person
                            </span>

                            {/* Spots remaining */}
                            <span className={`text-[10px] mt-1 ${isSelected ? 'text-white/70' : 'text-foreground/40'}`}>
                                {slot.remaining} of {BOOKING_CONFIG.MAX_PASSENGERS} spots
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
