-- AURA core — ap-south-1, INR en-IN, DPDP aligned
-- RLS: deny all by default, explicit owner_id scoping only (never USING(true))

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  simple_mode boolean default false,
  dyslexia_mode boolean default false,
  impairments jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "owner only profiles" on public.profiles;
create policy "owner only profiles" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- accounts
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  balance numeric(12,2) not null default 0,
  currency text not null default 'INR',
  created_at timestamptz default now()
);
alter table public.accounts enable row level security;
drop policy if exists "owner only accounts" on public.accounts;
create policy "owner only accounts" on public.accounts for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete cascade,
  amount numeric(12,2) not null,
  payee text not null,
  payee_trusted boolean default false,
  category text,
  flagged boolean default false,
  created_at timestamptz default now()
);
alter table public.transactions enable row level security;
drop policy if exists "owner only transactions" on public.transactions;
create policy "owner only transactions" on public.transactions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- fraud_events (AI audit, intent-only)
create table if not exists public.fraud_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid references public.transactions(id) on delete set null,
  query text not null,
  risk_score smallint not null check (risk_score >= 0 and risk_score <= 100),
  flags text[] default '{}',
  action text not null check (action in ('allow','intercept','allow_after_hold')),
  model text default 'rule-fallback',
  created_at timestamptz default now()
);
alter table public.fraud_events enable row level security;
drop policy if exists "owner only fraud_events" on public.fraud_events;
create policy "owner only fraud_events" on public.fraud_events for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- biometric_sessions
create table if not exists public.biometric_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  method text not null check (method in ('webauthn','behavioral_mock')),
  success boolean not null,
  risk_score smallint,
  created_at timestamptz default now()
);
alter table public.biometric_sessions enable row level security;
drop policy if exists "owner only biometric_sessions" on public.biometric_sessions;
create policy "owner only biometric_sessions" on public.biometric_sessions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- trusted_contacts
create table if not exists public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null,
  contact_email text not null,
  created_at timestamptz default now()
);
alter table public.trusted_contacts enable row level security;
drop policy if exists "owner only trusted_contacts" on public.trusted_contacts;
create policy "owner only trusted_contacts" on public.trusted_contacts for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
