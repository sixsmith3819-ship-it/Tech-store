'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Search, Filter, X, Sparkles, TrendingUp } from 'lucide-react'
import type { Product, ProductImage, Category } from '@/types/database'

export const dynamic = 'force-dynamic'

interface ProductWithImages extends Product {
  product_images?: ProductImage[]
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const initialSearch = searchParams.get('search') || ''
  const initialSort = searchParams.get('sort') || 'name'

  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [sortBy, setSortBy] = useState(initialSort)

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchTerm, sortBy])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/list')
      const data = await response.json()

      if (response.ok) {
        setCategories(data.categories || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)
      params.append('sort', sortBy)

      const response = await fetch(`/api/products/list?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch products')
        setProducts([])
        return
      }

      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  // Split products for Bento Grid (featured) and regular grid
  const featuredProducts = products.slice(0, 3)
  const regularProducts = products.slice(3)
  const showFeatured = products.length >= 3 && !searchTerm && !selectedCategory

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oracle-500/10 border border-oracle-400/20 mb-4">
            <Sparkles className="w-4 h-4 text-oracle-400" />
            <span className="text-sm font-semibold text-oracle-300">Explore Our Catalog</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-3">
            Products
          </h1>
          <p className="text-slate-300 text-lg">Discover enterprise-grade technology solutions</p>
        </div>

        {/* Filters Section - Glassmorphism */}
        <div className="bg-surface-elevated2/50 backdrop-blur-xl rounded-2xl border border-slate-600/20 p-6 mb-8 shadow-soft-md animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2">Search</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, description, or SKU..."
                    className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4">
            <label htmlFor="sort" className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 px-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price_low">Price (Low to High)</option>
              <option value="price_high">Price (High to Low)</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('')
                setSearchTerm('')
              }}
              className="mt-4 flex items-center gap-2 text-oracle-400 hover:text-oracle-300 font-medium text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-slide-in">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-slate-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-slate-600/20 p-12 text-center shadow-soft">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Products Found</h2>
            <p className="text-slate-300">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'No products available at the moment'}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-slate-300">
                Showing <span className="font-bold text-white">{products.length}</span> product
                {products.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Featured Products Bento Grid - Only show when not filtering */}
            {showFeatured && (
              <div className="mb-12 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-oracle-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Products</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Products Grid */}
            {regularProducts.length > 0 && (
              <>
                {showFeatured && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">All Products</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(showFeatured ? regularProducts : products).map((product, index) => (
                    <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
