-- Migration: custom_family (text) → custom_families (text[])
-- Run once in Supabase SQL editor for existing databases.

ALTER TABLE public.user_fragrances
  ADD COLUMN IF NOT EXISTS custom_families text[] NOT NULL DEFAULT '{}';

UPDATE public.user_fragrances
  SET custom_families = ARRAY[custom_family]
  WHERE custom_family IS NOT NULL;

ALTER TABLE public.user_fragrances
  DROP COLUMN IF EXISTS custom_family;
