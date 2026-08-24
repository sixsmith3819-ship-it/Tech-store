import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/profile/update-email
 * Update user email address with password verification
 * 
 * Security: Requires password verification to confirm identity before changing email
 */
export async function POST(request: Request) {
  try {
    // Get current user
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
    const { newEmail, password } = body

    // Validate required fields
    if (!newEmail || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'New email and password are required',
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a valid email address',
        },
        { status: 400 }
      )
    }

    // Check if new email is different from current email
    if (newEmail.toLowerCase() === user.email?.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          message: 'New email must be different from current email',
        },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Verify password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password,
    })

    if (signInError) {
      console.error('Password verification error:', signInError)
      return NextResponse.json(
        {
          success: false,
          message: 'Incorrect password',
        },
        { status: 400 }
      )
    }

    // Check if new email is already in use
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers()
    
    if (!checkError) {
      const emailExists = existingUser?.users?.some(
        (u) => u.email?.toLowerCase() === newEmail.toLowerCase()
      )

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            message: 'This email is already in use',
          },
          { status: 400 }
        )
      }
    }

    // Update email in Supabase auth
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (updateError) {
      console.error('Email update error:', updateError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update email',
        },
        { status: 500 }
      )
    }

    // Log email change for audit trail
    console.info(`Email change audit: User ${user.id} changed email from ${user.email} to ${newEmail}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Email updated successfully',
        newEmail: newEmail,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Email update endpoint error:', error)

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
