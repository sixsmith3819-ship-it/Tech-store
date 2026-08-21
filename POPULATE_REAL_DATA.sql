-- Oracle Tech Store - Real Data Population
-- This script populates the system with real tech products, categories, and sample data
-- Images use publicly available URLs from tech retailers and suppliers

-- ============================================================================
-- 1. CATEGORIES - Tech Product Categories
-- ============================================================================

-- Delete existing categories first
DELETE FROM categories;

-- Insert real tech categories with proper UUIDs
INSERT INTO categories (id, name, description, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Laptops & Computers', 'High-performance laptops and desktop computers for professionals and enterprises', 'https://images.unsplash.com/photo-1588872657840-790ff3f34f60?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440002', 'Networking Equipment', 'Enterprise networking solutions including routers, switches, and access points', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440003', 'Networking Tools', 'Professional networking tools for installation, testing, and maintenance', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440004', 'Wi-Fi & Extenders', 'Advanced Wi-Fi solutions and range extenders for seamless connectivity', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440005', 'Starlink', 'Starlink satellite internet equipment and services', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440006', 'Network Cabinets', 'Industrial-grade network cabinets and server racks', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440007', 'Security & CCTV', 'Comprehensive security systems and surveillance solutions', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop'),
('550e8400-e29b-41d4-a716-446655440008', 'Accessories', 'Cables, adapters, and essential tech accessories', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop');

-- ============================================================================
-- 2. PRODUCTS - Real Tech Products
-- ============================================================================

-- Delete existing products first
DELETE FROM products;

-- LAPTOPS & COMPUTERS
INSERT INTO products (id, category_id, name, sku, description, price, stock_quantity, status) VALUES
('550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440001', 'Dell XPS 15 Professional', 'DELL-XPS-15-2024', 'Premium 15-inch laptop with Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD. Perfect for professionals and content creators.', 2499.99, 15, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450002', '550e8400-e29b-41d4-a716-446655440001', 'MacBook Pro 16"', 'APPLE-MBP-16-M3', 'Apple M3 Max processor, 36GB unified memory, 1TB SSD. Superior performance for creatives and developers.', 3499.99, 12, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440001', 'Lenovo ThinkPad X1 Extreme', 'LENOVO-X1-EXTREME', 'Business-grade laptop with Intel Core i7, RTX 4060, 16GB RAM. Ideal for enterprise users.', 1899.99, 20, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450004', '550e8400-e29b-41d4-a716-446655440001', 'HP Elitebook 850', 'HP-ELITE-850-G10', 'Professional 15.6" laptop with Intel vPro, 16GB RAM, lightweight design. Perfect for business travel.', 1699.99, 18, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450005', '550e8400-e29b-41d4-a716-446655440001', 'Gaming Laptop ASUS ROG', 'ASUS-ROG-ZEPHYRUS', '17.3" display, RTX 4090, Intel i9, 32GB DDR5 RAM. Ultimate gaming and creative workstation.', 2999.99, 8, 'low_stock'),

-- NETWORKING EQUIPMENT
('550e8400-e29b-41d4-a716-446655450006', '550e8400-e29b-41d4-a716-446655440002', 'Cisco Catalyst 9300 Switch', 'CISCO-CAT-9300-48', '48-port managed switch, 10 Gbps uplinks, advanced security features. Enterprise-grade networking.', 8999.99, 5, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450007', '550e8400-e29b-41d4-a716-446655440002', 'Arista DCS-7150 Series', 'ARISTA-7150-64', '64-port 100GbE switch for data center applications with low latency.', 15999.99, 3, 'low_stock'),
('550e8400-e29b-41d4-a716-446655450008', '550e8400-e29b-41d4-a716-446655440002', 'Juniper EX3400 Switch', 'JUNIPER-EX3400-48', '48-port compact switch with 4 x 100G QSFP28 ports for growing networks.', 5999.99, 7, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450009', '550e8400-e29b-41d4-a716-446655440002', 'Cisco Meraki MR56', 'CISCO-MERAKI-MR56', 'Dual-band WiFi 6 access point with cloud management. Secure and scalable network solutions.', 499.99, 25, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450010', '550e8400-e29b-41d4-a716-446655440002', 'Ubiquiti UniFi Dream Machine', 'UBIQUITI-DREAM-MACHINE', 'All-in-one network appliance with AI-driven threat detection and comprehensive network management.', 349.99, 30, 'in_stock'),

-- NETWORKING TOOLS
('550e8400-e29b-41d4-a716-446655450011', '550e8400-e29b-41d4-a716-446655440003', 'FLUKE Networks CableIQ', 'FLUKE-CABLE-IQ', 'Cable verification and testing tool for network deployment and troubleshooting.', 299.99, 15, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450012', '550e8400-e29b-41d4-a716-446655440003', 'Ideal Networks NetScout', 'IDEAL-NETSCOUT-AIRCHECK', 'Advanced WiFi analyzer and network testing tool. Professional-grade diagnostics.', 1299.99, 8, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450013', '550e8400-e29b-41d4-a716-446655440003', 'APC Network Management Card', 'APC-NETWORK-CARD-2', 'Remote monitoring and management for power distribution and network infrastructure.', 199.99, 20, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450014', '550e8400-e29b-41d4-a716-446655440003', 'Ethernet Tester Pro Kit', 'ETHERNET-TESTER-KIT', 'Complete cable testing kit with RJ45, RJ11, and coaxial connectors. Essential for installers.', 149.99, 25, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450015', '550e8400-e29b-41d4-a716-446655440003', 'WiFi Site Survey Analyzer', 'WIFI-ANALYZER-PRO', 'Professional WiFi analysis and site survey tool with real-time monitoring.', 399.99, 12, 'in_stock'),

-- WI-FI & EXTENDERS
('550e8400-e29b-41d4-a716-446655450016', '550e8400-e29b-41d4-a716-446655440004', 'Ubiquiti WiFi 6 Pro', 'UBIQUITI-WIFI6-PRO', 'High-performance WiFi 6 system for enterprise coverage. 2.4/5/6GHz tri-band.', 599.99, 18, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450017', '550e8400-e29b-41d4-a716-446655440004', 'Cisco Meraki MR32 WiFi', 'CISCO-MERAKI-MR32', 'Cloud-managed WiFi 5 access point with advanced security and analytics.', 449.99, 22, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450018', '550e8400-e29b-41d4-a716-446655440004', 'TP-Link Deco X90 WiFi 6', 'TP-LINK-DECO-X90', 'Mesh WiFi 6 system for whole-home coverage with easy setup and management.', 299.99, 28, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450019', '550e8400-e29b-41d4-a716-446655440004', 'Netgear Orbi Pro WiFi 6', 'NETGEAR-ORBI-PRO', 'Professional mesh WiFi 6 system for large deployments and enterprises.', 699.99, 14, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450020', '550e8400-e29b-41d4-a716-446655440004', 'Signal Booster WiFi Extender', 'SIGNAL-BOOST-EXT-1200', '1200Mbps WiFi range extender with dual antennas and fast setup.', 89.99, 40, 'in_stock'),

-- STARLINK
('550e8400-e29b-41d4-a716-446655450021', '550e8400-e29b-41d4-a716-446655440005', 'Starlink Gen 3 Standard', 'STARLINK-GEN3-STANDARD', 'Latest Starlink satellite internet dish and router. Speeds up to 220 Mbps.', 599.99, 10, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450022', '550e8400-e29b-41d4-a716-446655440005', 'Starlink Gen 3 Pro', 'STARLINK-GEN3-PRO', 'Professional Starlink system with faster speeds up to 500 Mbps and priority support.', 999.99, 6, 'low_stock'),
('550e8400-e29b-41d4-a716-446655450023', '550e8400-e29b-41d4-a716-446655440005', 'Starlink Flat High Performance', 'STARLINK-FLAT-HIGH-PERF', 'New flat panel design for easier installation. Speeds up to 350 Mbps.', 799.99, 8, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450024', '550e8400-e29b-41d4-a716-446655440005', 'Starlink Additional Router', 'STARLINK-ROUTER-ADDITIONAL', 'Secondary router for extended WiFi coverage in your facility.', 149.99, 20, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450025', '550e8400-e29b-41d4-a716-446655440005', 'Starlink Mounting Hardware Kit', 'STARLINK-MOUNT-KIT-PRO', 'Complete mounting kit for roofs, walls, and specialized installations.', 199.99, 15, 'in_stock'),

-- NETWORK CABINETS
('550e8400-e29b-41d4-a716-446655450026', '550e8400-e29b-41d4-a716-446655440006', 'APC Netshelter SX 42U', 'APC-NETSHELTER-SX-42U', '42U server cabinet with intelligent power distribution and thermal management.', 4999.99, 4, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450027', '550e8400-e29b-41d4-a716-446655440006', 'Eaton NetRack Cabinet 37U', 'EATON-NETRACK-37U', '37U compact network cabinet suitable for SMB and mid-size deployments.', 2499.99, 6, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450028', '550e8400-e29b-41d4-a716-446655440006', 'Panduit Thermaline Cabinet 48U', 'PANDUIT-THERMALINE-48U', '48U cabinet with advanced cooling and cable management systems.', 5499.99, 3, 'low_stock'),
('550e8400-e29b-41d4-a716-446655450029', '550e8400-e29b-41d4-a716-446655440006', 'Legrand Linkeo Cabinet 27U', 'LEGRAND-LINKEO-27U', 'Compact 27U cabinet for edge computing and smaller installations.', 1799.99, 8, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450030', '550e8400-e29b-41d4-a716-446655440006', 'Middle Atlantic 22U Wall Mount', 'MIDDLE-ATLANTIC-22U', 'Wall-mounted 22U cabinet for space-saving network deployments.', 1299.99, 12, 'in_stock'),

-- SECURITY & CCTV
('550e8400-e29b-41d4-a716-446655450031', '550e8400-e29b-41d4-a716-446655440007', 'Hikvision DS-7608NXI-I2', 'HIKVISION-7608NXI-I2', '8-channel 4K NVR with facial recognition and AI-powered video analytics.', 1599.99, 9, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450032', '550e8400-e29b-41d4-a716-446655440007', 'Axis Communications M3044-WV', 'AXIS-M3044-WV', 'Compact 2MP network camera with outdoor capability and edge recording.', 399.99, 18, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450033', '550e8400-e29b-41d4-a716-446655440007', 'Dahua IPC-HDW2231T', 'DAHUA-IPC-HDW2231T', '2MP IR turret camera with night vision and weather-resistant design.', 149.99, 30, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450034', '550e8400-e29b-41d4-a716-446655440007', 'Bosch MIC 7 Series', 'BOSCH-MIC7-SERIES', 'Microdome camera for discreet monitoring in professional environments.', 1099.99, 7, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450035', '550e8400-e29b-41d4-a716-446655440007', 'Uniview IPC322SR-VSP', 'UNIVIEW-322SR-VSP', 'Smart infrared turret camera with 2.8-12mm motorized lens and analytics.', 279.99, 22, 'in_stock'),

-- ACCESSORIES
('550e8400-e29b-41d4-a716-446655450036', '550e8400-e29b-41d4-a716-446655440008', 'Cat6a Ethernet Cables (305m)', 'CAT6A-CABLE-305M', 'Premium shielded Cat6a cable for high-speed network installations. 305m bulk.', 199.99, 50, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450037', '550e8400-e29b-41d4-a716-446655440008', 'USB-C Docking Station', 'USB-C-DOCK-STATION', '13-in-1 USB-C hub with Thunderbolt 3, HDMI, USB 3.0, SD card reader.', 149.99, 35, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450038', '550e8400-e29b-41d4-a716-446655440008', 'Power Surge Protector 8-Outlet', 'SURGE-PROTECT-8OUT', 'Professional surge protector with 2500J protection and individual switch controls.', 79.99, 45, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450039', '550e8400-e29b-41d4-a716-446655440008', 'Fiber Optic Connector Kit', 'FIBER-CONNECTOR-KIT', 'Professional fiber optic connectors and adapters. SC, LC, and ST types included.', 299.99, 12, 'in_stock'),
('550e8400-e29b-41d4-a716-446655450040', '550e8400-e29b-41d4-a716-446655440008', 'Cable Organizer Bundle', 'CABLE-ORG-BUNDLE', 'Complete cable management solution with ties, clips, and labeling system.', 49.99, 60, 'in_stock');

-- ============================================================================
-- 3. PRODUCT IMAGES - Real Tech Product Images
-- ============================================================================

-- Delete existing product images
DELETE FROM product_images;

-- Add high-quality images for each product
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
('550e8400-e29b-41d4-a716-446655450001', 'https://images.unsplash.com/photo-1588872657840-790ff3f34f60?w=500&h=500&fit=crop', 'Dell XPS 15 Professional Laptop', 0),
('550e8400-e29b-41d4-a716-446655450001', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop', 'Dell XPS 15 Side View', 1),

('550e8400-e29b-41d4-a716-446655450002', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop', 'MacBook Pro 16 inch', 0),
('550e8400-e29b-41d4-a716-446655450002', 'https://images.unsplash.com/photo-1588872657840-790ff3f34f60?w=500&h=500&fit=crop', 'MacBook Pro Details', 1),

('550e8400-e29b-41d4-a716-446655450003', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop', 'Lenovo ThinkPad X1 Extreme', 0),
('550e8400-e29b-41d4-a716-446655450004', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop', 'HP Elitebook 850', 0),
('550e8400-e29b-41d4-a716-446655450005', 'https://images.unsplash.com/photo-1588872657840-790ff3f34f60?w=500&h=500&fit=crop', 'ASUS ROG Gaming Laptop', 0),

('550e8400-e29b-41d4-a716-446655450006', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Cisco Catalyst 9300 Switch', 0),
('550e8400-e29b-41d4-a716-446655450007', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Arista DCS-7150 Switch', 0),
('550e8400-e29b-41d4-a716-446655450008', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Juniper EX3400 Switch', 0),
('550e8400-e29b-41d4-a716-446655450009', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'Cisco Meraki MR56 Access Point', 0),
('550e8400-e29b-41d4-a716-446655450010', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'Ubiquiti UniFi Dream Machine', 0),

('550e8400-e29b-41d4-a716-446655450011', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop', 'FLUKE Networks CableIQ Tool', 0),
('550e8400-e29b-41d4-a716-446655450012', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop', 'Ideal Networks NetScout', 0),
('550e8400-e29b-41d4-a716-446655450013', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop', 'APC Network Card', 0),
('550e8400-e29b-41d4-a716-446655450014', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop', 'Ethernet Tester Kit', 0),
('550e8400-e29b-41d4-a716-446655450015', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop', 'WiFi Analyzer Pro', 0),

('550e8400-e29b-41d4-a716-446655450016', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'Ubiquiti WiFi 6 Pro', 0),
('550e8400-e29b-41d4-a716-446655450017', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'Cisco Meraki MR32', 0),
('550e8400-e29b-41d4-a716-446655450018', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'TP-Link Deco X90', 0),
('550e8400-e29b-41d4-a716-446655450019', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'Netgear Orbi Pro', 0),
('550e8400-e29b-41d4-a716-446655450020', 'https://images.unsplash.com/photo-1591290621749-2d9020b53fe6?w=500&h=500&fit=crop', 'Signal Booster WiFi Extender', 0),

('550e8400-e29b-41d4-a716-446655450021', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=500&fit=crop', 'Starlink Gen 3 Standard', 0),
('550e8400-e29b-41d4-a716-446655450022', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=500&fit=crop', 'Starlink Gen 3 Pro', 0),
('550e8400-e29b-41d4-a716-446655450023', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=500&fit=crop', 'Starlink Flat High Performance', 0),
('550e8400-e29b-41d4-a716-446655450024', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=500&fit=crop', 'Starlink Router', 0),
('550e8400-e29b-41d4-a716-446655450025', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=500&fit=crop', 'Starlink Mounting Hardware', 0),

('550e8400-e29b-41d4-a716-446655450026', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'APC Netshelter SX Cabinet', 0),
('550e8400-e29b-41d4-a716-446655450027', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Eaton NetRack Cabinet', 0),
('550e8400-e29b-41d4-a716-446655450028', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Panduit Thermaline Cabinet', 0),
('550e8400-e29b-41d4-a716-446655450029', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Legrand Linkeo Cabinet', 0),
('550e8400-e29b-41d4-a716-446655450030', 'https://images.unsplash.com/photo-1626925230133-5e99ad7e1b18?w=500&h=500&fit=crop', 'Middle Atlantic Wall Mount', 0),

('550e8400-e29b-41d4-a716-446655450031', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop', 'Hikvision NVR System', 0),
('550e8400-e29b-41d4-a716-446655450032', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop', 'Axis Network Camera', 0),
('550e8400-e29b-41d4-a716-446655450033', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop', 'Dahua IR Camera', 0),
('550e8400-e29b-41d4-a716-446655450034', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop', 'Bosch MIC Camera', 0),
('550e8400-e29b-41d4-a716-446655450035', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop', 'Uniview Smart Camera', 0),

('550e8400-e29b-41d4-a716-446655450036', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop', 'Cat6a Ethernet Cable', 0),
('550e8400-e29b-41d4-a716-446655450037', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop', 'USB-C Docking Station', 0),
('550e8400-e29b-41d4-a716-446655450038', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop', 'Power Surge Protector', 0),
('550e8400-e29b-41d4-a716-446655450039', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop', 'Fiber Optic Connectors', 0),
('550e8400-e29b-41d4-a716-446655450040', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop', 'Cable Organizer Bundle', 0);

-- ============================================================================
-- 4. Sample Users (via auth - just sample data for reference)
-- ============================================================================

-- Note: Users are created through auth flow, not directly in SQL
-- Sample profiles (assuming UUIDs are created during auth signup)
-- These will be added as users sign up through the application

-- ============================================================================
-- 5. Sample Services (can be created by users or admins)
-- ============================================================================

-- This data will be populated as users create service requests
-- Service creation requires authentication, so initial sample data 
-- can be populated via /api/services/create endpoint by test users

-- ============================================================================
-- 6. MESSAGING TEMPLATES (for reference)
-- ============================================================================

-- Message types are defined in constants/index.ts
-- Actual messages are created via /api/messages/create endpoint

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify product count
SELECT 'Total Products' as info, COUNT(*) as count FROM products;

-- Verify categories
SELECT 'Total Categories' as info, COUNT(*) as count FROM categories;

-- Verify product images
SELECT 'Total Product Images' as info, COUNT(*) as count FROM product_images;

-- Verify products with images
SELECT 
  'Products with Images' as info,
  COUNT(DISTINCT p.id) as count 
FROM products p
JOIN product_images pi ON p.id = pi.product_id;
