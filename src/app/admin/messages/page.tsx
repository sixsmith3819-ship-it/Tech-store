'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/formatting'
import { MESSAGE_TYPES } from '@/constants'
import { ArrowLeft, MessageCircle, Mail, Clock } from 'lucide-react'

interface AdminConversation {
  id: string
  conversation_id: string
  subject: string
  message_type: string
  last_message: string
  last_message_at: string
  unread_count: number
  sender_name: string
  sender_email: string
  message_count: number
}

export default function AdminMessagesPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [conversations, setConversations] = useState<AdminConversation[]>([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [error, setError] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)

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

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchConversations()
    }
  }, [isAuthenticated, isAdmin])

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true)
      const response = await fetch('/api/admin/messages/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch conversations')
        return
      }

      setConversations(data.conversations || [])
    } catch (err) {
      setError('An error occurred while fetching conversations')
      console.error(err)
    } finally {
      setConversationsLoading(false)
    }
  }

  const filteredConversations = unreadOnly
    ? conversations.filter(conv => conv.unread_count > 0)
    : conversations

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

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Link */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header & Filter Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-slide-in">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-400/20 mb-4">
              <MessageCircle className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-semibold text-pink-300">Message Management</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
              Messages
            </h1>
            <p className="text-gray-400 text-lg">
              {conversations.length} conversations • {totalUnread} unread
            </p>
          </div>
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              unreadOnly
                ? 'bg-gradient-to-r from-oracle-500 to-oracle-600 text-white shadow-glow'
                : 'bg-surface-elevated3 text-gray-300 border border-white/10 hover:border-oracle-400/50 hover:bg-oracle-400/10'
            }`}
          >
            {unreadOnly ? 'Show All' : 'Show Unread Only'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
            {error}
          </div>
        )}

        {/* Conversations List */}
        {conversationsLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Conversations</h2>
            <p className="text-gray-400">
              {unreadOnly ? 'No unread messages at the moment' : 'No customer messages yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
            {filteredConversations.map((conversation, index) => (
              <Link
                key={conversation.id}
                href={`/admin/messages/${conversation.conversation_id}`}
                className={`group block p-6 rounded-2xl border transition-all duration-300 hover:shadow-soft-md hover:-translate-y-1 ${
                  conversation.unread_count > 0
                    ? 'bg-surface-elevated2 border-pink-400/30 hover:border-pink-400/50'
                    : 'bg-surface-elevated2 border-white/10 hover:border-white/20'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Subtle glow on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  conversation.unread_count > 0 
                    ? 'bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-transparent'
                    : 'bg-gradient-to-br from-oracle-500/5 to-transparent'
                }`}></div>

                <div className="relative z-10 flex justify-between items-start gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Title & Badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white truncate group-hover:text-oracle-300 transition-colors">
                        {conversation.subject}
                      </h3>
                      {conversation.unread_count > 0 && (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1.5 rounded-full border border-red-400/30 whitespace-nowrap">
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                          {conversation.unread_count} new
                        </span>
                      )}
                    </div>

                    {/* Last Message */}
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {conversation.last_message}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="inline-flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        <span className="text-gray-400">{conversation.sender_name}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/20">
                        <span>{MESSAGE_TYPES[conversation.message_type as keyof typeof MESSAGE_TYPES] || conversation.message_type}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-gray-400">{conversation.message_count} messages</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(conversation.last_message_at)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
