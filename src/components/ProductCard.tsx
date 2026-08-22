'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatCurrency } from '@/utils/formatting'
import { getStockStatusDisplay, isProductAvailable } from '@/utils/product-helpers'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Eye, Package } from 'lucide-react'
import type { Product, ProductImage } from '@/types/database'

interface ProductCardProps {
  product: Product & { product_images?: ProductImage[] }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState(false)
  const [imageError, setImageError] = useState(false)

  const firstImage = product.product_images?.[0]?.image_url
  const stockStatus = getStockStatusDisplay(product.status)
  const isAvailable = isProductAvailable(product)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAvailable) return

    setIsAdding(true)
    addItem({
      cart_key: `${product.id}-false`,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      sku: product.sku,
      installation_selected: false,
      installation_fee: 0,
    })

    setAddedMessage(true)
    setTimeout(() => {
      setIsAdding(false)
      setAddedMessage(false)
    }, 2000)
  }

  return (
    <div className="group relative bg-surface-elevated2 rounded-2xl overflow-hidden border border-slate-600/20 hover:border-oracle-400/30 transition-all duration-500 h-full flex flex-col hover:shadow-soft-lg hover:-translate-y-1">
      {/* Aurora Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-oracle-500/0 via-purple-500/0 to-transparent group-hover:from-oracle-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none"></div>

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative bg-surface-elevated3 aspect-square overflow-hidden block">
        {firstImage && !imageError ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-slate-500" strokeWidth={1.5} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${stockStatus.color}`}>
            {stockStatus.label}
          </span>
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <span className="px-3 py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
              Limited Stock
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </div>
        </div>
      </Link>

      {/* Content Container */}
      <div className="relative p-5 flex flex-col flex-grow">
        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="block group/link">
          <h3 className="font-bold text-lg text-white mb-1.5 line-clamp-2 group-hover/link:text-oracle-300 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* SKU */}
        <p className="text-xs text-slate-400 mb-3 font-mono">SKU: {product.sku}</p>

        {/* Description Preview */}
        <p className="text-sm text-slate-300 mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="mb-4 pt-4 border-t border-slate-600/20">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-oracle-300 to-oracle-400 bg-clip-text text-transparent">
              {formatCurrency(product.price)}
            </p>
          </div>
          {product.stock_quantity > 0 && (
            <p className="text-xs text-slate-400 mt-1.5">
              {product.stock_quantity} units available
            </p>
          )}
        </div>

        {/* Added Message */}
        {addedMessage && (
          <div className="mb-3 p-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium rounded-lg text-center backdrop-blur-sm animate-scale-in">
            ✓ Added to Cart
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isAvailable
                ? 'bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white shadow-soft hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-surface-elevated3 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>

          <Link
            href={`/products/${product.id}`}
            className="px-4 py-3 rounded-xl border border-slate-600/30 hover:border-oracle-400/50 hover:bg-oracle-400/10 transition-all duration-300 flex items-center justify-center backdrop-blur-sm group/btn"
          >
            <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-oracle-300 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}
