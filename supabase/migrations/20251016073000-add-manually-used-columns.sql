-- Add manually_used flags for prompts and images
alter table public.prompts
  add column if not exists manually_used boolean not null default false;

alter table public.images
  add column if not exists manually_used boolean not null default false;
