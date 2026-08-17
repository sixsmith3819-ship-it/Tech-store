import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/health
 * Health check endpoint to verify database connectivity
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Test database connection by querying categories
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          error: error.message,
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
