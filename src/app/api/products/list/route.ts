import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/products/list?category=xyz&search=term&sort=name
 * Get all products with optional filtering and sorting
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const searchTerm = searchParams.get('search')
    const sortBy = searchParams.get('sort') || 'name'

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (*)
      `)

    // Filter by category
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('name', { ascending: true })
    }

    let { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch products',
        },
        { status: 500 }
      )
    }

    // Client-side search (filtering by name, description, SKU)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      products = products?.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch) ||
        p.sku.toLowerCase().includes(lowerSearch)
      ) || []
    }

    // Sort product_images by display_order within each product
    if (products) {
      products = products.map(product => ({
        ...product,
        product_images: product.product_images?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) || []
      }))
    }

    return NextResponse.json(
      {
        success: true,
        products: products || [],
        count: products?.length || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Products list endpoint error:', error)

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
