-- ══════════════════════════════════════════════════════════════
-- Migration 004: Create Referrals table
-- Run in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

create table if not exists public.referrals (
  id                uuid        primary key default uuid_generate_v4(),
  referral_code     text        unique not null,
  referrer_name     text        not null,
  referrer_email    text        not null,
  referrer_phone    text,
  referred_name     text        not null,
  referred_email    text,
  referred_phone    text,
  referred_service  text,
  project_amount    numeric     default 0,
  commission_amount numeric     default 0,
  status            text        not null default 'pending'
                    check (status in ('pending','contacted','in_progress','completed','paid','rejected')),
  notes             text,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

create index if not exists referrals_code_idx   on public.referrals (referral_code);
create index if not exists referrals_status_idx on public.referrals (status);

alter table public.referrals enable row level security;

create policy "Public can insert referrals"
  on public.referrals for insert with check (true);

create policy "Public can view referrals"
  on public.referrals for select using (true);

create policy "Admin can manage referrals"
  on public.referrals for all using (true);

select column_name, data_type from information_schema.columns
where table_name = 'referrals' order by ordinal_position;
