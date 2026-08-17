import { createServerSupabaseClient, getCurrentUser } from '@/lib/supabase-server'
import { generateServiceNumber } from '@/utils/formatting'
import { NextResponse } from 'next/server'

/**
 * POST /api/services/create
 * Create a new service request
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
    const {
      serviceType,
      title,
      description,
      desiredDate,
      desiredTime,
      fullName,
      email,
      phone,
      address,
      additionalInfo,
    } = body

    // Validate input
    if (!serviceType || !title || !description || !desiredDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Create service request
    const serviceNumber = generateServiceNumber()
    const { data: serviceRequest, error: createError } = await supabase
      .from('service_requests')
      .insert([
        {
          user_id: user.id,
          service_number: serviceNumber,
          service_type: serviceType,
          title,
          description,
          desired_date: desiredDate,
          desired_time: desiredTime || null,
          address,
          additional_info: additionalInfo || null,
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (createError || !serviceRequest) {
      console.error('Service request creation error:', createError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create service request',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Service request created successfully',
        request: {
          id: serviceRequest.id,
          service_number: serviceRequest.service_number,
          status: serviceRequest.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Service creation endpoint error:', error)

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
