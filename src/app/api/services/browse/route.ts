import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/services/browse?serviceType=xyz&search=term&sort=name
 * Get all available services for browsing (public endpoint, no auth required)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get('serviceType')
    const searchTerm = searchParams.get('search')
    const sortBy = searchParams.get('sort') || 'name'

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('services')
      .select('*')
      .eq('status', 'active')

    // Filter by service type
    if (serviceType) {
      query = query.eq('service_type', serviceType)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('name', { ascending: true })
    }

    let { data: services, error } = await query

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch services',
        },
        { status: 500 }
      )
    }

    // Client-side search (filtering by name, description)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      services = services?.filter(s =>
        s.name.toLowerCase().includes(lowerSearch) ||
        s.description.toLowerCase().includes(lowerSearch) ||
        (s.detailed_description && s.detailed_description.toLowerCase().includes(lowerSearch))
      ) || []
    }

    const response = NextResponse.json(
      {
        success: true,
        services: services || [],
        count: services?.length || 0,
      },
      { status: 200 }
    )

    // Disable caching - always fetch fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Services browse endpoint error:', error)

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
