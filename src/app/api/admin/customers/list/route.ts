import { createServiceRoleClient, getCurrentUserProfile } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/customers/list
 * Get all customers for admin
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

    // Fetch all customers
    const { data: customers, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Customers fetch error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch customers',
        },
        { status: 500 }
      )
    }

    // Get order and service counts for each customer
    const customersWithCounts = await Promise.all(
      (customers || []).map(async (customer: any) => {
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', customer.id)

        const { count: serviceCount } = await supabase
          .from('service_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', customer.id)

        return {
          ...customer,
          order_count: orderCount || 0,
          service_count: serviceCount || 0,
        }
      })
    )

    return NextResponse.json(
      {
        success: true,
        customers: customersWithCounts,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Admin customers list error:', error)

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
