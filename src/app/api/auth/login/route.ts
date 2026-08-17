import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validateLoginForm } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    const errors = validateLoginForm({ email, password })

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors,
        },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        {
          success: false,
          message: error.message === 'Invalid login credentials'
            ? 'Invalid email or password'
            : error.message || 'Failed to sign in',
        },
        { status: 401 }
      )
    }

    if (!data.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to sign in',
        },
        { status: 401 }
      )
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to retrieve user profile',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Signed in successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: profile?.full_name,
          role: profile?.role || 'customer',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Login endpoint error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during login',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
