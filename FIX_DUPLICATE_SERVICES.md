# Fix Duplicate Services

## Problem
You ran the setup SQL query twice, so you have duplicate services (14 instead of 7).

## Quick Solution

Copy this SQL into Supabase SQL Editor and run it:

\\\sql
DELETE FROM services
WHERE id NOT IN (
  SELECT MIN(id)
  FROM services
  GROUP BY name
);

SELECT COUNT(*) as total_services FROM services;
SELECT name, COUNT(*) as count FROM services GROUP BY name;
\\\

---

## How to Run in Supabase

1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"
5. Copy the SQL above
6. Paste into editor
7. Click "Run" button

---

## What It Does

- Keeps only the first copy of each service (oldest record)
- Deletes all duplicate copies
- Shows final count (should be 7)
- Shows verification that each service appears only once

---

## Result

You should see:
- total_services: 7
- Each service name with count = 1

---

## Alternative: Start Fresh

If you prefer to delete everything:

\\\sql
TRUNCATE services RESTART IDENTITY;
\\\

Then run the INSERT statements from SETUP_SERVICES_TABLE.sql

---

Done! Your services page will now show exactly 7 services with no duplicates.
