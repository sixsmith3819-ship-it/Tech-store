-- ============================================================================
-- TEST CHECKOUT FUNCTION
-- ============================================================================
-- This script tests if the process_demo_checkout function works

-- First, let's verify the function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'process_demo_checkout';

-- Get a test user (replace with actual user ID from your database)
-- SELECT id, email FROM auth.users LIMIT 1;

-- Once you have a user ID, replace 'YOUR-USER-ID' below and run this:
-- SELECT * FROM process_demo_checkout(
--   'YOUR-USER-ID',
--   50.00,
--   '{"order_number": "TEST-001"}'::jsonb
-- );

-- You should see results like:
-- success | message | new_balance | required | available
-- --------|---------|-------------|----------|----------
-- true    | Payment processed successfully | 9950.00 | 50.00 | 9950.00

-- If the function doesn't exist, run WALLET_SCHEMA.sql again in SQL Editor
