import { createServerSupabaseClient, getCurrentUserProfile, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/products/create
 * Create a new product (admin only)
 */
export async function POST(request: Request) {
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

    const body = await request.json()
    const { category_id, name, sku, description, price, stock_quantity, image_urls = [] } = body

    // Validate required fields
    if (!category_id || !name || !sku || !description || price === undefined || stock_quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS
    const supabase = await createServiceRoleClient()

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        category_id,
        name,
        sku,
        description,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity),
        status: parseInt(stock_quantity) === 0 ? 'out_of_stock' : parseInt(stock_quantity) < 10 ? 'low_stock' : 'in_stock',
      })
      .select()
      .single()

    if (productError) {
      console.error('Error creating product:', productError)
      return NextResponse.json(
        {
          success: false,
          message: productError.message || 'Failed to create product',
        },
        { status: 400 }
      )
    }

    // Add images if provided
    if (image_urls.length > 0) {
      const imagesToInsert = image_urls.map((url: string, idx: number) => ({
        product_id: product.id,
        image_url: url,
        display_order: idx,
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imagesToInsert)

      if (imagesError) {
        console.error('Error adding product images:', imagesError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        product,
        message: 'Product created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Product creation error:', error)

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
