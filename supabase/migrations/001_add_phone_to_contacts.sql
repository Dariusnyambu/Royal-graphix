-- ══════════════════════════════════════════════════════════════
-- Migration: Add phone column to contacts table
-- Run this in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS phone text;

-- Also ensure read column exists (some setups may be missing it)
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS read boolean DEFAULT false;

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;
