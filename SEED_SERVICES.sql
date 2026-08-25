-- Seed Services Data
-- Insert sample services for the services catalog

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
