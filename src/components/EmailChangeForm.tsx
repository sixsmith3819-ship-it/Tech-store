'use client'

import { useState } from 'react'
import { Mail, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { validateNewEmail, validatePassword } from '@/utils/validation'

interface EmailChangeFormProps {
  currentEmail: string
}

export default function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const clearMessages = () => {
    setSuccessMessage('')
    setErrorMessage('')
    setFieldErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate new email
    const emailError = validateNewEmail(newEmail, currentEmail)
    if (emailError) {
      errors[emailError.field] = emailError.message
    }

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      errors[passwordError.field] = passwordError.message
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearMessages()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEmail,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to update email')
        
        // Set field-specific error for incorrect password
        if (data.message === 'Incorrect password') {
          setFieldErrors({ password: data.message })
        } else if (data.message === 'This email is already in use') {
          setFieldErrors({ newEmail: data.message })
        } else if (data.message === 'New email must be different from current email') {
          setFieldErrors({ newEmail: data.message })
        } else if (data.message === 'Please enter a valid email address') {
          setFieldErrors({ newEmail: data.message })
        }
      } else {
        setSuccessMessage(`Email updated successfully! Your new email is ${data.newEmail}`)
        setNewEmail('')
        setPassword('')
        setFieldErrors({})
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Email change error:', error)
      setErrorMessage('An error occurred while updating your email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-cyan-500/20">
          <Mail className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Change Email Address</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Email Display */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Email Address
          </label>
          <input
            type="email"
            value={currentEmail}
            disabled
            className="w-full px-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-gray-400 placeholder-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <p className="text-sm text-gray-500 mt-2">You'll be able to log in with your new email address</p>
        </div>

        {/* New Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value)
                if (fieldErrors.newEmail) {
                  setFieldErrors({ ...fieldErrors, newEmail: '' })
                }
              }}
              placeholder="Enter your new email"
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                fieldErrors.newEmail ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'
              }`}
            />
            {fieldErrors.newEmail && (
              <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-400" />
            )}
          </div>
          {fieldErrors.newEmail && (
            <p className="text-sm text-red-400 mt-2">{fieldErrors.newEmail}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: '' })
                }
              }}
              placeholder="Enter your password to confirm"
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-surface-elevated3 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                fieldErrors.password ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'
              }`}
            />
            {fieldErrors.password && (
              <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-400" />
            )}
          </div>
          {fieldErrors.password && (
            <p className="text-sm text-red-400 mt-2">{fieldErrors.password}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">We need your password to confirm this change</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-start gap-3 animate-scale-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-300 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-start gap-3 animate-scale-in">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading || !newEmail || !password}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading || !newEmail || !password
                ? 'bg-surface-elevated3 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-soft hover:shadow-glow transform hover:scale-105 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Change Email
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          For security, we verify your password before making any changes to your account.
        </p>
      </form>
    </div>
  )
}
