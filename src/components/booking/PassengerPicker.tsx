'use client';

import { Minus, Plus } from 'lucide-react';

interface PassengerPickerProps {
    label: string;
    sublabel?: string;
    value: number;
    min: number;
    max: number;
    priceLabel?: string;
    onChange: (newValue: number) => void;
}

export default function PassengerPicker({ label, sublabel, value, min, max, priceLabel, onChange }: PassengerPickerProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#FFD699] rounded-xl border border-[#DCC8A0]">
            <div className="flex-1">
                <p className="text-sm font-semibold text-[#2D1600]">{label}</p>
                {sublabel && <p className="text-xs text-[#8B6914] mt-0.5">{sublabel}</p>}
                {priceLabel && <p className="text-xs text-[#FF9500] font-semibold mt-0.5">{priceLabel}</p>}
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="w-9 h-9 rounded-full border-2 border-[#DCC8A0] flex items-center justify-center text-[#614020] hover:border-[#FF9500] hover:text-[#FF9500] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold text-[#2D1600]">{value}</span>
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="w-9 h-9 rounded-full border-2 border-[#DCC8A0] flex items-center justify-center text-[#614020] hover:border-[#FF9500] hover:text-[#FF9500] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
