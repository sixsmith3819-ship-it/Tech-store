# Demo Wallet System - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Oracle Tech Store                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐     ┌─────────────────────────────────┐   │
│  │   Frontend (Next.js) │     │    Backend (Next.js API)       │   │
│  ├──────────────────────┤     ├─────────────────────────────────┤   │
│  │                      │     │                                 │   │
│  │ ┌──────────────────┐ │     │ ┌───────────────────────────┐   │   │
│  │ │ WalletContext    │ │     │ │ API Routes                │   │   │
│  │ │ ├─ wallet        │ │     │ │ ├─ /wallet/get           │   │   │
│  │ │ ├─ balance       │ │     │ │ ├─ /wallet/reset         │   │   │
│  │ │ ├─ transactions  │ │     │ │ ├─ /wallet/top-up        │   │   │
│  │ │ └─ useWallet()   │ │     │ │ └─ /orders/create        │   │   │
│  │ └────────┬─────────┘ │     │ └─────────────┬─────────────┘   │   │
│  │          │           │     │               │                 │   │
│  │ ┌────────▼─────────┐ │     │ ┌─────────────▼─────────────┐   │   │
│  │ │ Checkout Page    │ │     │ │ Supabase Client           │   │   │
│  │ │ ├─ Wallet Card   │ │     │ │ ├─ Authentication         │   │   │
│  │ │ ├─ Balance       │ │     │ │ ├─ RPC Calls              │   │   │
│  │ │ ├─ Reset Button  │ │     │ │ └─ Database Access        │   │   │
│  │ │ └─ Confirmation  │ │     │ └────────────┬──────────────┘   │   │
│  │ └─────────────────┘ │     │              │                  │   │
│  │                      │     └──────────────┼──────────────────┘   │
│  └──────────────────────┘                    │                      │
│                                              │                      │
└──────────────────────────────────────────────┼──────────────────────┘
                                               │
                                ┌──────────────▼──────────────┐
                                │   Supabase (PostgreSQL)    │
                                ├────────────────────────────┤
                                │                            │
                                │ ┌──────────────────────┐   │
                                │ │ Tables               │   │
                                │ │ ├─ wallets           │   │
                                │ │ ├─ wallet_trans...   │   │
                                │ │ └─ orders (updated)  │   │
                                │ └──────────────────────┘   │
                                │                            │
                                │ ┌──────────────────────┐   │
                                │ │ RPC Functions        │   │
                                │ │ ├─ create_user...    │   │
                                │ │ ├─ process_demo...   │   │
                                │ │ ├─ reset_demo...     │   │
                                │ │ └─ refund_wallet     │   │
                                │ └──────────────────────┘   │
                                │                            │
                                │ ┌──────────────────────┐   │
                                │ │ RLS Policies         │   │
                                │ │ ├─ Read own wallet    │   │
                                │ │ ├─ Can't modify       │   │
                                │ │ │  (via RPC only)    │   │
                                │ │ └─ Admin bypass       │   │
                                │ └──────────────────────┘   │
                                │                            │
                                └────────────────────────────┘
```

---

## User Registration Flow

```
User Signs Up
       │
       ▼
Supabase Auth
Creates User
       │
       ▼
Signup API
Validates User
       │
       ▼
create_user_wallet()
RPC Function
       │
       ├─ Check: Wallet exists?
       │        NO ✓
       │
       ├─ INSERT into wallets
       │  balance = 10,000.00
       │
       ├─ INSERT transaction
       │  type = 'initial_balance'
       │  amount = 10,000.00
       │
       ▼
Wallet Created ✓
User can shop!
```

---

## Checkout Payment Flow

```
User at Checkout
       │
       ▼
useWallet() Hook
Fetches wallet
       │
       ├─ GET /api/wallet/get
       │
       ▼
Display Wallet Card
Show balance vs total
       │
       ├─ If insufficient:
       │  Show error & reset button
       │
       ├─ If sufficient:
       │  Show "Pay" button
       │
       ▼
User Submits Form
       │
       ▼
POST /api/orders/create
paymentMethod='demo_money'
       │
       ▼
Backend Validates:
  - User authenticated?
  - Cart valid?
  - Amount valid?
       │
       ▼
process_demo_checkout() RPC
       │
       ├─ Database locks wallet
       │  (prevents race conditions)
       │
       ├─ Validate balance >= amount?
       │  NO → Return error
       │  YES ✓ → Continue
       │
       ├─ UPDATE wallet
       │  balance = balance - amount
       │
       ├─ INSERT transaction
       │  type = 'purchase'
       │  amount = payment_amount
       │
       ▼
RPC Returns Success
       │
       ├─ CREATE order
       │
       ├─ CREATE order_items
       │
       ├─ CLEAR cart
       │
       ▼
Redirect to
Confirmation Page
       │
       ▼
Display success
New balance shown
```

---

## Concurrent Request Handling

```
User clicks
"Complete Order"
twice rapidly
       │
       ├─────────┬────────────┐
       │         │            │
       ▼         ▼            ▼
  Request 1  Request 2   Request 3
  (1ms)      (5ms)       (10ms)
       │         │            │
       ▼         ▼            ▼
  Lock        Wait...      Wait...
  Wallet
       │
       ├─ Check balance
       │  $500 >= $540? YES ✓
       │
       ├─ Deduct: $500 - $540
       │  Wait... balance insufficient!
       │  Return: Insufficient funds error
       │
       ▼
  Release
  Lock
       │         │            │
       ▼         ▼            ▼
 Acquire      Acquire      Acquire
 Lock         Lock         Lock
       │         │            │
       ├─ Check  ├─ Check     ├─ Check
  balance:  balance:     balance:
  Insufficient
       │         │            │
       ▼         ▼            ▼
ERROR    ERROR           ERROR

RESULT:
- First request processes successfully
- Other requests get "Insufficient funds" error
- Wallet balance = $0 (correct!)
- No negative balance possible
- Consistency maintained ✓
```

---

## Data Flow Diagram

```
User Action                Backend Operation           Database State
─────────────────────────────────────────────────────────────────────

New Account
Register
    ▼
Create profile              create_user_wallet()       wallets: INSERTED
                                                       transactions: INSERTED
    │                       ├─ Validate no duplicate
    │                       ├─ Set balance = 10000
    │                       └─ Record transaction
    ▼

User makes
Purchase
    ▼
Add to cart                 No DB changes              (Cart in-memory)
    │
    ├─ Browse products      GET /products              No wallet changes
    │
    ├─ View checkout        GET /wallet/get            Wallet READ
    │   balance
    │
    ▼
Click "Buy"                 process_demo_checkout()    wallets: UPDATED
                                                       transactions: INSERTED
                            ├─ Lock wallet             orders: INSERTED
                            ├─ Validate balance        order_items: INSERTED
                            ├─ Deduct amount
                            ├─ Record transaction
                            └─ Release lock
    ▼

View Order                  GET /orders/{id}           No wallet changes
Confirmation


User wants to
Reset Wallet
    ▼
Click button                reset_demo_wallet()        wallets: UPDATED
                                                       transactions: INSERTED
                            ├─ Lock wallet
                            ├─ Set balance = 10000
                            ├─ Record reset transaction
                            └─ Release lock
    ▼

Wallet resets
to $10,000
```

---

## Database Transaction Atomicity

```
SCENARIO: Order Creation Fails

START TRANSACTION
    │
    ├─ UPDATE wallets
    │  balance -= 1234.56  ✓
    │
    ├─ INSERT transaction  ✓
    │
    ├─ INSERT order        ✗ FAILS!
    │  (validation error)
    │
    ▼
ROLLBACK
    │
    ├─ UNDO wallet update
    ├─ UNDO transaction record
    └─ No order created
    │
    ▼
Result:
Wallet unchanged ✓
No orphaned transactions ✓
Data consistent ✓

---

SCENARIO: Everything Succeeds

START TRANSACTION
    │
    ├─ UPDATE wallets      ✓
    ├─ INSERT transaction  ✓
    ├─ INSERT order        ✓
    ├─ INSERT order_items  ✓
    │
    ▼
COMMIT
    │
    ▼
All changes permanent ✓
Transaction complete ✓
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Application Level                              │
├─────────────────────────────────────────────────────────┤
│ ✓ Validate user authenticated                           │
│ ✓ Validate input (amount, user_id)                      │
│ ✓ Check authorization (own wallet only)                 │
│ ✓ Rate limiting (optional)                              │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ Layer 2: API Level (Next.js)                            │
├─────────────────────────────────────────────────────────┤
│ ✓ Auth check (getCurrentUser)                           │
│ ✓ User ID validation                                    │
│ ✓ Request validation                                    │
│ ✓ Error handling                                        │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ Layer 3: Supabase RPC Level                             │
├─────────────────────────────────────────────────────────┤
│ ✓ Service role authentication                           │
│ ✓ SQL injection prevention (parameterized)              │
│ ✓ Business logic validation                             │
│ ✓ Atomic operations                                     │
│ ✓ Database locking (FOR UPDATE)                         │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ Layer 4: RLS Policy Level                               │
├─────────────────────────────────────────────────────────┤
│ ✓ Row-level security filters                            │
│ ✓ User isolation (can't see other wallets)              │
│ ✓ Role-based access (service_role bypass)               │
│ ✓ Policy evaluation on every query                      │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ Layer 5: Database Constraint Level                      │
├─────────────────────────────────────────────────────────┤
│ ✓ CHECK (balance >= 0) - prevents negative              │
│ ✓ UNIQUE (user_id) - prevents duplicates                │
│ ✓ FOREIGN KEY - referential integrity                   │
│ ✓ PRIMARY KEY - unique records                          │
│ ✓ NOT NULL - required fields                            │
└─────────────────────────────────────────────────────────┘

Result: Multiple layers of protection ensure:
- No negative balances
- No double-spending
- No unauthorized access
- Data consistency
- Audit trail
```

---

## Performance Optimization

```
Frontend                Backend              Database
────────────────────────────────────────────────────────

useWallet()
Hook            ─────── GET /api/wallet/get
                         │
                         ├─ SELECT wallets (indexed)
                         ├─ SELECT transactions (indexed)
                         │
                         ├─ Calculate stats
                         └─ Return JSON
                ◄─────── Response
                         
Cache in React
State           (10 seconds default)

On Checkout:
Validate        ─────── POST /api/orders/create
Balance                  │
                         ├─ Call process_demo_checkout() RPC
                         │  (single database roundtrip)
                         │
                         ├─ Database Function:
                         │  Lock + Deduct + Record + Release
                         │  (atomic, fast)
                         │
                         └─ Return result
                ◄─────── Response

Refresh
Wallet          ─────── GET /api/wallet/get (again)
State
                ◄─────── Updated balance

Optimizations:
✓ Database indexes on frequently queried columns
✓ RPC function (single roundtrip vs multiple queries)
✓ Frontend caching reduces API calls
✓ Batch inserts for order items
```

---

## Scalability Considerations

```
Current Scale: Small to Medium
─────────────────────────────────

✓ Direct Supabase RPC calls
✓ Real-time updates via polling
✓ No caching layer needed
✓ Simple state management

If scaling to 100,000+ users:
─────────────────────────────────

Consider:
- Redis caching for wallet balance
- Background job queue for transactions
- Event sourcing for audit trail
- Read replicas for analytics
- Sharding by user_id
- Connection pooling

Database Optimization:
- Add partial indexes on transaction type
- Archive old transactions
- Materialized views for stats
- Denormalized balance cache

API Optimization:
- Rate limiting per user
- Batch operations
- Async processing
- CDN for static assets
```

---

**Architecture Version**: 1.0
**Last Updated**: August 2024
**Complexity Level**: Advanced (but well-documented)
