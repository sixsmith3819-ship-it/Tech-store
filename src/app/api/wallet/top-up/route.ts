import { createServiceRoleClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/wallet/top-up
 * Add demo money to wallet
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

    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid amount',
        },
        { status: 400 }
      )
    }

    // Limit top-up to prevent abuse
    const maxTopUp = 5000
    if (amount > maxTopUp) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum top-up amount is $${maxTopUp}.00`,
        },
        { status: 400 }
      )
    }

    // Use service role client for wallet operations
    const supabase = createServiceRoleClient()

    // Get current wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      console.error('Wallet fetch error:', walletError)
      return NextResponse.json(
        {
          success: false,
          message: 'Wallet not found',
        },
        { status: 404 }
      )
    }

    const previousBalance = wallet.balance
    const newBalance = previousBalance + amount

    // Update wallet
    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', wallet.id)

    if (updateError) {
      console.error('Error updating wallet:', updateError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to add demo money',
        },
        { status: 500 }
      )
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        type: 'demo_top_up',
        amount: amount,
        balance_before: previousBalance,
        balance_after: newBalance,
        description: `Demo funds added: +$${amount.toFixed(2)}`,
      })

    if (transactionError) {
      console.error('Error recording transaction:', transactionError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Demo money added successfully',
        new_balance: newBalance,
        amount_added: amount,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Wallet top-up endpoint error:', error)

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
