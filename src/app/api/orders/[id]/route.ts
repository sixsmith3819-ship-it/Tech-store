import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/orders/[id]
 * Get order details with items
 */
export async function GET(
  _request: Request,
  { params }: any
) {
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

    const { id: orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order ID is required',
        },
        { status: 400 }
      )
    }

    console.log('Fetching order:', { orderId, userId: user.id })

    const supabase = await createServerSupabaseClient()

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    console.log('Order query result:', { error: orderError?.message, hasOrder: !!order })

    if (orderError || !order) {
      console.error('Error fetching order:', orderError)
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Order detail endpoint error:', error)

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
