import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/wallet/get
 * Get current user's wallet information and recent transactions
 * Auto-creates wallet if it doesn't exist
 */
export async function GET(request: Request) {
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

    // Get wallet
    let { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If wallet doesn't exist, try to create it
    if (walletError?.code === 'PGRST116') {
      console.log('Wallet not found, creating one for user:', user.id)
      
      const { data: createResult, error: createError } = await supabase.rpc('create_user_wallet', {
        p_user_id: user.id,
      })

      if (createError || !createResult || createResult.length === 0) {
        console.error('Error creating wallet:', createError)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create wallet',
          },
          { status: 500 }
        )
      }

      // Fetch the newly created wallet
      const { data: newWallet, error: newWalletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (newWalletError || !newWallet) {
        console.error('Error fetching newly created wallet:', newWalletError)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch wallet',
          },
          { status: 500 }
        )
      }

      wallet = newWallet
    } else if (walletError) {
      console.error('Error fetching wallet:', walletError)
      return NextResponse.json(
        {
          success: false,
          message: 'Wallet not found',
        },
        { status: 404 }
      )
    }

    // Get recent transactions (last 10)
    const { data: transactions, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError)
    }

    // Calculate totals
    const purchaseTransactions = transactions?.filter(t => t.type === 'purchase') || []
    const totalSpent = purchaseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)

    return NextResponse.json(
      {
        success: true,
        wallet: {
          id: wallet.id,
          balance: wallet.balance,
          currency: wallet.currency,
          created_at: wallet.created_at,
          updated_at: wallet.updated_at,
        },
        transactions: transactions || [],
        stats: {
          total_spent: totalSpent,
          total_purchases: purchaseTransactions.length,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Wallet get endpoint error:', error)

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
