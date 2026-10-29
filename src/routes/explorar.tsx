import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/linsy/SearchBar";
import { EmptyState, PageHeader } from "@/components/linsy/States";
import { CATEGORIES, findCategory, findCommune } from "@/lib/catalog";

const searchSchema = z.object({
  q: z.string().max(80).optional().catch(undefined),
  comuna: z.string().max(60).optional().catch(undefined),
  categoria: z.string().max(60).optional().catch(undefined),
  cerca: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/explorar")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explorar profesionales de belleza · Linsy" },
      { name: "description", content: "Busca profesionales de belleza y cuidado personal por servicio y comuna en la Región de Valparaíso." },
      { property: "og:title", content: "Explorar profesionales · Linsy" },
      { property: "og:description", content: "Filtra por servicio, comuna y modalidad de atención." },
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
  const chips: { label: string; key: keyof typeof s }[] = [];
  if (s.q) chips.push({ label: `“${s.q}”`, key: "q" });
  if (cat) chips.push({ label: cat.name, key: "categoria" });
  if (com) chips.push({ label: com.name, key: "comuna" });
  if (s.cerca) chips.push({ label: "Cerca de mí", key: "cerca" });

  const title = cat && com ? `${cat.name} en ${com.name}` : cat ? cat.name : com ? `Profesionales en ${com.name}` : "Explorar profesionales";

  return (
    <>
      <PageHeader title={title}>Región de Valparaíso</PageHeader>
      <div className="container-linsy -mt-6 space-y-8 pb-8">
        <SearchBar key={`${s.q}-${s.comuna}`} initialQ={s.q} initialComuna={s.comuna} />

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" aria-label="Filtros activos">
            {chips.map((c) => (
              <Link key={c.key} to="/explorar" search={(prev) => ({ ...prev, [c.key]: undefined })}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-lila"
                aria-label={`Quitar filtro ${c.label}`}>
                {c.label} <X className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
            <Link to="/explorar" search={{}} className="text-sm font-medium text-primary hover:underline">Limpiar filtros</Link>
          </div>
        )}

        <p className="text-sm text-muted-foreground" aria-live="polite">0 profesionales encontradas</p>

        <EmptyState icon={SearchX} title="Aún no hay perfiles publicados"
          action={<Button asChild><Link to="/publicar">Publicar mi negocio</Link></Button>}>
          Linsy está dando sus primeros pasos. Cuando los primeros negocios sean aprobados, aparecerán aquí con estos filtros.
        </EmptyState>

        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Explora otras categorías</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.slug !== s.categoria).map((c) => (
              <Link key={c.slug} to="/explorar" search={(prev) => ({ ...prev, categoria: c.slug })}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
