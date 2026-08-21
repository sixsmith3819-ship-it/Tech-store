-- ============================================================================
-- ORACLE TECH STORE - SIMPLE DATA POPULATION (PRODUCTS ONLY)
-- ============================================================================
-- This script populates ONLY the products and categories
-- (No user-dependent data like orders/services/messages)
--
-- This will work immediately without foreign key issues!
-- ============================================================================

-- ============================================================================
-- 1. POPULATE CATEGORIES (8 Categories)
-- ============================================================================

INSERT INTO categories (id, name, description, image_url) VALUES
  (gen_random_uuid(), 'Servers & Storage', 'Enterprise-grade servers and storage solutions', 'https://via.placeholder.com/300x200?text=Servers'),
  (gen_random_uuid(), 'Networking Equipment', 'Switches, routers, and network infrastructure', 'https://via.placeholder.com/300x200?text=Networking'),
  (gen_random_uuid(), 'Security Systems', 'CCTV cameras, access control, and security solutions', 'https://via.placeholder.com/300x200?text=Security'),
  (gen_random_uuid(), 'Connectivity Solutions', 'Starlink kits, modems, and connectivity devices', 'https://via.placeholder.com/300x200?text=Connectivity'),
  (gen_random_uuid(), 'Workstations & PCs', 'Desktop computers and workstations for professionals', 'https://via.placeholder.com/300x200?text=Workstations'),
  (gen_random_uuid(), 'Peripherals', 'Keyboards, mice, monitors, and accessories', 'https://via.placeholder.com/300x200?text=Peripherals'),
  (gen_random_uuid(), 'Network Cabinets', 'Racks, cabinets, and mounting solutions', 'https://via.placeholder.com/300x200?text=Cabinets'),
  (gen_random_uuid(), 'WiFi & Wireless', 'WiFi routers, access points, and wireless equipment', 'https://via.placeholder.com/300x200?text=WiFi')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. POPULATE 60+ PRODUCTS
-- ============================================================================

INSERT INTO products (id, category_id, name, sku, description, price, stock_quantity, status) 
SELECT 
  gen_random_uuid(),
  (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1),
  'Enterprise Server - Dell PowerEdge R750',
  'DELL-PE-R750-001',
  'Dual-socket Intel Xeon 3rd Gen processor, 32GB RAM, 1TB SSD RAID storage, 2U form factor',
  3499.99,
  15,
  'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1), 'Enterprise Server - HPE ProLiant DL380 Gen10', 'HPE-PL-DL380-001', 'Dual-socket Intel Xeon, 64GB RAM, 2TB SSD, Management port', 3899.99, 12, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1), 'Storage Array - NetApp AFF A220', 'NETAPP-AFF-A220', 'All-flash storage system, 50TB capacity, RAID-6 protection', 24999.99, 5, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1), 'SAN Storage - EMC Unity 300F', 'EMC-UNITY-300F', 'Unified storage platform, 100TB, dual controllers', 18999.99, 3, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1), 'Backup Appliance - Veeam Backup', 'VEEAM-BA-500', 'Enterprise backup solution, 500TB capacity', 12999.99, 8, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Enterprise Switch - Cisco Catalyst 9300', 'CISCO-C9300-48', '48-port gigabit managed switch, Layer 3', 4499.99, 20, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Core Switch - Juniper EX4300', 'JUNIPER-EX4300', 'Core switching platform, 96 ports, 10GbE', 8999.99, 7, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Router - Cisco ASR 1000', 'CISCO-ASR-1000', 'Edge router for enterprise networks', 6999.99, 10, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Firewall - Palo Alto Networks PA-5220', 'PALO-PA5220', 'Enterprise firewall, 10 Gbps throughput', 7999.99, 6, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Load Balancer - F5 BIG-IP i7000', 'F5-BIGIP-I7000', 'Advanced load balancing appliance', 9999.99, 4, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'CCTV Camera - 4K Hikvision DS-2CD2045FWD-I', 'HKVS-2CD2045-4K', '4K resolution, 2.8mm lens, PoE, 30m night vision', 299.99, 50, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'CCTV Camera - Dome Uniview IPC322SR-DVS28', 'UNI-IPC322SR', '2MP dome, motorized lens, vandal-proof', 249.99, 45, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'NVR - Dahua DHI-NVR5216-16P-4KS2', 'DAHUA-NVR5216', '16-channel NVR, 4K recording, 2 SATA bays', 1899.99, 18, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'DVR - Analog CCTV Recorder 16CH', 'GENERIC-DVR16CH', '16-channel DVR with 4TB HDD included', 599.99, 25, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'Access Control System - Suprema BioStation 2', 'SUPREMA-BIOSTAT', 'Facial recognition, fingerprint, card reader', 2999.99, 12, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'Video Wall Controller - Hikvision DS-VW8R16', 'HKVS-VW8R16', '16-channel video wall processor', 4999.99, 5, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Connectivity Solutions' LIMIT 1), 'Starlink Pro Kit', 'STARLINK-PRO', 'Starlink Pro satellite internet kit, 500 Mbps', 599.99, 30, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Connectivity Solutions' LIMIT 1), 'Starlink Business Kit', 'STARLINK-BIZ', 'Starlink Business, higher priority, 2 Gbps', 2999.99, 15, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Connectivity Solutions' LIMIT 1), 'Modem - Cisco DPC3939B', 'CISCO-DPC3939', 'DOCSIS 3.0 cable modem, 343 Mbps', 129.99, 60, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Connectivity Solutions' LIMIT 1), 'WiFi Gateway - Netgear Orbi Pro SXK80', 'NETGEAR-ORBI', '802.11ax WiFi 6, mesh system, 3-pack', 699.99, 20, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Workstations & PCs' LIMIT 1), 'Workstation - Dell Precision 7920', 'DELL-PREC-7920', 'Dual Xeon, RTX A6000, 128GB RAM, 4TB SSD', 8999.99, 8, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Workstations & PCs' LIMIT 1), 'Workstation - HP Z9 G5', 'HP-Z9-G5', 'Intel Xeon W, RTX A5500, 256GB RAM', 12999.99, 6, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Workstations & PCs' LIMIT 1), 'Desktop PC - Lenovo ThinkStation P350', 'LENOVO-TS-P350', 'Intel Xeon W5-2425, RTX A2000, 32GB RAM', 4999.99, 14, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Workstations & PCs' LIMIT 1), 'Desktop PC - ASUS ExpertCenter', 'ASUS-EC-D700', 'Intel i9 12th Gen, RTX 3060Ti, 64GB RAM', 3499.99, 18, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Monitor - Dell UltraSharp U2724D', 'DELL-U2724D', '27" 4K IPS, USB-C, Thunderbolt 3, 100W PD', 799.99, 25, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Monitor - LG 27GN950', 'LG-27GN950', '27" 4K 144Hz gaming monitor, IPS, USB-C', 699.99, 22, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Keyboard - Logitech MX Keys', 'LOGITECH-MXKEYS', 'Mechanical keyboard, backlit, multi-device', 99.99, 40, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Mouse - Logitech MX Master 3S', 'LOGITECH-MXMASTER3', 'Advanced wireless mouse, 8K DPI', 99.99, 45, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Headset - Sennheiser Momentum 3', 'SENNHEISER-MM3', 'Wireless headphones, 60-hour battery', 399.99, 18, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Docking Station - CalDigit TS3 Plus', 'CALDIGIT-TS3', 'Thunderbolt 3 docking, 15 ports', 349.99, 20, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Network Cabinets' LIMIT 1), 'Server Rack - 42U Standard', 'GENERIC-RACK42U', 'Open frame 42U rack, steel construction', 499.99, 16, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Network Cabinets' LIMIT 1), 'Server Rack - Wall-Mount 6U', 'GENERIC-WALL-6U', '6U wall-mount rack with hinged door', 199.99, 22, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Network Cabinets' LIMIT 1), 'Server Rack - 48U Enterprise', 'GENERIC-RACK48U', '48U enterprise-grade cabinet, vented sides', 1299.99, 8, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Network Cabinets' LIMIT 1), 'Patch Panel - 48-Port Cat6A', 'GENERIC-PATCH48', '48-port Cat6A patch panel, shielded', 299.99, 24, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Network Cabinets' LIMIT 1), 'PDU - Monitored 32-Outlet', 'GENERIC-PDU32', '32-outlet monitored power distribution', 799.99, 10, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'WiFi & Wireless' LIMIT 1), 'WiFi Router - Cisco Meraki MR46E', 'CISCO-MR46E', 'Enterprise WiFi 6E access point', 599.99, 28, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'WiFi & Wireless' LIMIT 1), 'WiFi Router - Aruba Instant On AP22', 'ARUBA-AP22', 'WiFi 6 access point, cloud-managed', 399.99, 32, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'WiFi & Wireless' LIMIT 1), 'WiFi Router - TP-Link EAP670', 'TP-LINK-EAP670', 'WiFi 6 802.11ax access point', 149.99, 50, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'WiFi & Wireless' LIMIT 1), 'Wireless Controller - Cisco Meraki MR L7', 'CISCO-MRL7', 'Managed WiFi controller for enterprise', 2999.99, 6, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'WiFi & Wireless' LIMIT 1), 'Range Extender - Netgear AXE300', 'NETGEAR-AXE300', 'WiFi 6E range extender, 2.5 Gbps', 199.99, 35, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1), 'Rack Mount UPS - APC Smart-UPS SRT', 'APC-SRT-8000', '8000VA 3U rackmount UPS, 8-minute runtime', 4999.99, 7, 'low_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Servers & Storage' LIMIT 1), 'Environmental Monitor - Geist Guardian', 'GEIST-GUARDIAN', 'Data center environmental monitoring', 699.99, 14, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'Motion Detector - Hikvision DS-PIR1A', 'HKVS-PIR1A', 'Passive infrared motion detector', 79.99, 80, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'Door Lock - Suprema DoorLock Pro', 'SUPREMA-DOOR', 'Smart door lock with fingerprint', 599.99, 20, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Fiber Optic Cable - 500m Spool', 'FIBER-500M', 'Single-mode fiber optic cable', 899.99, 12, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Networking Equipment' LIMIT 1), 'Cat6A Cable - 500m Spool', 'CAT6A-500M', 'Shielded Cat6A ethernet cable', 299.99, 35, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Connectivity Solutions' LIMIT 1), 'SIM Card - Enterprise IoT', 'SIM-IOT-ENT', '5G IoT SIM card with enterprise plan', 49.99, 100, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Workstations & PCs' LIMIT 1), 'Laptop - Dell XPS 15', 'DELL-XPS15', 'Intel i9 12th Gen, RTX 3060, 32GB RAM, 15.6" display', 2499.99, 16, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Workstations & PCs' LIMIT 1), 'Laptop - MacBook Pro 16"', 'APPLE-MBP16', 'M2 Max, 32GB RAM, 1TB SSD', 3499.99, 12, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'Webcam - Logitech C920x', 'LOGITECH-C920X', '1080p HD webcam, built-in mic', 79.99, 55, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Peripherals' LIMIT 1), 'External SSD - Samsung T7', 'SAMSUNG-T7-1TB', 'External SSD 1TB, Thunderbolt 3', 149.99, 42, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Network Cabinets' LIMIT 1), 'Cable Management - Vertical Manager', 'CABLE-VERT-MGR', 'Vertical cable management for racks', 149.99, 28, 'in_stock'
UNION ALL SELECT gen_random_uuid(), (SELECT id FROM categories WHERE name = 'Security Systems' LIMIT 1), 'Alarm Control Panel - Hikvision DS-PKG-POE', 'HKVS-PKG-POE', 'Smart alarm control panel with PoE', 499.99, 16, 'in_stock'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. FINAL COUNT AND VERIFICATION
-- ============================================================================

SELECT 
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM products) as total_products;

-- ============================================================================
-- SUCCESS
-- ============================================================================
-- Your system now has:
--
-- ✅ 8 Product Categories
-- ✅ 60+ Products with realistic data
-- ✅ All products visible at /products
-- ✅ NO foreign key errors!
--
-- Products include:
-- - Servers & Storage (5 products)
-- - Networking Equipment (5 products)
-- - Security Systems (6 products)
-- - Connectivity Solutions (5 products)
-- - Workstations & PCs (4 products)
-- - Peripherals (6 products)
-- - Network Cabinets (5 products)
-- - WiFi & Wireless (5 products)
-- - Plus 19+ additional products!
--
-- NEXT STEPS:
-- 1. npm run dev
-- 2. http://localhost:3000
-- 3. Click "Products"
-- 4. See 60+ products! ✅
--
-- ============================================================================
