'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatCurrency, formatDate } from '@/utils/formatting'
import type { Order, OrderItem } from '@/types/database'

interface OrderDetail extends Order {
  order_items?: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Order not found')
        return
      }

      setOrder(data.order)
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
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'This order does not exist'}</p>
            <Link href="/dashboard/orders" className="bg-oracle-600 hover:bg-oracle-700 text-white font-bold py-2 px-6 rounded-lg transition inline-block">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
          <p className="text-green-700 mb-4">Thank you for your order. You will receive a confirmation email shortly.</p>
          <p className="text-green-600 text-sm">Order Number: <span className="font-bold">{order.order_number}</span></p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Information</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold text-gray-900">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-bold text-gray-900">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-yellow-600">Pending</span>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold text-oracle-600">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-bold text-gray-900">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone:</p>
                <p className="font-bold text-gray-900">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Address:</p>
                <p className="font-bold text-gray-900 whitespace-pre-wrap">{order.delivery_address}</p>
              </div>
              {order.additional_instructions && (
                <div>
                  <p className="text-sm text-gray-600">Special Instructions:</p>
                  <p className="font-bold text-gray-900">{order.additional_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-800">Product</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-800">Quantity</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-800">Price</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="px-6 py-4 font-bold text-gray-900">{item.product_name}</td>
                      <td className="px-6 py-4 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-center">{formatCurrency(item.unit_price)}</td>
                      <td className="px-6 py-4 text-right font-bold">{formatCurrency(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-blue-800">
            <li>✓ You will receive a confirmation email with your order details</li>
            <li>✓ Our team will process your order and prepare it for shipment</li>
            <li>✓ You can track your order status in your account dashboard</li>
            <li>✓ Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/orders"
            className="bg-oracle-600 hover:bg-oracle-700 text-white font-bold py-3 px-8 rounded-lg transition text-center"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-lg transition text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
