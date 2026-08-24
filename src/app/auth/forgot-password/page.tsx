'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Sparkles, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to send reset email')
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Mobile Aurora */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none md:hidden opacity-30">
        <div className="absolute top-0 right-0 w-48 h-48 bg-oracle-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Glass Card */}
        <div className="bg-surface-elevated2/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 shadow-soft-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-oracle-500 to-oracle-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold shadow-glow mb-3 sm:mb-4 text-sm sm:text-base">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>OTS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
              Reset Password
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              {submitted ? 'Check your email' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4 sm:space-y-5">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 border border-green-500/30 rounded-full">
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Email Sent Successfully!</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    We've sent a password reset link to <span className="font-medium text-white">{email}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    The link will expire in 1 hour. Please check your email and follow the instructions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full text-center text-sm sm:text-base text-oracle-400 hover:text-oracle-300 transition-colors font-medium mt-6"
              >
                ? Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-slide-in text-sm">
                  {error}
                </div>
              )}

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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    disabled={isLoading}
                    className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-surface-elevated3 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 sm:mt-8 text-center pt-4 sm:pt-6 border-t border-white/10">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-medium">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
