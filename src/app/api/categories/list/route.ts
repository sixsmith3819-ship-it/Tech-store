import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/categories/list
 * Get all product categories
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch categories',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        categories: categories || [],
        count: categories?.length || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Categories list endpoint error:', error)

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
