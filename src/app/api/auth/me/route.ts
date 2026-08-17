import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/me
 * Get current authenticated user and profile
 */
export async function GET() {
  try {
    // Get current user from session
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

    // Get user profile
    const supabase = await createServerSupabaseClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, address, role, created_at')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to retrieve profile',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: profile,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Get user endpoint error:', error)

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
