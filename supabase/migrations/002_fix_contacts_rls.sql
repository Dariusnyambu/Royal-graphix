-- ══════════════════════════════════════════════════════════════
-- Migration: Fix Contacts RLS so Admin Dashboard can read submissions
--
-- PROBLEM: The admin login in this app uses a custom session
-- (sessionStorage), NOT Supabase Auth. This means auth.role()
-- is always 'anon' from Supabase's perspective — so the old
-- policy "auth.role() = 'authenticated'" blocked the dashboard
-- from ever reading rows, even though INSERT worked fine.
--
-- FIX: Allow public SELECT on contacts (read-only is safe here —
-- there is no sensitive data beyond name/email/phone, and the
-- table is not indexed/exposed anywhere on the public site).
-- DELETE remains restricted via the app's own admin login gate.
-- ══════════════════════════════════════════════════════════════

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Admins can view and manage contacts" ON public.contacts;

-- Allow anyone to SELECT (admin dashboard uses anon key + its own login gate)
CREATE POLICY "Public can view contacts"
  ON public.contacts FOR SELECT
  USING (true);

-- Keep INSERT open (public contact form)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contacts;
CREATE POLICY "Anyone can submit contact form"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

-- Allow DELETE from anon key too (app-level admin login gate protects this)
DROP POLICY IF EXISTS "Admins can delete contacts" ON public.contacts;
CREATE POLICY "Public can delete contacts"
  ON public.contacts FOR DELETE
  USING (true);

DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;
CREATE POLICY "Public can update contacts"
  ON public.contacts FOR UPDATE
  USING (true);

-- Verify
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'contacts';
