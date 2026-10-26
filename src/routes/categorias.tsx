import { createFileRoute } from "@tanstack/react-router";
import { CategoryCard } from "@/components/linsy/CategoryCard";
import { PageHeader } from "@/components/linsy/States";
import { CATEGORIES } from "@/lib/catalog";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorías de belleza y cuidado personal · Linsy" },
      { name: "description", content: "Peluquería, uñas, pestañas, cosmetología, barbería, maquillaje, masajes y más en la Región de Valparaíso." },
      { property: "og:title", content: "Categorías · Linsy" },
      { property: "og:description", content: "Elige una categoría y encuentra profesionales en tu comuna." },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="Categorías">Elige qué servicio buscas.</PageHeader>
      <div className="container-linsy grid grid-cols-2 gap-3 py-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => <CategoryCard key={c.slug} category={c} />)}
      </div>
    </>
  ),
});
