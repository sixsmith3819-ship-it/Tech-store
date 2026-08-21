# Demo Wallet Implementation Checklist

Complete this checklist to properly implement the demo wallet system.

## Phase 1: Database Setup

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Copy entire contents of `WALLET_SCHEMA.sql`
- [ ] Paste into SQL editor
- [ ] Execute query (click RUN)
- [ ] Wait for success message
- [ ] Verify tables created:
  - [ ] `wallets` table exists
  - [ ] `wallet_transactions` table exists
- [ ] Verify functions created:
  - [ ] `create_user_wallet()`
  - [ ] `process_demo_checkout()`
  - [ ] `reset_demo_wallet()`
  - [ ] `refund_wallet()`
- [ ] Verify RLS policies enabled on:
  - [ ] `wallets` table
  - [ ] `wallet_transactions` table
- [ ] Verify `orders` table updated:
  - [ ] `payment_method` column added

## Phase 2: Application Updates

### Files Created (No Action Required)
- [x] `src/app/api/wallet/get/route.ts` ✓ Created
- [x] `src/app/api/wallet/reset/route.ts` ✓ Created
- [x] `src/app/api/wallet/top-up/route.ts` ✓ Created
- [x] `src/context/WalletContext.tsx` ✓ Created
- [x] `src/utils/wallet.ts` ✓ Created

### Files Modified
- [x] `src/app/checkout/page.tsx` ✓ Updated with wallet display
- [x] `src/app/api/orders/create/route.ts` ✓ Updated with payment processing

### Layout Update - REQUIRED
- [ ] Open `src/app/layout.tsx`
- [ ] Import WalletProvider:
  ```typescript
  import { WalletProvider } from '@/context/WalletContext'
  ```
- [ ] Wrap children with WalletProvider:
  ```typescript
  <CartProvider>
    <WalletProvider>
      {children}
    </WalletProvider>
  </CartProvider>
  ```
- [ ] Save file
- [ ] Test build: `npm run build`

## Phase 3: Signup Integration

Choose ONE option:

### Option A: Update Signup API (Recommended)
- [ ] Open your signup API route (e.g., `/api/auth/signup/route.ts`)
- [ ] After user is created successfully, add:
  ```typescript
  const supabase = await createServiceRoleClient()
  await supabase.rpc('create_user_wallet', {
    p_user_id: newUser.id,
  })
  ```
- [ ] Test: Create new account, verify wallet created in database

### Option B: Supabase Edge Function Webhook
- [ ] Contact Supabase support for PostgreSQL trigger setup
- [ ] OR create Edge Function to handle webhook
- [ ] Test: Create new account, verify wallet created

### Option C: Trigger via Database Hook
- [ ] Use Supabase Webhooks feature
- [ ] POST to endpoint on `auth.users` INSERT
- [ ] Call `/api/webhooks/create-wallet`
- [ ] Test: Create new account, verify wallet created

## Phase 4: Local Testing

### Setup
- [ ] Run `npm run dev`
- [ ] Open browser to `http://localhost:3000`

### Test 1: New User Registration ✓
- [ ] Navigate to `/auth/signup`
- [ ] Create new test account
- [ ] Verify success and redirect
- [ ] In Supabase, run:
  ```sql
  SELECT * FROM wallets WHERE user_id = 'TEST_USER_ID';
  ```
- [ ] Verify: Balance shows 10000.00

### Test 2: View Wallet in Dashboard
- [ ] Log in as test user
- [ ] Navigate to dashboard/cart
- [ ] Verify: Can see demo wallet (or will see in checkout)

### Test 3: Add Product to Cart ✓
- [ ] Go to `/products`
- [ ] Click on any product
- [ ] Click "Add to Cart"
- [ ] Verify: Product added to cart
- [ ] Go to `/cart`
- [ ] Verify: Product shows in cart

### Test 4: Checkout with Sufficient Funds ✓
- [ ] From cart, click "Checkout"
- [ ] Verify: Demo Wallet card shows $10,000.00
- [ ] Verify: Order Total shows (e.g., $108.00)
- [ ] Verify: "Reset Demo Money" button not shown (funds sufficient)
- [ ] Fill form with valid data
- [ ] Click "Complete Order"
- [ ] Verify: Redirects to order confirmation
- [ ] Verify: Order created with payment_method = 'demo_money'
- [ ] In database, verify:
  ```sql
  SELECT balance FROM wallets WHERE user_id = 'TEST_USER_ID';
  -- Should show 10000 - order_total = new_balance
  
  SELECT * FROM wallet_transactions WHERE user_id = 'TEST_USER_ID';
  -- Should show purchase transaction
  ```

### Test 5: Insufficient Funds ✓
- [ ] In Supabase, set wallet balance to $50:
  ```sql
  UPDATE wallets SET balance = 50.00 WHERE user_id = 'TEST_USER_ID';
  ```
- [ ] Add product ($100+) to cart
- [ ] Go to checkout
- [ ] Verify: Error message shows:
  "Insufficient demo funds. You need $108.00 but only have $50.00"
- [ ] Verify: "Reset Demo Money to $10,000" button visible
- [ ] Click button
- [ ] Verify: Confirmation modal appears
- [ ] Click "Yes, Reset Wallet"
- [ ] Verify: Modal closes, balance updates to $10,000
- [ ] Verify: Can now complete purchase

### Test 6: Reset Wallet ✓
- [ ] Make purchase (reduces wallet)
- [ ] Go to cart, checkout
- [ ] Verify: Balance shows reduced amount
- [ ] Complete another purchase (if sufficient funds)
- [ ] Repeat: Eventually funds will be low
- [ ] Click "Reset Demo Money to $10,000"
- [ ] Verify: Confirmation modal
- [ ] Confirm reset
- [ ] Verify: Balance shows $10,000.00
- [ ] In database verify:
  ```sql
  SELECT * FROM wallet_transactions WHERE user_id = 'TEST_USER_ID' 
  ORDER BY created_at DESC LIMIT 5;
  -- Should show reset transaction with type='reset'
  ```

### Test 7: Transaction History ✓
- [ ] In database, view all transactions:
  ```sql
  SELECT * FROM wallet_transactions WHERE user_id = 'TEST_USER_ID' 
  ORDER BY created_at DESC;
  ```
- [ ] Verify entries for:
  - [ ] initial_balance (10000.00)
  - [ ] purchase transactions (negative amounts)
  - [ ] reset transaction (large positive amount)
- [ ] Verify all have correct balance_before/after values

### Test 8: Mobile Responsive ✓
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on iPhone 12 breakpoint
- [ ] Test checkout flow on mobile
- [ ] Verify: Wallet card displays
- [ ] Verify: Confirmation modal is readable
- [ ] Verify: Can tap buttons easily

### Test 9: Concurrent Requests ✓
- [ ] Set wallet to $500
- [ ] Add two $250 products to cart ($500 total with tax)
- [ ] Open console (F12)
- [ ] Rapid-fire two checkout requests:
  ```javascript
  fetch('/api/orders/create', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...})
  })
  ```
- [ ] Both requests within 100ms
- [ ] Verify: Only one succeeds, wallet doesn't go negative
- [ ] Verify: Second request gets error

### Test 10: Error Handling ✓
- [ ] Test with invalid form data (checkout)
- [ ] Verify: Proper error messages shown
- [ ] Test with network offline
- [ ] Verify: Error handling works
- [ ] Test with expired session
- [ ] Verify: Redirects to login

## Phase 5: Existing User Migration

- [ ] Prepare SQL script for existing users:
  ```sql
  INSERT INTO wallets (user_id, balance, currency)
  SELECT id, 10000.00, 'USD'
  FROM auth.users
  WHERE id NOT IN (SELECT user_id FROM wallets)
  ON CONFLICT DO NOTHING;
  ```
- [ ] Review script carefully
- [ ] Run in Supabase SQL Editor on production
- [ ] Verify: All users have wallets
- [ ] Verify: No duplicates

## Phase 6: Production Deployment

### Pre-Deployment
- [ ] All tests passed locally
- [ ] Code review completed
- [ ] No console errors or warnings
- [ ] `npm run build` successful
- [ ] Tested on staging environment (if available)

### Deployment
- [ ] Push code to production branch
- [ ] Deploy to production server
- [ ] Verify: All new files deployed
- [ ] Verify: Layout updated with WalletProvider
- [ ] Verify: API routes accessible

### Post-Deployment
- [ ] Run WALLET_SCHEMA.sql on production DB
- [ ] Create wallets for existing users (see Phase 5)
- [ ] Test new user signup
- [ ] Test checkout flow on production
- [ ] Monitor error logs
- [ ] Test with real users

## Phase 7: Monitoring

### Daily
- [ ] Check error logs for wallet-related errors
- [ ] Monitor checkout success rate
- [ ] Check wallet transactions volume

### Weekly
- [ ] Review wallet statistics:
  ```sql
  SELECT 
    COUNT(DISTINCT user_id) as active_users,
    AVG(balance) as avg_balance,
    MIN(balance) as min_balance,
    MAX(balance) as max_balance
  FROM wallets;
  ```
- [ ] Review purchase patterns:
  ```sql
  SELECT 
    type,
    COUNT(*) as count,
    SUM(amount) as total
  FROM wallet_transactions
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY type;
  ```

### Monthly
- [ ] Audit transaction history for anomalies
- [ ] Review user feedback on demo money system
- [ ] Plan enhancements (admin dashboard, etc.)

## Optional Enhancements (Future)

- [ ] Create admin wallet management page
- [ ] Create customer transaction history page
- [ ] Add email notifications for low balance
- [ ] Add analytics dashboard
- [ ] Implement top-up options UI (+$100, +$500, +$1000)
- [ ] Create wallet management page in dashboard
- [ ] Add wallet export/download functionality

## Troubleshooting

### Issue: Database migration fails
- [ ] Check Supabase status page
- [ ] Verify all SQL syntax is correct
- [ ] Try running migrations one at a time
- [ ] Contact Supabase support if still fails

### Issue: Wallet not created for new users
- [ ] Verify signup API calls create_user_wallet RPC
- [ ] Check RPC function exists: `SELECT * FROM pg_proc WHERE proname = 'create_user_wallet';`
- [ ] Check function parameters are correct
- [ ] Look for errors in application logs

### Issue: Checkout fails with payment error
- [ ] Verify process_demo_checkout function exists
- [ ] Check wallet has sufficient balance
- [ ] Review error message in logs
- [ ] Ensure user is authenticated

### Issue: Balance shows incorrectly
- [ ] Clear browser cache
- [ ] Refresh page
- [ ] Verify in database:
  ```sql
  SELECT id, balance FROM wallets WHERE user_id = 'USER_ID';
  ```
- [ ] Check for decimal precision issues

### Issue: RLS policies blocking access
- [ ] Verify RLS policies exist:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'wallets';
  ```
- [ ] Check user_id parameter is correct
- [ ] Ensure service role is used for updates
- [ ] Review RLS policy logic

## Sign-Off

- [ ] All tests completed successfully
- [ ] Code ready for production
- [ ] Documentation complete
- [ ] Team briefed on new system
- [ ] Go-live approved

**Completed By:** ________________

**Date:** ________________

**Notes:** ________________________________________________________________________

