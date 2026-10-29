import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/linsy/States";
import { COMMUNES } from "@/lib/catalog";

export const Route = createFileRoute("/comunas")({
  head: () => ({
    meta: [
      { title: "Comunas de la Región de Valparaíso · Linsy" },
      { name: "description", content: "Encuentra profesionales de belleza en Viña del Mar, Valparaíso, Quilpué, Villa Alemana, Concón y todas las comunas de la región." },
      { property: "og:title", content: "Comunas · Linsy" },
      { property: "og:description", content: "Busca belleza y cuidado personal por comuna." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comunas,
});

function Comunas() {
  const provinces = [...new Set(COMMUNES.map((c) => c.province))];
  return (
    <>
      <PageHeader title="Comunas">Las 38 comunas de la Región de Valparaíso.</PageHeader>
      <div className="container-linsy grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {provinces.map((p) => (
          <section key={p} className="rounded-3xl bg-card p-6 shadow-soft">
            <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provincia de {p}</h2>
            <ul className="space-y-1">
              {COMMUNES.filter((c) => c.province === p).map((c) => (
                <li key={c.slug}>
                  <Link to="/explorar" search={{ comuna: c.slug }} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-accent">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden /> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
