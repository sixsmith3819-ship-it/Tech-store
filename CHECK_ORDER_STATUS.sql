-- ============================================================================
-- CHECK ORDER STATUS
-- ============================================================================
-- Run this to verify orders are being created correctly

-- Check all orders
SELECT id, user_id, order_number, status, total_amount, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- If you know your user ID, check that specific user's orders:
-- SELECT id, user_id, order_number, status, total_amount, created_at 
-- FROM orders 
-- WHERE user_id = 'YOUR-USER-ID'
-- ORDER BY created_at DESC;

-- Check for the specific order from your test (replace ID):
-- SELECT * FROM orders WHERE id = '6ba6de40-d221-4bbb-ad69-3044ccfda546';

-- Check order items
-- SELECT * FROM order_items WHERE order_id = '6ba6de40-d221-4bbb-ad69-3044ccfda546';

-- If orders are created but not visible, it might be an RLS issue.
-- Run this to bypass RLS and check with service role:
-- SELECT id, user_id, order_number, status, total_amount 
-- FROM orders 
-- WHERE id = '6ba6de40-d221-4bbb-ad69-3044ccfda546'::uuid;

-- Check RLS policies on orders table
SELECT schemaname, tablename, policyname, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;
