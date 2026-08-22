import { createServiceRoleClient, getCurrentUserProfile } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/orders/[id]
 * Fetch a single order with all items for admin
 */
export async function GET(request: Request, { params }: any) {
  try {
    const userProfile = await getCurrentUserProfile()
    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 })
    }

    const { id: orderId } = await params
    const supabase = createServiceRoleClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    if (itemsError) {
      return NextResponse.json({ success: false, message: 'Failed to fetch order items' }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: { ...order, order_items: items || [] } })
  } catch (error) {
    console.error('Admin order detail error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Update order status OR update an order item's installation status
 *
 * Body variants:
 *   { status: 'confirmed' }                                            — update order status
 *   { item_id: '...', installation_status: 'scheduled' }              — update item installation status
 */
export async function PATCH(request: Request, { params }: any) {
  try {
    const userProfile = await getCurrentUserProfile()
    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 })
    }

    const { id: orderId } = await params
    const body = await request.json()
    const supabase = createServiceRoleClient()

    // ── Update an individual order item's installation status ──────────
    if (body.item_id && body.installation_status !== undefined) {
      const validStatuses = ['none', 'requested', 'scheduled', 'in_progress', 'completed', 'cancelled']
      if (!validStatuses.includes(body.installation_status)) {
        return NextResponse.json({ success: false, message: 'Invalid installation status' }, { status: 400 })
      }

      const { data: item, error } = await supabase
        .from('order_items')
        .update({ installation_status: body.installation_status })
        .eq('id', body.item_id)
        .eq('order_id', orderId)   // ensure item belongs to this order
        .select()
        .single()

      if (error || !item) {
        return NextResponse.json({ success: false, message: 'Failed to update installation status' }, { status: 500 })
      }

      return NextResponse.json({ success: true, item })
    }

    // ── Update the order's overall status ─────────────────────────────
    if (body.status !== undefined) {
      const validOrderStatuses = ['pending', 'confirmed', 'processing', 'ready_for_delivery', 'out_for_delivery', 'completed', 'cancelled']
      if (!validOrderStatuses.includes(body.status)) {
        return NextResponse.json({ success: false, message: 'Invalid order status' }, { status: 400 })
      }

      const { data: order, error } = await supabase
        .from('orders')
        .update({ status: body.status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()

      if (error || !order) {
        return NextResponse.json({ success: false, message: 'Failed to update order status' }, { status: 500 })
      }

      return NextResponse.json({ success: true, order })
    }

    return NextResponse.json({ success: false, message: 'Nothing to update' }, { status: 400 })
  } catch (error) {
    console.error('Admin order PATCH error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 })
  }
}
