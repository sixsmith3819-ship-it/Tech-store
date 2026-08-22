import { createServerSupabaseClient, createServiceRoleClient, getCurrentUser } from '@/lib/supabase-server'
import { generateOrderNumber } from '@/utils/formatting'
import { NextResponse } from 'next/server'

/**
 * POST /api/orders/create
 * Create a new order with items and process demo wallet payment.
 *
 * Installation fee security:
 *   - The client sends installation_selected per item.
 *   - The server fetches the product's actual installation_available and
 *     installation_fee from the database and ignores whatever fee the
 *     client claims, preventing fee manipulation from the frontend.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { items, customer, deliveryAddress, additionalInstructions, totalAmount, paymentMethod = 'demo_money' } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'No items in order' }, { status: 400 })
    }
    if (!customer || !deliveryAddress) {
      return NextResponse.json({ success: false, message: 'Missing required customer information' }, { status: 400 })
    }

    // ── Server-side price + installation validation ─────────────────
    const supabase = createServiceRoleClient()

    const productIds: string[] = [...new Set(items.map((i: any) => i.product_id as string))]
    const { data: dbProducts, error: prodErr } = await supabase
      .from('products')
      .select('id, price, installation_available, installation_fee, installation_description')
      .in('id', productIds)

    if (prodErr || !dbProducts) {
      return NextResponse.json({ success: false, message: 'Failed to validate products' }, { status: 500 })
    }

    const productMap = new Map(dbProducts.map((p: any) => [p.id, p]))

    // Build validated order items — server controls prices and installation fees
    let serverCalculatedTotal = 0
    const validatedItems: any[] = []

    for (const item of items) {
      const dbProduct = productMap.get(item.product_id)
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.product_id}` },
          { status: 400 }
        )
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1)
      const unitPrice: number = dbProduct.price

      // Validate installation: only allow it if the product actually supports it
      const installationSelected: boolean =
        item.installation_selected === true && dbProduct.installation_available === true
      const installationFee: number = installationSelected ? (dbProduct.installation_fee ?? 0) : 0
      const installationDescription: string | null = installationSelected
        ? (dbProduct.installation_description ?? null)
        : null
      const installationStatus: string = installationSelected ? 'requested' : 'none'

      // Line total = (product price + installation fee) × quantity
      const lineTotal = (unitPrice + installationFee) * qty
      serverCalculatedTotal += lineTotal

      validatedItems.push({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: qty,
        unit_price: unitPrice,
        total_price: lineTotal,
        installation_selected: installationSelected,
        installation_fee: installationFee,
        installation_description: installationDescription,
        installation_status: installationStatus,
      })
    }

    // Apply 8% tax — round to 2 dp
    const serverTotal = Math.round(serverCalculatedTotal * 1.08 * 100) / 100

    // Sanity-check the client total within $0.10 to catch tampering
    if (Math.abs(serverTotal - totalAmount) > 0.10) {
      console.warn('Total mismatch', { serverTotal, clientTotal: totalAmount })
      return NextResponse.json(
        { success: false, message: 'Order total mismatch — please refresh and try again.' },
        { status: 400 }
      )
    }

    // Use the server-computed total for the actual charge
    const finalTotal = serverTotal

    console.log('Order creation request:', {
      user_id: user.id,
      items: validatedItems.length,
      finalTotal,
      paymentMethod,
    })

    // ── Demo money payment path ─────────────────────────────────────
    if (paymentMethod === 'demo_money') {
      const orderNumber = generateOrderNumber()

      const { data: checkoutResult, error: checkoutError } = await supabase.rpc(
        'process_demo_checkout',
        { p_user_id: user.id, p_order_total: finalTotal, p_order_data: { order_number: orderNumber } }
      )

      if (checkoutError) {
        console.error('Checkout error:', checkoutError)
        return NextResponse.json({ success: false, message: 'Payment processing failed' }, { status: 500 })
      }

      const result = Array.isArray(checkoutResult) ? checkoutResult[0] : checkoutResult
      if (!result?.success) {
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

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: orderNumber,
          customer_email: customer.email,
          customer_phone: customer.phone,
          delivery_address: deliveryAddress,
          additional_instructions: additionalInstructions || null,
          total_amount: finalTotal,
          payment_method: 'demo_money',
          status: 'confirmed',
        }])
        .select()
        .single()

      if (orderError || !order) {
        console.error('Order creation error:', orderError)
        await supabase.rpc('refund_wallet', { p_user_id: user.id, p_amount: finalTotal, p_reference: orderNumber })
        return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 })
      }

      // Create order items with installation data
      const orderItems = validatedItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        installation_selected: item.installation_selected,
        installation_fee: item.installation_fee,
        installation_description: item.installation_description,
        installation_status: item.installation_status,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) {
        console.error('Order items error:', itemsError)
        await supabase.rpc('refund_wallet', { p_user_id: user.id, p_amount: finalTotal, p_reference: orderNumber })
        await supabase.from('orders').delete().eq('id', order.id)
        return NextResponse.json({ success: false, message: 'Failed to create order items' }, { status: 500 })
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

    // ── Non-demo payment path ───────────────────────────────────────
    const orderNumber = generateOrderNumber()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        order_number: orderNumber,
        customer_email: customer.email,
        customer_phone: customer.phone,
        delivery_address: deliveryAddress,
        additional_instructions: additionalInstructions || null,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        status: 'pending',
      }])
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 })
    }

    const orderItems = validatedItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      installation_selected: item.installation_selected,
      installation_fee: item.installation_fee,
      installation_description: item.installation_description,
      installation_status: item.installation_status,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ success: false, message: 'Failed to create order items' }, { status: 500 })
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
    console.error('Order creation endpoint error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred', error: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
