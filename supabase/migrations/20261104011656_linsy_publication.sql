create function public.linsy_search_text(business_name text, offerings jsonb)
returns text language sql immutable set search_path = '' as $$
  select trim(regexp_replace(
    translate(lower(business_name || ' ' || coalesce(
      (select string_agg(service->>'name', ' ') from jsonb_array_elements(offerings) service), ''
    )), 'áéíóúüñ', 'aeiouun'), '[^a-z0-9]+', ' ', 'g'
  ));
$$;

create table public.categories (slug text primary key, name text not null);
create table public.communes (slug text primary key, name text not null);
create table public.user_roles (
  user_id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin', 'professional'))
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users on delete cascade
);

create table public.business_revisions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses on delete cascade,
  status text not null default 'draft' check (status in ('draft','pending','approved','rejected','archived')),
  name text not null check (length(trim(name)) between 1 and 100),
  description text not null check (length(description) <= 2000),
  category text not null references public.categories,
  commune text not null references public.communes,
  modality text not null check (modality in ('local','domicilio','casa')),
  whatsapp text not null check (whatsapp = '' or whatsapp ~ '^569[0-9]{8}$'),
  services jsonb not null default '[]',
  search_text text generated always as (public.linsy_search_text(name, services)) stored,
  photos text[] not null default '{}',
  review_reason text check (length(review_reason) <= 500),
  reviewed_by uuid references auth.users on delete set null,
  reviewed_at timestamptz,
  check (status <> 'rejected' or nullif(trim(review_reason), '') is not null),
  check (status = 'draft' or (whatsapp <> '' and jsonb_array_length(services) > 0)),
  check (jsonb_typeof(services) = 'array' and jsonb_array_length(services) <= 20),
  check (cardinality(photos) <= 6 and array_position(photos, null) is null)
);

create unique index business_working_revision on public.business_revisions (business_id)
  where status in ('draft','pending','rejected');
create unique index business_public_revision on public.business_revisions (business_id) where status = 'approved';
create index business_directory on public.business_revisions (category, commune, name) where status = 'approved';

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users on delete cascade,
  reason text not null check (length(trim(reason)) between 10 and 500),
  created_at timestamptz not null default now(),
  unique (business_id, reporter_id)
);

alter table public.categories enable row level security;
alter table public.communes enable row level security;
alter table public.user_roles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_revisions enable row level security;
alter table public.reports enable row level security;

revoke all on public.categories, public.communes, public.user_roles, public.businesses, public.business_revisions, public.reports from anon, authenticated;
grant select on public.categories, public.communes to anon, authenticated;
grant select (id, business_id, status, name, description, category, commune, modality, whatsapp, services, photos, review_reason, reviewed_at, search_text)
  on public.business_revisions to anon, authenticated;
grant select on public.user_roles, public.businesses, public.reports to authenticated;
grant insert on public.businesses, public.business_revisions, public.reports to authenticated;
grant update (status, name, description, category, commune, modality, whatsapp, services, photos, review_reason, reviewed_by, reviewed_at) on public.business_revisions to authenticated;

create policy category_catalog on public.categories for select to anon, authenticated using (true);
create policy commune_catalog on public.communes for select to anon, authenticated using (true);
create policy own_role on public.user_roles for select to authenticated using (user_id = (select auth.uid()));

create function public.linsy_is_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$ select exists(select 1 from public.user_roles where user_id = (select auth.uid()) and role = 'admin') $$;
revoke all on function public.linsy_is_admin() from public, anon;
grant execute on function public.linsy_is_admin() to authenticated;

create policy own_business on public.businesses for select to authenticated
  using (owner_id = (select auth.uid()));
create policy create_business on public.businesses for insert to authenticated
  with check (owner_id = (select auth.uid()) and exists (
    select 1 from public.user_roles where user_id = (select auth.uid()) and role in ('professional','admin')
  ));

create policy published_revisions on public.business_revisions for select to anon, authenticated
  using (status = 'approved');
create policy private_revisions on public.business_revisions for select to authenticated
  using ((select public.linsy_is_admin()) or exists (select 1 from public.businesses b where b.id = business_id));
create policy create_revision on public.business_revisions for insert to authenticated
  with check (status = 'draft' and review_reason is null and reviewed_by is null and reviewed_at is null
    and exists (select 1 from public.businesses b where b.id = business_id));
create policy edit_revision on public.business_revisions for update to authenticated
  using (status in ('draft','rejected') and exists (select 1 from public.businesses b where b.id = business_id))
  with check (status in ('draft','pending') and review_reason is null and reviewed_by is null and reviewed_at is null
    and exists (select 1 from public.businesses b where b.id = business_id));
create policy moderate_revision on public.business_revisions for update to authenticated
  using ((select public.linsy_is_admin())) with check ((select public.linsy_is_admin()));

create policy admin_reports on public.reports for select to authenticated using ((select public.linsy_is_admin()));
create policy create_report on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and exists (
    select 1 from public.business_revisions r where r.business_id = reports.business_id and r.status = 'approved'
  ));

create schema if not exists linsy_private;
revoke all on schema linsy_private from public, anon, authenticated;

create function linsy_private.assign_role() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.raw_user_meta_data ->> 'account_type' = 'profesional' then
    insert into public.user_roles (user_id, role) values (new.id, 'professional');
  end if;
  return new;
end;
$$;
revoke all on function linsy_private.assign_role() from public, anon, authenticated;
create trigger linsy_assign_role after insert on auth.users for each row execute function linsy_private.assign_role();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('linsy-business-images', 'linsy-business-images', false, 5242880, array['image/jpeg','image/png','image/webp']);

create policy upload_linsy_photo on storage.objects for insert to authenticated with check (
  bucket_id = 'linsy-business-images' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.businesses)
);
create policy own_linsy_photo on storage.objects for select to authenticated using (
  bucket_id = 'linsy-business-images' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy visible_linsy_photo on storage.objects for select to anon, authenticated using (
  bucket_id = 'linsy-business-images' and exists (
    select 1 from public.business_revisions r where storage.objects.name = any(r.photos)
  )
);
create policy discard_linsy_upload on storage.objects for delete to authenticated using (
  bucket_id = 'linsy-business-images' and (storage.foldername(name))[1] = (select auth.uid())::text
  and not exists (select 1 from public.business_revisions r where storage.objects.name = any(r.photos))
);

create function linsy_private.validate_revision() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  business_owner uuid;
  service jsonb;
begin
  select owner_id into strict business_owner from public.businesses where id = new.business_id;
  foreach service in array array(select jsonb_array_elements(new.services)) loop
    if jsonb_typeof(service) <> 'object'
      or jsonb_typeof(service->'name') is distinct from 'string'
      or length(trim(service->>'name')) not between 1 and 100
      or (service - 'name' - 'price') <> '{}'::jsonb
      or (service->>'price' is not null and (
        jsonb_typeof(service->'price') <> 'number' or service->>'price' !~ '^[0-9]{1,9}$'
      )) then
      raise exception 'Servicio inválido';
    end if;
  end loop;
  if exists (select 1 from unnest(new.photos) p where
    split_part(p, '/', 1) <> business_owner::text or not exists (
      select 1 from storage.objects where bucket_id = 'linsy-business-images' and name = p
    )
  ) then
    raise exception 'Foto inválida';
  end if;
  return new;
end;
$$;
revoke all on function linsy_private.validate_revision() from public, anon, authenticated;
create trigger validate_linsy_revision before insert or update of services, photos on public.business_revisions
  for each row execute function linsy_private.validate_revision();

create function public.linsy_review(revision_id uuid, approve boolean, reason text)
returns void language plpgsql security invoker set search_path = '' as $$
declare target_business uuid;
begin
  if not public.linsy_is_admin() then raise exception 'Acceso restringido'; end if;
  select business_id into target_business from public.business_revisions
    where id = revision_id and status = 'pending' for update;
  if not found then raise exception 'La revisión ya fue procesada'; end if;
  if approve then
    update public.business_revisions set status = 'archived'
      where business_id = target_business and status = 'approved';
  end if;
  update public.business_revisions
    set status = case when approve then 'approved' else 'rejected' end,
        review_reason = case when approve then null else trim(reason) end,
        reviewed_by = auth.uid(), reviewed_at = now()
    where id = revision_id;
end;
$$;
revoke all on function public.linsy_review(uuid,boolean,text) from public, anon;
grant execute on function public.linsy_review(uuid,boolean,text) to authenticated;

insert into public.categories (slug, name) values
  ('peluqueria','Peluquería'),
  ('cosmetologia','Cosmetología y faciales'),
  ('pestanas','Pestañas y lashistas'),
  ('barberia','Barbería'),
  ('unas','Manicure y uñas'),
  ('maquillaje','Maquillaje'),
  ('cejas','Diseño de cejas'),
  ('depilacion','Depilación'),
  ('masajes','Masajes'),
  ('corporales','Tratamientos corporales'),
  ('novias-eventos','Novias y eventos');

insert into public.communes (slug, name) values
  ('valparaiso','Valparaíso'),
  ('vina-del-mar','Viña del Mar'),
  ('concon','Concón'),
  ('quintero','Quintero'),
  ('puchuncavi','Puchuncaví'),
  ('casablanca','Casablanca'),
  ('juan-fernandez','Juan Fernández'),
  ('quilpue','Quilpué'),
  ('villa-alemana','Villa Alemana'),
  ('limache','Limache'),
  ('olmue','Olmué'),
  ('quillota','Quillota'),
  ('la-calera','La Calera'),
  ('hijuelas','Hijuelas'),
  ('la-cruz','La Cruz'),
  ('nogales','Nogales'),
  ('san-antonio','San Antonio'),
  ('cartagena','Cartagena'),
  ('el-quisco','El Quisco'),
  ('el-tabo','El Tabo'),
  ('algarrobo','Algarrobo'),
  ('santo-domingo','Santo Domingo'),
  ('san-felipe','San Felipe'),
  ('llaillay','Llaillay'),
  ('catemu','Catemu'),
  ('panquehue','Panquehue'),
  ('putaendo','Putaendo'),
  ('santa-maria','Santa María'),
  ('los-andes','Los Andes'),
  ('calle-larga','Calle Larga'),
  ('rinconada','Rinconada'),
  ('san-esteban','San Esteban'),
  ('la-ligua','La Ligua'),
  ('cabildo','Cabildo'),
  ('papudo','Papudo'),
  ('petorca','Petorca'),
  ('zapallar','Zapallar'),
  ('isla-de-pascua','Isla de Pascua');
