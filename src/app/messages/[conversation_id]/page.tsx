'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatDateTime } from '@/utils/formatting'
import { MESSAGE_TYPES } from '@/constants'
import { ArrowLeft, MessageCircle, Send } from 'lucide-react'

interface Message {
  id: string
  body: string
  sender_id: string
  sender_name: string
  is_admin: boolean
  created_at: string
  read_at: string | null
}

interface Conversation {
  id: string
  conversation_id: string
  subject: string
  message_type: string
  participant_name: string
  participant_email: string
  created_at: string
  messages: Message[]
}

type Params = Promise<{ conversation_id: string }>

export default function ConversationPage({ params }: { params: Params }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const [conversationId, setConversationId] = useState<string>('')
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [replyError, setReplyError] = useState('')

  useEffect(() => {
    params.then((p) => setConversationId(p.conversation_id))
  }, [params])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/messages')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (conversationId && isAuthenticated) {
      fetchConversation()
    }
  }, [conversationId, isAuthenticated])

  const fetchConversation = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/messages/${conversationId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch conversation')
        return
      }

      setConversation(data.conversation)
    } catch (err) {
      setError('An error occurred while fetching the conversation')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    setReplyError('')

    if (!replyMessage.trim()) {
      setReplyError('Message cannot be empty')
      return
    }

    if (replyMessage.trim().length < 5) {
      setReplyError('Message must be at least 5 characters')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: replyMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setReplyError(data.message || 'Failed to send reply')
        return
      }

      setReplyMessage('')
      fetchConversation()
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSending(false)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oracle-500 mb-4"></div>
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto relative z-10">
          <Link href="/messages" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Messages
          </Link>
          <div className="bg-surface-elevated2 rounded-2xl border border-white/10 p-8 text-center shadow-soft">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error || 'Conversation not found'}</p>
            <Link href="/messages" className="text-oracle-400 hover:text-oracle-300 font-medium">
              Return to Messages
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <Link href="/messages" className="inline-flex items-center gap-2 text-oracle-400 hover:text-oracle-300 mb-8 transition-colors group animate-fade-in">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Messages
        </Link>

        {/* Header */}
        <div className="bg-surface-elevated2 rounded-t-2xl border border-white/10 border-b-0 p-6 shadow-soft animate-slide-in">
          <h1 className="text-3xl font-bold text-white mb-2">{conversation.subject}</h1>
          <p className="text-gray-400">
            Conversation with {conversation.participant_name}
          </p>
        </div>

        {/* Messages */}
        <div className="bg-surface-elevated2 border-l border-r border-white/10 p-6 space-y-4 max-h-96 overflow-y-auto min-h-96">
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.is_admin ? 'flex-row-reverse' : ''} animate-slide-in`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold ${
                  message.is_admin ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-oracle-500 to-oracle-600'
                }`}>
                  {message.sender_name.charAt(0).toUpperCase()}
                </div>

                {/* Message */}
                <div className={`flex-1 ${message.is_admin ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl max-w-xs ${
                    message.is_admin
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                      : 'bg-surface-elevated3 text-gray-300 border border-white/10'
                  }`}>
                    <p className="font-medium text-sm mb-2 opacity-75">{message.sender_name}</p>
                    <p className="whitespace-pre-wrap">{message.body}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-2 ${message.is_admin ? 'text-right' : 'text-left'}`}>
                    {formatDateTime(message.created_at)}
                    {message.read_at && (
                      <span className="ml-2 text-gray-600">✓ Read</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="bg-surface-elevated2 rounded-b-2xl border border-white/10 border-t-0 p-6 shadow-soft animate-slide-in" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSendReply} className="space-y-4">
            {replyError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {replyError}
              </div>
            )}

            <div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                disabled={isSending}
                className="w-full px-4 py-3 bg-surface-elevated3 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-oracle-500 focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="Type your reply here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-gradient-to-r from-oracle-500 to-oracle-600 hover:from-oracle-600 hover:to-oracle-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reply
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
