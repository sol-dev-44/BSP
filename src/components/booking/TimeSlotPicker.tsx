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

export default function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading }: TimeSlotPickerProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9500]"></div>
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

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-2 text-[#2D1600] font-serif">Select a Time</h3>
            <p className="text-sm text-[#8B6914] mb-4">
                Early Bird (10 AM) $99 | Standard $119 | Sunset (last flight) $159
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
