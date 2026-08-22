import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/products/[id]
 * Get a single product with images and category
 */
export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const { id: productId } = await params

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product ID is required',
        },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        categories:category_id (*)
      `)
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      )
    }

    // Sort product_images by display_order
    if (product?.product_images) {
      product.product_images = product.product_images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    }

    const response = NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    )

    // Disable caching - always fetch fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Product detail endpoint error:', error)

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

