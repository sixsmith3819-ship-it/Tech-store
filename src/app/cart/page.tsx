'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatting'
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
        {/* Aurora Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-8">
            Shopping Cart
          </h1>

          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft">
            <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-8 text-lg">Start adding products to your cart</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oracle-500/10 border border-oracle-400/20 mb-4">
            <ShoppingCart className="w-4 h-4 text-oracle-400" />
            <span className="text-sm font-semibold text-oracle-300">{items.length} Items</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-slide-in">
            {items.map((item, index) => (
              <div 
                key={item.product_id} 
                className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-oracle-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Aurora Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-oracle-500/0 via-purple-500/0 to-transparent group-hover:from-oracle-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white mb-1">{item.product_name}</h3>
                    <p className="text-sm text-gray-500 font-mono mb-4">{item.sku}</p>
                    <div className="text-2xl font-bold bg-gradient-to-r from-oracle-300 to-oracle-400 bg-clip-text text-transparent">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col md:items-end gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-10 h-10 bg-surface-elevated3 hover:bg-surface-elevated4 text-white rounded-xl transition-all duration-300 flex items-center justify-center border border-white/10 hover:border-oracle-400/30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center bg-surface-elevated3 border border-white/10 rounded-xl py-2 text-white focus:outline-none focus:ring-2 focus:ring-oracle-500"
                      />
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-10 h-10 bg-surface-elevated3 hover:bg-surface-elevated4 text-white rounded-xl transition-all duration-300 flex items-center justify-center border border-white/10 hover:border-oracle-400/30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center border border-red-400/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary - Sticky */}
          <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
            <div className="bg-surface-elevated2/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 sticky top-4 shadow-soft-md">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-oracle-400" />
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping:</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (est):</span>
                  <span className="text-white font-medium">{formatCurrency(getTotal() * 0.08)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="bg-gradient-to-r from-oracle-300 to-oracle-400 bg-clip-text text-transparent">
                    {formatCurrency(getTotal() * 1.08)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center block mb-4 shadow-soft hover:shadow-glow transform hover:scale-105"
              >
                Proceed to Checkout
              </Link>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full bg-surface-elevated3 hover:bg-surface-elevated4 text-gray-400 hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-white/10"
              >
                Clear Cart
              </button>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
