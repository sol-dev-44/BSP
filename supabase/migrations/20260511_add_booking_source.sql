-- ============================================================
-- Add booking_source column to bsp_bookings
-- Tracks where bookings originate: 'website', 'viator', 'gyg', 'manual'
-- ============================================================

ALTER TABLE bsp_bookings
    ADD COLUMN IF NOT EXISTS booking_source TEXT DEFAULT 'website'
    CHECK (booking_source IN ('website', 'viator', 'gyg', 'manual'));

-- Backfill existing Viator bookings (identified by stripe_payment_intent_id prefix)
UPDATE bsp_bookings SET booking_source = 'viator'
    WHERE stripe_payment_intent_id LIKE 'viator_%' AND booking_source = 'website';

-- Backfill existing GYG bookings
UPDATE bsp_bookings SET booking_source = 'gyg'
    WHERE stripe_payment_intent_id LIKE 'gyg_%' AND booking_source = 'website';

CREATE INDEX IF NOT EXISTS idx_bsp_bookings_source ON bsp_bookings(booking_source);
