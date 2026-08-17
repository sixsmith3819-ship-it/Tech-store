import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/services/list
 * Get all service requests for the current user
 */
export async function GET() {
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

    const supabase = await createServerSupabaseClient()

    // Fetch user's service requests
    const { data: requests, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Service requests fetch error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch service requests',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        requests: requests || [],
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Service list endpoint error:', error)

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
