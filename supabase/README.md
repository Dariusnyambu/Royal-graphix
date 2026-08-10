# Royal Graphix — Supabase Setup

## 1. Run the Schema

Go to **Supabase Dashboard → SQL Editor** and run:
```sql
-- Paste the contents of schema.sql here
```

## 2. Run the Migration (if contacts table already exists)

If you already have a contacts table without the phone column, run:
```sql
-- Paste the contents of migrations/001_add_phone_to_contacts.sql
```

## 3. Seed Sample Data (optional)

```sql
-- Paste the contents of seed.sql
```

## 4. RLS Policies

The schema.sql already includes Row Level Security policies:
- **contacts**: Anyone can INSERT (public contact form), only authenticated users can SELECT/DELETE
- **portfolio**: Public can SELECT, only authenticated users can INSERT/UPDATE/DELETE

## 5. Storage Bucket

Create a storage bucket called `portfolio-images` with public access for portfolio image uploads.

## Credentials (already in .env)
```
VITE_SUPABASE_URL=https://ynrzdflcroelgcrvktbh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
