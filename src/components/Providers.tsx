'use client'

import { CartProvider } from '@/context/CartContext'
import { WalletProvider } from '@/context/WalletContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </CartProvider>
  )
}
