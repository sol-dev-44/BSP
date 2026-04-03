import { BUSINESS_INFO } from '@/config/business';

interface PriceBreakdownProps {
    partySize: number | '';
    boatRiders?: number;
    basePricePerPerson?: number;
    slotType?: string;
    discountAmount?: number;
    discountCode?: string;
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
    discountAmount = 0,
    discountCode,
    addOns,
}: PriceBreakdownProps) {
    const size = typeof partySize === 'number' ? partySize : 0;

    // Use the prop-provided price (from slot type), fallback to standard $119
    const pricePerPerson = basePricePerPerson || BUSINESS_INFO.pricing.parasail;
    const flightTotal = size * pricePerPerson;

    const slotTypeLabel = slotType === 'earlybird' ? 'Early Bird' : slotType === 'sunset' ? 'Sunset' : 'Standard';

    const observerCount = (boatRiders || 0) + (addOns.observer_package || 0);
    const observerTotal = observerCount * BUSINESS_INFO.pricing.observer;
    const comboTotal = (addOns.combo_package || 0) * BUSINESS_INFO.pricing.combo;
    const photoTotal = (addOns.photo_package || 0) * BUSINESS_INFO.pricing.photos;
    const goproTotal = (addOns.gopro_package || 0) * BUSINESS_INFO.pricing.gopro;
    const tipTotal = addOns.tip_amount || 0;

    const grandTotal = Math.max(0, flightTotal + observerTotal + comboTotal + photoTotal + goproTotal + tipTotal - discountAmount);

    return (
        <div className="bg-[#FFEACC] rounded-xl shadow-lg border-2 border-[#FF9500]/20 overflow-hidden">
            <div className="bg-[#FFD699] px-6 py-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-[#2D1600] font-serif">
                    Order Summary
                </h3>
            </div>

            <div className="p-6 space-y-3">
                {/* Flights */}
                {size > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#614020]">
                            Parasail Flight x {size}
                            <span className="text-[#8B6914] ml-1 text-xs">
                                (${pricePerPerson}/ea {slotTypeLabel.toLowerCase()})
                            </span>
                        </span>
                        <span className="font-medium text-[#2D1600]">${flightTotal}</span>
                    </div>
                )}

                {/* Early bird savings note */}
                {slotType === 'earlybird' && size > 0 && (
                    <div className="text-xs text-[#3D1C00] bg-[#FFD700]/10 rounded-lg px-3 py-2 border border-[#FFD700]/20">
                        Early Bird rate -- saving ${(BUSINESS_INFO.pricing.parasail - BUSINESS_INFO.pricing.earlyBird) * size} vs standard pricing
                    </div>
                )}

                {/* Sunset premium note */}
                {slotType === 'sunset' && size > 0 && (
                    <div className="text-xs text-[#FF9500] bg-[#FF9500]/10 rounded-lg px-3 py-2 border border-[#FF9500]/20">
                        Sunset premium flight -- golden hour experience
                    </div>
                )}

                {/* Observer Pass */}
                {observerCount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#614020]">
                            Observer Pass x {observerCount}
                            <span className="text-[#8B6914] ml-1 text-xs">
                                ($49/ea)
                            </span>
                        </span>
                        <span className="font-medium text-[#2D1600]">${observerTotal}</span>
                    </div>
                )}

                {/* Add-ons */}
                {(addOns.combo_package || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#614020]">
                            Media Combo ({addOns.combo_package})
                            <span className="text-[#FF9500] ml-1 text-xs font-semibold">Save $15</span>
                        </span>
                        <span className="font-medium text-[#2D1600]">${comboTotal}</span>
                    </div>
                )}
                {addOns.photo_package > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#614020]">
                            Photo Package ({addOns.photo_package})
                        </span>
                        <span className="font-medium text-[#2D1600]">${photoTotal}</span>
                    </div>
                )}
                {addOns.gopro_package > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#614020]">
                            GoPro Package ({addOns.gopro_package})
                        </span>
                        <span className="font-medium text-[#2D1600]">${goproTotal}</span>
                    </div>
                )}

                {/* Tip */}
                {tipTotal > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#FF9500]">
                        <span>Crew Gratuity</span>
                        <span className="font-medium">${tipTotal}</span>
                    </div>
                )}

                {/* Discount */}
                {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-[#16a34a]">
                        <span className="text-sm font-medium">
                            Discount {discountCode ? `(${discountCode})` : ''}
                        </span>
                        <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="h-px bg-[#DCC8A0]/30 my-4" />

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-black text-[#FF9500]">
                    <span className="font-serif">Total</span>
                    <span>${grandTotal}</span>
                </div>
            </div>
        </div>
    );
}
