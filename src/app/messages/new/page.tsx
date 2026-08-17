'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { validateEmail } from '@/utils/validation'
import { MESSAGE_TYPES } from '@/constants'

interface NewMessageForm {
  messageType: string
  subject: string
  message: string
}

export default function NewMessagePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState<NewMessageForm>({
    messageType: 'general',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/messages/new')
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

      if (!formData.messageType) {
        validationErrors.messageType = 'Message type is required'
      }

      if (!formData.subject.trim()) {
        validationErrors.subject = 'Subject is required'
      }

      if (formData.subject.trim().length < 5) {
        validationErrors.subject = 'Subject must be at least 5 characters'
      }

      if (!formData.message.trim()) {
        validationErrors.message = 'Message is required'
      }

      if (formData.message.trim().length < 20) {
        validationErrors.message = 'Message must be at least 20 characters'
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      // Submit message
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to send message' })
        return
      }

      // Redirect to conversation
      router.push(`/messages/${data.conversation.conversation_id}`)
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
      <div className="max-w-2xl mx-auto">
        <Link href="/messages" className="text-oracle-600 hover:text-oracle-700 mb-8 inline-block">
          ← Back to Messages
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">New Message</h1>
          <p className="text-gray-600 mb-8">
            Send a message to our support team. We'll get back to you as soon as possible.
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Type */}
            <div>
              <label htmlFor="messageType" className="block text-sm font-medium text-gray-700 mb-2">
                Message Type <span className="text-red-500">*</span>
              </label>
              <select
                id="messageType"
                name="messageType"
                value={formData.messageType}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.messageType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a message type</option>
                {Object.entries(MESSAGE_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.messageType && (
                <p className="mt-1 text-sm text-red-600">{errors.messageType}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Question about my order"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oracle-500 ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={6}
                placeholder="Please describe your message in detail..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Minimum 20 characters required
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-oracle-600 hover:bg-oracle-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              <Link
                href="/messages"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Response Time:</strong> We typically respond to messages within 24 hours during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
