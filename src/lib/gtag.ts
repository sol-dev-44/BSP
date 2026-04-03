export const GA_MEASUREMENT_ID = 'G-EJYNE9KRW7';

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
    }
}

export function event(action: string, params?: Record<string, unknown>) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, params);
    }
}

// Booking funnel events
export function trackSlotSelected(date: string, time: string, slotType: string, price: number) {
    event('select_item', {
        item_list_name: 'time_slots',
        items: [{
            item_name: `Parasail ${slotType}`,
            item_category: slotType,
            price,
            quantity: 1,
        }],
        trip_date: date,
        trip_time: time,
    });
}

export function trackBeginCheckout(total: number, partySize: number, observers: number, slotType: string) {
    event('begin_checkout', {
        currency: 'USD',
        value: total,
        items: [
            ...(partySize > 0 ? [{
                item_name: `Parasail Flight (${slotType})`,
                item_category: 'flight',
                quantity: partySize,
            }] : []),
            ...(observers > 0 ? [{
                item_name: 'Observer Pass',
                item_category: 'observer',
                quantity: observers,
                price: 49,
            }] : []),
        ],
    });
}

export function trackPurchase(transactionId: string, total: number, partySize: number, observers: number, slotType: string) {
    event('purchase', {
        transaction_id: transactionId,
        currency: 'USD',
        value: total,
        items: [
            ...(partySize > 0 ? [{
                item_name: `Parasail Flight (${slotType})`,
                item_category: 'flight',
                quantity: partySize,
            }] : []),
            ...(observers > 0 ? [{
                item_name: 'Observer Pass',
                item_category: 'observer',
                quantity: observers,
                price: 49,
            }] : []),
        ],
    });
}
