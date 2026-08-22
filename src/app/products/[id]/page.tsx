'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatCurrency } from '@/utils/formatting'
import { getStockStatusDisplay, isProductAvailable } from '@/utils/product-helpers'
import { useCart } from '@/context/CartContext'
import type { Product, ProductImage, Category } from '@/types/database'
import {
  ShoppingCart, Package, ArrowLeft, CheckCircle2, Wrench,
  Minus, Plus, ShieldCheck, Truck, RotateCcw, Sparkles, Info,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ProductDetail extends Product {
  product_images?: ProductImage[]
  categories?: Category
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem: addToCart } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [installationSelected, setInstallationSelected] = useState(false)
  const [addedMessage, setAddedMessage] = useState(false)

  useEffect(() => {
    if (productId) fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()
      if (!response.ok) { setError(data.message || 'Product not found'); return }
      setProduct(data.product)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-slate-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/products" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
            <p className="text-slate-300 mb-6">{error || 'This product does not exist'}</p>
            <Link href="/products" className="bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 inline-block">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = product.product_images?.sort((a, b) => a.display_order - b.display_order) || []
  const selectedImage = images[selectedImageIndex]?.image_url
  const stockStatus = getStockStatusDisplay(product.status)
  const isAvailable = isProductAvailable(product)

  const installationFee = product.installation_available ? (product.installation_fee ?? 0) : 0
  const selectedInstallFee = installationSelected ? installationFee : 0
  const itemTotal = (product.price + selectedInstallFee) * quantity

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(product.stock_quantity || 999, parseInt(e.target.value) || 1))
    setQuantity(value)
  }

  const handleAddToCart = () => {
    if (!isAvailable || !product) return

    addToCart({
      cart_key: `${product.id}-${installationSelected}`,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      sku: product.sku,
      installation_selected: installationSelected,
      installation_fee: installationSelected ? installationFee : 0,
      installation_description: installationSelected ? (product.installation_description ?? undefined) : undefined,
    })

    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 2500)
    setQuantity(1)
    setInstallationSelected(false)
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-slide-in">

          {/* ── Images ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/5 overflow-hidden aspect-square shadow-soft-md">
              <div className="absolute inset-0 bg-gradient-to-br from-oracle-500/0 to-purple-500/0 group-hover:from-oracle-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none z-10"></div>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-slate-600" strokeWidth={1} />
                </div>
              )}
              {/* Stock badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === idx
                        ? 'border-oracle-400 shadow-glow'
                        : 'border-white/10 hover:border-oracle-400/50'
                    }`}
                  >
                    <img src={img.image_url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: 'Secure Checkout', color: 'text-emerald-400' },
                { icon: Truck, label: 'Free Shipping', color: 'text-blue-400' },
                { icon: RotateCcw, label: '30-day Returns', color: 'text-purple-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="bg-surface-elevated2/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 flex flex-col items-center gap-1.5 text-center">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Product Info ────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Category */}
            {product.categories && (
              <Link
                href={`/products?category=${product.category_id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-oracle-500/10 border border-oracle-400/20 text-oracle-300 text-xs font-semibold hover:bg-oracle-500/20 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {product.categories.name}
              </Link>
            )}

            {/* Name */}
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-2">{product.name}</h1>
              <p className="text-sm text-slate-400 font-mono">SKU: {product.sku}</p>
            </div>

            {/* Base Price */}
            <div className="py-5 border-t border-b border-white/5">
              <p className="text-sm text-slate-400 mb-1">Product Price</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-oracle-300 to-oracle-400 bg-clip-text text-transparent">
                {formatCurrency(product.price)}
              </p>
              {product.stock_quantity > 0 && (
                <p className="text-sm text-slate-400 mt-1.5">{product.stock_quantity} units in stock</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Description</h2>
              <p className="text-slate-300 leading-relaxed">{product.description}</p>
            </div>

            {/* ── Installation Option ─────────────────────────────── */}
            {product.installation_available && installationFee > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-oracle-400" />
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Installation Service</h2>
                </div>

                {/* No installation option */}
                <button
                  type="button"
                  onClick={() => setInstallationSelected(false)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left group ${
                    !installationSelected
                      ? 'border-oracle-400/60 bg-oracle-500/10 shadow-glow'
                      : 'border-white/10 bg-surface-elevated2/50 hover:border-white/20'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    !installationSelected ? 'border-oracle-400' : 'border-slate-500'
                  }`}>
                    {!installationSelected && <div className="w-2.5 h-2.5 rounded-full bg-oracle-400"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold transition-colors ${!installationSelected ? 'text-white' : 'text-slate-300'}`}>
                      No installation
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">I will install it myself</p>
                  </div>
                  <span className={`font-bold whitespace-nowrap transition-colors ${!installationSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    +$0.00
                  </span>
                </button>

                {/* Professional installation option */}
                <button
                  type="button"
                  onClick={() => setInstallationSelected(true)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left group ${
                    installationSelected
                      ? 'border-emerald-400/60 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                      : 'border-white/10 bg-surface-elevated2/50 hover:border-emerald-400/30'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    installationSelected ? 'border-emerald-400' : 'border-slate-500'
                  }`}>
                    {installationSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold transition-colors ${installationSelected ? 'text-white' : 'text-slate-300'}`}>
                        Professional Installation
                      </p>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">Recommended</span>
                    </div>
                    {product.installation_description && (
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{product.installation_description}</p>
                    )}
                  </div>
                  <span className={`font-bold whitespace-nowrap transition-colors ${installationSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                    +{formatCurrency(installationFee)}
                  </span>
                </button>

                {/* Live price breakdown */}
                {installationSelected && (
                  <div className="bg-surface-elevated3/50 rounded-xl border border-emerald-400/20 p-4 space-y-2 animate-scale-in">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Product price</span>
                      <span className="text-slate-300">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Installation fee</span>
                      <span className="text-emerald-400">+{formatCurrency(installationFee)}</span>
                    </div>
                    {quantity > 1 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Quantity</span>
                        <span className="text-slate-300">×{quantity}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t border-white/10 pt-2 mt-2">
                      <span className="text-white">Item Total</span>
                      <span className="text-emerald-400">{formatCurrency(itemTotal)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Add to Cart ─────────────────────────────────────── */}
            {isAvailable ? (
              <div className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-300">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 bg-surface-elevated3 hover:bg-surface-elevated4 text-white rounded-xl border border-white/10 hover:border-oracle-400/30 flex items-center justify-center transition-all duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center bg-surface-elevated3 border border-white/10 rounded-xl py-2 text-white focus:outline-none focus:ring-2 focus:ring-oracle-500"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      className="w-10 h-10 bg-surface-elevated3 hover:bg-surface-elevated4 text-white rounded-xl border border-white/10 hover:border-oracle-400/30 flex items-center justify-center transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to cart confirmation */}
                {addedMessage && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl animate-scale-in">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Added to cart{installationSelected ? ' with professional installation' : ''}!
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                  {installationSelected && (
                    <span className="text-sm font-normal opacity-80">+ Installation</span>
                  )}
                </button>

                {/* Total preview */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm text-slate-400">
                    {quantity > 1 ? `${quantity} × ` : ''}{formatCurrency(product.price + selectedInstallFee)}
                  </span>
                  <span className="text-sm font-bold text-white">
                    Total: {formatCurrency(itemTotal)}
                  </span>
                </div>
              </div>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 bg-surface-elevated3 text-slate-500 font-bold text-lg rounded-xl cursor-not-allowed border border-white/5"
              >
                Out of Stock
              </button>
            )}

            {/* Product meta */}
            <div className="pt-5 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Availability</span>
                <span className={`font-semibold ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className="text-slate-300 font-semibold">Standard (3–5 days)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Returns</span>
                <span className="text-slate-300 font-semibold">30-day return policy</span>
              </div>
              {product.installation_available && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Installation</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5" />
                    Available (+{formatCurrency(installationFee)})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
