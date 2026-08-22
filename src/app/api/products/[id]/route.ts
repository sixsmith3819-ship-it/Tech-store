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
      product.product_images = product.product_images.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
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




/**
 * DELETE /api/products/[id]
 * Delete a product (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: any
) {
  try {
    const { getCurrentUserProfile, createServiceRoleClient } = await import('@/lib/supabase-server')
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

    // Use service role client to bypass RLS
    const supabase = await createServiceRoleClient()

    // Delete product images first (foreign key constraint)
    const { error: imagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId)

    if (imagesError) {
      console.error('Error deleting product images:', imagesError)
    }

    // Delete the product
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (productError) {
      console.error('Error deleting product:', productError)
      return NextResponse.json(
        {
          success: false,
          message: productError.message || 'Failed to delete product',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Product delete error:', error)

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
