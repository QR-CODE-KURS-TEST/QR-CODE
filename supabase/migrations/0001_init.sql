-- ============================================================
--  QR-SaaS – Initiales Schema (Phase 0)
-- ============================================================

-- ---------- Enums ----------
do $$ begin
  create type plan_tier as enum ('free', 'pro', 'business');
exception when duplicate_object then null; end $$;

do $$ begin
  create type qr_type as enum ('static', 'tracked');
exception when duplicate_object then null; end $$;

-- ---------- profiles (1:1 zu auth.users) ----------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text,
  full_name          text,
  avatar_url         text,
  plan               plan_tier   not null default 'free',
  stripe_customer_id text unique,
  created_at         timestamptz not null default now()
);

-- ---------- subscriptions ----------
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id        text,
  status                 text,
  plan                   plan_tier   not null default 'free',
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ---------- links (nur Tracked-Modus) ----------
create table if not exists public.links (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  slug            text not null unique,
  destination_url text not null,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

-- ---------- qr_codes ----------
create table if not exists public.qr_codes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null default 'Unbenannter QR-Code',
  type       qr_type not null,
  design     jsonb   not null default '{}'::jsonb,
  target_url text,                                              -- nur static
  link_id    uuid references public.links(id) on delete set null, -- nur tracked
  created_at timestamptz not null default now()
);

-- ---------- scans (Analytics-Events) ----------
create table if not exists public.scans (
  id          bigint generated always as identity primary key,
  link_id     uuid not null references public.links(id) on delete cascade,
  ts          timestamptz not null default now(),
  ip_hash     text,
  country     text,
  region      text,
  city        text,
  device_type text,
  os          text,
  browser     text,
  referrer    text,
  user_agent  text
);

-- ---------- Indizes ----------
create index if not exists idx_qr_codes_user on public.qr_codes (user_id);
create index if not exists idx_links_user    on public.links (user_id);
create index if not exists idx_scans_link_ts on public.scans (link_id, ts desc);

-- ---------- updated_at-Trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------- Auto-Profil bei neuem Auth-User ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.links         enable row level security;
alter table public.qr_codes      enable row level security;
alter table public.scans         enable row level security;

-- profiles: jeder sieht/ändert nur sein eigenes
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- subscriptions: nur lesen (Schreiben via Service-Role im Stripe-Webhook)
drop policy if exists "subs_select_own" on public.subscriptions;
create policy "subs_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- links: voller CRUD-Zugriff auf eigene
drop policy if exists "links_all_own" on public.links;
create policy "links_all_own" on public.links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- qr_codes: voller CRUD-Zugriff auf eigene
drop policy if exists "qr_all_own" on public.qr_codes;
create policy "qr_all_own" on public.qr_codes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- scans: Owner darf nur lesen (Insert erfolgt in Phase 2 via SECURITY-DEFINER-RPC)
drop policy if exists "scans_select_own" on public.scans;
create policy "scans_select_own" on public.scans
  for select using (
    exists (
      select 1 from public.links l
      where l.id = scans.link_id and l.user_id = auth.uid()
    )
  );
