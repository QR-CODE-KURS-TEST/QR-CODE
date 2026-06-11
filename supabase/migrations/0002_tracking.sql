-- ============================================================
--  Phase 2 – Redirect & Scan-Tracking
-- ============================================================

-- Löst einen Slug auf, protokolliert den Scan und gibt das Ziel zurück.
-- SECURITY DEFINER → läuft mit Owner-Rechten und umgeht so RLS für den
-- anonymen Scanner (kein Service-Role-Key nötig). Status:
--   'ok' (+ destination) | 'not_found' | 'inactive'
create or replace function public.record_scan(
  p_slug        text,
  p_ip_hash     text default null,
  p_country     text default null,
  p_region      text default null,
  p_city        text default null,
  p_device_type text default null,
  p_os          text default null,
  p_browser     text default null,
  p_referrer    text default null,
  p_user_agent  text default null
)
returns table(destination text, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id          uuid;
  v_destination text;
  v_active      boolean;
begin
  select l.id, l.destination_url, l.is_active
    into v_id, v_destination, v_active
  from public.links l
  where l.slug = p_slug;

  if v_id is null then
    return query select null::text, 'not_found'::text;
    return;
  end if;

  if not v_active then
    return query select null::text, 'inactive'::text;
    return;
  end if;

  insert into public.scans (
    link_id, ip_hash, country, region, city,
    device_type, os, browser, referrer, user_agent
  ) values (
    v_id, p_ip_hash, p_country, p_region, p_city,
    p_device_type, p_os, p_browser, p_referrer, p_user_agent
  );

  return query select v_destination, 'ok'::text;
end;
$$;

revoke all on function public.record_scan(
  text, text, text, text, text, text, text, text, text, text
) from public;
grant execute on function public.record_scan(
  text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;

-- Löst einen Slug NUR auf (ohne Scan zu loggen) – für Bots/Previews.
create or replace function public.resolve_link(p_slug text)
returns table(destination text, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id          uuid;
  v_destination text;
  v_active      boolean;
begin
  select l.id, l.destination_url, l.is_active
    into v_id, v_destination, v_active
  from public.links l
  where l.slug = p_slug;

  if v_id is null then
    return query select null::text, 'not_found'::text;
    return;
  end if;
  if not v_active then
    return query select null::text, 'inactive'::text;
    return;
  end if;
  return query select v_destination, 'ok'::text;
end;
$$;

revoke all on function public.resolve_link(text) from public;
grant execute on function public.resolve_link(text) to anon, authenticated;

-- ---------- Link-Übersicht mit Scan-Statistik ----------
-- security_invoker = on → RLS der Basistabellen greift (jeder sieht nur Eigenes).
create or replace view public.link_overview
with (security_invoker = on) as
select
  l.id,
  l.user_id,
  l.slug,
  l.destination_url,
  l.is_active,
  l.created_at,
  q.id   as qr_id,
  q.name as qr_name,
  count(s.id)  as scan_count,
  max(s.ts)    as last_scan
from public.links l
left join public.qr_codes q on q.link_id = l.id
left join public.scans s    on s.link_id = l.id
group by l.id, q.id, q.name;
