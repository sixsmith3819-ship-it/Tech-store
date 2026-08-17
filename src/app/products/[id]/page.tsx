'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatCurrency } from '@/utils/formatting'
import { getStockStatusDisplay, isProductAvailable } from '@/utils/product-helpers'
import { useCart } from '@/context/CartContext'
import type { Product, ProductImage, Category } from '@/types/database'

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

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Product not found')
        return
      }

      setProduct(data.product)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-600 mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/products" className="text-oracle-600 hover:text-oracle-700 mb-6 inline-block">
            ← Back to Products
          </Link>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'This product does not exist'}</p>
            <Link href="/products" className="bg-oracle-600 hover:bg-oracle-700 text-white font-bold py-2 px-6 rounded-lg transition inline-block">
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

  const handleAddToCart = () => {
    if (!isAvailable || !product) return

    addToCart({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      sku: product.sku,
    })

    alert(`Added ${quantity} ${product.name} to cart!`)
    setQuantity(1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1))
    setQuantity(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products" className="text-oracle-600 hover:text-oracle-700">
            ← Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-7xl">📦</div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === idx ? 'border-oracle-600' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Category */}
            {product.categories && (
              <Link
                href={`/products?category=${product.category_id}`}
                className="text-oracle-600 hover:text-oracle-700 text-sm font-medium mb-4 inline-block"
              >
                {product.categories.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* SKU */}
            <p className="text-gray-600 mb-6">
              <span className="font-medium">SKU:</span> {product.sku}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
              {product.stock_quantity > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {product.stock_quantity} in stock
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mb-8 border-t border-b py-6">
              <p className="text-5xl font-bold text-oracle-600">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Add to Cart Section */}
            {isAvailable ? (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <label htmlFor="quantity" className="font-medium text-gray-700">
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-oracle-600 hover:bg-oracle-700 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
                >
                  🛒 Add to Cart
                </button>
              </div>
            ) : (
              <div className="mb-8">
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed text-lg"
                >
                  Out of Stock
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-8 border-t space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className="font-bold text-gray-900">{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-bold text-gray-900">Standard (3-5 days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Returns:</span>
                <span className="font-bold text-gray-900">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 pt-12 border-t">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-600">
            Related products feature coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}
