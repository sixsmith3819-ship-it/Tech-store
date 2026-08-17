'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { validateEmail, validatePhone } from '@/utils/validation'
import { SERVICE_TYPES } from '@/constants'

interface ServiceRequestForm {
  serviceType: string
  title: string
  description: string
  desiredDate: string
  desiredTime: string
  fullName: string
  email: string
  phone: string
  address: string
  additionalInfo: string
}

export default function NewServiceRequestPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState<ServiceRequestForm>({
    serviceType: 'maintenance',
    title: '',
    description: '',
    desiredDate: '',
    desiredTime: '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    additionalInfo: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/services/new')
    }
  }, [isAuthenticated, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      // Validate form
      const validationErrors: Record<string, string> = {}

      if (!formData.serviceType) {
        validationErrors.serviceType = 'Service type is required'
      }

      if (!formData.title.trim()) {
        validationErrors.title = 'Service title is required'
      }

      if (!formData.description.trim()) {
        validationErrors.description = 'Service description is required'
      }

      if (formData.description.trim().length < 20) {
        validationErrors.description = 'Description must be at least 20 characters'
      }

      if (!formData.desiredDate) {
        validationErrors.desiredDate = 'Desired date is required'
      }

      if (!formData.fullName.trim()) {
        validationErrors.fullName = 'Full name is required'
      }

      const emailError = validateEmail(formData.email)
      if (emailError) {
        validationErrors[emailError.field] = emailError.message
      }

      const phoneError = validatePhone(formData.phone)
      if (phoneError) {
        validationErrors[phoneError.field] = phoneError.message
      }

      if (!formData.address.trim()) {
        validationErrors.address = 'Service address is required'
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      // Submit service request
      const response = await fetch('/api/services/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to create service request' })
        return
      }

      // Redirect to service request detail
      router.push(`/services/${data.request.id}`)
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/services" className="text-oracle-600 hover:text-oracle-700 mb-8 inline-block">
          ← Back to Service Requests
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">New Service Request</h1>
          <p className="text-gray-600 mb-8">
            Submit a new service request and our team will get back to you shortly.
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.serviceType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a service type</option>
                {SERVICE_TYPES.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Service Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Database Performance Optimization"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={5}
                placeholder="Describe the service you need in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desired Date */}
              <div>
                <label htmlFor="desiredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="desiredDate"
                  name="desiredDate"
                  type="date"
                  value={formData.desiredDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                    errors.desiredDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.desiredDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.desiredDate}</p>
                )}
              </div>

              {/* Desired Time */}
              <div>
                <label htmlFor="desiredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time (Optional)
                </label>
                <input
                  id="desiredTime"
                  name="desiredTime"
                  type="time"
                  value={formData.desiredTime}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Service Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={2}
                placeholder="123 Main St, City, State 12345"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500"
                rows={3}
                placeholder="Any other details we should know about your service request..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-oracle-600 hover:bg-oracle-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
              </button>
              <Link
                href="/services"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
