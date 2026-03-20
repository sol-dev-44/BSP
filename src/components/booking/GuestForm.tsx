import { useState } from 'react';
import { BUSINESS_INFO } from '@/config/business';

interface GuestFormProps {
    formData: {
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        party_size: number;
        boat_riders: number;
        notes: string;
        add_ons: {
            photo_package: number;
            gopro_package: number;
            tip_amount?: number;
        };
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    maxPartySize: number;
    selectedDate: string;
    selectedTime: string | null;
}

export default function GuestForm({ formData, onChange, maxPartySize, selectedDate, selectedTime }: GuestFormProps) {
    const [touched, setTouched] = useState({
        customer_name: false,
        customer_email: false,
        customer_phone: false,
        party_size: false,
    });

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // Validation Helpers
    const isNameValid = formData.customer_name.length > 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email);
    const isPhoneValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.customer_phone);
    const isPartySizeValid = formData.party_size > 0 && formData.party_size <= maxPartySize;

    // Price per person - uses the slot-based price passed from parent context
    const pricePerPerson = BUSINESS_INFO.pricing.parasail; // $119 standard default for tip calc
    const baseFlightCost = formData.party_size * pricePerPerson;

    const inputBaseClass = "w-full bg-[#38261a] border rounded-xl px-4 py-3 text-[#fbddca] focus:outline-none transition-colors placeholder-[#564240]";
    const inputValidClass = "border-[#564240] focus:border-[#ffb3ad] focus:ring-1 focus:ring-[#ffb3ad]";
    const inputErrorClass = "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500";

    return (
        <div className="space-y-8">
            <div className="bg-[#fbbb45]/10 border border-[#fbbb45]/30 rounded-xl p-6 mb-8 text-center">
                <p className="text-[#a58b88] text-sm uppercase tracking-wider font-semibold mb-1">Booking For</p>
                <div className="text-2xl font-bold text-[#fbddca] font-serif">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    <span className="mx-2">&bull;</span>
                    {selectedTime}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-[#fbddca] font-serif">Your Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#ddc0bd] mb-2">Full Name</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={onChange}
                            onBlur={() => handleBlur('customer_name')}
                            required
                            className={`${inputBaseClass} ${touched.customer_name && !isNameValid ? inputErrorClass : inputValidClass}`}
                            placeholder="John Doe"
                        />
                        {touched.customer_name && !isNameValid && (
                            <p className="text-red-500 text-xs mt-1">Please enter your full name.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#ddc0bd] mb-2">Email Address</label>
                        <input
                            type="email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={onChange}
                            onBlur={() => handleBlur('customer_email')}
                            required
                            className={`${inputBaseClass} ${touched.customer_email && !isEmailValid ? inputErrorClass : inputValidClass}`}
                            placeholder="john@example.com"
                        />
                        {touched.customer_email && !isEmailValid && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#ddc0bd] mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={onChange}
                            onBlur={() => handleBlur('customer_phone')}
                            required
                            className={`${inputBaseClass} ${touched.customer_phone && !isPhoneValid ? inputErrorClass : inputValidClass}`}
                            placeholder="(555) 555-5555"
                        />
                        {touched.customer_phone && !isPhoneValid && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid US phone number.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#ddc0bd] mb-2">
                            Number of Parasailers <span className="text-xs text-[#a58b88]">(Max {maxPartySize})</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={maxPartySize}
                            name="party_size"
                            value={formData.party_size}
                            onChange={onChange}
                            onBlur={() => handleBlur('party_size')}
                            required
                            className={`${inputBaseClass} ${touched.party_size && !isPartySizeValid ? inputErrorClass : inputValidClass}`}
                        />
                        {touched.party_size && !isPartySizeValid && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid number (1-{maxPartySize}).</p>
                        )}
                        <p className="text-xs text-[#a58b88] mt-1">
                            Price per person depends on your selected time slot (Early Bird $99, Standard $119, Sunset $159)
                        </p>
                    </div>
                </div>

                {/* Boat Riders / Observers */}
                <div>
                    <label className="block text-sm font-semibold text-[#ddc0bd] mb-2">
                        Boat Riders / Observers <span className="text-xs text-[#a58b88]">($49 each)</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        max={maxPartySize}
                        name="boat_riders"
                        value={formData.boat_riders}
                        onChange={onChange}
                        className={`${inputBaseClass} ${inputValidClass} max-w-xs`}
                    />
                    <p className="text-xs text-[#a58b88] mt-1">
                        Friends or family who want to ride the boat without flying.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#ddc0bd] mb-2">Special Requests / Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={onChange}
                        rows={3}
                        className={`${inputBaseClass} ${inputValidClass}`}
                        placeholder="Any special requests?"
                    />
                </div>
            </div>

            {/* Add-ons Section */}
            <div className="bg-[#38261a] p-6 rounded-xl border border-[#564240]/30">
                <h3 className="text-lg font-semibold mb-4 text-[#fbddca] font-serif flex items-center gap-2">
                    Upgrade Your Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Media Combo Package */}
                    <div className="bg-[#2c1c11] p-4 rounded-xl border-2 border-[#ffb3ad]/30 shadow-sm hover:border-[#ffb3ad]/50 transition-colors relative">
                        <span className="absolute -top-2.5 right-3 bg-[#ffb3ad] text-[#640c0f] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Save $15</span>
                        <label className="block text-sm font-bold text-[#fbddca] mb-2">Media Combo (${BUSINESS_INFO.pricing.combo})</label>
                        <p className="text-xs text-[#a58b88] mb-3">Photos + GoPro video. Save $15 vs buying separately!</p>
                        <select
                            name="add_ons.combo_package"
                            value={(formData.add_ons as any)?.combo_package || 0}
                            onChange={onChange}
                            className="w-full bg-[#190b03] border border-[#564240] rounded-xl px-3 py-2 text-sm text-[#fbddca] focus:ring-[#ffb3ad] focus:border-[#ffb3ad] cursor-pointer"
                        >
                            <option value="0">None</option>
                            <option value="1">1 combo ($75)</option>
                            <option value="2">2 combos ($150)</option>
                        </select>
                    </div>

                    {/* Photo Package */}
                    <div className="bg-[#2c1c11] p-4 rounded-xl border border-[#564240] shadow-sm hover:border-[#ffb3ad]/50 transition-colors">
                        <label className="block text-sm font-bold text-[#fbddca] mb-2">Photo Package (${BUSINESS_INFO.pricing.photos})</label>
                        <p className="text-xs text-[#a58b88] mb-3">Professional crew photos on SD card.</p>
                        <select
                            name="add_ons.photo_package"
                            value={formData.add_ons?.photo_package}
                            onChange={onChange}
                            className="w-full bg-[#190b03] border border-[#564240] rounded-xl px-3 py-2 text-sm text-[#fbddca] focus:ring-[#ffb3ad] focus:border-[#ffb3ad] cursor-pointer"
                        >
                            <option value="0">None</option>
                            <option value="1">1 package ($40)</option>
                            <option value="2">2 packages ($80)</option>
                        </select>
                    </div>

                    {/* GoPro Package */}
                    <div className="bg-[#2c1c11] p-4 rounded-xl border border-[#564240] shadow-sm hover:border-[#ffb3ad]/50 transition-colors">
                        <label className="block text-sm font-bold text-[#fbddca] mb-2">GoPro Package (${BUSINESS_INFO.pricing.gopro})</label>
                        <p className="text-xs text-[#a58b88] mb-3">Immersive aerial flight footage.</p>
                        <select
                            name="add_ons.gopro_package"
                            value={formData.add_ons?.gopro_package}
                            onChange={onChange}
                            className="w-full bg-[#190b03] border border-[#564240] rounded-xl px-3 py-2 text-sm text-[#fbddca] focus:ring-[#ffb3ad] focus:border-[#ffb3ad] cursor-pointer"
                        >
                            <option value="0">None</option>
                            <option value="1">1 package ($50)</option>
                            <option value="2">2 packages ($100)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Gratuity Section */}
            <div className="bg-[#2c1c11] p-6 rounded-xl border border-[#564240] shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-[#fbddca] font-serif flex items-center gap-2">
                    Show Some Love to the Crew
                </h3>
                <p className="text-sm text-[#a58b88] mb-6">Gratuity is greatly appreciated! 100% goes to your captain and crew.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 15, 20, 25].map((percent) => {
                        const tipForPercent = percent === 0 ? 0 : Math.round(baseFlightCost * (percent / 100));
                        const isActive = formData.add_ons.tip_amount === tipForPercent;
                        return (
                            <button
                                key={percent}
                                type="button"
                                onClick={() => {
                                    onChange({ target: { name: 'add_ons.tip_amount', value: tipForPercent.toString() } } as any);
                                }}
                                className={`py-3 rounded-xl text-sm font-bold border transition-all ${isActive
                                    ? 'bg-[#ffb3ad] text-[#640c0f] border-[#ffb3ad]'
                                    : 'bg-[#38261a] border-[#564240] hover:border-[#ffb3ad] text-[#ddc0bd]'
                                    }`}
                            >
                                {percent === 0 ? 'No Tip' : `${percent}% ($${tipForPercent})`}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4">
                    <label className="block text-xs font-semibold text-[#a58b88] mb-1">Custom Amount ($)</label>
                    <input
                        type="number"
                        min="0"
                        name="add_ons.tip_amount"
                        value={formData.add_ons.tip_amount || ''}
                        onChange={(e) => onChange(e)}
                        placeholder="Enter custom amount"
                        className="w-full bg-[#190b03] border border-[#564240] rounded-xl px-4 py-2 text-sm text-[#fbddca] focus:ring-[#ffb3ad] focus:border-[#ffb3ad] placeholder-[#564240]"
                    />
                </div>
            </div>

        </div>
    );
}
