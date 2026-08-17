import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/orders/list
 * Get current user's orders
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

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch orders',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        orders: orders || [],
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Orders list endpoint error:', error)

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
