# Supabase Setup Guide for Oracle Tech Store

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Name:** oracle-tech-store (or your preferred name)
   - **Database Password:** Save this securely!
   - **Region:** Choose closest to your users
5. Wait for the project to initialize (~2 minutes)

## Step 2: Get Your Credentials

Once your project is created:

1. Go to **Settings → API**
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

3. Update `.env.local` with these values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Create Database Tables & RLS Policies

### Option A: Using Supabase Dashboard SQL Editor (Recommended for First-Time Setup)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content of `schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run**
6. Wait for all queries to complete successfully

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 4: Enable Authentication

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Ensure **Email** provider is enabled (default)
3. Go to **Authentication → Email Templates** and customize if needed
4. Go to **Authentication → Policies** and set:
   - Confirm email: Enabled (recommended for production)
   - Auto-confirm users: Can be enabled for development

## Step 5: Configure Storage for Product Images

1. Go to **Storage → Buckets**
2. Create a new bucket called `product-images`
3. Configure CORS:
   - Go to bucket settings
   - Add CORS policy to allow uploads from your domain
4. Set bucket to **Public** to allow image viewing

## Step 6: Test the Connection

Run the development server:
```bash
npm run dev
```

The app should start without Supabase connection errors. If you get errors, verify:
- Environment variables are set correctly
- No trailing spaces in keys
- Project is fully initialized

## Database Schema Overview

The schema includes 8 main tables:

1. **profiles** - User information and roles
2. **categories** - Product categories
3. **products** - Product catalog
4. **product_images** - Product images with display order
5. **orders** - Customer orders
6. **order_items** - Items in each order
7. **service_requests** - Technical service requests
8. **messages** - Customer-admin communication

All tables have:
- ✅ Row Level Security (RLS) for data protection
- ✅ Indexes for performance
- ✅ Automatic timestamp updates
- ✅ Proper foreign key relationships
- ✅ Data validation constraints

## Important Security Notes

1. **Never commit `.env.local`** to version control
2. **Keep service_role key private** - only use on backend/server
3. **RLS policies are active** - all direct database access respects them
4. **Test RLS policies** in different user contexts during development
5. **Use service_role key carefully** - it bypasses RLS

## Troubleshooting

### "Module not found" errors
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env.local`

### Authentication errors
- Check that user email is confirmed (if email confirmation enabled)
- Verify user exists in Auth section
- Check RLS policies are not blocking access

### Image upload issues
- Ensure `product-images` bucket is created and public
- Check CORS settings on the bucket
- Verify bucket path in code matches bucket name

### Performance issues
- Check that indexes are created (they're included in schema.sql)
- Monitor slow queries in Supabase Dashboard
- Consider adding additional indexes for frequently filtered fields

## Next Steps

After setup is complete:
1. Proceed to **Phase 3: Authentication** to implement user signup/login
2. Test the database by creating sample data
3. Verify RLS policies are working correctly
4. Set up storage for product images

## Support

For Supabase documentation: https://supabase.com/docs
For issues: https://github.com/supabase/supabase/discussions
