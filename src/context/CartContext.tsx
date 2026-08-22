'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  cart_key: string            // unique: product_id + '-' + installation_selected
  product_id: string
  product_name: string
  price: number               // product base price only
  quantity: number
  sku: string
  installation_selected: boolean
  installation_fee: number    // per-unit installation fee (0 if not selected)
  installation_description?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (cartKey: string) => void
  updateQuantity: (cartKey: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number           // products subtotal (no installation)
  getInstallationTotal: () => number
  getGrandTotal: () => number      // products + installation (pre-tax)
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved)
        // Back-compat: migrate old items that lack cart_key
        const migrated = parsed.map(item => ({
          ...item,
          cart_key: item.cart_key ?? `${item.product_id}-false`,
          installation_selected: item.installation_selected ?? false,
          installation_fee: item.installation_fee ?? 0,
        }))
        setItems(migrated)
      } catch {
        // corrupted storage — start fresh
      }
    }
    setIsHydrated(true)
  }, [])

  // Persist cart to localStorage on every change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.cart_key === newItem.cart_key)
      if (existing) {
        // Same product + same installation choice → increment quantity
        return prev.map(i =>
          i.cart_key === newItem.cart_key
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (cartKey: string) => {
    setItems(prev => prev.filter(i => i.cart_key !== cartKey))
  }

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartKey)
      return
    }
    setItems(prev =>
      prev.map(i => i.cart_key === cartKey ? { ...i, quantity } : i)
    )
  }

  const clearCart = () => setItems([])

  /** Products subtotal only (no installation fees) */
  const getTotal = () =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  /** Installation fees total */
  const getInstallationTotal = () =>
    items.reduce((sum, i) => sum + i.installation_fee * i.quantity, 0)

  /** Products + installation, pre-tax */
  const getGrandTotal = () => getTotal() + getInstallationTotal()

  const getItemCount = () =>
    items.reduce((count, i) => count + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getInstallationTotal,
        getGrandTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
