import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { backend, modalities } from "@/lib/linsy-backend";
import { SearchX, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/linsy/SearchBar";
import { EmptyState, PageHeader } from "@/components/linsy/States";
import { CATEGORIES, findCategory, findCommune, normalizeText } from "@/lib/catalog";

const searchSchema = z.object({
  q: z.string().max(80).optional().catch(undefined),
  comuna: z.string().max(60).optional().catch(undefined),
  categoria: z.string().max(60).optional().catch(undefined),
  pagina: z.number().int().min(1).max(10000).optional().catch(undefined),
  cerca: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/explorar")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explorar profesionales de belleza · Linsy" },
      {
        name: "description",
        content:
          "Busca profesionales de belleza y cuidado personal por servicio y comuna en la Región de Valparaíso.",
      },
      { property: "og:title", content: "Explorar profesionales · Linsy" },
      {
        property: "og:description",
        content: "Filtra por servicio, comuna y modalidad de atención.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explorar,
});

function Explorar() {
  const s = Route.useSearch();
  const cat = findCategory(s.categoria);
  const com = findCommune(s.comuna);
  const page = s.pagina ?? 1;
  const pageSize = 12;
  const directory = useQuery({
    queryKey: ["directory", s.q, cat?.slug, com?.slug, page],
    enabled: !!backend,
    queryFn: async () => {
      let query = backend!
        .from("business_revisions")
        .select("business_id,name,description,category,commune,modality", { count: "exact" })
        .eq("status", "approved");
      if (cat) query = query.eq("category", cat.slug);
      if (com) query = query.eq("commune", com.slug);
      const terms = normalizeText(s.q ?? "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(/ +/);
      for (const term of terms.filter(Boolean)) query = query.ilike("search_text", `%${term}%`);
      const { data, count, error } = await query
        .order("name")
        .order("business_id")
        .range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { rows: data, count: count ?? 0 };
    },
  });
  const chips: { label: string; key: keyof typeof s }[] = [];
  if (s.q) chips.push({ label: `“${s.q}”`, key: "q" });
  if (cat) chips.push({ label: cat.name, key: "categoria" });
  if (com) chips.push({ label: com.name, key: "comuna" });

  const title =
    cat && com
      ? `${cat.name} en ${com.name}`
      : cat
        ? cat.name
        : com
          ? `Profesionales en ${com.name}`
          : "Explorar profesionales";

  return (
    <>
      <PageHeader title={title}>Región de Valparaíso</PageHeader>
      <div className="container-linsy -mt-6 space-y-8 pb-8">
        <SearchBar
          key={`${s.q}-${s.comuna}`}
          initialQ={s.q}
          initialComuna={s.comuna}
          initialCategory={cat?.slug}
        />

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" aria-label="Filtros activos">
            {chips.map((c) => (
              <Link
                key={c.key}
                to="/explorar"
                search={(prev) => ({ ...prev, [c.key]: undefined, pagina: undefined })}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-lila"
                aria-label={`Quitar filtro ${c.label}`}
              >
                {c.label} <X className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
            <Link
              to="/explorar"
              search={{}}
              className="text-sm font-medium text-primary hover:underline"
            >
              Limpiar filtros
            </Link>
          </div>
        )}

        {backend && directory.isPending && <p role="status">Buscando profesionales…</p>}
        {directory.isError && (
          <p role="alert">No pudimos consultar el directorio. Intenta recargar la página.</p>
        )}
        {directory.data && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {directory.data.count} perfiles encontrados
          </p>
        )}
        {!!directory.data?.rows.length && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {directory.data.rows.map((row) => (
              <article
                key={row.business_id}
                className="min-w-0 space-y-3 rounded-xl border bg-card p-5"
              >
                <h2 className="break-words text-xl font-semibold">{row.name}</h2>
                <p className="text-sm text-primary">
                  {findCategory(row.category)?.name} · {findCommune(row.commune)?.name}
                </p>
                <p className="text-sm">{modalities[row.modality as keyof typeof modalities]}</p>
                <p className="line-clamp-3 break-words text-sm text-muted-foreground">
                  {row.description}
                </p>
                <Button asChild variant="outline">
                  <Link to="/profesional/$slug" params={{ slug: row.business_id }}>
                    Ver perfil
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
        {(page > 1 || (directory.data?.count ?? 0) > page * pageSize) && (
          <nav aria-label="Páginas de resultados" className="flex gap-3">
            {page > 1 && (
              <Button asChild variant="outline">
                <Link to="/explorar" search={{ ...s, pagina: page - 1 }}>
                  Anterior
                </Link>
              </Button>
            )}
            {(directory.data?.count ?? 0) > page * pageSize && (
              <Button asChild variant="outline">
                <Link to="/explorar" search={{ ...s, pagina: page + 1 }}>
                  Siguiente
                </Link>
              </Button>
            )}
          </nav>
        )}

        {(!backend || (directory.data && !directory.data.rows.length)) && (
          <EmptyState
            icon={SearchX}
            title={
              backend && chips.length
                ? "No encontramos perfiles con estos filtros"
                : "Aún no hay perfiles publicados"
            }
            action={
              <Button asChild>
                <Link to="/publicar">Publicar mi negocio</Link>
              </Button>
            }
          >
            Linsy está dando sus primeros pasos. Cuando los primeros negocios sean aprobados,
            aparecerán aquí con estos filtros.
          </EmptyState>
        )}

        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Explora otras categorías</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.slug !== s.categoria).map((c) => (
              <Link
                key={c.slug}
                to="/explorar"
                search={(prev) => ({ ...prev, categoria: c.slug, pagina: undefined })}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
