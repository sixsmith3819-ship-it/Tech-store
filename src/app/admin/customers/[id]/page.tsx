'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { ArrowLeft, Users, Mail, Phone, MapPin, Package, Wrench, Calendar } from 'lucide-react'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items?: any[]
}

interface Service {
  id: string
  service_type: string
  description: string
  status: string
  created_at: string
}

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  role: string
  created_at: string
  updated_at: string
}

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not authenticated or not admin
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

  // Fetch customer details
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) return

      try {
        setIsLoadingData(true)
        const response = await fetch(`/api/admin/customers/${customerId}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Customer not found')
          return
        }

        setCustomer(data.customer)
        setOrders(data.orders || [])
        setServices(data.services || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (isAuthenticated && isAdmin) {
      fetchCustomerData()
    }
  }, [customerId, isAuthenticated, isAdmin])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      case 'pending':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/30'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-400/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  if (isLoading || isLoadingData) {
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

  if (error && !customer) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/admin/customers" 
            className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Customers
          </Link>
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/admin/customers" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Customers
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">Customer Details</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            {customer.full_name}
          </h1>
          <p className="text-gray-400 text-lg">Joined {formatDate(customer.created_at)}</p>
        </div>

        {/* Customer Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-in" style={{ animationDelay: '100ms' }}>
          {/* Email Card */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-oracle-400" />
              <h3 className="text-sm font-semibold text-gray-400">Email</h3>
            </div>
            <p className="text-white font-medium break-all">{customer.email}</p>
          </div>

          {/* Phone Card */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-oracle-400" />
              <h3 className="text-sm font-semibold text-gray-400">Phone</h3>
            </div>
            <p className="text-white font-medium">{customer.phone || 'Not provided'}</p>
          </div>

          {/* Address Card */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-oracle-400" />
              <h3 className="text-sm font-semibold text-gray-400">Address</h3>
            </div>
            <p className="text-white font-medium">{customer.address || 'Not provided'}</p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-12 animate-slide-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Orders ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-elevated3 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr 
                        key={order.id}
                        className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-400">{order.id.slice(0, 8)}...</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-emerald-400">{formatCurrency(order.total_amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-6 h-6 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Service Requests ({services.length})</h2>
          </div>

          {services.length === 0 ? (
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft">
              <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No service requests yet</p>
            </div>
          ) : (
            <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-elevated3 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Service Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr 
                        key={service.id}
                        className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-white capitalize">{service.service_type.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400 truncate max-w-xs">{service.description}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(service.status)}`}>
                            {service.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(service.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
