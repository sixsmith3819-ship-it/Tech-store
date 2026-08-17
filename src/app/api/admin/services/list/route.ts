import { createServiceRoleClient, getCurrentUserProfile } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/services/list
 * Get all service requests for admin
 */
export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile()

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authorized',
        },
        { status: 403 }
      )
    }

    // Use service role to bypass RLS
    const supabase = createServiceRoleClient()

    // Fetch all service requests
    const { data: services, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Services fetch error:', error)
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
        services: services || [],
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Admin services list error:', error)

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
