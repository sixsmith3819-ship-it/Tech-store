# Oracle Tech Store - Real Data Setup Guide

## Overview

This guide walks you through setting up the Oracle Tech Store with real tech product data, images, and comprehensive sample data for testing all functionality.

---

## Step 1: Populate Real Products and Categories

### What's Included

The `POPULATE_REAL_DATA.sql` script contains:
- **8 Real Tech Categories** with professional descriptions
- **40 Real Tech Products** including:
  - 5 Premium Laptops (Dell, Apple, Lenovo, HP, ASUS)
  - 5 Enterprise Networking Switches
  - 5 Professional Networking Tools
  - 5 WiFi 6 & Mesh Systems
  - 5 Starlink Solutions
  - 5 Network Cabinets
  - 5 Security & CCTV Systems
  - 5 Tech Accessories
- **Real Product Images** from Unsplash (professional quality tech photography)
- **Realistic Pricing** from $49.99 to $15,999.99

### How to Run

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Open the file: `POPULATE_REAL_DATA.sql`
4. Copy all content and paste into the Supabase SQL Editor
5. Click **Run**
6. Verify success: You should see output showing:
   - Total Products: 40
   - Total Categories: 8
   - Total Product Images: 80+ (multiple images per product)

**Result**: Your product catalog is now populated with real tech products!

---

## Step 2: Create Test Users

After populating products, create test users to populate other data types:

### Test User 1: Regular Customer

1. Go to your app at `http://localhost:3000`
2. Click **Sign Up**
3. Enter:
   - Email: `customer@techtore.com`
   - Password: `TestPassword123!`
   - Full Name: `John Customer`
4. Click **Sign Up**
5. Update profile with:
   - Phone: `555-0123`
   - Address: `123 Tech Street, Silicon Valley, CA 94025`

### Test User 2: Admin User

1. Sign up another user with:
   - Email: `admin@techstore.com`
   - Password: `AdminPassword123!`
   - Full Name: `Admin Manager`
2. **Manual Admin Assignment**: Go to Supabase → SQL Editor and run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@techstore.com';
```

---

## Step 3: Test All Features by Creating Sample Data

### A. Create Sample Orders

**As Customer User:**

1. Browse products at `/products`
2. Click on several products and add them to cart
3. Go to `/cart` and review items
4. Click **Proceed to Checkout**
5. Fill in checkout form with your customer details
6. Click **Complete Order**
7. You should see an order confirmation page

**Repeat 2-3 times** to have sample data for admin dashboard

### B. Create Sample Service Requests

1. Go to `/services`
2. Click **New Service Request**
3. Fill form:
   - Service Type: `System Maintenance`
   - Title: `Monthly Server Maintenance`
   - Description: `Schedule monthly maintenance for our network infrastructure`
   - Preferred Date: `2024-09-15`
   - Address: Your address
4. Click **Submit**
5. **Create 2-3 more** with different service types

### C. Create Sample Messages

1. Go to `/messages`
2. Click **New Message**
3. Fill in:
   - Type: `Technical Support`
   - Subject: `Network Issues at Office`
   - Message: `We're experiencing connectivity issues with our WiFi system. Need urgent assistance.`
4. Click **Send**
5. Create 2-3 more messages with different types

---

## Step 4: View Admin Dashboard

Now that you have sample data, the admin dashboard will show real statistics:

1. Go to `http://localhost:3000/admin/dashboard` (as admin user)
2. You should see:
   - **Total Orders**: Count of all orders created
   - **Total Revenue**: Sum of all order totals
   - **Pending Orders**: Count of pending orders
   - **Service Requests**: Count of all services
   - **Total Customers**: Count of customer profiles
   - Plus other stats

### Admin Management Pages

From the admin dashboard, you can:
- **Orders Management** (`/admin/orders`): View all customer orders
- **Services Management** (`/admin/services`): View all service requests
- **Customers Management** (`/admin/customers`): View all customer profiles
- **Messages Management** (`/admin/messages`): View all customer messages
- **Products Management** (`/admin/products`): View inventory

---

## Step 5: Verify All Buttons Work

### Customer Dashboard Buttons

| Button | Path | Should Do |
|--------|------|-----------|
| Edit Profile | `/dashboard/profile` | Opens profile editor |
| My Orders | `/dashboard/orders` | Shows customer's orders |
| View Services | `/services` | Shows available services |
| Browse Products | `/products` | Shows product catalog |
| Logout | - | Logs out user |

### Order Management Buttons

| Button | Action |
|--------|--------|
| Add to Cart | Adds product to cart |
| View Order Details | Opens full order info |
| Update Quantity | Changes item quantity |
| Remove Item | Deletes from cart |
| Proceed to Checkout | Goes to checkout form |
| Complete Order | Creates new order |

### Product Browsing Buttons

| Button | Action |
|--------|--------|
| Category Filter | Filters by product type |
| Search | Searches products |
| Sort | Orders products by criteria |
| View Details | Opens product detail page |
| Add to Cart | Adds to shopping cart |

### Admin Dashboard Buttons

| Button | Path | Function |
|--------|------|----------|
| Manage Orders | `/admin/orders` | View all orders |
| Manage Services | `/admin/services` | View all services |
| Manage Customers | `/admin/customers` | View all customers |
| View Messages | `/admin/messages` | View all messages |
| Manage Products | `/admin/products` | View inventory |

---

## Step 6: Test Checkout Flow

### Complete Checkout Flow

1. Add 3-5 products to cart
2. Go to `/cart`
3. Verify totals are calculated correctly
4. Click **Proceed to Checkout**
5. Fill checkout form:
   - Full Name: (auto-filled from profile)
   - Email: (auto-filled from profile)
   - Phone: (auto-filled from profile)
   - Delivery Address: (auto-filled from profile)
   - Additional Instructions: (optional)
6. Click **Place Order**
7. Should redirect to order confirmation page
8. Check `/dashboard/orders` to see new order listed

---

## Step 7: Verify Image Display

### Check Product Images

1. Go to `/products`
2. All products should display images from Unsplash
3. Images should be high-quality tech photography
4. Hover effects should work (slight zoom)
5. Click on product card to see detail page with full images

### Check Image URLs

If images aren't showing:

1. Go to Supabase → SQL Editor
2. Run:
```sql
SELECT product_id, image_url FROM product_images LIMIT 5;
```
3. Click URLs to verify they're valid image links

---

## System Statistics After Full Setup

After completing all steps, your system should have:

| Item | Count |
|------|-------|
| Products | 40 |
| Categories | 8 |
| Product Images | 80+ |
| Test Users (Customers) | 2+ |
| Admin Users | 1+ |
| Sample Orders | 5-10 |
| Service Requests | 3-5 |
| Messages | 3-5 |

---

## Troubleshooting

### Products Not Showing

**Issue**: Products page shows "No products available"

**Solution**:
1. Check Supabase SQL Editor - run `SELECT COUNT(*) FROM products;`
2. If count is 0, re-run `POPULATE_REAL_DATA.sql`
3. Clear browser cache (Ctrl+Shift+Del) and reload

### Images Not Loading

**Issue**: Products show placeholder icons instead of images

**Solution**:
1. Check internet connection (images are from Unsplash CDN)
2. Check Supabase RLS policies aren't blocking image_url access
3. Try different browser (some browsers block mixed content)

### Orders Not Creating

**Issue**: "Order creation failed" error at checkout

**Solution**:
1. Verify you're logged in as customer
2. Check cart has items
3. Check all checkout fields are filled
4. Check browser console for error details
5. Verify `/api/orders/create` endpoint is working

### Admin Dashboard Not Loading

**Issue**: Admin dashboard shows "Unauthorized" or doesn't load

**Solution**:
1. Verify user role is set to 'admin' in profiles table:
```sql
SELECT email, role FROM profiles WHERE email = 'admin@techstore.com';
```
2. If role is 'customer', update it:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@techstore.com';
```
3. Log out and log back in

---

## Production Considerations

### Before Going Live

1. **Replace Sample Images**: Replace Unsplash URLs with your own product images
2. **Update Pricing**: Adjust product prices to match your business model
3. **Enable Email Confirmation**: Enable email verification in Supabase
4. **Configure Payment Processing**: Set up payment gateway (Stripe, PayPal)
5. **Enable RLS Policies**: Verify all RLS policies are enforced
6. **Set up SSL Certificates**: Use HTTPS in production
7. **Configure CDN**: Use CDN for image delivery
8. **Set up Database Backups**: Configure automated backups

### Image Storage Best Practices

For production, consider:
- **Supabase Storage**: Upload images to Supabase Storage bucket
- **AWS S3**: Store images in S3 with CloudFront CDN
- **Cloudinary**: Use managed image service with transforms
- **Local Uploads**: Store in local folder if self-hosted

---

## Next Steps

1. ✅ Populate real product data
2. ✅ Create test users
3. ✅ Generate sample orders/services/messages
4. ✅ Verify all buttons work
5. ✅ Test checkout flow
6. 📌 Configure payment processing
7. 📌 Set up email notifications
8. 📌 Configure production deployment
9. 📌 Set up monitoring and analytics

---

## Support

For issues or questions:
- Check `/FIX_POPULATE_DATA.md` for data population help
- Check `/REACT_RENDER_FIX.md` for rendering issues
- Review error messages in browser console
- Check Supabase logs for database errors
- Review API response in Network tab of DevTools
