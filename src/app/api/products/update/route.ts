import { createServerSupabaseClient, getCurrentUserProfile, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * PUT /api/products/update
 * Update an existing product (admin only)
 */
export async function PUT(request: Request) {
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
    const { id, category_id, name, sku, description, price, stock_quantity, new_image_urls,
      installation_available, installation_fee, installation_description } = body

    if (!id) {
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

    // Build update object with only provided fields
    const updateData: Record<string, any> = {}
    if (category_id !== undefined) updateData.category_id = category_id
    if (name !== undefined) updateData.name = name
    if (sku !== undefined) updateData.sku = sku
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (stock_quantity !== undefined) {
      const qty = parseInt(stock_quantity)
      updateData.stock_quantity = qty
      // Auto-update status based on stock
      updateData.status = qty === 0 ? 'out_of_stock' : qty < 10 ? 'low_stock' : 'in_stock'
    }
    // Installation service fields
    if (installation_available !== undefined) updateData.installation_available = Boolean(installation_available)
    if (installation_fee !== undefined) updateData.installation_fee = parseFloat(installation_fee) || 0
    if (installation_description !== undefined) updateData.installation_description = installation_description || null

    // Update product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (productError) {
      console.error('Error updating product:', productError)
      return NextResponse.json(
        {
          success: false,
          message: productError.message || 'Failed to update product',
        },
        { status: 400 }
      )
    }

    // Handle new images if provided
    if (new_image_urls && Array.isArray(new_image_urls) && new_image_urls.length > 0) {
      try {
        // Get current max display_order for this product
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('display_order')
          .eq('product_id', id)
          .order('display_order', { ascending: false })
          .limit(1)

        let nextOrder = 1
        if (existingImages && existingImages.length > 0) {
          nextOrder = (existingImages[0].display_order || 0) + 1
        }

        // Insert new images
        const imagesToInsert = new_image_urls.map((url, index) => ({
          product_id: id,
          image_url: url,
          display_order: nextOrder + index,
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imagesToInsert)

        if (imagesError) {
          console.error('Error inserting images:', imagesError)
          // Don't fail the entire request if images fail - product was updated
          console.warn('Images were not saved, but product was updated')
        }
      } catch (imageError) {
        console.error('Error handling images:', imageError)
        // Don't fail the entire request
      }
    }

    return NextResponse.json(
      {
        success: true,
        product,
        message: 'Product updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Product update error:', error)

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
