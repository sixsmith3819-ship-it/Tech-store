import { createServiceRoleClient, getCurrentUserProfile } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/messages/list
 * Get all message conversations for admin
 */
export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile()

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authorized',
        },
        { status: 403 }
      )
    }

    // Use service role to bypass RLS
    const supabase = createServiceRoleClient()

    // Fetch all messages where admin is recipient
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Messages fetch error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch messages',
        },
        { status: 500 }
      )
    }

    // Group by conversation_id and get latest message from each
    const conversationMap = new Map<string, any>()

    for (const msg of messages || []) {
      if (!conversationMap.has(msg.conversation_id)) {
        // Get sender info
        const { data: sender } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', msg.sender_id)
          .single()

        // Count total messages in conversation
        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', msg.conversation_id)

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', msg.conversation_id)
          .eq('recipient_id', userProfile.id)
          .is('read_at', null)

        conversationMap.set(msg.conversation_id, {
          id: msg.id,
          conversation_id: msg.conversation_id,
          subject: msg.subject,
          message_type: msg.message_type,
          last_message: msg.body.substring(0, 100),
          last_message_at: msg.created_at,
          unread_count: unreadCount || 0,
          sender_name: sender?.full_name || 'Unknown',
          sender_email: sender?.email || '',
          message_count: messageCount || 0,
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
    console.error('Admin messages list error:', error)

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
