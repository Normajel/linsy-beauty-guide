create table linsy.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_name text not null check (length(trim(business_name)) between 1 and 120),
  contact_name text not null check (length(trim(contact_name)) between 1 and 120),
  contact_email text not null check (length(contact_email) between 3 and 254),
  commune text not null references linsy.communes(slug),
  plan text not null check (length(trim(plan)) between 1 and 100),
  price_clp integer not null check (price_clp > 0),
  starts_on date not null,
  cancelled_at timestamptz,
  cancelled_by text,
  created_at timestamptz not null default now(),
  created_by text not null
);

create table linsy.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references linsy.subscriptions(id),
  amount_clp integer not null check (amount_clp > 0),
  paid_on date not null,
  next_renewal date not null check (next_renewal > paid_on),
  method text not null check (method in ('transferencia', 'efectivo', 'otro')),
  reference text not null check (length(reference) <= 160),
  confirmed_by text not null,
  created_at timestamptz not null default now(),
  unique (subscription_id, next_renewal)
);

create function linsy.record_subscription_payment(
  actor text, subscription uuid, amount integer, paid date, renewal date, payment_method text, receipt text
) returns void language plpgsql set search_path = '' as $$
declare
  contract linsy.subscriptions;
  previous_renewal date;
begin
  if not exists (select 1 from linsy.user_roles where user_id = actor and role = 'admin') then
    raise exception 'forbidden';
  end if;
  select * into contract from linsy.subscriptions where id = subscription for update;
  if not found or contract.cancelled_at is not null then raise exception 'subscription_unavailable'; end if;
  if exists (
    select 1 from linsy.subscription_payments p where p.subscription_id = subscription
      and p.next_renewal = renewal and p.amount_clp = amount and p.paid_on = paid
      and p.method = payment_method and p.reference = receipt
  ) then return; end if;
  select max(next_renewal) into previous_renewal from linsy.subscription_payments where subscription_id = subscription;
  if paid > (now() at time zone 'America/Santiago')::date
     or renewal <= greatest(contract.starts_on, paid, previous_renewal) then
    raise exception 'invalid_payment_dates';
  end if;
  insert into linsy.subscription_payments (subscription_id, amount_clp, paid_on, next_renewal, method, reference, confirmed_by)
  values (subscription, amount, paid, renewal, payment_method, receipt, actor);
end;
$$;
