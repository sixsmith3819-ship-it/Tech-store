import { createServerSupabaseClient, createServiceRoleClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/wallet/reset
 * Reset demo wallet to $10,000.00
 */
export async function POST(request: Request) {
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

    // Use service role client for wallet operations
    const supabase = createServiceRoleClient()

    // Call the reset_demo_wallet database function
    const { data, error } = await supabase.rpc('reset_demo_wallet', {
      p_user_id: user.id,
    })

    console.log('Reset wallet result:', { error: error?.message, data })

    if (error) {
      console.error('Error resetting wallet:', error)
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to reset wallet',
        },
        { status: 400 }
      )
    }

    // data is an array with one object (from RETURNS TABLE in PostgreSQL)
    const result = Array.isArray(data) ? data[0] : data

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message || 'Failed to reset wallet',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Demo wallet reset successfully',
        new_balance: result.new_balance,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Wallet reset endpoint error:', error)

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
