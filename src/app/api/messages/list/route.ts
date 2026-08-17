import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/messages/list
 * Get all message conversations for the current user
 */
export async function GET() {
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

    const supabase = await createServerSupabaseClient()

    // Fetch conversations with latest message
    const { data: conversations, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Conversations fetch error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch conversations',
        },
        { status: 500 }
      )
    }

    // Group by conversation_id and get latest message from each
    const conversationMap = new Map<string, any>()
    
    for (const msg of conversations || []) {
      if (!conversationMap.has(msg.conversation_id)) {
        // Get participant info (sender if we're recipient, recipient if we're sender)
        const isAdmin = msg.is_admin
        const isSender = msg.sender_id === user.id

        const participantId = isSender ? msg.recipient_id : msg.sender_id
        
        // Fetch participant info
        const { data: participant } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', participantId)
          .single()

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', msg.conversation_id)
          .eq('recipient_id', user.id)
          .is('read_at', null)

        conversationMap.set(msg.conversation_id, {
          id: msg.id,
          conversation_id: msg.conversation_id,
          subject: msg.subject,
          message_type: msg.message_type,
          last_message: msg.body.substring(0, 100),
          last_message_at: msg.created_at,
          unread_count: unreadCount || 0,
          participant_name: participant?.full_name || 'Support Team',
          participant_email: participant?.email || '',
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        conversations: Array.from(conversationMap.values()),
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Messages list endpoint error:', error)

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
