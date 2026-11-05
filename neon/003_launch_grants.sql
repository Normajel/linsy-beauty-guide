create table linsy.launch_grants (
  slot integer primary key check (slot between 1 and 20),
  business_id uuid not null unique references linsy.businesses(id),
  starts_on date not null,
  ends_on date not null check (ends_on >= starts_on),
  assigned_at timestamptz not null default now(),
  assigned_by text not null
);

create function linsy.assign_launch_grant(actor text, business uuid, starts date, ends date)
returns integer language plpgsql set search_path = '' as $$
declare assigned_slot integer;
begin
  if not exists (select 1 from linsy.user_roles where user_id = actor and role = 'admin') then
    raise exception 'forbidden';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(77255993);
  select slot into assigned_slot from linsy.launch_grants
    where business_id = business and starts_on = starts and ends_on = ends;
  if found then return assigned_slot; end if;
  if exists (select 1 from linsy.launch_grants where business_id = business) then
    raise exception 'launch_already_assigned';
  end if;
  if not exists (select 1 from linsy.business_revisions where business_id = business and status <> 'archived') then
    raise exception 'subscription_unavailable';
  end if;
  select min(candidate) into assigned_slot from pg_catalog.generate_series(1,20) candidate
    where not exists (select 1 from linsy.launch_grants where slot = candidate);
  if assigned_slot is null then raise exception 'launch_quota_full'; end if;
  insert into linsy.launch_grants (slot,business_id,starts_on,ends_on,assigned_by)
    values (assigned_slot,business,starts,ends,actor);
  return assigned_slot;
end;
$$;
