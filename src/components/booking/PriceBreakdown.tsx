import { BUSINESS_INFO } from '@/config/business';

interface PriceBreakdownProps {
    partySize: number | '';
    boatRiders?: number;
    basePricePerPerson?: number;
    slotType?: string;
    addOns: {
        photo_package: number;
        gopro_package: number;
        combo_package?: number;
        observer_package?: number;
        tip_amount?: number;
    };
}

export default function PriceBreakdown({
    partySize,
    boatRiders = 0,
    basePricePerPerson,
    slotType = 'standard',
    addOns,
}: PriceBreakdownProps) {
    const size = typeof partySize === 'number' ? partySize : 0;

    // Use the prop-provided price (from slot type), fallback to standard $119
    const pricePerPerson = basePricePerPerson || BUSINESS_INFO.pricing.parasail;
    const flightTotal = size * pricePerPerson;

    const slotTypeLabel = slotType === 'earlybird' ? 'Early Bird' : slotType === 'sunset' ? 'Sunset' : 'Standard';

    const boatRiderTotal = (boatRiders || 0) * BUSINESS_INFO.pricing.observer;
    const observerTotal = (addOns.observer_package || 0) * BUSINESS_INFO.pricing.observer;
    const comboTotal = (addOns.combo_package || 0) * BUSINESS_INFO.pricing.combo;
    const photoTotal = (addOns.photo_package || 0) * BUSINESS_INFO.pricing.photos;
    const goproTotal = (addOns.gopro_package || 0) * BUSINESS_INFO.pricing.gopro;
    const tipTotal = addOns.tip_amount || 0;

    const grandTotal = flightTotal + boatRiderTotal + observerTotal + comboTotal + photoTotal + goproTotal + tipTotal;

    return (
        <div className="bg-[#111128] rounded-xl shadow-lg border-2 border-[#00f0ff]/20 overflow-hidden">
            <div className="bg-[#1a1a3e] px-6 py-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-[#e0f0ff] font-serif">
                    Order Summary
                </h3>
            </div>

            <div className="p-6 space-y-3">
                {/* Flights */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[#b0c4de]">
                        Parasail Flight x {size}
                        <span className="text-[#5a6a8a] ml-1 text-xs">
                            (${pricePerPerson}/ea {slotTypeLabel.toLowerCase()})
                        </span>
                    </span>
                    <span className="font-medium text-[#e0f0ff]">${flightTotal}</span>
                </div>

                {/* Early bird savings note */}
                {slotType === 'earlybird' && size > 0 && (
                    <div className="text-xs text-[#ff00ff] bg-[#ff00ff]/10 rounded-lg px-3 py-2 border border-[#ff00ff]/20">
                        Early Bird rate -- saving ${(BUSINESS_INFO.pricing.parasail - BUSINESS_INFO.pricing.earlyBird) * size} vs standard pricing
                    </div>
                )}

                {/* Sunset premium note */}
                {slotType === 'sunset' && size > 0 && (
                    <div className="text-xs text-[#00f0ff] bg-[#00f0ff]/10 rounded-lg px-3 py-2 border border-[#00f0ff]/20">
                        Sunset premium flight -- golden hour experience
                    </div>
                )}

                {/* Boat Riders */}
                {boatRiders > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#b0c4de]">
                            Boat Riders x {boatRiders}
                            <span className="text-[#5a6a8a] ml-1 text-xs">
                                ($49/ea)
                            </span>
                        </span>
                        <span className="font-medium text-[#e0f0ff]">${boatRiderTotal}</span>
                    </div>
                )}

                {/* Observers */}
                {(addOns.observer_package || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#b0c4de]">
                            Observer Pass x {addOns.observer_package}
                            <span className="text-[#5a6a8a] ml-1 text-xs">
                                ($49/ea)
                            </span>
                        </span>
                        <span className="font-medium text-[#e0f0ff]">${observerTotal}</span>
                    </div>
                )}

                {/* Add-ons */}
                {(addOns.combo_package || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#b0c4de]">
                            Media Combo ({addOns.combo_package})
                            <span className="text-[#00f0ff] ml-1 text-xs font-semibold">Save $15</span>
                        </span>
                        <span className="font-medium text-[#e0f0ff]">${comboTotal}</span>
                    </div>
                )}
                {addOns.photo_package > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#b0c4de]">
                            Photo Package ({addOns.photo_package})
                        </span>
                        <span className="font-medium text-[#e0f0ff]">${photoTotal}</span>
                    </div>
                )}
                {addOns.gopro_package > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#b0c4de]">
                            GoPro Package ({addOns.gopro_package})
                        </span>
                        <span className="font-medium text-[#e0f0ff]">${goproTotal}</span>
                    </div>
                )}

                {/* Tip */}
                {tipTotal > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#00f0ff]">
                        <span>Crew Gratuity</span>
                        <span className="font-medium">${tipTotal}</span>
                    </div>
                )}

                <div className="h-px bg-[#2a2a4a]/30 my-4" />

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-black text-[#00f0ff]">
                    <span className="font-serif">Total</span>
                    <span>${grandTotal}</span>
                </div>
            </div>
        </div>
    );
}
