-- ============================================================================
-- DELETE DUPLICATE SERVICES (Run this in Supabase SQL Editor)
-- ============================================================================

-- Option 1: Delete duplicates keeping only one of each service
-- This keeps the oldest record and deletes newer duplicates

DELETE FROM services
WHERE id NOT IN (
  SELECT MIN(id)
  FROM services
  GROUP BY name
);

-- Verify the result
SELECT COUNT(*) as total_services FROM services;
SELECT name, COUNT(*) as count FROM services GROUP BY name;

-- ============================================================================
-- Alternative: If you want to start completely fresh
-- ============================================================================

-- Uncomment the line below if you want to delete ALL services and start over:
-- TRUNCATE services RESTART IDENTITY;

-- Then run the INSERT statements from SETUP_SERVICES_TABLE.sql
