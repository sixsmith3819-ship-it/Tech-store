'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatCurrency } from '@/utils/formatting'
import { ORDER_STATUSES } from '@/constants'
import { ArrowLeft, Package, Filter, Search, Eye } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  order_items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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
      fetchOrders()
    }
  }, [isAuthenticated, isAdmin])

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch('/api/admin/orders/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch orders')
        return
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError('An error occurred while fetching orders')
      console.error(err)
    } finally {
      setOrdersLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true
    const matchesSearch = searchTerm 
      ? order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return matchesStatus && matchesSearch
  })

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
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-4">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Order Management</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Orders
          </h1>
          <p className="text-gray-400 text-lg">Total orders: {orders.length}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-slide-in" style={{ animationDelay: '100ms' }}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by order # or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-oracle-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {ordersLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Found</h2>
            <p className="text-gray-400">
              {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No orders have been placed yet'}
            </p>
          </div>
        ) : (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft animate-slide-in" style={{ animationDelay: '200ms' }}>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated3 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const status = ORDER_STATUSES.find(s => s.id === order.status)
                    return (
                      <tr 
                        key={order.id} 
                        className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-white">{order.order_number}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{order.customer_email}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-emerald-400">{formatCurrency(order.total_amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: status?.color ? `${status.color}33` : '#e5e7eb33',
                              color: status?.textColor || '#1f2937',
                              border: `1px solid ${status?.color || '#e5e7eb'}40`,
                            }}
                          >
                            {status?.label || order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 font-medium transition-colors group"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {filteredOrders.map((order, index) => {
                const status = ORDER_STATUSES.find(s => s.id === order.status)
                return (
                  <div 
                    key={order.id} 
                    className="bg-surface-elevated3 rounded-lg border border-white/10 p-4 space-y-3"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Order Number */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Order #</p>
                        <p className="font-mono text-sm font-bold text-white">{order.order_number}</p>
                      </div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-oracle-400 hover:text-oracle-300 font-medium transition-colors px-3 py-1.5 bg-oracle-500/10 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">View</span>
                      </Link>
                    </div>

                    {/* Customer Email */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Customer</p>
                      <p className="text-sm text-gray-300 truncate">{order.customer_email}</p>
                    </div>

                    {/* Date and Total */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Date</p>
                        <p className="text-sm text-gray-300">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Total</p>
                        <p className="text-sm font-bold text-emerald-400">{formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-2">Status</p>
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-bold inline-block"
                        style={{
                          backgroundColor: status?.color ? `${status.color}33` : '#e5e7eb33',
                          color: status?.textColor || '#1f2937',
                          border: `1px solid ${status?.color || '#e5e7eb'}40`,
                        }}
                      >
                        {status?.label || order.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
