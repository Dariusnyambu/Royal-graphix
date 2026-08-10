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

-- Seed the two current openings, once, if the table is empty.
insert into public.jobs (title, icon, type, location, summary, responsibilities, requirements, status)
select * from (values
  ('Graphic Designer', 'Palette', 'Full-time', 'Nairobi, Kenya (Hybrid)',
   'Own the visual identity of client brands — from logos and social content to full brand systems — for our growing roster of Kenyan and international clients.',
   array['Design logos, brand identities, and marketing collateral for clients','Create social media graphics, posters, and campaign assets','Collaborate with the web team on landing page and UI visuals','Maintain brand consistency across every client deliverable','Turn client feedback into polished, on-brief revisions quickly'],
   array['1+ years of professional graphic design experience','Strong portfolio across branding, print, and digital design','Proficiency in Adobe Creative Suite and/or Figma','Sharp eye for typography, color, and layout','Able to manage multiple projects and deadlines'],
   'published'),
  ('Senior Developer', 'Code2', 'Full-time', 'Nairobi, Kenya (Hybrid)',
   'Lead development of client web platforms end-to-end — from architecture to deployment — mentoring the team while shipping fast, reliable products.',
   array['Architect and build client web apps with React and modern tooling','Design and maintain Supabase/Postgres schemas and APIs','Review code, mentor junior developers, and set engineering standards','Own deployments (Vercel) and performance/SEO best practices','Work directly with clients to scope technical requirements'],
   array['4+ years of professional web development experience','Strong command of React, JavaScript/TypeScript, and REST/SQL','Experience with Supabase, Firebase, or similar backends','Comfortable owning a project from spec to production','Excellent communication with both clients and teammates'],
   'published')
) as seed
where not exists (select 1 from public.jobs);


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
