import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/messages/reply
 * Send a reply to an existing conversation
 */
export async function POST(request: Request) {
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

    const body = await request.json()
    const { conversation_id, message } = body

    // Validate input
    if (!conversation_id || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Get conversation to verify user is participant and get recipient
    const { data: conversationMessages, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .limit(1)

    if (fetchError || !conversationMessages || conversationMessages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      )
    }

    const firstMessage = conversationMessages[0]

    // Verify user is part of conversation
    const isParticipant =
      firstMessage.sender_id === user.id || firstMessage.recipient_id === user.id

    if (!isParticipant) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 403 }
      )
    }

    // Determine recipient (the other person in conversation)
    const recipientId =
      firstMessage.sender_id === user.id
        ? firstMessage.recipient_id
        : firstMessage.sender_id

    // Create reply message
    const { data: replyData, error: replyError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id,
          sender_id: user.id,
          recipient_id: recipientId,
          subject: firstMessage.subject,
          body: message,
          message_type: firstMessage.message_type,
          is_admin: false,
        },
      ])
      .select()
      .single()

    if (replyError || !replyData) {
      console.error('Reply creation error:', replyError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send reply',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Reply sent successfully',
        reply: {
          id: replyData.id,
          conversation_id: replyData.conversation_id,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Reply endpoint error:', error)

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
