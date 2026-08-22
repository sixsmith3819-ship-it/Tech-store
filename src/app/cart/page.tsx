'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatting'
import {
  ShoppingCart, ArrowLeft, Trash2, Plus, Minus,
  ShieldCheck, Truck, RotateCcw, Sparkles, Wrench,
} from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getInstallationTotal, getGrandTotal } = useCart()

  const subtotal = getTotal()
  const installationTotal = getInstallationTotal()
  const grandPreTax = getGrandTotal()
  const tax = grandPreTax * 0.08
  const orderTotal = grandPreTax * 1.08

  const hasInstallation = items.some(i => i.installation_selected)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-8">
            Shopping Cart
          </h1>
          <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-12 text-center shadow-soft">
            <ShoppingCart className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h2>
            <p className="text-slate-300 mb-8 text-lg">Start adding products to your cart</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oracle-500/10 border border-oracle-400/20 mb-4">
            <ShoppingCart className="w-4 h-4 text-oracle-400" />
            <span className="text-sm font-semibold text-oracle-300">{items.length} Item{items.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-3">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4 animate-slide-in">
            {items.map((item, index) => {
              const itemLineTotal = (item.price + item.installation_fee) * item.quantity
              return (
                <div
                  key={item.cart_key}
                  className="group relative bg-surface-elevated2 rounded-2xl border border-slate-600/20 hover:border-oracle-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Aurora glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-oracle-500/0 via-purple-500/0 to-transparent group-hover:from-oracle-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>

                  <div className="relative z-10 flex flex-col md:flex-row gap-6">
                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-white leading-tight">{item.product_name}</h3>
                          <p className="text-sm text-slate-400 font-mono mt-0.5">{item.sku}</p>
                        </div>
                      </div>

                      {/* Price breakdown */}
                      <div className="space-y-1 mt-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold bg-gradient-to-r from-oracle-300 to-oracle-400 bg-clip-text text-transparent">
                            {formatCurrency(item.price)}
                          </span>
                          <span className="text-sm text-slate-400">product price</span>
                        </div>

                        {/* Installation badge + fee */}
                        {item.installation_selected ? (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30">
                              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-semibold text-emerald-300">Professional Installation</span>
                            </div>
                            <span className="text-sm font-bold text-emerald-400">+{formatCurrency(item.installation_fee)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full border border-slate-600/30">Self-install</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity + actions */}
                    <div className="flex flex-col md:items-end gap-4">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cart_key, item.quantity - 1)}
                          className="w-9 h-9 bg-surface-elevated3 hover:bg-surface-elevated4 text-white rounded-xl transition-all duration-300 flex items-center justify-center border border-slate-600/30 hover:border-oracle-400/30"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.cart_key, parseInt(e.target.value) || 1)}
                          className="w-14 text-center bg-surface-elevated3 border border-slate-600/30 rounded-xl py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-oracle-500"
                          aria-label="Quantity"
                        />
                        <button
                          onClick={() => updateQuantity(item.cart_key, item.quantity + 1)}
                          className="w-9 h-9 bg-surface-elevated3 hover:bg-surface-elevated4 text-white rounded-xl transition-all duration-300 flex items-center justify-center border border-slate-600/30 hover:border-oracle-400/30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal + remove */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                          <p className="text-xl font-bold text-white">{formatCurrency(itemLineTotal)}</p>
                          {item.installation_selected && item.quantity > 1 && (
                            <p className="text-xs text-emerald-400 mt-0.5">
                              incl. {formatCurrency(item.installation_fee * item.quantity)} install
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.cart_key)}
                          className="w-9 h-9 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center border border-red-400/25"
                          aria-label={`Remove ${item.product_name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* ── Order Summary ──────────────────────────────────────── */}
          <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
            <div className="bg-surface-elevated2/50 backdrop-blur-xl rounded-2xl border border-slate-600/20 p-8 sticky top-4 shadow-soft-md">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-oracle-400" />
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>

              <div className="space-y-3 mb-6">
                {/* Products subtotal */}
                <div className="flex justify-between text-slate-300">
                  <span>Products:</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>

                {/* Installation line — only shown if any item has installation */}
                {hasInstallation && (
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                      Installation:
                    </span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(installationTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>Shipping:</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax (est. 8%):</span>
                  <span className="text-white font-medium">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="border-t border-slate-600/30 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="bg-gradient-to-r from-oracle-300 to-oracle-400 bg-clip-text text-transparent">
                    {formatCurrency(orderTotal)}
                  </span>
                </div>
                {hasInstallation && (
                  <p className="text-xs text-emerald-400 mt-1 text-right">
                    Includes {formatCurrency(installationTotal)} installation
                  </p>
                )}
              </div>

              {/* Checkout */}
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center block mb-4 shadow-soft hover:shadow-glow transform hover:scale-105"
              >
                Proceed to Checkout
              </Link>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="w-full bg-surface-elevated3 hover:bg-surface-elevated4 text-slate-400 hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-slate-600/20"
              >
                Clear Cart
              </button>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-slate-600/20 space-y-3">
                {[
                  { Icon: ShieldCheck, color: 'text-emerald-400', label: 'Secure checkout' },
                  { Icon: Truck, color: 'text-blue-400', label: 'Free shipping on orders over $50' },
                  { Icon: RotateCcw, color: 'text-purple-400', label: '30-day returns' },
                  ...(hasInstallation ? [{ Icon: Wrench, color: 'text-emerald-400', label: 'Professional installation included' }] : []),
                ].map(({ Icon, color, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
