'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/formatting'
import { ArrowLeft, Users, Search, Eye, Package, Wrench } from 'lucide-react'

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  role: string
  created_at: string
  order_count: number
  service_count: number
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(true)
  const [error, setError] = useState('')
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
      fetchCustomers()
    }
  }, [isAuthenticated, isAdmin])

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true)
      const response = await fetch('/api/admin/customers/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch customers')
        return
      }

      setCustomers(data.customers || [])
    } catch (err) {
      setError('An error occurred while fetching customers')
      console.error(err)
    } finally {
      setCustomersLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">Customer Management</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Customers
          </h1>
          <p className="text-gray-400 text-lg">Total customers: {customers.length}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-8 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Customers Table */}
        {customersLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Customers Found</h2>
            <p className="text-gray-400">
              {searchTerm ? 'Try adjusting your search' : 'No customers have registered yet'}
            </p>
          </div>
        ) : (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft animate-slide-in" style={{ animationDelay: '200ms' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated3 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Services</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">{customer.full_name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{customer.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          <Package className="w-3 h-3" />
                          <span className="text-xs font-bold">{customer.order_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                          <Wrench className="w-3 h-3" />
                          <span className="text-xs font-bold">{customer.service_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(customer.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/admin/customers/${customer.id}`}
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
