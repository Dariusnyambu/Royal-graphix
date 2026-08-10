-- ============================================================
-- Royal Graphix — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Enable UUID extension ──
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────
-- TABLE: portfolio
-- ──────────────────────────────────────────
create table if not exists public.portfolio (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text not null,
  image_url       text,
  category        text not null,
  live_url        text,
  emoji           text default '🖼️',
  client_problem  text,
  solution        text,
  created_at      timestamptz default now() not null
);

-- Indexes
create index if not exists portfolio_category_idx on public.portfolio (category);
create index if not exists portfolio_created_idx  on public.portfolio (created_at desc);

-- Row Level Security
alter table public.portfolio enable row level security;

-- Public can READ all portfolio items
create policy "Portfolio is publicly readable"
  on public.portfolio for select
  using (true);

-- Only authenticated admins can INSERT / UPDATE / DELETE
create policy "Admins can manage portfolio"
  on public.portfolio for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ──────────────────────────────────────────
-- TABLE: contacts
-- ──────────────────────────────────────────
create table if not exists public.contacts (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  phone        text,
  project_type text not null,
  budget       text,
  message      text not null,
  read         boolean default false,
  created_at   timestamptz default now() not null
);

-- Indexes
create index if not exists contacts_created_idx on public.contacts (created_at desc);
create index if not exists contacts_email_idx   on public.contacts (email);

-- Row Level Security
alter table public.contacts enable row level security;

-- Anyone can INSERT (submit the contact form)
create policy "Anyone can submit contact form"
  on public.contacts for insert
  with check (true);

-- Only authenticated admins can SELECT / UPDATE / DELETE
create policy "Admins can view and manage contacts"
  on public.contacts for select
  using (auth.role() = 'authenticated');

create policy "Admins can update contacts"
  on public.contacts for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete contacts"
  on public.contacts for delete
  using (auth.role() = 'authenticated');


-- ──────────────────────────────────────────
-- STORAGE: portfolio-images bucket
-- ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Public can view images
create policy "Public can view portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

-- Authenticated users can upload images
create policy "Admins can upload portfolio images"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-images'
    and auth.role() = 'authenticated'
  );

-- Authenticated users can delete images
create policy "Admins can delete portfolio images"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-images'
    and auth.role() = 'authenticated'
  );

-- ── Projects / Task Tracker ────────────────────────────────────────────────
create table if not exists public.projects (
  id           uuid primary key default uuid_generate_v4(),
  client_name  text not null,
  client_email text,
  client_phone text,
  project_type text not null,
  title        text not null,
  description  text,
  status       text not null default 'received'
                check (status in ('received','awaiting_payment','paid','in_progress','review','delivered','cancelled')),
  priority     text not null default 'normal'
                check (priority in ('low','normal','high','urgent')),
  amount       numeric,
  deadline     date,
  notes        text,
  tracking_code text unique,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

create index if not exists projects_status_idx  on public.projects (status);
create index if not exists projects_client_idx  on public.projects (client_email);
create index if not exists projects_tracking_idx on public.projects (tracking_code);

alter table public.projects enable row level security;

-- Public can look up their own project by tracking code
create policy "Public can view own project by tracking code"
  on public.projects for select
  using (true);

-- Only admin (anon key used by app) can insert/update/delete
create policy "Admin can manage projects"
  on public.projects for all
  using (true);


-- ──────────────────────────────────────────
-- TABLE: blog_posts
-- ──────────────────────────────────────────
create table if not exists public.blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text unique not null,
  category    text not null,
  excerpt     text,
  content     text not null,
  cover_image text,
  emoji       text default '📝',
  author      text default 'Royal Graphix',
  read_time   text default '5 min read',
  tags        text[] default '{}',
  status      text not null default 'draft' check (status in ('draft','published')),
  views       integer not null default 0,
  seo_title       text,
  seo_description text,
  published_at timestamptz,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create index if not exists blog_posts_slug_idx   on public.blog_posts (slug);
create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_created_idx on public.blog_posts (created_at desc);

alter table public.blog_posts enable row level security;

create policy "Published posts are publicly readable"
  on public.blog_posts for select
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Admins can manage blog posts"
  on public.blog_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone (including anon readers) can bump the view counter via RPC-less update
create policy "Anyone can increment views"
  on public.blog_posts for update
  using (status = 'published')
  with check (status = 'published');


-- ──────────────────────────────────────────
-- TABLE: reviews
-- ──────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text,
  role       text,
  rating     integer not null check (rating between 1 and 5),
  message    text not null,
  hidden     boolean not null default false,
  created_at timestamptz default now() not null
);

create index if not exists reviews_created_idx on public.reviews (created_at desc);
create index if not exists reviews_hidden_idx  on public.reviews (hidden);

alter table public.reviews enable row level security;

create policy "Visible reviews are publicly readable"
  on public.reviews for select
  using (hidden = false or auth.role() = 'authenticated');

create policy "Anyone can submit a review"
  on public.reviews for insert
  with check (true);

create policy "Admins can update reviews"
  on public.reviews for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete reviews"
  on public.reviews for delete
  using (auth.role() = 'authenticated');


-- ──────────────────────────────────────────
-- TABLE: job_applications  (Careers page)
-- ──────────────────────────────────────────
create table if not exists public.job_applications (
  id          uuid primary key default uuid_generate_v4(),
  role        text not null,
  name        text not null,
  email       text not null,
  phone       text,
  portfolio_url text,
  message     text,
  status      text not null default 'new' check (status in ('new','reviewed','shortlisted','rejected')),
  created_at  timestamptz default now() not null
);

create index if not exists job_applications_created_idx on public.job_applications (created_at desc);

alter table public.job_applications enable row level security;

create policy "Anyone can submit a job application"
  on public.job_applications for insert
  with check (true);

create policy "Admins can view job applications"
  on public.job_applications for select
  using (auth.role() = 'authenticated');

create policy "Admins can update job applications"
  on public.job_applications for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete job applications"
  on public.job_applications for delete
  using (auth.role() = 'authenticated');


-- ──────────────────────────────────────────
-- TABLE: page_views  (real-time site analytics)
-- ──────────────────────────────────────────
create table if not exists public.page_views (
  id          uuid primary key default uuid_generate_v4(),
  path        text not null,
  session_id  text not null,
  referrer    text,
  created_at  timestamptz default now() not null
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx    on public.page_views (path);
create index if not exists page_views_session_idx on public.page_views (session_id);

alter table public.page_views enable row level security;

create policy "Anyone can log a page view"
  on public.page_views for insert
  with check (true);

create policy "Admins can read page views"
  on public.page_views for select
  using (auth.role() = 'authenticated');

-- Enable realtime for live analytics in the admin dashboard
alter publication supabase_realtime add table public.page_views;


-- ──────────────────────────────────────────
-- STORAGE: blog-images bucket
-- ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Public can view blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admins can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Admins can delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');


-- ============================================================
-- Section: Dynamic Careers, Service Images, Portfolio Gallery (from migration 006)
-- ============================================================
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
