'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/formatting'
import { SERVICE_TYPES, SERVICE_STATUSES, getServiceType, getServiceStatus } from '@/constants'
import { ArrowLeft, Wrench, Filter, Search, Eye, Tag } from 'lucide-react'

interface ServiceRequest {
  id: string
  service_number: string
  service_type: string
  title: string
  status: string
  customer_name: string
  customer_email: string
  desired_date: string
  created_at: string
}

export default function AdminServicesPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [services, setServices] = useState<ServiceRequest[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
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
      fetchServices()
    }
  }, [isAuthenticated, isAdmin])

  const fetchServices = async () => {
    try {
      setServicesLoading(true)
      const response = await fetch('/api/admin/services/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch services')
        return
      }

      setServices(data.services || [])
    } catch (err) {
      setError('An error occurred while fetching services')
      console.error(err)
    } finally {
      setServicesLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesStatus = statusFilter ? service.status === statusFilter : true
    const matchesSearch = searchTerm 
      ? service.service_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 mb-4">
            <Wrench className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Service Management</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Service Requests
          </h1>
          <p className="text-gray-400 text-lg">Total service requests: {services.length}</p>
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
              placeholder="Search by request #, title or customer..."
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
              {SERVICE_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Table */}
        {servicesLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Service Requests Found</h2>
            <p className="text-gray-400">
              {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No service requests have been submitted yet'}
            </p>
          </div>
        ) : (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 overflow-hidden shadow-soft animate-slide-in" style={{ animationDelay: '200ms' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated3 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Request #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Requested Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, index) => {
                    const status = getServiceStatus(service.status)
                    const serviceType = getServiceType(service.service_type)
                    return (
                      <tr 
                        key={service.id} 
                        className="border-b border-white/5 hover:bg-surface-elevated3 transition-colors"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-white">{service.service_number}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{service.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{service.customer_name}</td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                            <Tag className="w-3 h-3" />
                            <span className="text-xs font-bold">{serviceType?.name || service.service_type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(service.desired_date)}</td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: status?.color ? `${status.color}33` : '#e5e7eb33',
                              color: status?.textColor || '#1f2937',
                              border: `1px solid ${status?.color || '#e5e7eb'}40`,
                            }}
                          >
                            {status?.label || service.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/admin/services/${service.id}`}
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
          </div>
        )}
      </div>
    </div>
  )
}
