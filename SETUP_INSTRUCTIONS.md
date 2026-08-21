# Setup Instructions - Wallet System & Image Upload

## Overview
This document provides step-by-step instructions to set up the demo wallet system and enable image uploads for products.

## Issues Encountered
1. **Wallet Table Missing** - The `wallets` and `wallet_transactions` tables don't exist
2. **Upload Authorization Failing** - The upload endpoint was checking for wallet existence, which failed

## Solution Overview
1. Run the wallet schema SQL to create necessary tables and functions
2. Create the Supabase storage bucket for product images
3. Create a webhook to auto-create wallets when users sign up

---

## Step 1: Create Wallet Tables & Functions

### Instructions:
1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `WALLET_SCHEMA.sql` from your project root
4. Paste it into the SQL editor
5. Click **RUN**

### What This Does:
- Creates `wallets` table (stores user wallet balances)
- Creates `wallet_transactions` table (audit trail of all wallet activity)
- Creates database functions for:
  - Creating user wallets with $10,000 initial balance
  - Processing atomic checkout payments
  - Resetting demo wallets
  - Refunding wallet amounts
  - Topping up demo money

### Expected Result:
- No errors should appear
- Tables and functions should be listed in the left sidebar

---

## Step 2: Create Supabase Storage Bucket

### Instructions:
1. Go to your **Supabase Dashboard** → **Storage**
2. Click **Create a new bucket**
3. Name it: `products` (exactly)
4. Toggle **Public** to ON (so images are accessible)
5. Click **Create bucket**

### Verify:
- You should see a bucket named `products` in your storage list
- It should show as "Public"

---

## Step 3: Create Auto-Wallet Generation Webhook

### Option A: Using Supabase Auth Hook (Recommended)
This auto-creates a wallet whenever a new user signs up.

1. Go to **Supabase Dashboard** → **Database** → **Webhooks**
2. Click **Create a new hook**
3. Configure as follows:
   - **Name**: `auto_create_wallet`
   - **Table**: `auth.users`
   - **Events**: Check only **INSERT**
   - **Webhook URL**: `https://yourdomain.com/api/auth/webhook/create-wallet`
   - Click **Create hook**

### Option B: Manual Setup (If Webhook Fails)
Add wallet creation to your signup API. Update `/src/app/api/auth/signup/route.ts`:

```typescript
// After user is created in auth
const { data: wallet } = await supabase.rpc('create_user_wallet', {
  p_user_id: newUser.id,
})

if (!wallet || wallet.length === 0) {
  console.error('Failed to create wallet for new user')
  // Don't fail signup, wallet might already exist
}
```

### Option C: Manual Creation for Existing Users
If you have existing users, run this in **SQL Editor**:

```sql
-- Create wallets for all users who don't have one
SELECT create_user_wallet(id) FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM wallets);
```

---

## Step 4: Verify Setup

### Test 1: Check Wallet Table
Run in **SQL Editor**:
```sql
SELECT * FROM wallets;
SELECT * FROM wallet_transactions;
```
Expected: No error (may return empty if no users yet)

### Test 2: Check Upload Endpoint
1. Go to admin product creation page: `/admin/products/new`
2. Try uploading an image from your device
3. Check browser console for errors
4. If successful, you should see the image URL added to the form

### Test 3: Check Wallet on Checkout
1. Sign up a new user (if using webhook)
2. Go to checkout page
3. You should see wallet balance: $10,000.00
4. Complete an order
5. Wallet balance should decrease

---

## Step 5: Fix Any Issues

### Issue: "Table wallets not found"
**Solution**: Run the `WALLET_SCHEMA.sql` again in SQL Editor

### Issue: "Not authorized" on image upload
**Solution**: Verify your profile has `role = 'admin'` in the database
```sql
SELECT id, role FROM profiles WHERE id = 'your-user-id';
```
If role is not 'admin', update it:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

### Issue: "products bucket not found" on image upload
**Solution**: Create the storage bucket (see Step 2)

### Issue: No wallet appears in checkout
**Solution**: 
1. Sign in to Supabase dashboard
2. Go to **SQL Editor**
3. Run: `SELECT * FROM wallets WHERE user_id = 'your-user-id';`
4. If empty, run: `SELECT create_user_wallet('your-user-id');`

### Issue: Image uploads to storage but doesn't return URL
**Solution**: Check if storage bucket permissions are correct
1. Go to **Storage** → **products** bucket
2. Click **Policies**
3. Make sure there's a policy allowing public access

---

## Testing Checklist

After setup, verify everything works:

### Wallet System
- [ ] New users get $10,000 balance on signup
- [ ] Wallet displays on checkout page
- [ ] Order completion deducts from wallet
- [ ] Insufficient funds shows error
- [ ] Reset wallet button works
- [ ] Confirmation modal appears before reset

### Image Upload
- [ ] Can upload images from device to product creation page
- [ ] Can paste image URLs as alternative
- [ ] Uploaded images display as URLs in form
- [ ] Multiple images can be added
- [ ] Images persist after page refresh

### Orders
- [ ] Can place order with sufficient funds
- [ ] Cannot place order with insufficient funds
- [ ] Order confirmation page appears after checkout
- [ ] Wallet balance updated after order

---

## Troubleshooting Commands

### Check Wallet Creation
```sql
-- See all wallets
SELECT * FROM wallets;

-- See all wallet transactions
SELECT * FROM wallet_transactions;

-- Check specific user's wallet
SELECT * FROM wallets WHERE user_id = 'UUID_HERE';

-- Check specific user's transactions
SELECT * FROM wallet_transactions WHERE user_id = 'UUID_HERE' ORDER BY created_at DESC;
```

### Manual Wallet Reset
```sql
-- Reset a user's wallet to $10,000
UPDATE wallets SET balance = 10000.00 WHERE user_id = 'UUID_HERE';

-- Record the reset in transactions
INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, balance_before, balance_after, description)
SELECT id, user_id, 'reset', 0, balance, 10000.00, 'Manual reset'
FROM wallets WHERE user_id = 'UUID_HERE';
```

### Check User Profile
```sql
-- See user's profile including role
SELECT * FROM profiles WHERE id = 'UUID_HERE';

-- Update user to admin
UPDATE profiles SET role = 'admin' WHERE id = 'UUID_HERE';
```

---

## Architecture Summary

### Wallet Flow
1. User signs up → Webhook calls `create_user_wallet()` → Gets $10,000
2. User adds items to cart
3. User goes to checkout → Fetches wallet balance via `/api/wallet/get`
4. User submits order → Calls `process_demo_checkout()` → Deducts from wallet
5. Order confirmed → `/api/orders/create` returns success

### Upload Flow
1. Admin clicks upload on product page
2. Selects image file from device
3. Sends to `/api/admin/upload` as FormData
4. Server checks admin status using `profiles.role`
5. Server validates file (type, size)
6. Server uploads to Supabase Storage bucket `products`
7. Server returns public URL
8. URL added to product image list

---

## Security Notes

✅ **What's Secure**
- Wallet deductions happen on backend (server-side)
- RLS policies prevent users from accessing other users' wallets
- All transactions are immutable audit trail
- File uploads validated for type and size
- Admin checks required for uploads

⚠️ **What to Monitor**
- Ensure RLS policies stay enabled on wallet tables
- Regularly review wallet_transactions for anomalies
- Keep storage bucket access restricted
- Ensure only admins can upload images

---

## Next Steps

1. ✅ Run WALLET_SCHEMA.sql
2. ✅ Create products storage bucket
3. ✅ Set up wallet auto-creation (webhook or signup)
4. ✅ Test the complete flow
5. Consider: Admin dashboard to view/reset user wallets
6. Consider: Transaction history page for users

---

## Files Modified/Created

### New Files
- `WALLET_SCHEMA.sql` - Complete wallet system schema
- `/src/app/api/admin/upload/route.ts` - Image upload endpoint

### Modified Files
- `/src/app/admin/products/[id]/page.tsx` - Added file upload UI
- `/src/app/admin/products/new/page.tsx` - Added file upload UI
- `/src/app/checkout/page.tsx` - Fixed race condition on cart clear

### Existing Files (Not Changed)
- `/src/context/WalletContext.tsx` - Already implemented
- `/src/app/api/wallet/get/route.ts` - Already implemented
- `/src/app/api/orders/create/route.ts` - Already implemented

---

## Support

If you encounter issues:
1. Check the error message in browser console
2. Check server logs (application console)
3. Verify all SQL ran successfully (no errors in SQL Editor)
4. Run the troubleshooting commands to debug
5. Ensure user is admin role if upload fails

