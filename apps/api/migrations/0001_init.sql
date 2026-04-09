create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  viewport jsonb not null default '{"x":0,"y":0,"zoom":1}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null unique references boards(id) on delete cascade,
  schema_version text not null,
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  variables jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  type text not null,
  storage_path text not null,
  metadata jsonb not null default '{}'::jsonb,
  thumbnail_path text,
  created_at timestamptz not null default now()
);

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  status text not null,
  provider text not null,
  started_at timestamptz,
  finished_at timestamptz,
  logs jsonb not null default '[]'::jsonb,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists variants (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references runs(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  score numeric,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists provider_configs (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  encrypted_key text not null,
  endpoint text,
  model_defaults jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
