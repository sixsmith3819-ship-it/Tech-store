import { createServiceRoleClient, getCurrentUserProfile } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/orders/list
 * Get all orders for admin
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

    // Fetch all orders with items
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Orders fetch error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch orders',
        },
        { status: 500 }
      )
    }

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order: any) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)

        return {
          ...order,
          order_items: items || [],
        }
      })
    )

    return NextResponse.json(
      {
        success: true,
        orders: ordersWithItems,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Admin orders list error:', error)

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
