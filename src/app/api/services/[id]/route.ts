import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

/**
 * GET /api/services/[id]
 * Get a specific service request
 */
export async function GET(request: Request, { params }: { params: Params }) {
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

    const { id } = await params

    const supabase = await createServerSupabaseClient()

    // Fetch service request
    const { data: serviceRequest, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !serviceRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service request not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        request: serviceRequest,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Service detail endpoint error:', error)

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
