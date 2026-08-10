-- ============================================================
-- Migration 007 — Portfolio Case Studies + SEO Fields
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run on an existing database — uses IF NOT EXISTS / ADD COLUMN guards.
-- Existing portfolio rows and data are preserved; new columns are additive.
-- ============================================================

-- ── slug (needed for /portfolio/:slug case study pages) ──
alter table public.portfolio add column if not exists slug text;

-- ── basic project info ──
alter table public.portfolio add column if not exists client_name text;
alter table public.portfolio add column if not exists client_industry text;
alter table public.portfolio add column if not exists featured boolean not null default false;
alter table public.portfolio add column if not exists status text not null default 'published' check (status in ('draft','published'));
alter table public.portfolio add column if not exists project_year text;

-- ── case study narrative (client_problem/solution already exist from migration 005) ──
alter table public.portfolio add column if not exists overview text;
alter table public.portfolio add column if not exists objectives text;
alter table public.portfolio add column if not exists process_text text;
alter table public.portfolio add column if not exists services_provided text[] default '{}';
alter table public.portfolio add column if not exists tech_stack text[] default '{}';
alter table public.portfolio add column if not exists results text[] default '{}';

-- ── testimonial ──
alter table public.portfolio add column if not exists testimonial_text text;
alter table public.portfolio add column if not exists testimonial_name text;
alter table public.portfolio add column if not exists testimonial_role text;
alter table public.portfolio add column if not exists testimonial_image text;

-- ── image alt text (gallery_images already exists from migration 006) ──
alter table public.portfolio add column if not exists image_alt text;

-- ── SEO ──
alter table public.portfolio add column if not exists seo_title text;
alter table public.portfolio add column if not exists seo_description text;
alter table public.portfolio add column if not exists focus_keyword text;
alter table public.portfolio add column if not exists canonical_url text;
alter table public.portfolio add column if not exists og_image text;

-- ── backfill slug for any existing rows that don't have one yet ──
-- (simple slugify: lowercase, spaces/punctuation → hyphens; de-duplicated with a short id suffix)
update public.portfolio
set slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || substr(id::text, 1, 6)
where slug is null or slug = '';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'portfolio_slug_key'
  ) then
    alter table public.portfolio add constraint portfolio_slug_key unique (slug);
  end if;
end $$;
create index if not exists portfolio_slug_idx   on public.portfolio (slug);
create index if not exists portfolio_status_idx on public.portfolio (status);
