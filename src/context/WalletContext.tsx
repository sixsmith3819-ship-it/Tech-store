'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface WalletTransaction {
  id: string
  type: 'initial_balance' | 'purchase' | 'reset' | 'refund' | 'demo_top_up'
  amount: number
  balance_before: number
  balance_after: number
  reference?: string
  description: string
  created_at: string
}

interface Wallet {
  id: string
  balance: number
  currency: string
  created_at: string
  updated_at: string
}

interface WalletContextType {
  wallet: Wallet | null
  transactions: WalletTransaction[]
  isLoading: boolean
  error: string | null
  totalSpent: number
  totalPurchases: number
  fetchWallet: () => Promise<void>
  resetWallet: () => Promise<boolean>
  topUpWallet: (amount: number) => Promise<boolean>
  deductAmount: (amount: number) => boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ total_spent: 0, total_purchases: 0 })

  const fetchWallet = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/wallet/get')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch wallet')
        setWallet(null)
        return
      }

      setWallet(data.wallet)
      setTransactions(data.transactions || [])
      setStats(data.stats || { total_spent: 0, total_purchases: 0 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Failed to fetch wallet:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const resetWallet = useCallback(async () => {
    try {
      setError(null)

      const response = await fetch('/api/wallet/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to reset wallet')
        return false
      }

      // Refresh wallet data
      await fetchWallet()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Failed to reset wallet:', err)
      return false
    }
  }, [fetchWallet])

  const topUpWallet = useCallback(async (amount: number) => {
    try {
      setError(null)

      const response = await fetch('/api/wallet/top-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to add demo money')
        return false
      }

      // Refresh wallet data
      await fetchWallet()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Failed to top up wallet:', err)
      return false
    }
  }, [fetchWallet])

  const deductAmount = useCallback((amount: number): boolean => {
    // Client-side check (should not be relied upon for actual deduction)
    if (!wallet) return false
    return wallet.balance >= amount
  }, [wallet])

  // Fetch wallet when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet()
    }
  }, [isAuthenticated, fetchWallet])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        isLoading,
        error,
        totalSpent: stats.total_spent,
        totalPurchases: stats.total_purchases,
        fetchWallet,
        resetWallet,
        topUpWallet,
        deductAmount,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
