-- ═══════════════════════════════════════════════════════════════════════════
-- SPRITZ — Database Schema
-- Run this entire file in the Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → paste → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────
do $$ begin
  create type scent_family as enum (
    'woody', 'fresh', 'floral', 'oriental', 'green', 'amber',
    'citrica', 'fougere', 'chipre', 'gourmand',
    'aromatica', 'acuatica', 'afrutada', 'cuero'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type fragrance_status as enum (
    'active', 'empty', 'wishlist', 'sold'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type fragrance_gender as enum ('masculine', 'feminine', 'unisex');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fragrance_concentration as enum (
    'EDT', 'EDP', 'parfum', 'cologne', 'mist'
  );
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  location      jsonb default '{}'::jsonb,
  -- shape: { city: string, lat: number, lon: number }
  preferences   jsonb default '{}'::jsonb,
  -- shape: { defaultOccasion: string, preferredFamilies: string[], notificationTime: string }
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────
-- FRAGRANCES (public catalog)
-- ─────────────────────────────────────────
create table if not exists public.fragrances (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  brand           text not null,
  family          text not null,
  -- Using text instead of enum for flexibility with external data
  top_notes       text[] default '{}',
  middle_notes    text[] default '{}',
  base_notes      text[] default '{}',
  description     text,
  image_url       text,
  external_id     text unique,
  -- external_id: Fragrantica/Parfumo ID for deduplication
  gender          text,
  concentration   text,
  year_released   integer,
  created_at      timestamptz default now() not null
);

-- Public catalog: anyone can read, only service role can write
alter table public.fragrances enable row level security;

create policy "Anyone can read fragrances"
  on public.fragrances for select
  using (true);

create policy "Service role can insert fragrances"
  on public.fragrances for insert
  with check (true);

-- Full-text search index on name + brand
create index if not exists fragrances_search_idx
  on public.fragrances
  using gin (to_tsvector('spanish', name || ' ' || brand));

-- ─────────────────────────────────────────
-- USER_FRAGRANCES (personal collection)
-- ─────────────────────────────────────────
create table if not exists public.user_fragrances (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  fragrance_id    uuid references public.fragrances(id) on delete set null,
  -- null = fully manual/custom entry

  -- Custom entry fields (used when fragrance_id is null)
  custom_name     text,
  custom_brand    text,
  custom_families text[] default '{}',
  custom_notes    jsonb default '{}'::jsonb,
  -- shape: { top: string[], middle: string[], base: string[] }

  -- Personal fields
  photo_url       text,
  personal_notes  text,
  status          text not null default 'active',
  ml_remaining    integer,
  purchase_date   date,
  purchase_price  numeric(10, 2),

  -- Personal tags
  occasion_tags   text[] default '{}',
  season_tags     text[] default '{}',
  mood_tags       text[] default '{}',

  date_added      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,

  -- Prevent adding same catalog fragrance twice
  unique nulls not distinct (user_id, fragrance_id)
);

alter table public.user_fragrances enable row level security;

create policy "Users can manage own wardrobe"
  on public.user_fragrances for all
  using (auth.uid() = user_id);

create index if not exists user_fragrances_user_idx
  on public.user_fragrances(user_id);

create trigger user_fragrances_updated_at
  before update on public.user_fragrances
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────
-- WEAR_LOGS (daily wear records)
-- ─────────────────────────────────────────
create table if not exists public.wear_logs (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  user_fragrance_id   uuid not null references public.user_fragrances(id) on delete cascade,
  worn_at             timestamptz not null default now(),
  occasion            text,
  mood                text,
  weather_data        jsonb default '{}'::jsonb,
  -- shape: { temp: number, feels_like: number, condition: string, humidity: number, description: string }
  ai_recommended      boolean not null default false,
  rating              integer check (rating between 1 and 5),
  notes               text,
  created_at          timestamptz default now() not null
);

alter table public.wear_logs enable row level security;

create policy "Users can manage own wear logs"
  on public.wear_logs for all
  using (auth.uid() = user_id);

create index if not exists wear_logs_user_date_idx
  on public.wear_logs(user_id, worn_at desc);

create index if not exists wear_logs_fragrance_idx
  on public.wear_logs(user_fragrance_id);

-- ─────────────────────────────────────────
-- STORAGE BUCKETS
-- (Run separately in Supabase Storage UI or via API)
-- ─────────────────────────────────────────
-- Bucket 1: fragrance-photos (private, user uploads)
--   Path pattern: {user_id}/{filename}
--   Max size: 5 MB
--   Allowed types: image/jpeg, image/png, image/webp
--
-- Bucket 2: fragrance-catalog (public, catalog images)
--   Public access: true
--   Max size: 2 MB
--
-- To create via SQL:
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values
--   ('fragrance-photos', 'fragrance-photos', false, 5242880, '{image/jpeg,image/png,image/webp}'),
--   ('fragrance-catalog', 'fragrance-catalog', true, 2097152, '{image/jpeg,image/png,image/webp}');
