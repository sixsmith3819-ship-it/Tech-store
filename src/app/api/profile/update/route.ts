import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * PUT /api/profile/update
 * Update user profile information
 */
export async function PUT(request: Request) {
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
    const { fullName, phone, address } = body

    // Get Supabase client
    const supabase = await createServerSupabaseClient()

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone || null,
        address: address || null,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update profile',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: data,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Profile update endpoint error:', error)

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
