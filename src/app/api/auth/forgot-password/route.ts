import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/forgot-password
 * Send password reset email to user
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (userError || !user) {
      // Don't reveal if user exists (security best practice)
      return NextResponse.json(
        { success: true, message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      )
    }

    // Use Supabase's built-in password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: \\/auth/reset-password\,
    })

    if (error) {
      console.error('Password reset error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'If an account exists with this email, you will receive a password reset link.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    )
  }
}
