'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { validateEmail, validatePhone } from '@/utils/validation'
import { SERVICE_TYPES } from '@/constants'
import { ArrowLeft, Plus } from 'lucide-react'

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
      router.push('/auth/login?redirect=/dashboard/services/new')
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
      router.push(`/dashboard/services/${data.request.id}`)
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
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/dashboard/services" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 mb-4">
              <Plus className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">New Service Request</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
              Request a Service
            </h1>
            <p className="text-gray-400">
              Submit a new service request and our team will get back to you shortly.
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-slate-200 mb-2">
                Service Type <span className="text-red-400">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                  errors.serviceType ? 'border-red-500' : 'border-slate-600/30'
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
                <p className="mt-1 text-sm text-red-400">{errors.serviceType}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
                Service Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500' : 'border-slate-600/30'
                }`}
                placeholder="e.g., Network Configuration"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500' : 'border-slate-600/30'
                }`}
                rows={5}
                placeholder="Describe the service you need in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desired Date */}
              <div>
                <label htmlFor="desiredDate" className="block text-sm font-medium text-slate-200 mb-2">
                  Desired Date <span className="text-red-400">*</span>
                </label>
                <input
                  id="desiredDate"
                  name="desiredDate"
                  type="date"
                  value={formData.desiredDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.desiredDate ? 'border-red-500' : 'border-slate-600/30'
                  }`}
                />
                {errors.desiredDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.desiredDate}</p>
                )}
              </div>

              {/* Desired Time */}
              <div>
                <label htmlFor="desiredTime" className="block text-sm font-medium text-slate-200 mb-2">
                  Preferred Time (Optional)
                </label>
                <input
                  id="desiredTime"
                  name="desiredTime"
                  type="time"
                  value={formData.desiredTime}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-200 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                  errors.fullName ? 'border-red-500' : 'border-slate-600/30'
                }`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-slate-600/30'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500' : 'border-slate-600/30'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-200 mb-2">
                Service Address <span className="text-red-400">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                  errors.address ? 'border-red-500' : 'border-slate-600/30'
                }`}
                rows={2}
                placeholder="123 Main St, City, State 12345"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-400">{errors.address}</p>
              )}
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-200 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-surface-elevated3 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Any other details we should know..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
              </button>
              <Link
                href="/dashboard/services"
                className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
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
