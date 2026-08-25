-- Oracle Tech Store - Complete Database Schema
-- This schema supports all 5 developmental objectives

-- ============================================================================
-- 1. USER PROFILES & ROLES (Objective 5: Communication & Authentication)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. PRODUCT CATEGORIES (Objective 1: Product Catalogue)
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. PRODUCTS (Objective 1: Product Catalogue, Objective 3: Product Management)
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);

-- ============================================================================
-- 4. PRODUCT IMAGES (Objective 1: Product Catalogue, Objective 3: Product Management)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(display_order);

-- ============================================================================
-- 5. ORDERS (Objective 2: Online Ordering System, Objective 5: Order Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  additional_instructions TEXT,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'processing', 'ready_for_delivery', 'out_for_delivery', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- ============================================================================
-- 6. ORDER ITEMS (Objective 2: Online Ordering System, Objective 5: Order Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- 7. SERVICES CATALOG (Public browsable services)
-- ============================================================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  service_type TEXT NOT NULL CHECK (service_type IN ('cctv_installation', 'starlink_installation', 'networking_installation', 'network_cabinet', 'wifi_setup', 'maintenance', 'other')),
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'discontinued')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_service_type ON services(service_type);
CREATE INDEX idx_services_status ON services(status);

-- ============================================================================
-- 7. SERVICE REQUESTS (Objective 4: Service Request System)
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_request_number TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL CHECK (service_type IN ('cctv_installation', 'starlink_installation', 'networking_installation', 'network_cabinet', 'wifi_setup', 'other')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_service_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at);
CREATE INDEX idx_service_requests_service_request_number ON service_requests(service_request_number);

-- ============================================================================
-- 8. MESSAGES (Objective 5: Customer Communication)
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('general', 'order', 'service_request', 'product')) DEFAULT 'general',
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  related_service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_admin_id ON messages(admin_id);
CREATE INDEX idx_messages_related_order_id ON messages(related_order_id);
CREATE INDEX idx_messages_related_service_request_id ON messages(related_service_request_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES - RLS Policies
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Service role bypass (for signup via API)
CREATE POLICY "Service role can do anything on profiles"
  ON profiles
  USING (auth.role() = 'service_role');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PRODUCTS - RLS Policies
-- ============================================================================

-- All users can read products
CREATE POLICY "All users can read products"
  ON products FOR SELECT
  USING (TRUE);

-- Only service role can manage products (no need to check admin status)
CREATE POLICY "Service role can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- PRODUCT_IMAGES - RLS Policies
-- ============================================================================

-- All users can read product images
CREATE POLICY "All users can read product images"
  ON product_images FOR SELECT
  USING (TRUE);

-- Only service role can manage product images
CREATE POLICY "Service role can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update product images"
  ON product_images FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete product images"
  ON product_images FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- CATEGORIES - RLS Policies
-- ============================================================================

-- All users can read categories
CREATE POLICY "All users can read categories"
  ON categories FOR SELECT
  USING (TRUE);

-- Only service role can manage categories
CREATE POLICY "Service role can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- SERVICES - RLS Policies
-- ============================================================================

-- All users can read active services
CREATE POLICY "All users can read active services"
  ON services FOR SELECT
  USING (status = 'active');

-- Only service role can manage services
CREATE POLICY "Service role can insert services"
  ON services FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update services"
  ON services FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete services"
  ON services FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- ORDERS - RLS Policies
-- ============================================================================

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all orders
CREATE POLICY "Service role can read all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'service_role');

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Service role can update any order
CREATE POLICY "Service role can update any order"
  ON orders FOR UPDATE
  USING (auth.role() = 'service_role');

-- Service role can delete orders
CREATE POLICY "Service role can delete orders"
  ON orders FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- ORDER_ITEMS - RLS Policies
-- ============================================================================

-- Users can read order items from their orders
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Service role can read all order items
CREATE POLICY "Service role can read all order items"
  ON order_items FOR SELECT
  USING (auth.role() = 'service_role');

-- Users can insert order items for their orders
CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Service role can manage order items
CREATE POLICY "Service role can update order items"
  ON order_items FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete order items"
  ON order_items FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- SERVICE_REQUESTS - RLS Policies
-- ============================================================================

-- Users can read their own service requests
CREATE POLICY "Users can read own service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all service requests
CREATE POLICY "Service role can read all service requests"
  ON service_requests FOR SELECT
  USING (auth.role() = 'service_role');

-- Users can insert their own service requests
CREATE POLICY "Users can insert own service requests"
  ON service_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending service requests
CREATE POLICY "Users can update own pending service requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Service role can update any service request
CREATE POLICY "Service role can update any service request"
  ON service_requests FOR UPDATE
  USING (auth.role() = 'service_role');

-- Service role can delete service requests
CREATE POLICY "Service role can delete service requests"
  ON service_requests FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- MESSAGES - RLS Policies
-- ============================================================================

-- Users can read messages they sent
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all messages
CREATE POLICY "Service role can read all messages"
  ON messages FOR SELECT
  USING (auth.role() = 'service_role');

-- Users can insert messages
CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own unread messages
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id AND is_read = FALSE)
  WITH CHECK (auth.uid() = user_id);

-- Service role can update any message
CREATE POLICY "Service role can update any message"
  ON messages FOR UPDATE
  USING (auth.role() = 'service_role');

-- Service role can delete messages
CREATE POLICY "Service role can delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for development/demo)
-- ============================================================================

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Laptops', 'High-performance laptops and notebooks'),
  ('Networking Equipment', 'Enterprise-grade networking hardware'),
  ('Networking Tools', 'Professional networking tools and equipment'),
  ('Wi-Fi & Extenders', 'Wireless connectivity solutions'),
  ('Starlink', 'Starlink Mini Kits and related equipment'),
  ('Network Cabinets', 'Server and equipment cabinets'),
  ('Security & CCTV', 'CCTV systems and security equipment'),
  ('Accessories', 'Tech accessories and add-ons')
ON CONFLICT (name) DO NOTHING;
