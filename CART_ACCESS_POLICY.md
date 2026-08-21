# Cart Access Policy - Oracle Tech Store

## Who Can Add to Cart?

### ✅ **BOTH** - Customer and Admin Users Can Add to Cart

**Current Implementation**: There are **NO role-based restrictions** on adding items to the shopping cart.

---

## How It Works

### Cart System Architecture

```
ProductCard Component
    ↓
Add to Cart Button (No role check)
    ↓
CartContext.addItem()
    ↓
localStorage (Client-side storage)
    ↓
Cart persists for current user
```

### Key Code Analysis

#### 1. **ProductCard Component** (`src/components/ProductCard.tsx`)
```typescript
const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault()
  if (!isAvailable) return  // ← Only checks if product is available
  
  // Add item - NO ROLE CHECK HERE
  addItem({
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    quantity: 1,
    sku: product.sku,
  })
}
```
**Finding**: No `useAuth()` or role check. Anyone can add to cart.

#### 2. **CartContext** (`src/context/CartContext.tsx`)
```typescript
const addItem = (newItem: CartItem) => {
  setItems(prevItems => {
    // ... logic to add item
    return [...prevItems, newItem]
  })
}
```
**Finding**: No authentication or role verification. It's a pure client-side context.

#### 3. **Products Page** (`src/app/products/page.tsx`)
```typescript
export default function ProductsPage() {
  // No auth check - page accessible to all users
  // ProductCard displayed for all users
}
```
**Finding**: No role-based product filtering.

---

## Current Access Matrix

| User Type | Can Browse Products | Can Add to Cart | Can Checkout | Can View Orders |
|-----------|-------------------|-----------------|--------------|-----------------|
| **Customer** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (own) |
| **Admin** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (all) |
| **Guest** | ✅ Yes | ✅ Yes* | ❌ No** | ❌ No |

*Guests can add to cart but can't checkout (requires auth)  
**Checkout requires authentication

---

## Storage Details

### Client-Side Storage (localStorage)
- Cart stored in browser's `localStorage` 
- Key: `'cart'`
- Data structure: `CartItem[]`

```typescript
interface CartItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
  sku: string
}
```

### Per-User Cart
- Each browser/device has its own cart
- Carts are NOT shared between users
- Admins and Customers have separate carts on same device

---

## Checkout Process (Where Authentication Happens)

| Step | Requirement |
|------|-------------|
| 1. Browse Products | None (public) |
| 2. Add to Cart | None (client-side) |
| 3. View Cart | None (localStorage) |
| 4. Click Checkout | **✅ Must be authenticated** |
| 5. Submit Order | **✅ Must have customer role** |

**Code Location**: `src/app/checkout/page.tsx`
```typescript
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login')  // ← Redirects unauthenticated users
  }
}, [isLoading, isAuthenticated, router])
```

---

## Option 1: Current Behavior (Recommended for E-Commerce)

**Both customers and admins can use the shopping cart normally.**

### Pros:
- Admins can test shopping flow
- Admins can place orders to test system
- Admins can experience customer journey
- Simpler implementation
- More flexible

### Cons:
- Admins might accidentally place real orders
- No distinction between roles

---

## Option 2: Restrict Admins from Adding to Cart

If you want to **prevent admins** from adding to cart, here's how:

### Implementation (ProductCard.tsx)

```typescript
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }: ProductCardProps) {
  const { isAdmin } = useAuth()  // ← Check if admin
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Block admins from adding to cart
    if (isAdmin) {
      alert('Admins cannot add items to cart. Use Manage Products instead.')
      return
    }

    if (!isAvailable) return
    addItem({ ... })
  }

  return (
    // ... JSX
    <button
      onClick={handleAddToCart}
      disabled={!isAvailable || isAdding || isAdmin}  // ← Disable for admins
      className={...}
    >
      {isAdmin ? '🔒 Admin Only' : '🛒 Add to Cart'}
    </button>
  )
}
```

---

## Option 3: Show Admin-Only Inventory Management Interface

**For admins, show different options**:

```typescript
if (isAdmin) {
  return (
    <div>
      <button>Edit Product</button>
      <button>Manage Stock</button>
      <button>View Orders for This Product</button>
    </div>
  )
} else {
  return (
    <button onClick={handleAddToCart}>🛒 Add to Cart</button>
  )
}
```

---

## Recommendation

### For Development/Testing: ✅ **Keep Current Behavior**
- Both roles can add to cart
- Admins can test the full shopping experience
- Easier to debug checkout flow

### For Production: ⚠️ **Restrict Admins** (Optional)
- Add the role check from Option 2
- Prevent accidental admin orders
- Clearer separation of admin vs customer features

---

## Summary

**Current State**: 
- ✅ **Both admins and customers can add to cart**
- Cart is client-side (localStorage)
- Authentication only required at checkout

**To Change This**: 
- Add `useAuth()` check in ProductCard
- Disable button for admins
- Show different UI for admin vs customer roles

Would you like me to **implement Option 2** (restrict admins from adding to cart)?

---

*Oracle Tech Store - Cart Access Policy*  
*Last Updated: August 14, 2026*
