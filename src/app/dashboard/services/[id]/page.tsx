'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatDateTime } from '@/utils/formatting'
import { SERVICE_TYPES, SERVICE_STATUSES, getServiceType, getServiceStatus } from '@/constants'
import { ArrowLeft } from 'lucide-react'

interface ServiceRequest {
  id: string
  service_request_number: string
  service_type: string
  status: string
  created_at: string
  updated_at: string
  description: string
  preferred_date?: string
  preferred_time?: string
  address?: string
  additional_info?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

type Params = Promise<{ id: string }>

export default function ServiceDetailPage({ params }: { params: Params }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [id, setId] = useState<string>('')
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Unwrap params
  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard/services')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchServiceRequest()
    }
  }, [id, isAuthenticated])

  const fetchServiceRequest = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/services/${id}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch service request')
        return
      }

      setRequest(data.request)
    } catch (err) {
      setError('An error occurred while fetching the service request')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-600 mb-4"></div>
          <p className="text-gray-600">Loading service request...</p>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard/services" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          <div className="bg-surface-elevated2 rounded-xl border border-white/10 p-8 text-center">
            <p className="text-red-400 mb-4">{error || 'Service request not found'}</p>
            <Link href="/dashboard/services" className="text-oracle-400 hover:text-oracle-300 font-medium">
              Return to Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const status = getServiceStatus(request.status)
  const serviceType = getServiceType(request.service_type)

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/services" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white">Service Request #{request.service_request_number}</h1>
              </div>
              <span
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border"
                style={{
                  backgroundColor: status?.color ? `${status.color}33` : '#e5e7eb33',
                  color: status?.textColor || '#1f2937',
                  borderColor: `${status?.color || '#e5e7eb'}40`,
                }}
              >
                {status?.label || request.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Service Type</p>
                <p className="font-bold text-white">{serviceType?.name || request.service_type}</p>
              </div>
              <div>
                <p className="text-gray-400">Requested Date</p>
                <p className="font-bold text-white">{request.preferred_date ? formatDate(request.preferred_date) : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-400">Submitted</p>
                <p className="font-bold text-white">{formatDate(request.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-400 whitespace-pre-wrap">{request.description}</p>

            {request.additional_info && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Additional Information</h3>
                <p className="text-gray-400 whitespace-pre-wrap">{request.additional_info}</p>
              </div>
            )}
          </div>

          {/* Service Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            {request.address && (
              <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8">
                <h3 className="text-lg font-bold text-white mb-4">Service Location</h3>
                <p className="text-gray-400 whitespace-pre-wrap">{request.address}</p>
              </div>
            )}

            {/* Contact */}
            {request.customer_name && (
              <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8">
                <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {request.customer_name && (
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-medium text-white">{request.customer_name}</p>
                    </div>
                  )}
                  {request.customer_email && (
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href={`mailto:${request.customer_email}`} className="font-medium text-oracle-400 hover:text-oracle-300">
                        {request.customer_email}
                      </a>
                    </div>
                  )}
                  {request.customer_phone && (
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a href={`tel:${request.customer_phone}`} className="font-medium text-oracle-400 hover:text-oracle-300">
                        {request.customer_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-surface-elevated3 rounded-2xl p-6 text-sm text-gray-400 text-center">
            <p>
              Created: <span className="font-medium text-white">{formatDateTime(request.created_at)}</span>
            </p>
            <p>
              Last Updated: <span className="font-medium text-white">{formatDateTime(request.updated_at)}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/dashboard/services"
              className="flex-1 text-center bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
