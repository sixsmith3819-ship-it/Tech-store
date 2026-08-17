'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, Settings, Bell, Database, Shield, Save, X } from 'lucide-react'

export default function AdminSettingsPage() {
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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-4">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Admin Settings</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-gray-400 text-lg">Configure your admin preferences and system settings</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">General Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  defaultValue="Oracle Tech Store"
                  className="w-full px-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-2">Contact support to change store name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@oracletech.store"
                  className="w-full px-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-2">Contact support to change email</p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'orders', label: 'Email notifications for new orders', defaultChecked: true },
                { id: 'services', label: 'Email notifications for new service requests', defaultChecked: true },
                { id: 'messages', label: 'Email notifications for new messages', defaultChecked: true },
                { id: 'daily', label: 'Daily summary email', defaultChecked: false },
              ].map(pref => (
                <label key={pref.id} className="flex items-center group cursor-pointer hover:bg-surface-elevated3/50 -mx-4 px-4 py-3 rounded-xl transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-oracle-500 rounded border-white/20 focus:ring-oracle-500 cursor-pointer" 
                    defaultChecked={pref.defaultChecked}
                  />
                  <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">{pref.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* System Information */}
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 shadow-soft animate-slide-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Database className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">System Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 px-4 rounded-xl bg-surface-elevated3/50 border border-white/5 hover:border-white/10 transition-all">
                <span className="text-gray-400">System Version</span>
                <span className="font-medium text-white">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-4 px-4 rounded-xl bg-surface-elevated3/50 border border-white/5 hover:border-white/10 transition-all">
                <span className="text-gray-400">Database Status</span>
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="font-medium text-emerald-400">Connected</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 px-4 rounded-xl bg-surface-elevated3/50 border border-white/5 hover:border-white/10 transition-all">
                <span className="text-gray-400">Last Backup</span>
                <span className="font-medium text-white">Today at 12:00 AM</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-surface-elevated2 rounded-2xl border border-red-500/20 p-8 shadow-soft animate-slide-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-red-500/20">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
            </div>
            
            <p className="text-gray-400 mb-4">Advanced admin functions that require extra caution</p>
            <button className="px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-medium">
              Reset System Cache
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 animate-slide-in" style={{ animationDelay: '400ms' }}>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105">
              <Save className="w-5 h-5" />
              Save Changes
            </button>
            <Link 
              href="/admin/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-surface-elevated3 text-gray-300 border border-white/10 hover:border-white/20 rounded-xl transition-all font-medium"
            >
              <X className="w-5 h-5" />
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
