import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

type Params = Promise<{ conversation_id: string }>

/**
 * GET /api/messages/[conversation_id]
 * Get a specific conversation with all messages
 */
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      )
    }

    const { conversation_id } = await params

    const supabase = await createServerSupabaseClient()

    // Fetch all messages in conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })

    if (messagesError || !messages || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      )
    }

    // Verify user is part of this conversation
    const isParticipant = messages.some(
      msg => msg.sender_id === user.id || msg.recipient_id === user.id
    )

    if (!isParticipant) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access',
        },
        { status: 403 }
      )
    }

    // Mark messages as read for current user
    const unreadMessages = messages.filter(
      msg => msg.recipient_id === user.id && !msg.read_at
    )

    if (unreadMessages.length > 0) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversation_id)
        .eq('recipient_id', user.id)
        .is('read_at', null)
    }

    // Get sender info from first message
    const firstMessage = messages[0]
    const otherParticipantId =
      firstMessage.sender_id === user.id ? firstMessage.recipient_id : firstMessage.sender_id

    const { data: participant } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', otherParticipantId)
      .single()

    // Get message senders' names
    const { data: senders } = await supabase
      .from('profiles')
      .select('id, full_name')

    const senderMap = new Map(senders?.map(s => [s.id, s.full_name]) || [])

    const messagesWithNames = messages.map(msg => ({
      ...msg,
      sender_name: senderMap.get(msg.sender_id) || 'User',
    }))

    return NextResponse.json(
      {
        success: true,
        conversation: {
          id: messages[0].id,
          conversation_id,
          subject: messages[0].subject,
          message_type: messages[0].message_type,
          participant_name: participant?.full_name || 'Support Team',
          participant_email: participant?.email || '',
          created_at: messages[0].created_at,
          messages: messagesWithNames,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Message detail endpoint error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
