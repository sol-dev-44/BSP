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
        color: 'text-[#fbbb45]',
        bgColor: 'bg-[#38261a]',
        borderColor: 'border-[#564240]',
        badgeBg: 'bg-[#fbbb45]/15 text-[#fbbb45]',
    },
    standard: {
        label: 'Standard',
        color: 'text-[#f4ba96]',
        bgColor: 'bg-[#38261a]',
        borderColor: 'border-[#564240]',
        badgeBg: 'bg-[#f4ba96]/15 text-[#f4ba96]',
    },
    sunset: {
        label: 'Sunset',
        color: 'text-[#ffb3ad]',
        bgColor: 'bg-[#38261a]',
        borderColor: 'border-[#564240]',
        badgeBg: 'bg-[#ffb3ad]/15 text-[#ffb3ad]',
    },
};

export default function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading }: TimeSlotPickerProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffb3ad]"></div>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="text-center p-8 bg-[#190b03] rounded-xl">
                <p className="text-[#a58b88]">No available slots for this date.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-2 text-[#fbddca] font-serif">Select a Time</h3>
            <p className="text-sm text-[#a58b88] mb-4">
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
                                    ? 'bg-[#ffb3ad] border-[#ffb3ad] text-[#640c0f] shadow-lg shadow-[#ffb3ad]/30'
                                    : `bg-[#38261a] ${config.borderColor} text-[#fbddca] hover:shadow-md hover:border-[#ffb3ad]`
                                }
                            `}
                        >
                            {/* Slot type badge */}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                                isSelected ? 'bg-[#640c0f]/20 text-[#640c0f]' : config.badgeBg
                            }`}>
                                {config.label}
                            </span>

                            <span className="text-lg font-bold">
                                {slot.time}
                            </span>

                            {/* Price */}
                            <span className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-[#640c0f]/90' : config.color}`}>
                                ${slot.price}/person
                            </span>

                            {/* Spots remaining */}
                            <span className={`text-[10px] mt-1 ${isSelected ? 'text-[#640c0f]/70' : 'text-[#a58b88]'}`}>
                                {slot.remaining} of {BOOKING_CONFIG.MAX_PASSENGERS} spots
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
