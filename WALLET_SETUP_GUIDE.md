# Demo Wallet Setup - Quick Start Guide

## STEP 1: Run Database Migration

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Open the file `WALLET_SCHEMA.sql` from your project root
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click "RUN" button
8. Wait for success message

This will create:
- `wallets` table
- `wallet_transactions` table
- RLS policies
- Database functions
- Update `orders` table with `payment_method` column

## STEP 2: Update Root Layout

Update your `src/app/layout.tsx` to include the WalletProvider:

```tsx
import { CartProvider } from '@/context/CartContext'
import { WalletProvider } from '@/context/WalletContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

## STEP 3: Create Signup Wallet Trigger

Option A: Update your signup API route to create wallet

```typescript
// In your signup API (e.g., /api/auth/signup/route.ts)
// After user is successfully created:

const supabase = await createServiceRoleClient()
const { data: wallet } = await supabase.rpc('create_user_wallet', {
  p_user_id: newUser.id,
})
```

Option B: Use Supabase Auth Hooks (Enterprise)

Contact Supabase support to add a PostgreSQL trigger that calls:
```sql
SELECT create_user_wallet(NEW.id);
```
When a new user is inserted into `auth.users`

Option C: Create Edge Function Webhook

1. In Supabase, go to Database → Webhooks
2. Create new webhook on `auth.users` table, INSERT events
3. HTTP POST to: `https://yourdomain.com/api/webhooks/create-wallet`
4. Create endpoint:

```typescript
// /api/webhooks/create-wallet/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const { record } = body // new auth user
  
  const supabase = createServiceRoleClient()
  await supabase.rpc('create_user_wallet', {
    p_user_id: record.id,
  })
  
  return Response.json({ success: true })
}
```

## STEP 4: Test Locally

```bash
npm run dev
```

1. **Create new user account**
   - Sign up at `/auth/signup`
   - After signup, check database:
     ```sql
     SELECT * FROM wallets WHERE user_id = 'USER_ID';
     ```
   - Should show balance of 10000.00

2. **Add product to cart**
   - Go to `/products`
   - Click on a product
   - Add to cart

3. **Go to checkout**
   - Navigate to `/checkout`
   - Should see:
     - Demo Wallet card showing $10,000.00
     - Order total
     - Balance comparison
   - Fill form
   - Click "Complete Order"

4. **Verify order created**
   - Should redirect to order confirmation
   - Check database:
     ```sql
     SELECT * FROM orders WHERE user_id = 'USER_ID';
     -- Should have payment_method = 'demo_money'
     
     SELECT * FROM wallets WHERE user_id = 'USER_ID';
     -- Balance should be reduced
     
     SELECT * FROM wallet_transactions WHERE user_id = 'USER_ID';
     -- Should show purchase transaction
     ```

## STEP 5: Test Edge Cases

### Test Insufficient Funds

1. Manually set wallet balance to $50:
   ```sql
   UPDATE wallets SET balance = 50.00 WHERE user_id = 'USER_ID';
   ```

2. Add $100 product to cart
3. Go to checkout
4. Should see:
   - Error: "Insufficient demo funds. You need $108.00 but only have $50.00"
   - "Reset Demo Money to $10,000" button

5. Click reset button:
   - Confirmation modal appears
   - Click "Yes, Reset Wallet"
   - Wallet resets to $10,000
   - Can now complete purchase

### Test Reset Wallet

1. Purchase products until wallet is low or empty
2. In checkout, see "Reset Demo Money to $10,000" button
3. Click it
4. Confirm in modal
5. Balance updates to $10,000
6. Can make another purchase

### Test Transaction History

1. Make a few purchases
2. Check database:
   ```sql
   SELECT * FROM wallet_transactions 
   WHERE user_id = 'USER_ID'
   ORDER BY created_at DESC;
   ```
3. Should see:
   - initial_balance (10000.00)
   - purchase (negative amounts)
   - reset (large positive if reset)

## STEP 6: Deploy to Production

1. Ensure `WALLET_SCHEMA.sql` migrations are applied to prod database
2. Redeploy application with:
   - Updated checkout page
   - Wallet context
   - API routes
3. Enable automatic wallet creation for existing users:
   ```sql
   -- One-time script to create wallets for existing users
   INSERT INTO wallets (user_id, balance, currency)
   SELECT id, 10000.00, 'USD'
   FROM auth.users
   WHERE id NOT IN (SELECT user_id FROM wallets)
   ON CONFLICT DO NOTHING;
   ```

## Verification Checklist

- [ ] `WALLET_SCHEMA.sql` executed successfully
- [ ] `wallets` table exists and has RLS enabled
- [ ] `wallet_transactions` table exists
- [ ] Database functions exist: create_user_wallet, process_demo_checkout, reset_demo_wallet, refund_wallet
- [ ] Root layout has WalletProvider
- [ ] Signup creates wallet for new users
- [ ] Checkout page displays wallet balance
- [ ] Purchase deducts from wallet
- [ ] Insufficient funds prevents purchase
- [ ] Reset wallet functionality works
- [ ] Transaction history records all operations
- [ ] Mobile responsive

## Troubleshooting

### "Wallet not found" error during checkout
**Solution**: User doesn't have wallet. Run:
```sql
SELECT create_user_wallet('USER_ID');
```

### "Insufficient balance" but should have funds
**Solution**: Check wallet balance:
```sql
SELECT balance FROM wallets WHERE user_id = 'USER_ID';
```

### Orders created but wallet not updated
**Solution**: Check if `process_demo_checkout` function exists:
```sql
SELECT * FROM pg_proc WHERE proname = 'process_demo_checkout';
```
If empty, re-run WALLET_SCHEMA.sql

### RLS policy blocking access
**Solution**: Verify RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'wallets';
```
Should see policies for all operations.

## Files Summary

| File | Purpose |
|------|---------|
| `WALLET_SCHEMA.sql` | Database migration - RUN ONCE |
| `DEMO_WALLET_IMPLEMENTATION.md` | Complete implementation documentation |
| `WALLET_SETUP_GUIDE.md` | This file - quick setup steps |
| `/src/app/api/wallet/get/route.ts` | Fetch wallet & transactions |
| `/src/app/api/wallet/reset/route.ts` | Reset wallet endpoint |
| `/src/app/api/wallet/top-up/route.ts` | Add demo money endpoint |
| `/src/context/WalletContext.tsx` | Wallet state management |
| `/src/app/checkout/page.tsx` | Updated checkout with wallet |
| `/src/app/api/orders/create/route.ts` | Updated to process wallet payments |

## Next Steps

1. Complete all 6 setup steps above
2. Test the flow completely
3. Deploy to production
4. Monitor transaction logs
5. Optional: Create admin wallet management page
6. Optional: Create customer wallet dashboard page

