import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { generateMessageId } from '@/utils/formatting'
import { NextResponse } from 'next/server'

/**
 * POST /api/messages/create
 * Create a new message/conversation
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
    const { messageType, subject, message } = body

    // Validate input
    if (!messageType || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Get admin user for recipient (first admin found)
    const { data: adminUsers } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'admin')
      .limit(1)

    if (!adminUsers || adminUsers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No admin available to receive messages',
        },
        { status: 500 }
      )
    }

    const adminUser = adminUsers[0]
    const conversationId = generateMessageId()

    // Create initial message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: adminUser.id,
          subject,
          body: message,
          message_type: messageType,
          is_admin: false,
        },
      ])
      .select()
      .single()

    if (messageError || !messageData) {
      console.error('Message creation error:', messageError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create message',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message created successfully',
        conversation: {
          conversation_id: conversationId,
          subject,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Message creation endpoint error:', error)

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
