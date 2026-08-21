# 📊 Data Population Guide

**Purpose:** Populate your system with realistic sample data for testing  
**Status:** ✅ Ready to run  
**Data Include:** 60+ products, 5 demo users, orders, services, messages

---

## 🚀 Quick Start (3 Steps)

### Step 1: Run RLS Fix (If Not Done)
Make sure you've run `FIX_RLS_RECURSION.sql` first (if you haven't already).

### Step 2: Open Supabase SQL Editor
1. Go to **Supabase Dashboard** → https://app.supabase.com
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 3: Copy & Run Data Population
1. Copy **all content** from `POPULATE_DATA.sql`
2. Paste into SQL Editor
3. Click **Run**
4. ✅ Done! You now have sample data

---

## 📦 What Gets Created

### 1. **8 Product Categories**
- Servers & Storage
- Networking Equipment
- Security Systems
- Connectivity Solutions
- Workstations & PCs
- Peripherals
- Network Cabinets
- WiFi & Wireless

### 2. **60+ Products**
High-quality, realistic product data including:
- **Servers:** Dell, HPE, enterprise-grade
- **Networking:** Cisco, Juniper, firewalls, switches
- **Security:** CCTV, NVR, access control systems
- **Connectivity:** Starlink kits, modems, WiFi
- **Workstations:** Dell, HP, ASUS high-end PCs
- **Peripherals:** Monitors, keyboards, mice, cables
- **Cabinets:** Racks, patch panels, PDUs
- **WiFi:** Enterprise access points, routers

**Each product includes:**
- ✅ Realistic name and description
- ✅ Accurate pricing ($79.99 - $24,999.99)
- ✅ Stock quantities (3-100 units)
- ✅ Stock status (in_stock, low_stock)

### 3. **5 Demo User Accounts**
Ready for testing:
- `customer@example.com` - Customer user
- `admin@example.com` - Admin user
- `manager@example.com` - Customer user
- `tech@example.com` - Customer user
- `support@example.com` - Customer user

**Note:** These profiles are pre-created but you'll need to sign up normally to create auth users.

### 4. **6 Sample Orders**
With different statuses:
- 1 Completed
- 1 Out for Delivery
- 1 Processing
- 1 Confirmed
- 1 Pending
- 1 Ready for Delivery

**Each order includes:**
- Real order numbers (ORD-2024-001, etc.)
- Customer info
- Delivery addresses
- Instructions
- Amounts ($1,599 - $24,999)

### 5. **6 Sample Service Requests**
Different service types:
- CCTV Installation
- Starlink Installation
- Network Installation
- Network Cabinet Setup
- WiFi Setup
- Technical Consulting

**With different statuses:**
- Scheduled
- Pending
- Reviewed
- In Progress
- Completed

### 6. **6 Sample Messages**
Customer-admin conversations:
- Order status questions
- Product inquiries
- Service follow-ups
- Technical support
- Billing questions
- General inquiries

**With:**
- Read/unread status
- Various message types
- Realistic timestamps

---

## 💡 How to Use This Data

### 1. Browse Products
- Visit `/products`
- See 60+ products with real pricing
- Filter by category
- View product details

### 2. Create Orders
- Add products to cart
- Proceed to checkout
- See realistic product data

### 3. View Sample Orders
- Login as customer
- Dashboard → Orders
- See different order statuses
- Click to view details

### 4. Request Services
- Go to `/services`
- See 6 realistic service requests
- Different statuses to understand workflows

### 5. Send Messages
- Click Messages
- See sample conversations
- Understand the message system

### 6. Admin Functions
- Login as admin
- Dashboard shows statistics
- Manage all orders, services, customers
- See messages from customers

---

## 🔧 Testing Scenarios

### Scenario 1: New User Journey
1. Sign up with new account
2. Browse products (60+ available)
3. Add items to cart
4. Checkout and create order
5. View your orders

### Scenario 2: Admin Management
1. Login as admin@example.com
2. View dashboard stats
3. See all orders from customers
4. See all service requests
5. View customer conversations

### Scenario 3: Service Request Process
1. Request a service
2. See different statuses
3. Understand workflows
4. Check service details

### Scenario 4: Customer Communication
1. Send a message
2. See message thread
3. Admin can respond
4. Full conversation flow

---

## 📊 Data Statistics

After running the script:

| Entity | Count | Details |
|--------|-------|---------|
| Categories | 8 | Product categories |
| Products | 60+ | Full product catalog |
| Users | 5 | Demo accounts |
| Orders | 6 | Sample orders |
| Service Requests | 6 | Sample requests |
| Messages | 6 | Sample conversations |

**Total Dataset:** 91+ items ready to test with

---

## 🎯 What To Do Next

### 1. Test Browsing (No Auth Needed)
```
npm run dev
→ http://localhost:3000
→ Click "Products"
→ See 60+ products displayed
```

### 2. Test User Features
```
Sign up as new user
→ Browse products
→ Add to cart
→ Create order
→ View order in dashboard
```

### 3. Test Admin Features
```
Login as admin@example.com
→ Go to /admin/dashboard
→ See statistics
→ Manage orders
→ Manage services
→ View customers
```

### 4. Test Service System
```
Request a service
→ Fill service form
→ See it in services list
→ View service details
```

### 5. Test Messaging
```
Send message
→ See in messages
→ Admin can view
→ Response system works
```

---

## 🚀 Performance Note

With 60+ products and sample data:
- ✅ Product list loads instantly
- ✅ Filters work smoothly
- ✅ Search is responsive
- ✅ Admin dashboard shows stats
- ✅ All features operational

---

## 📝 Product Examples

Here's what you'll see in the product list:

**Servers:**
- Enterprise Server - Dell PowerEdge R750 ($3,499.99)
- Enterprise Server - HPE ProLiant DL380 Gen10 ($3,899.99)
- Storage Array - NetApp AFF A220 ($24,999.99)

**Networking:**
- Enterprise Switch - Cisco Catalyst 9300 ($4,499.99)
- Core Switch - Juniper EX4300 ($8,999.99)
- Firewall - Palo Alto Networks PA-5220 ($7,999.99)

**Security:**
- CCTV Camera - 4K Hikvision ($299.99)
- NVR - Dahua 16-channel ($1,899.99)
- Access Control System ($2,999.99)

**Connectivity:**
- Starlink Pro Kit ($599.99)
- Starlink Business Kit ($2,999.99)

**Workstations:**
- Workstation - Dell Precision 7920 ($8,999.99)
- Laptop - Dell XPS 15 ($2,499.99)
- Laptop - MacBook Pro 16" ($3,499.99)

**And 40+ more products!**

---

## ✅ Verification

After running the script, verify by:

1. **Check Products Dashboard:**
```sql
SELECT COUNT(*) FROM products;
-- Should show: 60+
```

2. **Browse in App:**
```
Visit http://localhost:3000/products
Should see 60+ products with prices
```

3. **Check Sample Orders:**
```sql
SELECT COUNT(*) FROM orders;
-- Should show: 6
```

4. **Check Services:**
```sql
SELECT COUNT(*) FROM service_requests;
-- Should show: 6
```

---

## 🎉 You're Ready!

Your system now has:
- ✅ Full product catalog (60+ items)
- ✅ Real pricing ($79 - $25,000)
- ✅ Sample users (5 accounts)
- ✅ Demo orders (6 orders)
- ✅ Service requests (6 requests)
- ✅ Messages (6 conversations)

**Everything is ready for comprehensive testing!**

---

## 📞 Troubleshooting

### Script Fails to Run?
- Make sure RLS_FIX script ran first
- Check database connection
- Verify you're in SQL Editor (not terminal)

### Products Don't Show?
- Try refreshing browser
- Clear browser cache
- Check database has data: `SELECT COUNT(*) FROM products;`

### Need More Data?
- Duplicate the SQL INSERT statements
- Add more products as needed
- Modify prices/details as desired

### Want to Clean Data?
```sql
-- Delete sample data (keep structure)
DELETE FROM messages;
DELETE FROM service_requests;
DELETE FROM orders;
DELETE FROM order_items;
DELETE FROM products;
DELETE FROM profiles WHERE id != auth.uid();
```

---

## 🏆 Now You Have

A complete, realistic e-commerce system with:
- ✨ 60+ real products
- 💰 Realistic pricing
- 📦 Sample orders
- 🛠️ Service requests
- 💬 Message system
- 👥 Demo users
- 🔐 Admin access

**Perfect for testing and demos!**

---

*Data Population Guide - August 14, 2026*  
*Status: ✅ Ready to Deploy*

