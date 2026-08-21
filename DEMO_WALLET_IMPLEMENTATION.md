# Demo Wallet System - Implementation Guide

## Overview
This document provides a complete implementation guide for the Demo Money/Demo Wallet system in the Oracle Tech Store e-commerce application.

## Architecture

### Database Schema
The wallet system uses three main components:

1. **wallets table**
   - `id`: UUID primary key
   - `user_id`: Foreign key to auth.users (UNIQUE - one wallet per user)
   - `balance`: DECIMAL(12, 2) - Non-negative, starts at 10,000.00
   - `currency`: TEXT - Default 'USD'
   - `created_at`, `updated_at`: Timestamps

2. **wallet_transactions table**
   - `id`: UUID primary key
   - `wallet_id`: Foreign key to wallets
   - `user_id`: Foreign key to auth.users (for RLS)
   - `type`: TEXT - 'initial_balance' | 'purchase' | 'reset' | 'refund' | 'demo_top_up'
   - `amount`: DECIMAL(12, 2) - Amount of transaction
   - `balance_before`, `balance_after`: For audit trail
   - `reference`: Order number or reference
   - `description`: Human-readable description
   - `created_at`: Timestamp

3. **orders table modifications**
   - Added `payment_method` column: 'demo_money' | 'card' | 'bank_transfer'
   - Defaults to 'demo_money'

### Database Functions
Three RPC functions handle atomic operations:

1. **create_user_wallet(p_user_id UUID)**
   - Creates wallet with $10,000 initial balance
   - Prevents duplicate wallets
   - Records initial_balance transaction

2. **process_demo_checkout(p_user_id, p_order_total, p_order_data)**
   - Atomically deducts from wallet
   - Validates sufficient balance (locking for race conditions)
   - Records purchase transaction
   - Returns success/failure with new balance

3. **reset_demo_wallet(p_user_id)**
   - Resets balance to $10,000
   - Records reset transaction
   - Returns new balance

4. **refund_wallet(p_user_id, p_amount, p_reference)**
   - Adds funds back to wallet
   - Records refund transaction

### Row Level Security (RLS)
- Users can only read their own wallet
- Users can only read their own transactions
- Service role can read/write all wallets
- Updates only allowed via service role (through functions)

## Files Created

### API Routes
1. `/src/app/api/wallet/get/route.ts`
   - Fetches user's wallet and recent transactions
   - Returns balance, transaction history, stats

2. `/src/app/api/wallet/reset/route.ts`
   - POST endpoint to reset wallet
   - Calls `reset_demo_wallet` RPC

3. `/src/app/api/wallet/top-up/route.ts`
   - POST endpoint to add demo money
   - Limits top-up to $5,000 per request
   - Records demo_top_up transaction

### Frontend Components
1. `/src/context/WalletContext.tsx`
   - React Context for wallet state management
   - `useWallet()` hook for accessing wallet data
   - Methods: fetchWallet, resetWallet, topUpWallet, deductAmount

2. Updated `/src/app/checkout/page.tsx`
   - Displays demo wallet balance
   - Shows order total vs available balance
   - Reset wallet button with confirmation modal
   - Integrated wallet payment flow

### Database Schema
1. `/WALLET_SCHEMA.sql`
   - Complete SQL migration
   - Creates wallets and wallet_transactions tables
   - Defines RLS policies
   - Defines database functions
   - Adds payment_method column to orders

## Implementation Steps

### Step 1: Create Provider in Layout
Update your root layout to wrap with WalletProvider:

```tsx
// src/app/layout.tsx
import { WalletProvider } from '@/context/WalletContext'
import { CartProvider } from '@/context/CartContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </CartProvider>
      </body>
    </html>
  )
}
```

### Step 2: Run Database Migration
Execute the SQL in `WALLET_SCHEMA.sql` in your Supabase dashboard:
1. Go to SQL Editor
2. Create new query
3. Copy and paste entire WALLET_SCHEMA.sql
4. Click "RUN"

### Step 3: Create Signup Trigger
Add automatic wallet creation to signup. Update auth webhook or add to signup API:

```typescript
// After user is created in signup
const { data } = await supabase.rpc('create_user_wallet', {
  p_user_id: newUser.id,
})
```

Alternatively, create an Auth Hook in Supabase:
1. Go to Database → Webhooks
2. Create webhook on `auth.users` INSERT
3. Call endpoint to create wallet

Or use Supabase Edge Functions to auto-create wallets.

### Step 4: Update Orders API
The `/api/orders/create` endpoint has been updated to:
1. Accept `paymentMethod` parameter
2. Call `process_demo_checkout` for demo_money
3. Handle insufficient funds
4. Record payment method in order

### Step 5: Test the Flow

**Test 1: Register New User**
- Sign up new account
- Check dashboard
- Verify wallet shows $10,000

**Test 2: Purchase with Sufficient Funds**
- Add product to cart
- Go to checkout
- Verify wallet balance displays
- Complete order
- Verify wallet balance reduced
- Verify order created with payment_method='demo_money'

**Test 3: Insufficient Funds**
- Reduce wallet balance to $50 (via SQL for testing)
- Try to purchase $100 product
- Verify error message
- Verify order NOT created
- Verify wallet balance unchanged

**Test 4: Reset Wallet**
- Start with $0 balance
- Click "Reset Demo Money"
- Confirm modal
- Verify balance becomes $10,000
- Check transactions show reset

**Test 5: Concurrent Checkout**
- Simulate multiple checkout requests simultaneously
- Verify wallet never goes negative
- Verify only one order succeeds if balance insufficient

## Security Considerations

1. **All financial operations on backend**
   - Wallet deduction happens in database function
   - Client cannot modify balance directly
   - RLS prevents cross-user access

2. **Atomic transactions**
   - Checkout uses database transactions
   - If order creation fails, wallet refunded
   - No possibility of orphaned transactions

3. **Audit Trail**
   - Every transaction recorded
   - Includes balance before/after
   - References order number
   - Immutable transaction history

4. **Race Condition Prevention**
   - Database functions use FOR UPDATE locks
   - Prevents double-spending
   - Multiple concurrent requests handled safely

## Admin Functionality (Optional Future Enhancement)

To add admin wallet management:
1. Create `/admin/wallet-management/page.tsx`
2. Create `/api/admin/wallets/list/route.ts`
3. Create `/api/admin/wallets/reset/route.ts` (admin only)
4. Display user wallets, reset capabilities
5. View transaction history

## Wallet Display Component

To show wallet in dashboard header:

```tsx
import { useWallet } from '@/context/WalletContext'

export function WalletDisplay() {
  const { wallet, isLoading } = useWallet()
  
  if (isLoading) return <div>Loading...</div>
  if (!wallet) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
      <WalletIcon className="w-5 h-5 text-blue-400" />
      <div>
        <p className="text-xs text-gray-400">Demo Wallet</p>
        <p className="font-bold text-blue-400">{formatCurrency(wallet.balance)}</p>
      </div>
    </div>
  )
}
```

## Transaction History Page (Optional)

Create `/dashboard/wallet/page.tsx` to show:
- Current balance
- Top-up options
- Reset button
- Transaction history table
- Statistics (total spent, number of purchases)

## Error Handling

The system handles these cases:
- Wallet not found → Create automatically via signup
- Insufficient funds → Show error, suggest reset
- Concurrent checkout → Atomic lock prevents issues
- Database failures → Proper error messages
- Network failures → Retry logic in frontend

## Environment Variables

No new environment variables required. Uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Monetary Precision

All monetary values use:
- `DECIMAL(12, 2)` in database (prevents float precision issues)
- Amounts in cents are never used
- Always round to 2 decimal places in frontend
- Calculations verified server-side

## Testing Checklist

- [ ] New user gets $10,000 wallet on signup
- [ ] Wallet displays in checkout
- [ ] Successful purchase deducts from wallet
- [ ] Insufficient funds prevents purchase
- [ ] Reset wallet button works
- [ ] Confirmation modal works
- [ ] Transaction history records all operations
- [ ] Multiple concurrent checkouts work safely
- [ ] Mobile responsive
- [ ] Error messages are clear
- [ ] Users cannot access other users' wallets
- [ ] Admins cannot manipulate other user wallets

## Next Steps

1. Run the SQL migration
2. Add wallet creation to signup flow
3. Update root layout with WalletProvider
4. Test complete flow locally
5. Deploy to production
6. Monitor wallet system in admin panel (future)

