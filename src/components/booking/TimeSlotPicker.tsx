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
        color: 'text-[#ff00ff]',
        bgColor: 'bg-[#1a1a3e]',
        borderColor: 'border-[#2a2a4a]',
        badgeBg: 'bg-[#ff00ff]/15 text-[#ff00ff]',
    },
    standard: {
        label: 'Standard',
        color: 'text-[#b8ff00]',
        bgColor: 'bg-[#1a1a3e]',
        borderColor: 'border-[#2a2a4a]',
        badgeBg: 'bg-[#b8ff00]/15 text-[#b8ff00]',
    },
    sunset: {
        label: 'Sunset',
        color: 'text-[#00f0ff]',
        bgColor: 'bg-[#1a1a3e]',
        borderColor: 'border-[#2a2a4a]',
        badgeBg: 'bg-[#00f0ff]/15 text-[#00f0ff]',
    },
};

export default function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading }: TimeSlotPickerProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f0ff]"></div>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="text-center p-8 bg-[#050510] rounded-xl">
                <p className="text-[#5a6a8a]">No available slots for this date.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-2 text-[#e0f0ff] font-serif">Select a Time</h3>
            <p className="text-sm text-[#5a6a8a] mb-4">
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
                                    ? 'bg-[#00f0ff] border-[#00f0ff] text-[#001a1f] shadow-lg shadow-[#00f0ff]/30'
                                    : `bg-[#1a1a3e] ${config.borderColor} text-[#e0f0ff] hover:shadow-md hover:border-[#00f0ff]`
                                }
                            `}
                        >
                            {/* Slot type badge */}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                                isSelected ? 'bg-[#001a1f]/20 text-[#001a1f]' : config.badgeBg
                            }`}>
                                {config.label}
                            </span>

                            <span className="text-lg font-bold">
                                {slot.time}
                            </span>

                            {/* Price */}
                            <span className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-[#001a1f]/90' : config.color}`}>
                                ${slot.price}/person
                            </span>

                            {/* Spots remaining */}
                            <span className={`text-[10px] mt-1 ${isSelected ? 'text-[#001a1f]/70' : 'text-[#5a6a8a]'}`}>
                                {slot.remaining} of {BOOKING_CONFIG.MAX_PASSENGERS} spots
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
