# Oracle Tech Store - Quick Start Guide

## ⚡ 10-Minute Setup

### 1️⃣ Load Real Data (2 minutes)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open file: `POPULATE_REAL_DATA.sql`
3. Copy all content and paste into SQL Editor
4. Click **Run**
5. ✅ You now have 40 products, 8 categories, 80+ images!

### 2️⃣ Create Test Users (3 minutes)

**Sign up as customer:**
- Go to `http://localhost:3000`
- Click **Sign Up**
- Email: `customer@techstore.com`
- Password: `TestPassword123!`
- Name: `John Customer`

**Create admin user:**
- Repeat signup with:
  - Email: `admin@techstore.com`
  - Password: `AdminPassword123!`
  - Name: `Admin Manager`

**Make admin in Supabase SQL Editor:**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@techstore.com';
```

### 3️⃣ Create Sample Orders (2 minutes)

As customer user:
1. Go to `/products` → Browse products
2. Add 3-5 items to cart
3. Go to `/cart` → Click **Proceed to Checkout**
4. Fill form → Click **Place Order**
5. ✅ Order created!

Repeat 2-3 times for more sample data.

### 4️⃣ Test Everything (3 minutes)

- ✅ Products display: `/products`
- ✅ Cart works: Add items → `/cart`
- ✅ Checkout: `/checkout`
- ✅ Dashboard: `/dashboard`
- ✅ Admin panel: `/admin/dashboard` (as admin user)

---

## 📍 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Homepage** | `/` | Main landing page |
| **Products** | `/products` | Browse all products |
| **Product Detail** | `/products/{id}` | View single product |
| **Shopping Cart** | `/cart` | View/manage cart |
| **Checkout** | `/checkout` | Place order |
| **Dashboard** | `/dashboard` | Customer dashboard |
| **Orders** | `/dashboard/orders` | View customer orders |
| **Admin** | `/admin/dashboard` | Admin dashboard |
| **Services** | `/services` | Browse services |
| **Messages** | `/messages` | View messages |

---

## 🎮 Testing Scenarios

### Scenario 1: Complete Purchase
```
1. Sign up as customer
2. Browse /products
3. Add 3 items to cart
4. Go to /cart
5. Click Proceed to Checkout
6. Fill checkout form
7. Place Order
8. See confirmation page
9. Check /dashboard/orders
✅ Order appears in list!
```

### Scenario 2: Admin Management
```
1. Sign in as admin
2. Go to /admin/dashboard
3. View stats (orders, revenue, etc.)
4. Click "Manage Orders"
5. See all customer orders
6. Click "View" on any order
✅ View full order details!
```

### Scenario 3: Navigation & Contrast
```
1. Load homepage
2. Scroll down to see navigation change color
3. Navigation text should be visible at all times
4. Try clicking cart icon, login, etc.
✅ All buttons work and are visible!
```

---

## 📊 After Setup - You Should Have

| Item | Count |
|------|-------|
| Products | 40 |
| Categories | 8 |
| Product Images | 80+ |
| Test Users | 2+ |
| Sample Orders | 5+ |
| Total Revenue (simulated) | $X,XXX |

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Check types
npm run type-check

# Run linter
npm run lint
```

---

## 🚀 What Works Now

✅ **All Features Implemented**
- User authentication (signup/login)
- Product browsing with images
- Shopping cart
- Checkout & orders
- Customer dashboard
- Admin management
- Service requests
- Messaging system
- Order tracking
- Profile management

✅ **UI/UX Complete**
- Modern dark theme
- Glassmorphism effects
- Responsive design
- Animated backgrounds
- Fixed navigation contrast
- All buttons functional

✅ **Data Ready**
- 40 real tech products
- Professional product images
- Sample pricing
- Stock management
- Category organization

---

## ⚠️ Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Products not showing | Run `POPULATE_REAL_DATA.sql` |
| Images not loading | Check internet (images from Unsplash CDN) |
| Can't checkout | Make sure you're logged in |
| Admin access denied | Run: `UPDATE profiles SET role = 'admin' WHERE email = '...';` |
| Buttons not responding | Hard refresh browser: `Ctrl+Shift+R` |

---

## 📝 Next Steps

### Phase 1 (Now) ✅
- [x] Load product data
- [x] Create test users
- [x] Create sample orders
- [x] Test all buttons
- [x] Verify images

### Phase 2 (Soon)
- [ ] Add payment processing
- [ ] Set up email notifications
- [ ] Configure analytics
- [ ] Add more products

### Phase 3 (Production)
- [ ] Enable email confirmation
- [ ] Set up SSL/HTTPS
- [ ] Configure backups
- [ ] Deploy to production

---

## 🎯 What Each User Should See

### Customer User
- Browse products with images
- Add to cart and checkout
- View their orders
- Track order status
- Request services
- Send messages

### Admin User
- Dashboard with all statistics
- Manage all orders
- Manage all services
- Manage all customers
- View all messages
- Manage inventory

---

## 📚 Full Documentation

For detailed info, see:
- `REAL_DATA_SETUP.md` - Step-by-step setup guide
- `COMPLETE_SETUP_SUMMARY.md` - Full technical summary
- `POPULATE_REAL_DATA.sql` - Product data script

---

## ✨ You're All Set!

The Oracle Tech Store is now:
- ✅ Fully functional
- ✅ Populated with real data
- ✅ Ready for testing
- ✅ Production-ready (except payments)

**Start here**: Go to `http://localhost:3000` and start shopping! 🛍️

---

*Quick Start Guide - Oracle Tech Store*  
*For full details, see REAL_DATA_SETUP.md*
