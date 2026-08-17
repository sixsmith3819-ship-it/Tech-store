import { createServerSupabaseClient, getCurrentUserProfile } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics for admin
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

    const supabase = await createServerSupabaseClient()

    // Get total orders and revenue
    const { data: ordersData } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')

    const totalOrders = ordersData?.length || 0
    const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0

    // Get orders in last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recentOrders = ordersData?.filter(o => o.created_at > twentyFourHoursAgo).length || 0

    // Get service requests
    const { data: servicesData } = await supabase
      .from('service_requests')
      .select('status')

    const totalServiceRequests = servicesData?.length || 0
    const pendingServices = servicesData?.filter(s => s.status === 'pending').length || 0

    // Get customers count
    const { data: customersData } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'customer')

    const totalCustomers = customersData?.length || 0

    // Get unread messages for admin
    const { data: messagesData } = await supabase
      .from('messages')
      .select('id')
      .eq('recipient_id', userProfile.id)
      .is('read_at', null)

    const unreadMessages = messagesData?.length || 0

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalOrders,
          totalRevenue,
          pendingOrders,
          totalServiceRequests,
          pendingServices,
          totalCustomers,
          recentOrders,
          unreadMessages,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Admin dashboard stats error:', error)

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
