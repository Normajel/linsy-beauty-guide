import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/linsy/States";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos de uso · Linsy" },
      { name: "description", content: "Condiciones de uso de la plataforma Linsy." },
      { property: "og:title", content: "Términos de uso · Linsy" },
      { property: "og:description", content: "Condiciones para clientes y profesionales." },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="Términos de uso" />
      <article className="container-linsy max-w-3xl space-y-5 py-10 text-muted-foreground">
        <p className="rounded-2xl bg-durazno p-4 text-sm text-durazno-ink">
          Borrador en preparación. Debe ser revisado por asesoría legal antes del lanzamiento.
        </p>
        <p>Linsy es un directorio que conecta a personas con profesionales de belleza y cuidado personal. No gestiona reservas, pagos ni la prestación de los servicios.</p>
        <p>Las profesionales son responsables de la veracidad de la información, precios y fotografías que publican. Los perfiles se revisan antes de publicarse.</p>
        <p>Las fotografías de antes y después requieren autorización de las personas identificables y no deben inducir a error.</p>
      </article>
    </>
  ),
});
