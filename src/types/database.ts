// User Roles
export type UserRole = 'customer' | 'admin'

// User Profile
export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Categories
export interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

// Products
export interface Product {
  id: string
  category_id: string
  name: string
  sku: string
  description: string
  price: number
  stock_quantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  // Installation service fields
  installation_available: boolean
  installation_fee: number
  installation_description?: string
  created_at: string
  updated_at: string
}

// Product Images
export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  display_order: number
  created_at: string
}

// Shopping Cart (client-side state)
export interface CartItem {
  cart_key: string       // unique key: product_id + installation flag e.g. "uuid-true"
  product_id: string
  product_name: string
  sku: string
  price: number
  quantity: number
  // Installation fields
  installation_selected: boolean
  installation_fee: number
  installation_description?: string
}

// Orders
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'ready_for_delivery' | 'out_for_delivery' | 'completed' | 'cancelled'

export interface Order {
  id: string
  user_id: string
  order_number: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  additional_instructions?: string
  total_amount: number
  payment_method?: string
  status: OrderStatus
  created_at: string
  updated_at: string
}

// Order Items
export type InstallationStatus = 'none' | 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  // Installation fields
  installation_selected: boolean
  installation_fee: number
  installation_description?: string
  installation_status: InstallationStatus
}

// Service Types
export type ServiceType = 'cctv_installation' | 'starlink_installation' | 'networking_installation' | 'network_cabinet' | 'wifi_setup' | 'other'
export type ServiceStatus = 'pending' | 'reviewed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface ServiceRequest {
  id: string
  user_id: string
  service_request_number: string
  service_type: ServiceType
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  preferred_date?: string
  preferred_time?: string
  description: string
  status: ServiceStatus
  created_at: string
  updated_at: string
}

// Messages
export interface Message {
  id: string
  user_id: string
  admin_id?: string
  subject: string
  body: string
  message_type: 'general' | 'order' | 'service_request' | 'product'
  related_order_id?: string
  related_service_request_id?: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// Conversation (for UI display)
export interface Conversation {
  id: string
  user_id: string
  subject: string
  last_message: string
  last_message_at: string
  unread_count: number
}
