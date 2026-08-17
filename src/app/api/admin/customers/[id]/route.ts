import { createServerSupabaseClient, getCurrentUserProfile, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/customers/[id]
 * Get customer details with orders and services (admin only)
 */
export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const user = await getCurrentUserProfile()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - admin access required',
        },
        { status: 403 }
      )
    }

    const { id: customerId } = await params

    if (!customerId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Customer ID is required',
        },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS
    const supabase = await createServiceRoleClient()

    // Get customer profile
    const { data: customer, error: customerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) {
      console.error('Error fetching customer:', customerError)
      return NextResponse.json(
        {
          success: false,
          message: 'Customer not found',
        },
        { status: 404 }
      )
    }

    // Get customer orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', customerId)
      .order('created_at', { ascending: false })

    // Get customer services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', customerId)
      .order('created_at', { ascending: false })

    return NextResponse.json(
      {
        success: true,
        customer,
        orders: orders || [],
        services: services || [],
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Customer detail endpoint error:', error)

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
