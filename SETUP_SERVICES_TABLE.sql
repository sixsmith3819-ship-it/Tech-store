-- ============================================================================
-- STEP 1: Run this entire script in Supabase SQL Editor
-- ============================================================================

-- Create services table (if not exists)
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

CREATE INDEX IF NOT EXISTS idx_services_service_type ON services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow all users to read active services
DROP POLICY IF EXISTS "All users can read active services" ON services;
CREATE POLICY "All users can read active services"
  ON services FOR SELECT
  USING (status = 'active');

-- Allow service role to manage services
DROP POLICY IF EXISTS "Service role can insert services" ON services;
CREATE POLICY "Service role can insert services"
  ON services FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can update services" ON services;
CREATE POLICY "Service role can update services"
  ON services FOR UPDATE
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can delete services" ON services;
CREATE POLICY "Service role can delete services"
  ON services FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 2: Insert sample services data
-- ============================================================================

INSERT INTO services (name, description, detailed_description, price, service_type, image_url, status) VALUES
  (
    'CCTV Installation',
    'Professional CCTV system installation with setup and configuration',
    'Complete CCTV installation service including site assessment, camera placement, wiring, DVR/NVR setup, and testing. Includes 1 year warranty.',
    299.99,
    'cctv_installation',
    'https://via.placeholder.com/400x300?text=CCTV+Installation',
    'active'
  ),
  (
    'Starlink Installation',
    'Professional Starlink satellite internet setup',
    'Expert installation of Starlink satellite dish, routers, and connection optimization for maximum performance. Includes roof mounting and weather sealing.',
    399.99,
    'starlink_installation',
    'https://via.placeholder.com/400x300?text=Starlink+Setup',
    'active'
  ),
  (
    'Network Installation',
    'Complete network infrastructure setup and configuration',
    'Design and installation of enterprise-grade network infrastructure including cabling, switches, firewalls, and access points.',
    599.99,
    'networking_installation',
    'https://via.placeholder.com/400x300?text=Network+Installation',
    'active'
  ),
  (
    'Network Cabinet Setup',
    'Professional network cabinet installation and organization',
    'Installation, cabling organization, and labeling of network equipment in standard 19 inch racks. Includes cable management and documentation.',
    249.99,
    'network_cabinet',
    'https://via.placeholder.com/400x300?text=Network+Cabinet',
    'active'
  ),
  (
    'WiFi Network Setup',
    'WiFi installation and optimization for homes and offices',
    'Professional WiFi network design, access point installation, and optimization for coverage and performance across your facility.',
    199.99,
    'wifi_setup',
    'https://via.placeholder.com/400x300?text=WiFi+Setup',
    'active'
  ),
  (
    'System Maintenance',
    'Ongoing system maintenance and support package',
    'Monthly maintenance service including system checks, security updates, performance optimization, and technical support. 24/7 emergency support included.',
    149.99,
    'maintenance',
    'https://via.placeholder.com/400x300?text=System+Maintenance',
    'active'
  ),
  (
    'Consulting Service',
    'Expert technical consulting for enterprise solutions',
    'Expert consultation for network planning, security assessment, infrastructure design, and technology recommendations tailored to your business needs.',
    499.99,
    'other',
    'https://via.placeholder.com/400x300?text=IT+Consulting',
    'active'
  );

-- Verify the insert
SELECT COUNT(*) as total_services, COUNT(CASE WHEN status = 'active' THEN 1 END) as active_services FROM services;
