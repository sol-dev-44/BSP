-- ============================================================
-- Big Sky Parasail (BSP) Database Schema
-- Run these in Supabase SQL Editor for project: qcohcaavhwujvagmpbdp
-- All tables prefixed with bsp_ to avoid conflicts with other sites
-- ============================================================

-- Enable pgvector extension (required for RAG embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- 1. BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    trip_date DATE NOT NULL,
    trip_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    stripe_payment_intent_id TEXT,
    notes TEXT,
    add_ons JSONB DEFAULT '{}'::jsonb
);

-- RLS
ALTER TABLE bsp_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_bookings_service_all" ON bsp_bookings
    FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bsp_bookings_date ON bsp_bookings(trip_date);
CREATE INDEX IF NOT EXISTS idx_bsp_bookings_status ON bsp_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bsp_bookings_stripe ON bsp_bookings(stripe_payment_intent_id);

-- ============================================================
-- 2. RAG DOCUMENTS TABLE (for AI chat knowledge base)
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_documents (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('safety', 'equipment', 'weather', 'emergency', 'general')),
    embedding VECTOR(1536),
    file_type TEXT CHECK (file_type IN ('pdf', 'txt', 'text_input')),
    chunk_index INTEGER DEFAULT 0,
    total_chunks INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE bsp_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_documents_service_all" ON bsp_documents
    FOR ALL USING (true) WITH CHECK (true);

-- Vector similarity search index
CREATE INDEX IF NOT EXISTS idx_bsp_documents_embedding ON bsp_documents
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_bsp_documents_category ON bsp_documents(category);

-- ============================================================
-- 3. VECTOR SEARCH FUNCTION (for RAG retrieval)
-- ============================================================
CREATE OR REPLACE FUNCTION match_bsp_documents(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.1,
    match_count INT DEFAULT 5,
    filter_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    content TEXT,
    category TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        bd.id,
        bd.title,
        bd.content,
        bd.category,
        1 - (bd.embedding <=> query_embedding) AS similarity
    FROM bsp_documents bd
    WHERE
        (filter_category IS NULL OR bd.category = filter_category)
        AND 1 - (bd.embedding <=> query_embedding) > match_threshold
    ORDER BY bd.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================================
-- 4. ADMIN SUPPLIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bsp_supplies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_supplies_service_all" ON bsp_supplies
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 5. ADMIN EXPENSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bsp_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_expenses_service_all" ON bsp_expenses
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 6. ADMIN MAINTENANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bsp_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_maintenance_service_all" ON bsp_maintenance
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 7. ADMIN TODOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bsp_todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_todos_service_all" ON bsp_todos
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 8. ADMIN NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bsp_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bsp_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_notes_service_all" ON bsp_notes
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 9. PRICING INTEGRITY MIGRATION (Phase 1)
-- Run these in Supabase SQL Editor to add slot pricing columns.
-- Safe to re-run: ADD COLUMN IF NOT EXISTS is idempotent.
-- ============================================================
ALTER TABLE bsp_bookings
    ADD COLUMN IF NOT EXISTS slot_type TEXT CHECK (slot_type IN ('earlybird', 'standard', 'sunset')),
    ADD COLUMN IF NOT EXISTS per_person_rate NUMERIC(10, 2);

-- ============================================================
-- 10. DISCOUNT CODES MIGRATION (Phase 2)
-- Run these in Supabase SQL Editor to add discount code support.
-- ============================================================

CREATE TABLE IF NOT EXISTS bsp_discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_name TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bsp_discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bsp_discount_codes_service_all" ON bsp_discount_codes
    FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bsp_discount_codes_code_name ON bsp_discount_codes(code_name);
CREATE INDEX IF NOT EXISTS idx_bsp_discount_codes_is_active ON bsp_discount_codes(is_active);

ALTER TABLE bsp_bookings
    ADD COLUMN IF NOT EXISTS discount_code TEXT,
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;
