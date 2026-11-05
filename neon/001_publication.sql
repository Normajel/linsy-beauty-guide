create schema linsy;

create function linsy.linsy_search_text(business_name text, offerings jsonb)
returns text language sql immutable set search_path = '' as $$
  select trim(regexp_replace(
    translate(lower(business_name || ' ' || coalesce(
      (select string_agg(service->>'name', ' ') from jsonb_array_elements(offerings) service), ''
    )), 'áéíóúüñ', 'aeiouun'), '[^a-z0-9]+', ' ', 'g'
  ));
$$;

create table linsy.categories (slug text primary key, name text not null);
create table linsy.communes (slug text primary key, name text not null);
create table linsy.user_roles (
  user_id text primary key,
  role text not null check (role = 'admin')
);

create table linsy.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null unique
);

create table linsy.business_revisions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references linsy.businesses on delete cascade,
  status text not null default 'draft' check (status in ('draft','pending','approved','rejected','archived')),
  name text not null check (length(trim(name)) between 1 and 100),
  description text not null check (length(description) <= 2000),
  category text not null references linsy.categories,
  commune text not null references linsy.communes,
  modality text not null check (modality in ('local','domicilio','casa')),
  whatsapp text not null check (whatsapp = '' or whatsapp ~ '^569[0-9]{8}$'),
  services jsonb not null default '[]',
  search_text text generated always as (linsy.linsy_search_text(name, services)) stored,
  photos text[] not null default '{}',
  review_reason text check (length(review_reason) <= 500),
  reviewed_by text,
  reviewed_at timestamptz,
  check (status <> 'rejected' or nullif(trim(review_reason), '') is not null),
  check (status = 'draft' or (whatsapp <> '' and jsonb_array_length(services) > 0)),
  check (jsonb_typeof(services) = 'array' and jsonb_array_length(services) <= 20),
  check (cardinality(photos) <= 6 and array_position(photos, null) is null)
);

create unique index business_working_revision on linsy.business_revisions (business_id)
  where status in ('draft','pending','rejected');
create unique index business_public_revision on linsy.business_revisions (business_id) where status = 'approved';
create index business_directory on linsy.business_revisions (category, commune, name) where status = 'approved';

create table linsy.reports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references linsy.businesses on delete cascade,
  reporter_id text not null,
  reason text not null check (length(trim(reason)) between 10 and 500),
  created_at timestamptz not null default now(),
  unique (business_id, reporter_id)
);

create table linsy.business_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  mime text not null check (mime in ('image/jpeg','image/png','image/webp')),
  bytes bytea not null check (octet_length(bytes) between 1 and 3145728),
  created_at timestamptz not null default now()
);
create index business_photos_owner on linsy.business_photos (owner_id);
create index business_revisions_photos on linsy.business_revisions using gin (photos);

create function linsy.save_revision(actor text, expected uuid, payload jsonb)
returns void language plpgsql set search_path = '' as $$
declare
  business uuid;
  working uuid;
  working_status text;
  paths text[] := array(select jsonb_array_elements_text(payload->'photos'));
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor, 77255));
  insert into linsy.businesses (owner_id) values (actor)
    on conflict (owner_id) do nothing;
  select id into strict business from linsy.businesses where owner_id = actor;
  select id, status into working, working_status from linsy.business_revisions
    where business_id = business and status in ('draft','pending','rejected') for update;
  if working is distinct from expected or working_status = 'pending' then
    raise exception 'revision_conflict';
  end if;
  if exists (select 1 from unnest(paths) as path where not exists (
    select 1 from linsy.business_photos p where p.id::text = path and p.owner_id = actor
  )) then raise exception 'invalid_photo'; end if;
  if working is null then
    insert into linsy.business_revisions
      (business_id,status,name,description,category,commune,modality,whatsapp,services,photos)
    values (business,payload->>'status',payload->>'name',payload->>'description',
      payload->>'category',payload->>'commune',payload->>'modality',payload->>'whatsapp',payload->'services',paths);
  else
    update linsy.business_revisions set status=payload->>'status', name=payload->>'name',
      description=payload->>'description', category=payload->>'category', commune=payload->>'commune',
      modality=payload->>'modality', whatsapp=payload->>'whatsapp', services=payload->'services', photos=paths,
      review_reason=null, reviewed_at=null, reviewed_by=null where id=working;
  end if;
  delete from linsy.business_photos p where p.owner_id=actor
    and p.created_at < now() - interval '1 hour'
    and not exists (select 1 from linsy.business_revisions r where r.photos @> array[p.id::text]);
end;
$$;

create function linsy.review_revision(actor text, revision uuid, approve boolean, reason text)
returns void language plpgsql set search_path = '' as $$
declare business uuid;
begin
  if not exists (select 1 from linsy.user_roles where user_id=actor and role='admin') then
    raise exception 'forbidden';
  end if;
  select business_id into business from linsy.business_revisions where id=revision and status='pending' for update;
  if not found then raise exception 'revision_conflict'; end if;
  if approve then
    update linsy.business_revisions set status='archived' where business_id=business and status='approved';
  end if;
  update linsy.business_revisions set status=case when approve then 'approved' else 'rejected' end,
    review_reason=case when approve then null else reason end, reviewed_by=actor, reviewed_at=now()
    where id=revision;
end;
$$;

insert into linsy.categories (slug, name) values
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

insert into linsy.communes (slug, name) values
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
