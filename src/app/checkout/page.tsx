'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useWallet } from '@/context/WalletContext'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/utils/formatting'
import { validateEmail, validatePhone, ValidationError } from '@/utils/validation'
import { ArrowLeft, User, Mail, Phone, MapPin, FileText, ShoppingBag, Check, Package, Wallet as WalletIcon, AlertCircle } from 'lucide-react'

interface CheckoutForm {
  fullName: string
  email: string
  phone: string
  deliveryAddress: string
  additionalInstructions: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { wallet, isLoading: walletLoading, fetchWallet, resetWallet } = useWallet()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const { addItem: addToCart } = useCart()

  const [isHydrated, setIsHydrated] = useState(false)

  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryAddress: user?.address || '',
    additionalInstructions: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Hydrate on mount
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const totalAmount = getTotal() * 1.08 // Include tax
  const hasEnoughBalance = wallet && wallet.balance >= totalAmount

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/cart')
    }
  }, [items, isHydrated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const validationErrors: Record<string, string> = {}

      if (!formData.fullName.trim()) {
        validationErrors.fullName = 'Full name is required'
      }

      const emailError = validateEmail(formData.email)
      if (emailError) {
        validationErrors[emailError.field] = emailError.message
      }

      const phoneError = validatePhone(formData.phone)
      if (phoneError) {
        validationErrors[phoneError.field] = phoneError.message
      }

      if (!formData.deliveryAddress.trim()) {
        validationErrors.deliveryAddress = 'Delivery address is required'
      }

      // Check wallet balance - still allow submit even if wallet not loaded, backend will validate
      if (wallet && wallet.balance < totalAmount) {
        validationErrors.wallet = `Insufficient demo funds. You need $${totalAmount.toFixed(2)} but only have $${wallet.balance.toFixed(2)}`
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          deliveryAddress: formData.deliveryAddress,
          additionalInstructions: formData.additionalInstructions,
          totalAmount: totalAmount,
          paymentMethod: 'demo_money',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to create order' })
        setIsSubmitting(false)
        return
      }

      // Refresh wallet to show new balance
      await fetchWallet()
      
      // Clear cart after redirecting to avoid race condition with empty cart check
      router.push(`/order-confirmation/${data.order.id}`)
      
      // Clear cart after a brief delay to let navigation complete
      setTimeout(() => {
        clearCart()
      }, 100)
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      })
      setIsSubmitting(false)
    }
  }

  const handleResetWallet = async () => {
    try {
      const success = await resetWallet()
      if (success) {
        setShowResetConfirm(false)
      }
    } catch (error) {
      console.error('Failed to reset wallet:', error)
    }
  }

  if (!isHydrated || authLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-4">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Secure Checkout</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Complete Your Order
          </h1>
          <p className="text-gray-400 text-lg">Review your items and enter delivery information</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Customer Information</h2>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                        errors.fullName ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Delivery Information</h2>
              </div>

              <div className="space-y-4">
                {/* Delivery Address */}
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                      errors.deliveryAddress ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    rows={3}
                    placeholder="123 Main St, City, State 12345"
                  />
                  {errors.deliveryAddress && (
                    <p className="mt-2 text-sm text-red-400">{errors.deliveryAddress}</p>
                  )}
                </div>

                {/* Additional Instructions */}
                <div>
                  <label htmlFor="additionalInstructions" className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Instructions (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <textarea
                      id="additionalInstructions"
                      name="additionalInstructions"
                      value={formData.additionalInstructions}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Special delivery instructions, door code, etc."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || walletLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-soft hover:shadow-glow transform hover:scale-[1.02] animate-slide-in flex items-center justify-center gap-2"
              style={{ animationDelay: '200ms' }}
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Order...
                </>
              ) : walletLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading Wallet...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Order
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="animate-slide-in space-y-6" style={{ animationDelay: '300ms' }}>
            {/* Demo Wallet Card */}
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <WalletIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Demo Wallet</h3>
                  <p className="text-xs text-gray-500">Demonstration funds only</p>
                </div>
              </div>

              {walletLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-oracle-500"></div>
                </div>
              ) : wallet ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                    <p className="text-3xl font-bold text-blue-400">{formatCurrency(wallet.balance)}</p>
                  </div>
                  <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Order Total:</span>
                      <span className={`font-bold ${totalAmount > wallet.balance ? 'text-red-400' : 'text-emerald-400'}`}>
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    {totalAmount > wallet.balance && (
                      <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300">
                          Insufficient funds. Need {formatCurrency(totalAmount - wallet.balance)} more.
                        </p>
                      </div>
                    )}
                  </div>

                  {totalAmount > wallet.balance && (
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full px-4 py-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 hover:bg-orange-500/30 rounded-lg text-sm font-medium transition-all"
                    >
                      Reset Demo Money to $10,000
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Wallet not available</p>
              )}
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 max-w-sm w-full">
                  <h3 className="text-2xl font-bold text-white mb-2">Reset Demo Wallet?</h3>
                  <p className="text-gray-400 mb-6">
                    Your demo wallet will be reset to $10,000.00. This will replace your current balance.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleResetWallet}
                      className="w-full px-4 py-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 rounded-xl font-medium transition-all"
                    >
                      Yes, Reset Wallet
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="w-full px-4 py-3 bg-gray-500/20 border border-gray-400/30 text-gray-300 hover:bg-gray-500/30 rounded-xl font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary Card */}
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 sticky top-4 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-oracle-500/20">
                  <Package className="w-5 h-5 text-oracle-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pb-6 border-b border-white/5">
                {items.map((item: any, idx: number) => (
                  <div key={item.product_id} className="flex justify-between text-sm animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex-1">
                      <p className="text-gray-300 font-medium">{item.product_name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (est):</span>
                  <span>{formatCurrency(getTotal() * 0.08)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-white/10">
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                  <p className="text-xs text-blue-300">
                    <span className="font-bold">Payment Method:</span> Demo Wallet
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Secure demo checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
