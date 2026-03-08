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
        <div className="bg-white dark:bg-[#2A1F17] rounded-xl shadow-lg border-2 border-[#D4605A]/20 overflow-hidden">
            <div className="bg-[#6B4226] dark:bg-[#3D2B1F] px-6 py-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-white font-serif">
                    Order Summary
                </h3>
            </div>

            <div className="p-6 space-y-3">
                {/* Flights */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/70">
                        Parasail Flight x {size}
                        <span className="text-foreground/40 ml-1 text-xs">
                            (${pricePerPerson}/ea {slotTypeLabel.toLowerCase()})
                        </span>
                    </span>
                    <span className="font-medium text-foreground">${flightTotal}</span>
                </div>

                {/* Early bird savings note */}
                {slotType === 'earlybird' && size > 0 && (
                    <div className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                        Early Bird rate -- saving ${(BUSINESS_INFO.pricing.parasail - BUSINESS_INFO.pricing.earlyBird) * size} vs standard pricing
                    </div>
                )}

                {/* Sunset premium note */}
                {slotType === 'sunset' && size > 0 && (
                    <div className="text-xs text-orange-700 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                        Sunset premium flight -- golden hour experience
                    </div>
                )}

                {/* Boat Riders */}
                {boatRiders > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">
                            Boat Riders x {boatRiders}
                            <span className="text-foreground/40 ml-1 text-xs">
                                ($49/ea)
                            </span>
                        </span>
                        <span className="font-medium text-foreground">${boatRiderTotal}</span>
                    </div>
                )}

                {/* Observers */}
                {(addOns.observer_package || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">
                            Observer Pass x {addOns.observer_package}
                            <span className="text-foreground/40 ml-1 text-xs">
                                ($49/ea)
                            </span>
                        </span>
                        <span className="font-medium text-foreground">${observerTotal}</span>
                    </div>
                )}

                {/* Add-ons */}
                {(addOns.combo_package || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">
                            Media Combo ({addOns.combo_package})
                            <span className="text-[#D4605A] ml-1 text-xs font-semibold">Save $15</span>
                        </span>
                        <span className="font-medium text-foreground">${comboTotal}</span>
                    </div>
                )}
                {addOns.photo_package > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">
                            Photo Package ({addOns.photo_package})
                        </span>
                        <span className="font-medium text-foreground">${photoTotal}</span>
                    </div>
                )}
                {addOns.gopro_package > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">
                            GoPro Package ({addOns.gopro_package})
                        </span>
                        <span className="font-medium text-foreground">${goproTotal}</span>
                    </div>
                )}

                {/* Tip */}
                {tipTotal > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#D4605A]">
                        <span>Crew Gratuity</span>
                        <span className="font-medium">${tipTotal}</span>
                    </div>
                )}

                <div className="h-px bg-[#E5A832]/30 my-4" />

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-bold text-foreground">
                    <span className="font-serif">Total</span>
                    <span>${grandTotal}</span>
                </div>
            </div>
        </div>
    );
}
