'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatDateTime } from '@/utils/formatting'
import { MESSAGE_TYPES } from '@/constants'
import { MessageCircle, Plus, Mail, Clock } from 'lucide-react'

interface Conversation {
  id: string
  conversation_id: string
  subject: string
  message_type: string
  last_message: string
  last_message_at: string
  unread_count: number
  participant_name: string
  participant_email: string
}

export default function MessagesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/messages')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations()
    }
  }, [isAuthenticated])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/messages/list')
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch conversations')
        return
      }

      setConversations(data.conversations || [])
    } catch (err) {
      setError('An error occurred while fetching messages')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 animate-slide-in">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-400/20 mb-4">
              <MessageCircle className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-semibold text-pink-300">Messages</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
              Your Conversations
            </h1>
            <p className="text-gray-400 text-lg">
              {conversations.length} conversations • {unreadCount > 0 && <span className="text-pink-400 font-semibold">{unreadCount} unread</span>}
            </p>
          </div>
          <Link
            href="/messages/new"
            className="px-6 py-3 bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Message
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm animate-scale-in">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
            <p className="text-gray-400">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-12 text-center shadow-soft animate-scale-in">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Conversations Yet</h2>
            <p className="text-gray-400 mb-6">Start a conversation with our support team</p>
            <Link
              href="/messages/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-oracle-500 to-oracle-600 text-white font-bold rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow"
            >
              <Plus className="w-5 h-5" />
              Start Conversation
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
            {conversations.map((conversation, index) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.conversation_id}`}
                className={`group block p-6 rounded-2xl border transition-all duration-300 hover:shadow-soft-md hover:-translate-y-1 ${
                  conversation.unread_count > 0
                    ? 'bg-surface-elevated2 border-pink-400/30 hover:border-pink-400/50'
                    : 'bg-surface-elevated2 border-white/10 hover:border-white/20'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Subtle glow */}
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

                    {/* Last Message Preview */}
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {conversation.last_message}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <div className="inline-flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        <span className="text-gray-400">{conversation.participant_name}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/20">
                        <span>{MESSAGE_TYPES[conversation.message_type as keyof typeof MESSAGE_TYPES] || conversation.message_type}</span>
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
