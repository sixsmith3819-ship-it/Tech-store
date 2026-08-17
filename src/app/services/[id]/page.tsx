'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatDateTime } from '@/utils/formatting'
import { SERVICE_TYPES, SERVICE_STATUSES, getServiceType, getServiceStatus } from '@/constants'

interface ServiceRequest {
  id: string
  service_number: string
  service_type: string
  title: string
  description: string
  desired_date: string
  desired_time: string | null
  address: string
  additional_info: string | null
  status: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
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
      router.push('/auth/login?redirect=/services')
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
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/services" className="text-oracle-600 hover:text-oracle-700 mb-8 inline-block">
            ← Back to Service Requests
          </Link>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error || 'Service request not found'}</p>
            <Link href="/services" className="text-oracle-600 hover:text-oracle-700 font-medium">
              Return to Service Requests
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const status = getServiceStatus(request.status)
  const serviceType = getServiceType(request.service_type)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/services" className="text-oracle-600 hover:text-oracle-700 mb-8 inline-block">
          ← Back to Service Requests
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900">{request.title}</h1>
                <p className="text-gray-600 mt-2">Request #{request.service_number}</p>
              </div>
              <span
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                style={{
                  backgroundColor: status?.color || '#e5e7eb',
                  color: status?.textColor || '#1f2937',
                }}
              >
                {status?.label || request.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Service Type</p>
                <p className="font-bold text-gray-900">{serviceType?.name || request.service_type}</p>
              </div>
              <div>
                <p className="text-gray-500">Requested Date</p>
                <p className="font-bold text-gray-900">{formatDate(request.desired_date)}</p>
              </div>
              <div>
                <p className="text-gray-500">Preferred Time</p>
                <p className="font-bold text-gray-900">{request.desired_time || 'Any time'}</p>
              </div>
              <div>
                <p className="text-gray-500">Submitted</p>
                <p className="font-bold text-gray-900">{formatDate(request.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>

            {request.additional_info && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Additional Information</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{request.additional_info}</p>
              </div>
            )}
          </div>

          {/* Service Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Service Location</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{request.address}</p>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{request.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${request.customer_email}`} className="font-medium text-oracle-600 hover:text-oracle-700">
                    {request.customer_email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${request.customer_phone}`} className="font-medium text-oracle-600 hover:text-oracle-700">
                    {request.customer_phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-100 rounded-lg p-6 text-sm text-gray-600 text-center">
            <p>
              Created: <span className="font-medium">{formatDateTime(request.created_at)}</span>
            </p>
            <p>
              Last Updated: <span className="font-medium">{formatDateTime(request.updated_at)}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/services"
              className="flex-1 text-center bg-oracle-600 hover:bg-oracle-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Back to Service Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
