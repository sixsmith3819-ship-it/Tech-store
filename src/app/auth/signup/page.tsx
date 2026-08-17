'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Lock, UserPlus, Sparkles, Check } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const errorMap: Record<string, string> = {}
          data.errors.forEach((error: any) => {
            errorMap[error.field] = error.message
          })
          setErrors(errorMap)
        } else {
          setErrors({ general: data.message || 'Signup failed' })
        }
        return
      }

      setSuccessMessage(data.message)
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Aurora Background - Hidden on small screens */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Mobile Aurora - Smaller version */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none md:hidden opacity-30">
        <div className="absolute top-0 right-0 w-48 h-48 bg-oracle-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Glass Card - Optimized for mobile */}
        <div className="bg-surface-elevated2/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 shadow-soft-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-oracle-500 to-oracle-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold shadow-glow mb-3 sm:mb-4 text-sm sm:text-base">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>OTS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Join Oracle Tech Store today</p>
          </div>

          {successMessage && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg sm:rounded-xl backdrop-blur-sm animate-scale-in flex items-start gap-2 sm:gap-3 text-sm">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-300">{successMessage}</p>
            </div>
          )}

          {errors.general && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-400 backdrop-blur-sm animate-slide-in text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-surface-elevated3 border rounded-lg sm:rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.fullName ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-surface-elevated3 border rounded-lg sm:rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-surface-elevated3 border rounded-lg sm:rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="At least 6 characters"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-surface-elevated3 border rounded-lg sm:rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 sm:mt-8 text-center pt-4 sm:pt-6 border-t border-white/10">
            <p className="text-xs sm:text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-oracle-400 hover:text-oracle-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-4 sm:mt-6 text-xs text-gray-500 text-center leading-relaxed">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-oracle-400 hover:text-oracle-300">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-oracle-400 hover:text-oracle-300">Privacy Policy</Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4 sm:mt-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
