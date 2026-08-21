# Oracle Tech Store - Complete Testing Guide

**How to Test the Website Locally**

---

## 🚀 Quick Start (5 minutes)

### Step 1: Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Oracle Tech Store homepage with:
- Navigation menu
- Hero section
- Featured categories
- Services showcase

---

## 📋 Complete Testing Scenarios

### 1. HOMEPAGE TESTING

#### Test Navigation
1. Click each navigation link:
   - ✅ "Products" → `/products`
   - ✅ "Services" → `/services` (shows login redirect)
   - ✅ "About" → stays on homepage
   - ✅ "Contact" → stays on homepage

#### Test Hero Section
- ✅ See hero image and text
- ✅ "Shop Now" button is clickable
- ✅ Button redirects to `/products`

#### Test Categories Section
- ✅ See 8 product categories displayed
- ✅ Each category card is visible
- ✅ Categories are clickable (links work)

#### Test Services Section
- ✅ See 6 service types displayed
- ✅ Service cards are visible
- ✅ Professional layout

#### Test Footer
- ✅ Footer visible at bottom
- ✅ Contains company info
- ✅ Social links present

---

### 2. AUTHENTICATION TESTING

#### Sign Up Flow
1. Click "Sign Up" in navigation
2. Go to `/auth/signup`
3. Fill in the form:
   - ✅ Full Name: "John Doe"
   - ✅ Email: "john@example.com"
   - ✅ Password: "SecurePass123!"
   - ✅ Confirm Password: "SecurePass123!"
4. Click "Sign Up"
5. ✅ Should redirect to dashboard on success

#### Test Validation
- Leave fields empty → ✅ Error messages appear
- Invalid email format → ✅ Email error shown
- Password mismatch → ✅ Password error shown
- Short password → ✅ Password requirements shown

#### Login Flow
1. Logout if logged in (click Logout button)
2. Click "Login" in navigation
3. Fill in:
   - ✅ Email: your signup email
   - ✅ Password: your signup password
4. Click "Login"
5. ✅ Redirects to dashboard

#### Test Invalid Credentials
- Wrong email → ✅ Error message
- Wrong password → ✅ Error message
- Empty fields → ✅ Validation errors

---

### 3. PRODUCT BROWSING

#### Browse Products
1. Navigate to `/products`
2. ✅ See product list (8+ products)
3. ✅ Each product shows:
   - Product image
   - Product name
   - Price
   - Stock status
   - "Add to Cart" button

#### Test Product Search
1. Find search box at top
2. Type "laptop"
3. ✅ Products filter by search
4. ✅ Only matching products show

#### Test Category Filter
1. Find category dropdown
2. Select "Networking Equipment"
3. ✅ Products filtered by category
4. ✅ Dropdown shows selected category

#### Test Sorting
1. Find sort dropdown
2. Try each option:
   - ✅ "Lowest Price" - sorts ascending
   - ✅ "Highest Price" - sorts descending
   - ✅ "Newest" - sorts by date

#### Test Product Details
1. Click on any product
2. Go to `/products/[id]`
3. ✅ See full product details:
   - Product images
   - Full description
   - Price
   - Stock status
   - Quantity selector
   - "Add to Cart" button

#### Test Stock Status
- Products show:
  - ✅ "In Stock" (green badge)
  - ✅ "Low Stock" (yellow badge)
  - ✅ "Out of Stock" (red badge)

---

### 4. SHOPPING CART TESTING

#### Add to Cart
1. On product detail page
2. Increase quantity to 2
3. Click "Add to Cart"
4. ✅ See success message
5. ✅ Cart badge updates (shows 2)
6. ✅ Still on product page

#### Add Multiple Items
1. Go back to products
2. Add different products to cart
3. Add same product again
4. ✅ Quantity increases for same product
5. ✅ Cart badge updates total

#### View Cart
1. Click cart icon in navigation
2. Go to `/cart`
3. ✅ See all items in table:
   - Product name
   - Price
   - Quantity
   - Total per item
   - Remove button
4. ✅ See order summary:
   - Subtotal
   - Tax estimate (8%)
   - Total with tax

#### Adjust Quantities
1. Click + button next to item
2. ✅ Quantity increases
3. ✅ Totals recalculate
4. Click - button
5. ✅ Quantity decreases
6. ✅ Totals update

#### Remove Items
1. Click "Remove" on an item
2. ✅ Item removes from cart
3. ✅ Totals recalculate
4. ✅ Cart badge updates

#### Clear Cart
1. Click "Clear Cart" button
2. ✅ All items removed
3. ✅ Cart empty message shows
4. ✅ Totals reset

#### Persistence Test
1. Add items to cart
2. Refresh browser (F5)
3. ✅ Items still in cart
4. ✅ Close tab and reopen
5. ✅ Items still there (localStorage)

---

### 5. CHECKOUT TESTING

#### Start Checkout
1. With items in cart
2. Click "Proceed to Checkout"
3. Redirect to `/checkout`
4. ✅ Must be logged in (else redirected to login)

#### Fill Customer Info
1. Form pre-fills from profile:
   - ✅ Full Name
   - ✅ Email
   - ✅ Phone
2. Can edit all fields
3. ✅ Fields are required (red asterisk)

#### Fill Delivery Info
1. Enter delivery address
2. ✅ Address field required
3. Optional: Special instructions
4. ✅ Instructions can be empty

#### Validate Form
- Leave Full Name empty → ✅ Error
- Invalid email format → ✅ Error
- Short phone number → ✅ Error
- Leave address empty → ✅ Error

#### Place Order
1. Click "Complete Order"
2. ✅ Loading state shows
3. ✅ Order created in system
4. ✅ Redirected to confirmation page

#### Order Confirmation
1. Redirect to `/order-confirmation/[id]`
2. ✅ See success message
3. ✅ See order number
4. ✅ See order date
5. ✅ Itemized receipt displayed
6. ✅ Delivery address shown
7. ✅ Cart cleared

#### Confirmation Actions
1. Click "View Your Orders"
2. ✅ Goes to `/dashboard/orders`
3. Back on confirmation page
4. Click "Continue Shopping"
5. ✅ Goes to `/products`

---

### 6. ORDER MANAGEMENT

#### View Orders
1. In dashboard or `/dashboard/orders`
2. ✅ See table of all orders:
   - Order number
   - Date
   - Total
   - Status
   - Link to view details
3. ✅ Orders sorted by newest first

#### View Order Details
1. Click "View" on an order
2. Go to `/orders/[id]`
3. ✅ See complete order info:
   - Order number
   - Order date
   - Items with prices
   - Total amount
   - Delivery address
   - Special instructions

#### Order Status Display
1. Each order shows status:
   - ✅ Pending (yellow)
   - ✅ Confirmed (blue)
   - ✅ Processing (purple)
   - ✅ Ready for Delivery (purple)
   - ✅ Out for Delivery (orange)
   - ✅ Completed (green)

---

### 7. SERVICE REQUESTS TESTING

#### Create Service Request
1. Click "Services" in navigation
2. Click "+ New Request" or go to `/services/new`
3. ✅ Must be logged in

#### Fill Service Form
1. Service Type: Select from dropdown
   - ✅ System Maintenance
   - ✅ Installation Service
   - ✅ Technical Consulting
   - ✅ Technical Support
   - ✅ Troubleshooting
   - ✅ Custom Service
2. Title: Enter service title
3. Description: Enter detailed description (min 20 chars)
4. Desired Date: Pick a date
5. Preferred Time: Optional
6. Fill customer info:
   - ✅ Full Name
   - ✅ Email
   - ✅ Phone
   - ✅ Address
7. Optional: Additional info

#### Validation
- Leave required fields empty → ✅ Errors show
- Short description → ✅ Error (min 20 chars)
- Invalid email → ✅ Error
- Short phone → ✅ Error

#### Submit Request
1. Click "Submit Service Request"
2. ✅ Loading state
3. ✅ Redirected to detail page

#### View Service Requests
1. Go to `/services`
2. ✅ See all requests in list:
   - Request number
   - Title
   - Status (color-coded)
   - Customer name
   - Service type
   - Requested date

#### Filter by Status
1. See status filter on page
2. ✅ "All Statuses" shows all
3. ✅ Each status shows only matching

#### View Request Details
1. Click a request
2. Go to `/services/[id]`
3. ✅ See full details:
   - Request number
   - Title
   - Description
   - Type
   - Status
   - Dates
   - Customer info
   - Location
   - Additional info

---

### 8. MESSAGING TESTING

#### Create Message
1. Go to `/messages/new`
2. Must be logged in
3. Fill form:
   - Message Type: Select from dropdown (General, Order, Service, Billing, Technical, Other)
   - Subject: Enter subject (min 5 chars)
   - Message: Enter message (min 20 chars)
4. ✅ All fields required

#### Validation
- Leave subject empty → ✅ Error
- Short subject (< 5 chars) → ✅ Error
- Short message (< 20 chars) → ✅ Error
- Leave message type empty → ✅ Error

#### Send Message
1. Click "Send Message"
2. ✅ Loading state
3. ✅ Redirected to conversation

#### View Conversations
1. Go to `/messages`
2. ✅ See conversation list:
   - Subject
   - Last message preview
   - Sender name
   - Message type
   - Last message date/time
   - Unread count (if any)

#### Conversation View
1. Click a conversation
2. Go to `/messages/[id]`
3. ✅ See full message thread:
   - Your messages (white, left)
   - Admin messages (blue, right)
   - Sender names
   - Timestamps
   - Read status indicators

#### Reply to Message
1. In conversation view
2. Type reply in text box
3. ✅ Min 5 characters required
4. Click "Send Reply"
5. ✅ Message appears in thread
6. ✅ Conversation refreshes

#### Unread Tracking
1. Create new message
2. Go to messages list
3. ✅ Unread count shows
4. ✅ Badge on new conversation
5. Click to view
6. ✅ Message marked as read

---

### 9. ADMIN DASHBOARD TESTING

#### Access Admin
1. Create/login with admin user
2. **Setup Admin User:**
   - Create account via signup
   - In Supabase dashboard, find your user
   - In profiles table, set role = 'admin'
   - Logout and login again
3. Click "Admin" in navigation (shows for admin only)
4. Go to `/admin/dashboard`

#### Dashboard Statistics
1. ✅ See 8 statistics:
   - Total Orders
   - Total Revenue
   - Pending Orders
   - Service Requests
   - Pending Services
   - Total Customers
   - Recent Orders (24h)
   - Unread Messages
2. ✅ All numbers display correctly

#### Admin Management Tools
1. See 6 management cards:
   - ✅ Orders Management
   - ✅ Services Management
   - ✅ Customers Management
   - ✅ Messages Management
   - ✅ Products Management
   - ✅ Settings

---

### 10. ADMIN ORDERS

#### View All Orders
1. Click "Orders" on dashboard
2. Go to `/admin/orders`
3. ✅ See table with all orders:
   - Order number
   - Customer email
   - Date
   - Total amount
   - Status
4. ✅ Sortable by columns

#### Filter Orders
1. Find status dropdown
2. ✅ "All Statuses" shows all
3. Select specific status:
   - ✅ Pending
   - ✅ Confirmed
   - ✅ Processing
   - ✅ Ready for Delivery
   - ✅ Out for Delivery
   - ✅ Completed
   - ✅ Cancelled
4. ✅ Table updates with filter

#### View Order Details
1. Click "View" on order
2. See full order info
3. ✅ Items, totals, customer details

---

### 11. ADMIN SERVICES

#### View All Services
1. Click "Services" on dashboard
2. Go to `/admin/services`
3. ✅ See table with all requests:
   - Request number
   - Title
   - Customer name
   - Service type
   - Requested date
   - Status

#### Filter Services
1. Find status dropdown
2. ✅ Filter by status
3. ✅ Pending, Reviewed, Scheduled, In Progress, Completed, Cancelled

#### View Service Details
1. Click "View" on request
2. See full details

---

### 12. ADMIN CUSTOMERS

#### View All Customers
1. Click "Customers" on dashboard
2. Go to `/admin/customers`
3. ✅ See table with all customers:
   - Name
   - Email
   - Phone
   - Order count (badge)
   - Service count (badge)
   - Joined date

#### Search Customers
1. Type in search box
2. ✅ Search by name works
3. ✅ Search by email works
4. ✅ Real-time filtering

#### View Customer Details
1. Click "View" on customer
2. See full customer profile

---

### 13. ADMIN MESSAGES

#### View All Conversations
1. Click "Messages" on dashboard
2. Go to `/admin/messages`
3. ✅ See all conversations:
   - Subject
   - Last message preview
   - Sender name
   - Message type
   - Message count
   - Last message date/time
   - Unread count

#### Filter Unread
1. Click "Show Unread" button
2. ✅ Shows only unread conversations
3. Click again
4. ✅ Shows all conversations

#### View Conversation
1. Click a conversation
2. See full message thread
3. ✅ Can read all messages
4. ✅ Messages marked as read

#### Respond to Message
1. Type reply in text box
2. Click "Send Reply"
3. ✅ Admin message appears (blue, right)

---

### 14. PROFILE & ACCOUNT

#### View Profile
1. Click your name in dashboard
2. Go to `/dashboard/profile`
3. ✅ See your account info:
   - Full name
   - Email
   - Phone
   - Address
   - Account type

#### Edit Profile
1. Click "Edit Profile"
2. Form becomes editable
3. Update information
4. Click "Save Changes"
5. ✅ Changes saved
6. ✅ Success message

#### Logout
1. Click "Logout" button
2. ✅ Redirected to home
3. ✅ Must log back in to access protected pages

---

### 15. RESPONSIVE DESIGN

#### Mobile Testing (< 640px)
1. Open browser dev tools (F12)
2. Set device to mobile (e.g., iPhone 12)
3. ✅ Navigation collapses to hamburger menu
4. ✅ Products display in single column
5. ✅ Forms stack vertically
6. ✅ Tables scroll horizontally
7. ✅ Buttons are touch-friendly

#### Tablet Testing (640px - 1024px)
1. Set device to tablet (e.g., iPad)
2. ✅ Two-column layouts
3. ✅ Clear spacing
4. ✅ Readable text
5. ✅ Accessible buttons

#### Desktop Testing (> 1024px)
1. Full browser window
2. ✅ Multi-column layouts
3. ✅ Optimal spacing
4. ✅ All features visible

---

### 16. ERROR HANDLING

#### Network Errors
1. Start dev server
2. Stop server (Ctrl+C)
3. Refresh page
4. ✅ Error message displays
5. ✅ Not a blank page

#### Form Errors
1. Submit form with invalid data
2. ✅ Errors show under fields
3. ✅ Clear error messages
4. ✅ Form doesn't submit

#### 404 Errors
1. Navigate to `/invalid-page`
2. ✅ Error page displays
3. ✅ Can navigate back

---

## 🧪 Automated Testing

### Run Unit Tests
```bash
npm test
```

Expected output:
```
Test Suites: 4 passed, 4 total
Tests:       40 passed, 40 total
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```
- Tests re-run on file changes

### Generate Coverage Report
```bash
npm run test:coverage
```
- Shows test coverage percentage

---

## 🔒 Security Testing

### SQL Injection Test
1. Try to enter SQL in form fields:
   - `'; DROP TABLE--`
2. ✅ Should be sanitized/validated
3. ✅ Doesn't break the application

### XSS Testing
1. Try to enter HTML/JavaScript:
   - `<script>alert('xss')</script>`
2. ✅ Should be escaped or sanitized
3. ✅ Doesn't execute

### Authentication Test
1. Try to access `/admin/dashboard` as regular user
2. ✅ Redirected to customer dashboard

---

## 📊 Performance Testing

### Load Time
1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload page
4. ✅ Page loads in < 2 seconds
5. ✅ Main bundle < 500KB

### API Response Time
1. Open DevTools → "Network" tab
2. Add product to cart
3. ✅ API responds in < 500ms

---

## ✅ Complete Testing Checklist

**General:**
- ✅ Homepage loads correctly
- ✅ Navigation works
- ✅ Footer displays
- ✅ No console errors

**Authentication:**
- ✅ Sign up works
- ✅ Login works
- ✅ Logout works
- ✅ Protected routes redirect to login

**Products:**
- ✅ Products load
- ✅ Search works
- ✅ Filter works
- ✅ Sort works
- ✅ Product details work

**Shopping:**
- ✅ Add to cart works
- ✅ Cart persists (localStorage)
- ✅ Checkout works
- ✅ Order confirmation shows

**Orders:**
- ✅ Order history displays
- ✅ Order details show
- ✅ Status displays correctly

**Services:**
- ✅ Service form works
- ✅ Service list displays
- ✅ Service details show
- ✅ Status filtering works

**Messages:**
- ✅ Can send message
- ✅ Conversations display
- ✅ Can reply
- ✅ Unread tracking works

**Admin:**
- ✅ Admin dashboard shows stats
- ✅ Orders management works
- ✅ Services management works
- ✅ Customers list works
- ✅ Messages inbox works

**Responsive:**
- ✅ Mobile layout works
- ✅ Tablet layout works
- ✅ Desktop layout works

**Security:**
- ✅ No SQL injection possible
- ✅ No XSS possible
- ✅ Auth required on protected routes
- ✅ Admin routes protected

---

## 🐛 Reporting Issues

If you find any issues:

1. **Note the issue:**
   - What page/feature?
   - What's the expected behavior?
   - What's the actual behavior?
   - Browser used?
   - Device (mobile/desktop)?

2. **Check console for errors:**
   - F12 → Console tab
   - Copy any error messages

3. **Check Network tab:**
   - F12 → Network tab
   - Look for failed requests

---

## 📞 Support

**For technical issues:**
- Check TROUBLESHOOTING_GUIDE.md
- Review error messages in console
- Check Network tab in DevTools

**For feature questions:**
- Review README_FINAL.md
- Check API_DOCUMENTATION.md
- Review user guides

---

**Happy Testing! 🎉**

Start with the Quick Start section above, then work through the testing scenarios in order. Report any issues you find!
