'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  Package, DollarSign, Clock, Wrench, AlertCircle, Users, 
  TrendingUp, MessageCircle, ShoppingBag, Settings, BarChart3, Shield 
} from 'lucide-react'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalServiceRequests: number
  pendingServices: number
  totalCustomers: number
  recentOrders: number
  unreadMessages: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalServiceRequests: 0,
    pendingServices: 0,
    totalCustomers: 0,
    recentOrders: 0,
    unreadMessages: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (!isLoading && !isAdmin) {
      router.push('/dashboard')
      return
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardStats()
    }
  }, [isAuthenticated, isAdmin])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/admin/dashboard/stats')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch statistics')
        return
      }

      setStats(data.stats)
    } catch (err) {
      setError('An error occurred while fetching statistics')
      console.error(err)
    } finally {
      setStatsLoading(false)
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

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background - Subtle for professional look */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-400/20 mb-4">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-300">Admin Panel</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Welcome back, {user?.fullName}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-slide-in">
            {error}
          </div>
        )}

        {/* Bento Grid - Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-in">
          {/* Total Revenue - FEATURED (2x height) */}
          <div className="lg:row-span-2 group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 p-8 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-green-500/0 to-transparent group-hover:from-emerald-500/5 group-hover:via-green-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="inline-block p-4 rounded-2xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors w-fit mb-6">
                <DollarSign className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
              {statsLoading ? (
                <div className="text-3xl font-bold text-gray-500">...</div>
              ) : (
                <>
                  <p className="text-5xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent mb-4">
                    ${(stats.totalRevenue / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-auto">
                    From {stats.totalOrders} orders
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Total Orders */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-transparent group-hover:from-blue-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors mb-4">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-white">
                {statsLoading ? '...' : stats.totalOrders}
              </p>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-orange-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-transparent group-hover:from-orange-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Pending Orders</p>
              <p className="text-3xl font-bold text-orange-400">
                {statsLoading ? '...' : stats.pendingOrders}
              </p>
            </div>
          </div>

          {/* Service Requests */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-transparent group-hover:from-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors mb-4">
                <Wrench className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Service Requests</p>
              <p className="text-3xl font-bold text-white">
                {statsLoading ? '...' : stats.totalServiceRequests}
              </p>
            </div>
          </div>

          {/* Pending Services */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-red-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-transparent group-hover:from-red-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Pending Services</p>
              <p className="text-3xl font-bold text-red-400">
                {statsLoading ? '...' : stats.pendingServices}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-in" style={{ animationDelay: '100ms' }}>
          {/* Total Customers */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-transparent group-hover:from-cyan-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors mb-4">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Customers</p>
              <p className="text-3xl font-bold text-white">
                {statsLoading ? '...' : stats.totalCustomers}
              </p>
            </div>
          </div>

          {/* Recent Orders (24h) */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-transparent group-hover:from-blue-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Recent Orders (24h)</p>
              <p className="text-3xl font-bold text-blue-400">
                {statsLoading ? '...' : stats.recentOrders}
              </p>
            </div>
          </div>

          {/* Unread Messages */}
          <div className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all duration-500 p-6 shadow-soft hover:shadow-soft-md">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-transparent group-hover:from-pink-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-xl bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors mb-4">
                <MessageCircle className="w-6 h-6 text-pink-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Unread Messages</p>
              <p className="text-3xl font-bold text-pink-400">
                {statsLoading ? '...' : stats.unreadMessages}
              </p>
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-oracle-400" />
            <h2 className="text-2xl font-bold text-white">Management Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { href: '/admin/orders', icon: Package, title: 'Orders', desc: 'Manage customer orders', color: 'blue' },
              { href: '/admin/services', icon: Wrench, title: 'Services', desc: 'Manage service requests', color: 'purple' },
              { href: '/admin/customers', icon: Users, title: 'Customers', desc: 'View and manage customers', color: 'cyan' },
              { href: '/admin/messages', icon: MessageCircle, title: 'Messages', desc: 'Customer conversations', color: 'pink' },
              { href: '/admin/products', icon: ShoppingBag, title: 'Products', desc: 'Manage inventory', color: 'emerald' },
              { href: '/admin/settings', icon: Settings, title: 'Settings', desc: 'Admin preferences', color: 'gray' },
            ].map((tool, index) => {
              const Icon = tool.icon
              const colorMap: Record<string, string> = {
                blue: 'from-blue-500/0 group-hover:from-blue-500/5 border-blue-400/30 text-blue-400',
                purple: 'from-purple-500/0 group-hover:from-purple-500/5 border-purple-400/30 text-purple-400',
                cyan: 'from-cyan-500/0 group-hover:from-cyan-500/5 border-cyan-400/30 text-cyan-400',
                pink: 'from-pink-500/0 group-hover:from-pink-500/5 border-pink-400/30 text-pink-400',
                emerald: 'from-emerald-500/0 group-hover:from-emerald-500/5 border-emerald-400/30 text-emerald-400',
                gray: 'from-gray-500/0 group-hover:from-gray-500/5 border-gray-400/30 text-gray-400',
              }
              const [gradientClass, , borderClass, textClass] = colorMap[tool.color].split(' ')

              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:${borderClass} transition-all duration-500 p-8 shadow-soft hover:shadow-soft-md hover:-translate-y-1`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} to-transparent transition-all duration-500 pointer-events-none rounded-2xl`}></div>
                  <div className="relative z-10">
                    <Icon className={`w-8 h-8 ${textClass} mb-4`} />
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:${textClass} transition-colors">{tool.title}</h3>
                    <p className="text-gray-400 mb-4">{tool.desc}</p>
                    <div className={`flex items-center gap-2 ${textClass} font-medium`}>
                      <span>Manage</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-bold text-white mb-6">Quick Links</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="text-oracle-400 hover:text-oracle-300 font-medium transition-colors">
              ← Back to Store
            </Link>
            <Link href="/dashboard" className="text-oracle-400 hover:text-oracle-300 font-medium transition-colors">
              Customer Dashboard
            </Link>
            <Link href="/products" className="text-oracle-400 hover:text-oracle-300 font-medium transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
