-- ============================================================
--  Phase 3 – Analytics-Aggregate (SECURITY INVOKER → RLS greift)
-- ============================================================

-- Kennzahlen-Überblick für das Zeitfenster der letzten p_days Tage.
create or replace function public.analytics_overview(p_days int)
returns table(total bigint, visitors bigint, last24h bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    count(*)                                              as total,
    count(distinct ip_hash)                               as visitors,
    count(*) filter (where ts >= now() - interval '24 hours') as last24h
  from public.scans
  where ts >= now() - make_interval(days => p_days);
$$;

-- Tages-Zeitreihe (mit Lücken-Auffüllung für saubere Charts).
create or replace function public.scan_timeseries(p_days int)
returns table(day date, scans bigint)
language sql
stable
security invoker
set search_path = public
as $$
  with d as (
    select generate_series(
      current_date - (p_days - 1),
      current_date,
      interval '1 day'
    )::date as day
  )
  select d.day, count(s.id) as scans
  from d
  left join public.scans s on s.ts::date = d.day
  group by d.day
  order by d.day;
$$;

-- Verteilung nach Dimension (device_type | os | browser | country).
create or replace function public.scan_breakdown(p_dimension text, p_days int)
returns table(label text, scans bigint)
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if p_dimension not in ('device_type', 'os', 'browser', 'country') then
    raise exception 'invalid dimension';
  end if;

  return query execute format(
    'select coalesce(nullif(%I, '''')::text, ''Unbekannt'') as label, count(*) as scans
       from public.scans
      where ts >= now() - make_interval(days => $1)
      group by 1
      order by 2 desc
      limit 8',
    p_dimension
  ) using p_days;
end;
$$;

-- Top-QR-Codes nach Scans im Zeitfenster.
create or replace function public.top_qr(p_days int)
returns table(qr_id uuid, name text, scans bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select q.id, q.name, count(s.id) as scans
  from public.qr_codes q
  join public.links l on l.id = q.link_id
  left join public.scans s
    on s.link_id = l.id
   and s.ts >= now() - make_interval(days => p_days)
  where q.type = 'tracked'
  group by q.id, q.name
  order by scans desc, q.name
  limit 5;
$$;
