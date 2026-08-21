-- ============================================================================
-- FIX FOR RLS INFINITE RECURSION IN PROFILES TABLE
-- ============================================================================
-- This script fixes the infinite recursion error that occurs during user signup
-- The issue was caused by policies checking the profiles table recursively
--
-- ERROR WAS: infinite recursion detected in policy for relation "profiles"
--
-- SOLUTION: Drop existing problematic policies and recreate them without recursion
-- ============================================================================

-- Step 1: Drop all existing RLS policies on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can do anything on profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile and admins can read all" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- Step 2: Drop policies on other tables that reference profiles (to avoid recursion)
DROP POLICY IF EXISTS "All users can read products" ON products;
DROP POLICY IF EXISTS "Service role can insert products" ON products;
DROP POLICY IF EXISTS "Service role can update products" ON products;
DROP POLICY IF EXISTS "Service role can delete products" ON products;

DROP POLICY IF EXISTS "All users can read product images" ON product_images;
DROP POLICY IF EXISTS "Service role can insert product images" ON product_images;
DROP POLICY IF EXISTS "Service role can update product images" ON product_images;
DROP POLICY IF EXISTS "Service role can delete product images" ON product_images;

DROP POLICY IF EXISTS "All users can read categories" ON categories;
DROP POLICY IF EXISTS "Service role can insert categories" ON categories;
DROP POLICY IF EXISTS "Service role can update categories" ON categories;
DROP POLICY IF EXISTS "Service role can delete categories" ON categories;

DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Service role can read all orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own pending orders" ON orders;
DROP POLICY IF EXISTS "Service role can update any order" ON orders;
DROP POLICY IF EXISTS "Service role can delete orders" ON orders;

DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
DROP POLICY IF EXISTS "Service role can read all order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Service role can update order items" ON order_items;
DROP POLICY IF EXISTS "Service role can delete order items" ON order_items;

DROP POLICY IF EXISTS "Users can read own service requests" ON service_requests;
DROP POLICY IF EXISTS "Service role can read all service requests" ON service_requests;
DROP POLICY IF EXISTS "Users can insert own service requests" ON service_requests;
DROP POLICY IF EXISTS "Users can update own pending service requests" ON service_requests;
DROP POLICY IF EXISTS "Service role can update any service request" ON service_requests;
DROP POLICY IF EXISTS "Service role can delete service requests" ON service_requests;

DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Service role can read all messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can update own messages" ON messages;
DROP POLICY IF EXISTS "Service role can update any message" ON messages;
DROP POLICY IF EXISTS "Service role can delete messages" ON messages;

-- ============================================================================
-- NEW RLS POLICIES - WITHOUT RECURSION
-- ============================================================================

-- PROFILES - New policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Service role can do anything on profiles"
  ON profiles
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PRODUCTS - New policies
CREATE POLICY "All users can read products"
  ON products FOR SELECT
  USING (TRUE);

CREATE POLICY "Service role can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'service_role');

-- PRODUCT_IMAGES - New policies
CREATE POLICY "All users can read product images"
  ON product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Service role can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update product images"
  ON product_images FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete product images"
  ON product_images FOR DELETE
  USING (auth.role() = 'service_role');

-- CATEGORIES - New policies
CREATE POLICY "All users can read categories"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Service role can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'service_role');

-- ORDERS - New policies
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can read all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update any order"
  ON orders FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete orders"
  ON orders FOR DELETE
  USING (auth.role() = 'service_role');

-- ORDER_ITEMS - New policies
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can read all order items"
  ON order_items FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can update order items"
  ON order_items FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete order items"
  ON order_items FOR DELETE
  USING (auth.role() = 'service_role');

-- SERVICE_REQUESTS - New policies
CREATE POLICY "Users can read own service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can read all service requests"
  ON service_requests FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert own service requests"
  ON service_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending service requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update any service request"
  ON service_requests FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete service requests"
  ON service_requests FOR DELETE
  USING (auth.role() = 'service_role');

-- MESSAGES - New policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can read all messages"
  ON messages FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id AND is_read = FALSE)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update any message"
  ON messages FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- All policies have been recreated without recursion
-- Signup should now work without infinite recursion error
-- ============================================================================
