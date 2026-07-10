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
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null,
  image_url   text,
  category    text not null check (category in ('Web Design','Branding','Graphics','SEO Projects','Real Estate')),
  live_url    text,
  emoji       text default '🖼️',
  created_at  timestamptz default now() not null
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
