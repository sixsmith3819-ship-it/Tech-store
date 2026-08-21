-- ============================================================================
-- CREATE WALLETS FOR EXISTING USERS
-- ============================================================================
-- Run this SQL to create wallets for any existing users who don't have one yet
-- This is useful after adding the wallet system to an existing app

-- Create wallets for all users who don't have one
SELECT create_user_wallet(id) FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM wallets);

-- Verify: Check how many wallets were created
SELECT COUNT(*) as wallet_count FROM wallets;
SELECT COUNT(*) as user_count FROM auth.users;

-- Show any users without wallets (should be empty after above)
SELECT u.id, u.email FROM auth.users u 
WHERE u.id NOT IN (SELECT user_id FROM wallets);
