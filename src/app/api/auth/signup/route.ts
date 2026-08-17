import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createUserProfile } from '@/lib/auth-utils'
import { validateSignupForm } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/signup
 * Register a new user account
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, fullName, password, confirmPassword } = body

    // Validate input
    const errors = validateSignupForm({
      email,
      fullName,
      password,
      confirmPassword,
    })

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

    // Check if user already exists
    const {
      data: { user: existingUser },
    } = await supabase.auth.getUser()

    // Sign up new user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signupError) {
      console.error('Signup error:', signupError)
      return NextResponse.json(
        {
          success: false,
          message: signupError.message || 'Failed to create account',
        },
        { status: 400 }
      )
    }

    if (!authData.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create account',
        },
        { status: 400 }
      )
    }

    // Create user profile
    try {
      await createUserProfile(
        authData.user.id,
        email,
        fullName,
        'customer' // New users are customers by default
      )
    } catch (profileError) {
      console.error('Profile creation error:', profileError)
      // Delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to complete registration',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully! Please check your email to confirm your account.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Signup endpoint error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during signup',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
