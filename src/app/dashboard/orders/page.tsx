'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { ORDER_STATUSES } from '@/constants'
import { ArrowLeft, Package, Eye } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  order_items?: any[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders()
    }
  }, [isAuthenticated, user])

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch('/api/orders/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch orders')
        return
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setOrdersLoading(false)
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-4">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">My Orders</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            My Orders
          </h1>
          <p className="text-gray-400 text-lg">View and track your orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
            {error}
          </div>
        )}

        {ordersLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet. Start shopping!</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-oracle-500 to-oracle-600 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft animate-slide-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated3 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 font-mono text-sm font-medium text-white">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-400">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const status = ORDER_STATUSES.find(s => s.id === order.status)
                          return (
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
                          )
                        })()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 font-medium transition-colors group"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
