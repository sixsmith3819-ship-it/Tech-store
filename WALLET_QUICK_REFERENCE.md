# Demo Wallet - Quick Reference Card

## 🚀 Quick Start (5 Steps)

1. **Run Database Migration**
   - Supabase → SQL Editor → New Query
   - Paste `WALLET_SCHEMA.sql` → RUN

2. **Update Layout**
   - Add `<WalletProvider>` to `src/app/layout.tsx`

3. **Add Wallet Creation to Signup**
   - Call `supabase.rpc('create_user_wallet', {p_user_id: newUser.id})`

4. **Build & Test**
   - `npm run build`
   - `npm run dev`

5. **Deploy**
   - Push changes
   - Run migration on production DB

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `WALLET_SCHEMA.sql` | Database migration (RUN ONCE) |
| `src/app/api/wallet/get/route.ts` | Fetch wallet balance & transactions |
| `src/app/api/wallet/reset/route.ts` | Reset wallet to $10,000 |
| `src/context/WalletContext.tsx` | React wallet state & hooks |
| `src/app/checkout/page.tsx` | Updated with wallet integration |
| `src/utils/wallet.ts` | Utility functions |

---

## 🎯 Key Concepts

### Database Functions (RPC)
```typescript
// Create wallet for new user ($10,000 starting balance)
supabase.rpc('create_user_wallet', { p_user_id })

// Process payment atomically
supabase.rpc('process_demo_checkout', {
  p_user_id,
  p_order_total,
  p_order_data
})

// Reset wallet to $10,000
supabase.rpc('reset_demo_wallet', { p_user_id })

// Refund amount (if order fails)
supabase.rpc('refund_wallet', { p_user_id, p_amount, p_reference })
```

### Frontend Hook
```typescript
import { useWallet } from '@/context/WalletContext'

const { 
  wallet,              // { id, balance, currency }
  transactions,        // Array of transactions
  isLoading,           // boolean
  error,               // string | null
  totalSpent,          // number
  totalPurchases,      // number
  fetchWallet,         // async () => void
  resetWallet,         // async () => boolean
  topUpWallet,         // async (amount) => boolean
} = useWallet()
```

### API Endpoints
```
GET  /api/wallet/get         → Fetch wallet & transactions
POST /api/wallet/reset       → Reset wallet to $10,000
POST /api/wallet/top-up      → Add demo money
POST /api/orders/create      → Create order with demo payment
```

---

## 💰 Wallet Transaction Types

| Type | Description | Amount | When |
|------|-------------|--------|------|
| `initial_balance` | New user setup | +10000.00 | User signup |
| `purchase` | Buy products | -order_total | Checkout |
| `reset` | User resets wallet | +variable | User clicks reset |
| `refund` | Order cancelled | +order_total | Order cancelled |
| `demo_top_up` | Add more money | +amount | User requests |

---

## 🔒 Security

✅ All financial operations on backend (Supabase RPC functions)
✅ Database constraints prevent negative balance
✅ Row-level security (RLS) isolates users
✅ Atomic transactions (all-or-nothing)
✅ Database locks prevent race conditions
✅ Audit trail records all transactions

---

## 📊 Database Queries

### Check User Wallet
```sql
SELECT * FROM wallets WHERE user_id = 'USER_ID';
```

### View Transaction History
```sql
SELECT * FROM wallet_transactions 
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC;
```

### Reset User Wallet (Admin)
```sql
UPDATE wallets SET balance = 10000.00 WHERE user_id = 'USER_ID';
INSERT INTO wallet_transactions VALUES (...);
```

### Check Wallet Stats
```sql
SELECT 
  COUNT(*) as total_users,
  AVG(balance) as avg_balance,
  MIN(balance) as min_balance,
  MAX(balance) as max_balance
FROM wallets;
```

---

## ✅ Testing Scenarios

### Test 1: New User
- Sign up → Check wallet is $10,000 ✓

### Test 2: Purchase
- Add product → Checkout → Wallet decreases ✓

### Test 3: Insufficient Funds
- Wallet $50 → Try to buy $100 → Error ✓

### Test 4: Reset
- Click reset → Confirm → Wallet = $10,000 ✓

### Test 5: Concurrent Requests
- Two checkouts simultaneously → Only one succeeds ✓

---

## 🎨 UI Components

### Demo Wallet Card (Checkout)
```
┌─ Demo Wallet ─────────────────┐
│ 💰 Demonstration funds only    │
│                               │
│ Current Balance:              │
│ $10,000.00                    │
│                               │
│ Order Total: $1,234.56        │
│                               │
│ ✓ Sufficient funds            │
│                               │
│ [Pay with Demo Money Button]  │
└───────────────────────────────┘
```

### Insufficient Funds
```
┌─ Demo Wallet ─────────────────┐
│ Current Balance: $50.00       │
│ Order Total: $1,234.56        │
│                               │
│ ⚠️ Insufficient funds.        │
│    Need $1,184.56 more        │
│                               │
│ [Reset Demo Money to $10,000] │
└───────────────────────────────┘
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Wallet not found" | Run `SELECT create_user_wallet('USER_ID');` |
| Checkout fails silently | Check browser console for errors |
| Balance shows wrong amount | Refresh page, check database |
| RLS policy error | Verify `CREATE POLICY` statements ran |
| Function doesn't exist | Re-run `WALLET_SCHEMA.sql` |

---

## 📋 Production Checklist

Before going live:
- [ ] Database migration executed
- [ ] Layout has WalletProvider
- [ ] Signup creates wallets
- [ ] Checkout displays wallet
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Tested completely
- [ ] Monitoring set up

---

## 🔗 Related Documentation

- `WALLET_SCHEMA.sql` - Database schema
- `DEMO_WALLET_IMPLEMENTATION.md` - Complete technical docs
- `WALLET_SETUP_GUIDE.md` - Step-by-step setup
- `WALLET_IMPLEMENTATION_CHECKLIST.md` - Implementation checklist
- `DEMO_WALLET_SUMMARY.md` - Full project summary

---

## 💡 Pro Tips

1. **Test with Real Data**: Use actual products and prices
2. **Monitor Regularly**: Check wallet transactions weekly
3. **Clear Cache**: Browser cache can hide balance updates
4. **Atomic Operations**: All-or-nothing prevents data inconsistency
5. **User Friendly**: Reset button prevents frustration
6. **Clear Labeling**: "DEMO MONEY" everywhere prevents confusion
7. **Error Messages**: Show exactly what went wrong and how to fix it
8. **Audit Trail**: Keep all transactions for debugging

---

## 🎓 Learning Resources

- Supabase RPC: https://supabase.com/docs/reference/javascript/rpc
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Database Functions: https://supabase.com/docs/guides/database/functions
- React Context: https://react.dev/reference/react/useContext

---

**Version**: 1.0
**Last Updated**: August 2024
**Status**: Production Ready ✅
