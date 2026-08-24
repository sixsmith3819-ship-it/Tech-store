# Oracle Tech Store - User Guide

## Quick Start

### For New Users (Clients)

#### 1. **Sign Up**
- Click "Create one" on login page or go to /auth/signup
- Enter email, full name, and password (min 8 chars)
- You're automatically logged in after signup
- Access your dashboard at /dashboard

#### 2. **Browse & Shop**
- **Products**: Navigate to Products page
  - Browse by category (Laptops, Servers, Software, etc.)
  - Click product to view details
  - Add to cart from product page
- **Services**: View professional services (Installation, Consulting, Support)
  - Select service and add to cart

#### 3. **Purchase**
- **Shopping Cart** (/cart)
  - View all items added
  - Adjust quantities or remove items
  - See total price
  - Click "Proceed to Checkout"
- **Checkout** (/checkout)
  - Review order details
  - Confirm wallet balance (points/credits)
  - Click "Place Order"
- **Order Confirmation**
  - Receive confirmation page with Order ID
  - Order details saved to your profile

#### 4. **Manage Account**
- Go to **Dashboard** ? **Profile**
  - View/edit: Full name, phone, address
  - Change email: Scroll to "Change Email Address" section
    - Enter new email + current password
    - Email updates immediately
  - **Change Password**: Click "Change Password" button
    - Enter current password + new password
    - Password updates immediately

#### 5. **View Orders**
- Go to **Dashboard** ? **Orders**
  - See all past orders with status
  - Click order to view details (items, total, date)

#### 6. **Messages**
- Go to **Messages** (/messages)
  - View all conversations with seller/support
  - Click conversation to reply
  - Create new message with "New Message" button

#### 7. **Logout**
- Click profile icon ? Logout
- Logged out and redirected to home page

---

### For Admin Users

#### 1. **Login**
- Use admin credentials at /auth/login
- Dashboard at /admin/dashboard

#### 2. **Manage Products** (/admin/products)
- **Add Product**: Click "Add Product"
  - Fill: Name, description, price, category, image
  - Click "Create"
- **Edit Product**: Click product ? Edit
  - Update fields and save
- **Delete Product**: Click product ? Delete
  - ?? Can't delete if product has active orders
  - Must wait until orders are completed

#### 3. **Manage Services** (/admin/services)
- **Add Service**: Click "Add Service"
  - Fill: Name, description, price, image
  - Click "Create"
- **Edit/Delete**: Same as products

#### 4. **View Orders** (/admin/orders)
- See all customer orders
- Click order to view details
- Track order status and items

#### 5. **View Customers** (/admin/customers)
- See all registered customers
- View customer details (name, email, phone, address)
- Click customer for full info

#### 6. **Messages** (/admin/messages)
- View all customer messages
- Reply to customer inquiries
- Manage conversations

#### 7. **Admin Settings** (/admin/settings)
- **Change Email**:
  - Scroll to "Change Email Address" section
  - Enter new email + current password
  - Email updates with password verification
- **General Settings**: View store info (read-only)
- **Notifications**: Configure email preferences
- **System Info**: Check database status, version

#### 8. **Logout**
- Click profile ? Logout

---

## Key Features

### Customer Wallet System
- Earn credits/points on purchases
- Use wallet balance for future orders
- View balance on checkout page
- Top-up wallet available (admin feature)

### Order Tracking
- Each order has unique Order ID
- Track items, total price, and date
- View order history anytime

### Secure Authentication
- Password min 8 characters, max 12 characters
- Email validation required
- Password reset via "Forgot?" link on login

### Email Change
- Requires password verification for security
- Admin/users can change email from settings
- Can login with new email immediately

---

## Common Tasks

| Task | Path | Steps |
|------|------|-------|
| Buy a product | Products ? Add to Cart ? Checkout | Select item ? Confirm ? Place order |
| Change password | Dashboard/Settings ? Change Password | Enter old + new password |
| Change email | Dashboard/Settings ? Change Email | Enter new email + password |
| View my orders | Dashboard ? Orders | Click order to view details |
| Contact support | Messages ? New Message | Write and send message |
| Reset forgotten password | Login page ? "Forgot?" | Enter email ? Follow link |
| Manage products (admin) | Admin ? Products | Add/Edit/Delete products |
| View all customers (admin) | Admin ? Customers | Browse customer list |

---

## Troubleshooting

**Can't login?**
- Check email is correct
- Try "Forgot?" to reset password
- Password max 12 characters

**Can't delete product (admin)?**
- Product has active orders
- Wait until orders are completed
- System prevents deleting products in use

**Email change not working?**
- Password must be correct
- New email must be different
- Check email not already in use

**Cart items lost?**
- Cart saved per session
- Items remain after logout
- Clear browser cache if issues persist

---

## Security Tips

? Never share your password
? Use strong, unique passwords
? Logout when finished (public computers)
? Verify emails before purchasing
? Review orders before checkout

---

## Support

For issues, use **Messages** feature to contact admin/support team.

**Version**: 1.0.0
**Last Updated**: August 2026
