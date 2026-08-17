import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * End user session and sign out
 */
export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()

    // Sign out user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to sign out',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Signed out successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Logout endpoint error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during logout',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
