'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, MapPin, Mail, Phone, Store } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const router = useRouter()
  const { isLoading, isAuthenticated, isAdmin } = useAuth()

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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-oracle-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-4">
            <Store className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">About Us</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Oracle Tech Store
          </h1>
          <p className="text-gray-400 text-lg">Your trusted technology solution provider</p>
        </div>

        {/* Main Content */}
        <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft mb-8 animate-slide-in">
          <h2 className="text-2xl font-bold text-white mb-4">About Our Store</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Welcome to Oracle Tech Store, your premier destination for cutting-edge technology solutions and professional services. 
            We are dedicated to providing high-quality products and exceptional service to meet all your technology needs.
          </p>
          <p className="text-gray-300 leading-relaxed">
            With our extensive inventory and expert team, we're committed to helping you find the perfect technology solutions 
            for your business or personal requirements. Whether you're looking for the latest hardware, software, or professional 
            installation services, we've got you covered.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
          {/* Address */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-soft-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Address</h3>
            </div>
            <p className="text-gray-300">
              Shop number 13<br />
              Dawnhouse<br />
              Gweru
            </p>
          </div>

          {/* Email */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-soft-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Email</h3>
            </div>
            <a href="mailto:ayanda ncubep@gmail.com" className="text-oracle-400 hover:text-oracle-300 transition-colors">
              ayanda ncubep@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-soft-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Phone</h3>
            </div>
            <a href="tel:+263772615419" className="text-oracle-400 hover:text-oracle-300 transition-colors">
              +263 77 261 5419
            </a>
          </div>

          {/* Store Hours */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-6 shadow-soft hover:shadow-soft-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Store className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Hours</h3>
            </div>
            <p className="text-gray-300">
              Monday - Friday<br />
              9:00 AM - 5:00 PM<br />
              <span className="text-gray-500 text-sm">Saturday - Sunday: Closed</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
