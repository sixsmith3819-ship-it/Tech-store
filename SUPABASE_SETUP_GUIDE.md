# Supabase Setup Instructions - Services Table & Data

## Problem
The services table doesn't exist in your Supabase database yet. Error: elation "services" does not exist

## Solution
You need to run SQL scripts to create the services table and seed sample data.

---

## Option A: Run Full Schema (Recommended - First Time Setup)

If this is your first setup or you want to recreate everything:

### Step 1: Go to Supabase SQL Editor
1. Open https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Click "New Query" button

### Step 2: Copy Full Schema
1. Open the file: schema.sql (in your project root)
2. Copy the ENTIRE content
3. Paste into Supabase SQL Editor
4. Click "Run" button
5. Wait for completion (1-2 minutes)

### Step 3: Add Sample Services
1. Create a new query in Supabase SQL Editor
2. Open the file: SETUP_SERVICES_TABLE.sql (in your project root)
3. Copy the ENTIRE content
4. Paste into the new query
5. Click "Run" button

---

## Option B: Quick Setup (Services Only)

If you already have other tables but just need services:

### Step 1: Go to Supabase SQL Editor
1. Open https://app.supabase.com
2. Select your project
3. Click "SQL Editor"
4. Click "New Query"

### Step 2: Run Services Setup
1. Open: SETUP_SERVICES_TABLE.sql
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click "Run" button

The script will:
- Create the services table
- Add indexes
- Enable Row Level Security
- Create access policies
- Insert 7 sample services

---

## Verification

After running the SQL, you should see:
`
total_services | active_services
7              | 7
`

Then:
1. Refresh your website
2. Click "Services" in navigation
3. You should now see all 7 services displayed

---

## Services Added

1. **CCTV Installation** - .99
2. **Starlink Installation** - .99
3. **Network Installation** - .99
4. **Network Cabinet Setup** - .99
5. **WiFi Network Setup** - .99
6. **System Maintenance** - .99
7. **Consulting Service** - .99

All are marked as "active" and visible to users.

---

## Troubleshooting

**Still seeing "Failed to fetch services"?**
- Refresh the page (Ctrl+F5)
- Clear browser cache
- Check that all 7 services show in verification query
- Check your Supabase RLS policies are correct

**Need to delete and start over?**
Run this in SQL Editor:
`sql
TRUNCATE services RESTART IDENTITY;
`

Then run the setup script again.

---

## Files Reference

- schema.sql - Complete database schema (all tables)
- SETUP_SERVICES_TABLE.sql - Services table + sample data only
- SEED_SERVICES.sql - Sample data only (requires table exists)

**Version**: 1.0.0
**Last Updated**: August 2026
