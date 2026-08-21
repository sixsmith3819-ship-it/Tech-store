# Oracle Tech Store - Database Documentation

## Overview

The Oracle Tech Store uses a **PostgreSQL database on Supabase** with comprehensive Row-Level Security (RLS) policies to ensure data protection and enforce business rules.

## Database Schema

### 1. Profiles Table
**Purpose:** Store user information and roles

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, references auth.users(id) |
| email | TEXT | Unique, from auth system |
| full_name | TEXT | User's full name |
| phone | TEXT | Phone number (optional) |
| address | TEXT | Delivery address (optional) |
| role | TEXT | 'customer' or 'admin' |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modifications |

**Addresses Objective:** 5 (Authentication & Communication)

---

### 2. Categories Table
**Purpose:** Product categories for organization

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | TEXT | Unique category name |
| description | TEXT | Category description (optional) |
| image_url | TEXT | Category image URL (optional) |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modifications |

**Addresses Objective:** 1 (Product Catalogue), 3 (Product Management)

**Example Data:**
- Laptops
- Networking Equipment
- Wi-Fi & Extenders
- Starlink
- Network Cabinets
- Security & CCTV
- Accessories

---

### 3. Products Table
**Purpose:** Product catalog with inventory management

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| category_id | UUID | Foreign key to categories |
| name | TEXT | Product name |
| sku | TEXT | Stock keeping unit (unique) |
| description | TEXT | Product description |
| price | DECIMAL | Price (must be > 0) |
| stock_quantity | INTEGER | Available quantity (>= 0) |
| status | TEXT | 'in_stock', 'low_stock', 'out_of_stock' |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modifications |

**Indexes:**
- `idx_products_category_id` - Fast category filtering
- `idx_products_status` - Quick status lookups
- `idx_products_sku` - SKU uniqueness enforcement

**Addresses Objective:** 1 (Product Catalogue), 3 (Product Management)

---

### 4. Product Images Table
**Purpose:** Multiple images per product with ordering

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| product_id | UUID | Foreign key to products |
| image_url | TEXT | URL to product image |
| alt_text | TEXT | Alt text for accessibility (optional) |
| display_order | INTEGER | Order for display (default 0) |
| created_at | TIMESTAMP | Auto-set on creation |

**Indexes:**
- `idx_product_images_product_id` - Fast product lookup
- `idx_product_images_display_order` - Ordered display

**Addresses Objective:** 1 (Product Catalogue), 3 (Product Management)

---

### 5. Orders Table
**Purpose:** Customer orders with status tracking

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| order_number | TEXT | Unique order identifier (e.g., ORD-123456) |
| customer_email | TEXT | Customer email at time of order |
| customer_phone | TEXT | Customer phone at time of order |
| delivery_address | TEXT | Delivery address |
| additional_instructions | TEXT | Special instructions (optional) |
| total_amount | DECIMAL | Order total (must be >= 0) |
| status | TEXT | See Order Statuses below |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modifications |

**Status Values:**
- `pending` - Order awaiting confirmation
- `confirmed` - Order confirmed by admin
- `processing` - Order being prepared
- `ready_for_delivery` - Order ready to ship
- `out_for_delivery` - Order in transit
- `completed` - Order delivered
- `cancelled` - Order cancelled

**Indexes:**
- `idx_orders_user_id` - User order lookup
- `idx_orders_status` - Status filtering
- `idx_orders_created_at` - Date-based queries
- `idx_orders_order_number` - Order number lookup

**Addresses Objective:** 2 (Online Ordering), 5 (Order Tracking)

---

### 6. Order Items Table
**Purpose:** Individual items within an order

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| order_id | UUID | Foreign key to orders |
| product_id | UUID | Foreign key to products |
| product_name | TEXT | Product name (snapshot) |
| quantity | INTEGER | Quantity ordered (must be > 0) |
| unit_price | DECIMAL | Price per unit at time of order |
| total_price | DECIMAL | Calculated total (must be > 0) |
| created_at | TIMESTAMP | Auto-set on creation |

**Indexes:**
- `idx_order_items_order_id` - Order lookup
- `idx_order_items_product_id` - Product sales tracking

**Addresses Objective:** 2 (Online Ordering), 5 (Order Tracking)

---

### 7. Service Requests Table
**Purpose:** Technical service requests tracking

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| service_request_number | TEXT | Unique identifier (e.g., SRV-123456) |
| service_type | TEXT | Type of service requested |
| customer_name | TEXT | Customer name |
| customer_email | TEXT | Customer email |
| customer_phone | TEXT | Customer phone |
| address | TEXT | Service location |
| preferred_date | DATE | Preferred service date (optional) |
| preferred_time | TEXT | Preferred time (optional) |
| description | TEXT | Service details/requirements |
| status | TEXT | See Service Statuses below |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modifications |

**Service Type Values:**
- `cctv_installation` - CCTV system installation
- `starlink_installation` - Starlink Mini Kit installation
- `networking_installation` - Network infrastructure setup
- `network_cabinet` - Network cabinet installation
- `wifi_setup` - Wi-Fi system setup
- `other` - Other technical services

**Service Status Values:**
- `pending` - Request received, awaiting review
- `reviewed` - Admin has reviewed request
- `scheduled` - Service scheduled
- `in_progress` - Service being performed
- `completed` - Service completed
- `cancelled` - Request cancelled

**Indexes:**
- `idx_service_requests_user_id` - User requests
- `idx_service_requests_status` - Status filtering
- `idx_service_requests_service_type` - Service type filtering
- `idx_service_requests_created_at` - Date-based queries
- `idx_service_requests_service_request_number` - SR number lookup

**Addresses Objective:** 4 (Service Request System)

---

### 8. Messages Table
**Purpose:** Customer-admin communication

**Columns:**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users (customer) |
| admin_id | UUID | Foreign key to auth.users (admin, optional) |
| subject | TEXT | Message subject |
| body | TEXT | Message content |
| message_type | TEXT | Type of message |
| related_order_id | UUID | Foreign key to orders (optional) |
| related_service_request_id | UUID | Foreign key to service_requests (optional) |
| is_read | BOOLEAN | Read status (default false) |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modifications |

**Message Type Values:**
- `general` - General inquiry
- `order` - Order-related message
- `service_request` - Service request message
- `product` - Product inquiry

**Indexes:**
- `idx_messages_user_id` - User messages
- `idx_messages_admin_id` - Admin messages
- `idx_messages_related_order_id` - Order-related messages
- `idx_messages_related_service_request_id` - Service-related messages
- `idx_messages_is_read` - Unread message filtering
- `idx_messages_created_at` - Date-based queries

**Addresses Objective:** 5 (Customer Communication)

---

## Row-Level Security (RLS) Policies

All tables have RLS enabled to enforce data access control at the database level.

### Profiles RLS
- Users can read their own profile
- Admins can read all profiles
- Users can only update their own profile

### Products & Categories RLS
- All users can read (public browsing)
- Only admins can insert, update, delete

### Product Images RLS
- All users can read
- Only admins can manage

### Orders & Order Items RLS
- Users can read their own orders
- Admins can read all orders
- Users can insert their own orders
- Users can update/delete their pending orders
- Admins can update any order status
- Only admins can delete orders

### Service Requests RLS
- Users can read their own requests
- Admins can read all requests
- Users can insert their own requests
- Users can update/delete their pending requests
- Admins can update any request status
- Only admins can delete requests

### Messages RLS
- Users can read their own messages
- Admins can read all messages
- Users can insert messages
- Users can update their unread messages
- Admins can update any message
- Only admins can delete messages

---

## Database Relationships

```
auth.users
├── profiles (1:1)
├── orders (1:N)
│   └── order_items (1:N)
│       └── products (N:1)
├── service_requests (1:N)
└── messages (1:N)

categories (1:N)
├── products (1:N)
│   └── product_items (1:N)
│   └── product_images (1:N)
```

---

## Key Features

### Automatic Timestamps
All tables with `created_at` and `updated_at` columns have triggers that:
- Set `created_at` on INSERT
- Update `updated_at` on any UPDATE

### Data Validation
- Prices must be positive
- Stock quantities must be non-negative
- Order amounts must be non-negative
- Product SKUs are unique
- Order numbers are unique
- Service request numbers are unique

### Foreign Key Constraints
- Cascading deletes where appropriate (categories → products)
- SET NULL for admin references (if admin deleted)

### Performance Indexes
- All frequently queried fields have indexes
- Foreign keys are indexed automatically
- Status fields indexed for filtering
- Date fields indexed for range queries

---

## Usage Examples

### Get all products in a category
```sql
SELECT * FROM products 
WHERE category_id = 'category-uuid'
ORDER BY name;
```

### Get customer orders with items
```sql
SELECT o.*, COUNT(oi.id) as item_count, SUM(oi.total_price) as total
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 'user-uuid'
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### Get pending service requests for admin
```sql
SELECT * FROM service_requests
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Get unread messages for user
```sql
SELECT COUNT(*) as unread_count FROM messages
WHERE user_id = 'user-uuid' AND is_read = FALSE;
```

---

## Best Practices

1. **Always use prepared statements** when querying from client code
2. **Never expose service_role key** to frontend - use it only on backend
3. **Test RLS policies** in different user contexts
4. **Monitor slow queries** in Supabase dashboard
5. **Keep backups** of critical data
6. **Use indexes** for frequently filtered fields
7. **Validate data** before INSERT/UPDATE
8. **Handle errors gracefully** in application code

---

## Maintenance

### Regular Tasks
- Monitor database size and storage usage
- Review slow query logs
- Backup critical tables
- Clean up old deleted records if soft-delete is implemented
- Monitor RLS performance

### Scaling Considerations
- Add more indexes as query patterns emerge
- Consider materialized views for complex queries
- Archive old orders/service requests if needed
- Monitor connection limits

---

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Policies enforce user isolation
- ✅ Admin operations require role verification
- ✅ Sensitive data (passwords) not stored in profiles
- ✅ Foreign key constraints prevent orphaned records
- ✅ Unique constraints prevent duplicates
- ✅ Check constraints enforce valid data
- ✅ Indexes prevent full table scans
- ✅ Timestamps track data changes
- ✅ service_role key never exposed to client

---

## Support

For SQL documentation: https://www.postgresql.org/docs/
For Supabase: https://supabase.com/docs/guides/database
