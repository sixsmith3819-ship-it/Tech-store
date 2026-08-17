import { createServerSupabaseClient, createServiceRoleClient, getCurrentUser } from '@/lib/supabase-server'
import { generateOrderNumber } from '@/utils/formatting'
import { NextResponse } from 'next/server'

/**
 * POST /api/orders/create
 * Create a new order with items and process demo wallet payment
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
    const { items, customer, deliveryAddress, additionalInstructions, totalAmount, paymentMethod = 'demo_money' } = body

    console.log('Order creation request:', {
      user_id: user.id,
      items: items?.length,
      totalAmount,
      paymentMethod,
      customer_email: customer?.email,
    })

    // Validate input
    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No items in order',
        },
        { status: 400 }
      )
    }

    if (!customer || !deliveryAddress) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required customer information',
        },
        { status: 400 }
      )
    }

    // Use service role client for financial operations
    const supabase = createServiceRoleClient()

    // If payment method is demo_money, process wallet deduction first
    if (paymentMethod === 'demo_money') {
      const orderNumber = generateOrderNumber()
      
      // Call the atomic checkout function
      const { data: checkoutResult, error: checkoutError } = await supabase.rpc(
        'process_demo_checkout',
        {
          p_user_id: user.id,
          p_order_total: totalAmount,
          p_order_data: {
            order_number: orderNumber,
          },
        }
      )

      if (checkoutError) {
        console.error('Checkout error:', checkoutError)
        return NextResponse.json(
          {
            success: false,
            message: 'Payment processing failed',
          },
          { status: 500 }
        )
      }

      // checkoutResult is an array with one object (from RETURNS TABLE in PostgreSQL)
      const result = Array.isArray(checkoutResult) ? checkoutResult[0] : checkoutResult

      console.log('Checkout result:', JSON.stringify(result, null, 2))

      if (!result?.success) {
        console.log('Checkout failed with result:', result)
        return NextResponse.json(
          {
            success: false,
            message: result?.message || 'Payment failed',
            required_amount: result?.required,
            available_balance: result?.available,
          },
          { status: 400 }
        )
      }

      // Wallet has been debited, now create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            customer_email: customer.email,
            customer_phone: customer.phone,
            delivery_address: deliveryAddress,
            additional_instructions: additionalInstructions || null,
            total_amount: totalAmount,
            payment_method: 'demo_money',
            status: 'confirmed',
          },
        ])
        .select()
        .single()

      if (orderError || !order) {
        console.error('Order creation error:', orderError)
        // Refund wallet if order creation failed
        await supabase.rpc('refund_wallet', {
          p_user_id: user.id,
          p_amount: totalAmount,
          p_reference: orderNumber,
        })

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create order',
          },
          { status: 500 }
        )
      }

      // Create order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        // Refund wallet and delete order if items failed
        await supabase.rpc('refund_wallet', {
          p_user_id: user.id,
          p_amount: totalAmount,
          p_reference: orderNumber,
        })
        await supabase.from('orders').delete().eq('id', order.id)

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create order items',
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Order created and payment processed',
          order: {
            id: order.id,
            orderNumber: order.order_number,
            totalAmount: order.total_amount,
            paymentMethod: order.payment_method,
            status: order.status,
          },
          new_balance: result.new_balance,
        },
        { status: 201 }
      )
    }

    // For other payment methods, just create the order without wallet processing
    const orderNumber = generateOrderNumber()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          order_number: orderNumber,
          customer_email: customer.email,
          customer_phone: customer.phone,
          delivery_address: deliveryAddress,
          additional_instructions: additionalInstructions || null,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create order',
        },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      await supabase.from('orders').delete().eq('id', order.id)

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create order items',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: order.total_amount,
          paymentMethod: order.payment_method,
          status: order.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Order creation endpoint error:', error)

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
