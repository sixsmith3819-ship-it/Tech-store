import { createServerSupabaseClient } from './supabase-server'
import type { Product, Order, ServiceRequest, Category } from '@/types/database'

/**
 * Product Database Operations
 */
export const productDB = {
  /**
   * Get all products with optional filtering
   */
  async getAll(filters?: { category_id?: string; status?: string }) {
    const supabase = await createServerSupabaseClient()
    let query = supabase.from('products').select(`
      *,
      categories:category_id (*)
    `)

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  /**
   * Get single product by ID
   */
  async getById(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        categories:category_id (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Search products by name or description
   */
  async search(query: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (error) throw error
    return data
  },

  /**
   * Check product availability and stock
   */
  async checkStock(productId: string, quantity: number) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('stock_quantity, status')
      .eq('id', productId)
      .single()

    if (error) throw error
    
    return {
      available: data.stock_quantity >= quantity && data.status !== 'out_of_stock',
      currentStock: data.stock_quantity,
      required: quantity,
    }
  },
}

/**
 * Order Database Operations
 */
export const orderDB = {
  /**
   * Create a new order
   */
  async create(order: any) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Get order by ID
   */
  async getById(orderId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Update order status (admin only)
   */
  async updateStatus(orderId: string, status: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

/**
 * Service Request Database Operations
 */
export const serviceRequestDB = {
  /**
   * Create a new service request
   */
  async create(request: any) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('service_requests')
      .insert([request])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Get user's service requests
   */
  async getUserRequests(userId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Get service request by ID
   */
  async getById(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Update service request status (admin only)
   */
  async updateStatus(id: string, status: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

/**
 * Message Database Operations
 */
export const messageDB = {
  /**
   * Send a message
   */
  async send(message: any) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Get user's messages (conversations)
   */
  async getUserMessages(userId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return data?.length || 0
  },
}

/**
 * Category Database Operations
 */
export const categoryDB = {
  /**
   * Get all categories
   */
  async getAll() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * Get category by ID
   */
  async getById(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },
}
