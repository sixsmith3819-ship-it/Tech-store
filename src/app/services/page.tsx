'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/formatting'
import { SERVICE_TYPES, SERVICE_STATUSES, getServiceType, getServiceStatus } from '@/constants'
import { Plus, Wrench, Sparkles, Calendar, Tag } from 'lucide-react'

interface ServiceRequest {
  id: string
  service_number: string
  service_type: string
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export default function ServicesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/services')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchServiceRequests()
    }
  }, [isAuthenticated])

  const fetchServiceRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/services/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch service requests')
        return
      }

      setRequests(data.requests || [])
    } catch (err) {
      setError('An error occurred while fetching service requests')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 mb-4">
            <Wrench className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Professional Services</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                Service Requests
              </h1>
              <p className="text-gray-400 text-lg">Manage your installation and support requests</p>
            </div>
            <Link
              href="/services/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Request
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-slide-in">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading service requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <Wrench className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">No Service Requests Yet</h2>
            <p className="text-gray-400 mb-8 text-lg">Create your first service request to get started</p>
            <Link
              href="/services/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow"
            >
              <Plus className="w-5 h-5" />
              Create Service Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {requests.map((request, index) => {
              const status = getServiceStatus(request.status)
              const serviceType = getServiceType(request.service_type)

              return (
                <Link
                  key={request.id}
                  href={`/services/${request.id}`}
                  className="group relative bg-surface-elevated2 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-500 p-6 block shadow-soft hover:shadow-soft-md hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Aurora Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-transparent group-hover:from-purple-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {request.title}
                        </h3>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          request.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                          request.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                          request.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                          'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                        }`}>
                          {status?.label || request.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                        {request.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Tag className="w-4 h-4" />
                          <span className="text-gray-400">{request.service_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Wrench className="w-4 h-4" />
                          <span className="text-gray-400">{serviceType?.name || request.service_type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-gray-400">{formatDate(request.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right md:min-w-[140px]">
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="text-sm font-medium text-white">{formatDate(request.updated_at)}</p>
                      <div className="mt-3 text-purple-400 font-medium flex items-center gap-2 md:justify-end">
                        <span>View Details</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
