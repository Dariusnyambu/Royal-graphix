-- ============================================================
-- Migration 005 — Blog engine, Reviews, Careers, Real-time Analytics
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run on an existing database — uses IF NOT EXISTS / ADD COLUMN guards.
-- ============================================================

-- ── portfolio: add case-study fields, free-form category ──
alter table public.portfolio drop constraint if exists portfolio_category_check;
alter table public.portfolio add column if not exists client_problem text;
alter table public.portfolio add column if not exists solution text;

-- ── blog_posts ──
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

create index if not exists blog_posts_slug_idx    on public.blog_posts (slug);
create index if not exists blog_posts_status_idx  on public.blog_posts (status);
create index if not exists blog_posts_created_idx on public.blog_posts (created_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "Published posts are publicly readable" on public.blog_posts;
create policy "Published posts are publicly readable"
  on public.blog_posts for select
  using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Admins can manage blog posts" on public.blog_posts;
create policy "Admins can manage blog posts"
  on public.blog_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Anyone can increment views" on public.blog_posts;
create policy "Anyone can increment views"
  on public.blog_posts for update
  using (status = 'published')
  with check (status = 'published');

-- ── reviews ──
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

drop policy if exists "Visible reviews are publicly readable" on public.reviews;
create policy "Visible reviews are publicly readable"
  on public.reviews for select
  using (hidden = false or auth.role() = 'authenticated');

drop policy if exists "Anyone can submit a review" on public.reviews;
create policy "Anyone can submit a review"
  on public.reviews for insert
  with check (true);

drop policy if exists "Admins can update reviews" on public.reviews;
create policy "Admins can update reviews"
  on public.reviews for update
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews"
  on public.reviews for delete
  using (auth.role() = 'authenticated');

-- ── job_applications (Careers page) ──
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

drop policy if exists "Anyone can submit a job application" on public.job_applications;
create policy "Anyone can submit a job application"
  on public.job_applications for insert
  with check (true);

drop policy if exists "Admins can view job applications" on public.job_applications;
create policy "Admins can view job applications"
  on public.job_applications for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can update job applications" on public.job_applications;
create policy "Admins can update job applications"
  on public.job_applications for update
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete job applications" on public.job_applications;
create policy "Admins can delete job applications"
  on public.job_applications for delete
  using (auth.role() = 'authenticated');

-- ── page_views (real-time analytics) ──
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

drop policy if exists "Anyone can log a page view" on public.page_views;
create policy "Anyone can log a page view"
  on public.page_views for insert
  with check (true);

drop policy if exists "Admins can read page views" on public.page_views;
create policy "Admins can read page views"
  on public.page_views for select
  using (auth.role() = 'authenticated');

-- Enable realtime so the admin dashboard can subscribe to live page views
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'page_views'
  ) then
    alter publication supabase_realtime add table public.page_views;
  end if;
end $$;

-- ── blog-images storage bucket ──
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');
