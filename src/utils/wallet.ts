/**
 * Wallet utility functions for demo money system
 */

/**
 * Format amount as currency (handles monetary precision)
 */
export function formatAmount(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Check if amount is valid for transactions
 */
export function isValidAmount(amount: any): boolean {
  if (typeof amount !== 'number' && typeof amount !== 'string') return false
  const num = typeof amount === 'number' ? amount : parseFloat(amount)
  return !isNaN(num) && num > 0 && Number.isFinite(num)
}

/**
 * Round to 2 decimal places (monetary precision)
 */
export function roundToFraction(amount: number, fractionDigits: number = 2): number {
  return Math.round(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits)
}

/**
 * Check if wallet has sufficient balance
 */
export function hasSufficientBalance(balance: number, requiredAmount: number): boolean {
  return balance >= roundToFraction(requiredAmount)
}

/**
 * Get transaction type label
 */
export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    initial_balance: 'Initial Balance',
    purchase: 'Purchase',
    reset: 'Wallet Reset',
    refund: 'Refund',
    demo_top_up: 'Demo Top-up',
  }
  return labels[type] || type
}

/**
 * Get transaction type color
 */
export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    initial_balance: 'text-blue-400',
    purchase: 'text-red-400',
    reset: 'text-orange-400',
    refund: 'text-emerald-400',
    demo_top_up: 'text-green-400',
  }
  return colors[type] || 'text-gray-400'
}

/**
 * Get transaction amount sign (+ or -)
 */
export function getTransactionAmountSign(type: string): string {
  const negativeTypes = ['purchase']
  return negativeTypes.includes(type) ? '-' : '+'
}

/**
 * Format wallet balance with proper styling
 */
export function formatBalanceDisplay(balance: number): string {
  if (balance >= 0) {
    return formatAmount(balance)
  }
  // Should never be negative due to constraints, but handle just in case
  return `-${formatAmount(Math.abs(balance))}`
}

/**
 * Calculate checkout total including tax
 */
export function calculateCheckoutTotal(subtotal: number, taxRate: number = 0.08): number {
  const tax = roundToFraction(subtotal * taxRate)
  return roundToFraction(subtotal + tax)
}

/**
 * Validate wallet for payment
 */
export interface WalletValidation {
  valid: boolean
  message?: string
  requiredAmount?: number
  availableBalance?: number
}

export function validateWalletForPayment(
  balance: number | null | undefined,
  requiredAmount: number
): WalletValidation {
  if (!balance && balance !== 0) {
    return {
      valid: false,
      message: 'Wallet not found',
    }
  }

  if (!isValidAmount(requiredAmount)) {
    return {
      valid: false,
      message: 'Invalid payment amount',
    }
  }

  if (balance < requiredAmount) {
    return {
      valid: false,
      message: `Insufficient demo funds. You need ${formatAmount(requiredAmount)} but only have ${formatAmount(balance)}.`,
      requiredAmount: roundToFraction(requiredAmount),
      availableBalance: roundToFraction(balance),
    }
  }

  return {
    valid: true,
  }
}

/**
 * Get message for display based on balance
 */
export function getWalletBalanceMessage(balance: number, threshold: number = 1000): string {
  if (balance === 0) {
    return 'Your demo wallet is empty. Reset to continue shopping.'
  }
  if (balance < threshold) {
    return `Your demo wallet balance is low (${formatAmount(balance)}). Consider resetting.`
  }
  return `Available balance: ${formatAmount(balance)}`
}
