-- ============================================================
-- Migration 006 — Dynamic Careers, Service Images, Portfolio Gallery
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run on an existing database — uses IF NOT EXISTS / ADD COLUMN guards.
-- ============================================================

-- ── jobs (Careers — replaces hardcoded listings) ──
create table if not exists public.jobs (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  icon             text default 'Briefcase',   -- Lucide icon name, e.g. 'Palette', 'Code2'
  type             text default 'Full-time',
  location         text default 'Nairobi, Kenya (Hybrid)',
  summary          text,
  responsibilities text[] default '{}',
  requirements     text[] default '{}',
  status           text not null default 'draft' check (status in ('draft','published')),
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

create index if not exists jobs_status_idx  on public.jobs (status);
create index if not exists jobs_created_idx on public.jobs (created_at desc);

alter table public.jobs enable row level security;

drop policy if exists "Published jobs are publicly readable" on public.jobs;
create policy "Published jobs are publicly readable"
  on public.jobs for select
  using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Admins can manage jobs" on public.jobs;
create policy "Admins can manage jobs"
  on public.jobs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');



-- ── service_images (Services section — admin-managed images) ──
create table if not exists public.service_images (
  slug       text primary key,
  image_url  text not null,
  updated_at timestamptz default now() not null
);

alter table public.service_images enable row level security;

drop policy if exists "Service images are publicly readable" on public.service_images;
create policy "Service images are publicly readable"
  on public.service_images for select
  using (true);

drop policy if exists "Admins can manage service images" on public.service_images;
create policy "Admins can manage service images"
  on public.service_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ── portfolio: gallery / additional images ──
alter table public.portfolio add column if not exists gallery_images text[] default '{}';


-- ── storage: service-images bucket ──
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view service images" on storage.objects;
create policy "Public can view service images"
  on storage.objects for select
  using (bucket_id = 'service-images');

drop policy if exists "Admins can upload service images" on storage.objects;
create policy "Admins can upload service images"
  on storage.objects for insert
  with check (bucket_id = 'service-images' and auth.role() = 'authenticated');

drop policy if exists "Admins can delete service images" on storage.objects;
create policy "Admins can delete service images"
  on storage.objects for delete
  using (bucket_id = 'service-images' and auth.role() = 'authenticated');
