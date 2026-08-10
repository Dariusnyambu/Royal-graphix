-- ══════════════════════════════════════════════════════════════
-- Migration 003: Create Projects / Task Tracker table
-- Run in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

create table if not exists public.projects (
  id            uuid        primary key default uuid_generate_v4(),
  client_name   text        not null,
  client_email  text,
  client_phone  text,
  project_type  text        not null,
  title         text        not null,
  description   text,
  status        text        not null default 'received'
                            check (status in ('received','awaiting_payment','paid','in_progress','review','delivered','cancelled')),
  priority      text        not null default 'normal'
                            check (priority in ('low','normal','high','urgent')),
  amount        numeric,
  deadline      date,
  notes         text,
  tracking_code text        unique,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

create index if not exists projects_status_idx   on public.projects (status);
create index if not exists projects_tracking_idx on public.projects (tracking_code);

alter table public.projects enable row level security;

drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects"
  on public.projects for select using (true);

drop policy if exists "Admin can manage projects" on public.projects;
create policy "Admin can manage projects"
  on public.projects for all using (true);

-- Verify
select column_name, data_type from information_schema.columns
where table_name = 'projects' order by ordinal_position;
