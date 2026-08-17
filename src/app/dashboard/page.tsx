'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import ProductCard from '@/components/ProductCard'
import { Package, ShoppingBag, Wrench, MessageCircle, User, LogOut, Sparkles, TrendingUp } from 'lucide-react'
import type { Product, ProductImage } from '@/types/database'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState<(Product & { product_images?: ProductImage[] })[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (!isLoading && isAdmin) {
      router.push('/admin/dashboard')
      return
    }

    fetchFeaturedProducts()
  }, [isLoading, isAuthenticated, isAdmin, router])

  const fetchFeaturedProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await fetch('/api/products/list?sort=newest')
      const data = await response.json()
      if (response.ok) {
        setFeaturedProducts((data.products || []).slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Redirecting to admin dashboard...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
            <span className="text-sm font-semibold text-oracle-300">Welcome Back</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                Hello, {user.fullName}!
              </h1>
              <p className="text-gray-400 text-lg">Manage your orders, services, and profile</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* User Info Card - Glass Effect */}
        <div className="bg-surface-elevated2/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8 shadow-soft-md animate-slide-in">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-oracle-400" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-base font-medium text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="text-base font-medium text-white">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-base font-medium text-white line-clamp-1" title={user.address || 'Not provided'}>
                {user.address || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Type</p>
              <p className="text-base font-medium text-white capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="mt-6 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
          >
            Edit Profile
          </button>
        </div>

        {/* Bento Grid - Quick Actions */}
        <div className="mb-12 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-oracle-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Browse Products - FEATURED (Larger Card) */}
            <Link 
              href="/products" 
              className="group lg:col-span-2 relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 p-8 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1"
            >
              {/* Aurora Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-green-500/0 to-transparent group-hover:from-emerald-500/10 group-hover:via-green-500/10 transition-all duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-4 rounded-2xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors mb-4">
                  <ShoppingBag className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Browse Products
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-lg">
                  Discover our latest enterprise-grade technology products
                </p>
                <div className="mt-6 flex items-center gap-2 text-emerald-400 font-medium">
                  <span>Start Shopping</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* Orders */}
            <Link 
              href="/dashboard/orders" 
              className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 p-8 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-transparent group-hover:from-blue-500/10 group-hover:via-blue-500/10 transition-all duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-4 rounded-2xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors mb-4">
                  <Package className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  My Orders
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  View and track your orders
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-400 font-medium">
                  <span>View Orders</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* Services */}
            <Link 
              href="/services" 
              className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-500 p-8 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-transparent group-hover:from-purple-500/10 group-hover:via-purple-500/10 transition-all duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-4 rounded-2xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors mb-4">
                  <Wrench className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Services
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Request professional services
                </p>
                <div className="mt-4 flex items-center gap-2 text-purple-400 font-medium">
                  <span>View Services</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* Messages */}
            <Link 
              href="/messages" 
              className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all duration-500 p-8 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-pink-500/0 to-transparent group-hover:from-pink-500/10 group-hover:via-pink-500/10 transition-all duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-4 rounded-2xl bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors mb-4">
                  <MessageCircle className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  Messages
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Chat with support team
                </p>
                <div className="mt-4 flex items-center gap-2 text-pink-400 font-medium">
                  <span>View Messages</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* Profile */}
            <Link 
              href="/dashboard/profile" 
              className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-orange-400/30 transition-all duration-500 p-8 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-transparent group-hover:from-orange-500/10 group-hover:via-orange-500/10 transition-all duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="inline-block p-4 rounded-2xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors mb-4">
                  <User className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  Edit Profile
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Update your information
                </p>
                <div className="mt-4 flex items-center gap-2 text-orange-400 font-medium">
                  <span>Edit Profile</span>
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-oracle-400" />
            <h2 className="text-2xl font-bold text-white">Featured Products</h2>
          </div>
          {loadingProducts ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold text-white mb-2">No Products Available</h3>
              <p className="text-gray-400 mb-6">Check back soon for new arrivals</p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
