-- ============================================================================
-- INSTALLATION SERVICE FEATURE MIGRATION
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- 1. Add installation columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS installation_available BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS installation_fee       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS installation_description TEXT;

-- 2. Add installation columns to order_items table
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS installation_selected    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS installation_fee         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS installation_description TEXT,
  ADD COLUMN IF NOT EXISTS installation_status      TEXT NOT NULL DEFAULT 'none'
    CHECK (installation_status IN ('none','requested','scheduled','in_progress','completed','cancelled'));

-- 3. Index for quickly listing items that need installation
CREATE INDEX IF NOT EXISTS idx_order_items_installation_selected
  ON order_items (installation_selected)
  WHERE installation_selected = TRUE;

CREATE INDEX IF NOT EXISTS idx_order_items_installation_status
  ON order_items (installation_status)
  WHERE installation_status != 'none';

-- 4. Seed example installation data for CCTV / Starlink products
--    (only runs if those products already exist; safe to run multiple times)
UPDATE products
SET
  installation_available    = TRUE,
  installation_fee          = 100.00,
  installation_description  = 'Professional CCTV system installation by certified technicians. Includes mounting, cabling, and DVR/NVR configuration.'
WHERE
  LOWER(name) LIKE '%cctv%'
  AND installation_available = FALSE;

UPDATE products
SET
  installation_available    = TRUE,
  installation_fee          = 75.00,
  installation_description  = 'Professional Starlink dish installation. Includes optimal site survey, mounting, and network configuration.'
WHERE
  LOWER(name) LIKE '%starlink%'
  AND installation_available = FALSE;

-- ============================================================================
-- VERIFICATION QUERIES (run these to confirm the migration worked)
-- ============================================================================
-- SELECT id, name, installation_available, installation_fee, installation_description
-- FROM products
-- WHERE installation_available = TRUE;

-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name IN ('products','order_items')
--   AND column_name LIKE 'installation%'
-- ORDER BY table_name, column_name;
