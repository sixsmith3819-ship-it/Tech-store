# ⚠️ IMMEDIATE SETUP REQUIRED

## Quick Action Items

You have two errors that need immediate fixes:

### Error 1: Wallet Table Missing
```
Error: Could not find the table 'public.wallets' in the schema cache
```

### Error 2: Image Upload Returning 403
```
POST /api/admin/upload 403
```

---

## How to Fix (5 Minutes)

### Step 1: Create Wallet Tables (2 minutes)

1. Open your Supabase dashboard
2. Go to **SQL Editor** 
3. Click **+ New Query**
4. Open the file: `WALLET_SCHEMA.sql` in your project
5. Copy ALL the SQL
6. Paste into the SQL editor
7. Click **RUN**

✅ You should see "Success" with no errors

### Step 2: Create Storage Bucket (2 minutes)

1. In Supabase, go to **Storage**
2. Click **Create a new bucket**
3. Name it exactly: `products`
4. Toggle **Public** ON
5. Click **Create**

✅ You should see a "products" bucket in your storage list

### Step 3: Test Everything (1 minute)

1. Go to `/admin/products/new` 
2. Try uploading an image
3. Go to checkout and verify wallet shows $10,000

---

## What These Steps Do

### WALLET_SCHEMA.sql creates:
- ✅ `wallets` table - stores user balances
- ✅ `wallet_transactions` table - audit trail
- ✅ Database functions for payments, resets, refunds
- ✅ Security policies (RLS)

### Products Storage Bucket:
- ✅ Storage for product images
- ✅ Public access for image URLs
- ✅ Automatic CDN for fast loading

---

## After Setup

✅ Image uploads will work
✅ Wallet system will work
✅ Checkout will show wallet balance
✅ Orders will deduct from wallet

---

## If You Get Stuck

Check the detailed guide: `SETUP_INSTRUCTIONS.md` in your project root

Common issues and fixes are listed there.

