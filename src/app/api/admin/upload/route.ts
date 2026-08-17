import { createServerSupabaseClient, createServiceRoleClient, getCurrentUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * POST /api/admin/upload
 * Upload an image file to Supabase Storage
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Use regular client for profile check
    const regularSupabase = await createServerSupabaseClient()

    // Check if user is admin - more robust check that doesn't fail if wallet doesn't exist
    let isAdmin = false
    try {
      const { data: profile } = await regularSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      isAdmin = profile?.role === 'admin'
    } catch (error) {
      // If profile check fails, deny access
      console.error('Error checking admin status:', error)
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      )
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${random}.${extension}`
    const filepath = `product-images/${filename}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use service role client for storage upload (bypasses RLS)
    const serviceSupabase = createServiceRoleClient()

    // Upload to Supabase Storage
    const { data, error } = await serviceSupabase.storage
      .from('products')
      .upload(filepath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Get public URL - use service role client
    const { data: urlData } = serviceSupabase.storage
      .from('products')
      .getPublicUrl(filepath)

    if (!urlData) {
      return NextResponse.json(
        { success: false, message: 'Failed to get image URL' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        imageUrl: urlData.publicUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Upload endpoint error:', error)

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
