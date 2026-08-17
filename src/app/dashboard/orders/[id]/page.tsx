'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { ORDER_STATUSES } from '@/constants'
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react'

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  additional_instructions?: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const { user, isLoading, isAuthenticated } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrder()
    }
  }, [isAuthenticated, orderId])

  const fetchOrder = async () => {
    try {
      setOrderLoading(true)
      setError('')
      
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch order')
        return
      }

      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setOrderLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    return ORDER_STATUSES.find(s => s.id === status)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />
      case 'out_for_delivery':
      case 'ready_for_delivery':
        return <Truck className="w-6 h-6 text-blue-400" />
      case 'processing':
        return <Package className="w-6 h-6 text-orange-400" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
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

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/dashboard/orders" 
            className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Link>
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center">
            <p className="text-red-400 text-lg">{error || 'Order not found'}</p>
            <Link href="/dashboard/orders" className="inline-flex items-center gap-2 px-6 py-3 bg-oracle-500 text-white font-bold rounded-xl mt-6 transition-all hover:bg-oracle-600">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/dashboard/orders" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-4">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Order Details</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            {order.order_number}
          </h1>
          <p className="text-gray-400">Placed on {formatDate(order.created_at)}</p>
        </div>

        {/* Status Section */}
        <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Order Status</p>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <span 
                  className="px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: statusInfo?.color ? `${statusInfo.color}33` : '#e5e7eb33',
                    color: statusInfo?.textColor || '#1f2937',
                    border: `1px solid ${statusInfo?.color || '#e5e7eb'}40`,
                  }}
                >
                  {statusInfo?.label || order.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-2">Order Total</p>
              <p className="text-4xl font-bold text-emerald-400">{formatCurrency(order.total_amount)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft animate-slide-in mb-8" style={{ animationDelay: '100ms' }}>
          <div className="border-b border-white/10 px-8 py-4">
            <h2 className="text-xl font-bold text-white">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-elevated3 border-b border-white/10">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300">Product</th>
                  <th className="px-8 py-4 text-center text-sm font-semibold text-gray-300">Quantity</th>
                  <th className="px-8 py-4 text-right text-sm font-semibold text-gray-300">Unit Price</th>
                  <th className="px-8 py-4 text-right text-sm font-semibold text-gray-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-8 py-4 font-medium text-white">{item.product_name}</td>
                      <td className="px-8 py-4 text-center text-gray-400">{item.quantity}</td>
                      <td className="px-8 py-4 text-right text-gray-400">{formatCurrency(item.unit_price)}</td>
                      <td className="px-8 py-4 text-right font-bold text-emerald-400">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-4 text-center text-gray-400">
                      No items in this order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-in" style={{ animationDelay: '200ms' }}>
          {/* Delivery Address */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft">
            <h3 className="text-lg font-bold text-white mb-4">Delivery Address</h3>
            <p className="text-gray-400 whitespace-pre-wrap mb-4">{order.delivery_address}</p>
            {order.additional_instructions && (
              <>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Special Instructions</h4>
                <p className="text-gray-400">{order.additional_instructions}</p>
              </>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft">
            <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white font-medium">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Order Date</p>
                <p className="text-white font-medium">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-12 animate-slide-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-bold text-white mb-6">Order Timeline</h3>
          <div className="space-y-4">
            {/* Created */}
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-400 border-4 border-surface-base"></div>
                <div className="w-1 h-12 bg-emerald-400 opacity-20"></div>
              </div>
              <div className="pt-1">
                <p className="font-bold text-white">Order Created</p>
                <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
              </div>
            </div>

            {/* Current Status */}
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full border-4 border-surface-base"
                  style={{ backgroundColor: statusInfo?.color || '#e5e7eb' }}
                ></div>
              </div>
              <div className="pt-1">
                <p className="font-bold text-white">{statusInfo?.label || 'Processing'}</p>
                <p className="text-sm text-gray-400">Current status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex gap-4 justify-center animate-slide-in" style={{ animationDelay: '400ms' }}>
          <Link
            href="/dashboard/orders"
            className="px-8 py-3 bg-surface-elevated3 border border-white/10 text-white font-bold rounded-xl hover:bg-surface-elevated4 transition-all"
          >
            Back to Orders
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-gradient-to-r from-oracle-500 to-oracle-600 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
