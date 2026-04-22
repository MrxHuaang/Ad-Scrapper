-- Add snapshot fields to render saved ADs without re-scraping
-- Safe to apply after 20260422_000001_ad_detail_core.sql

alter table public.ad_saved
  add column if not exists subject text,
  add column if not exists pdf_link text,
  add column if not exists make text,
  add column if not exists model text,
  add column if not exists effective_date text,
  add column if not exists status text,
  add column if not exists product_type text;

