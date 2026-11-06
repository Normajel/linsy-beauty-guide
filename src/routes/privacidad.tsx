import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/linsy/States";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad · Linsy" },
      {
        name: "description",
        content: "Cómo Linsy trata los datos personales de clientes y profesionales.",
      },
      { property: "og:title", content: "Privacidad · Linsy" },
      { property: "og:description", content: "Política de privacidad de Linsy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="Política de privacidad" />
      <article className="container-linsy max-w-3xl space-y-5 py-10 text-muted-foreground">
        <p className="rounded-2xl bg-durazno p-4 text-sm text-durazno-ink">
          Borrador en preparación. Este texto debe ser revisado por asesoría legal antes del
          lanzamiento, considerando la Ley 19.628 y la Ley 21.719 sobre protección de datos
          personales.
        </p>
        <p>
          Linsy recopila solo los datos necesarios para mostrar perfiles profesionales y permitir el
          contacto entre personas y profesionales.
        </p>
        <p>
          No publicamos correos personales, direcciones privadas ni ubicaciones exactas que la
          profesional haya decidido ocultar.
        </p>
        <p>
          Tu ubicación en «Cerca de mí» solo se usa en el momento de la búsqueda y con tu
          autorización expresa.
        </p>
        <p>
          Podrás solicitar la actualización o eliminación de tus datos. El canal de contacto se
          publicará antes del lanzamiento.
        </p>
      </article>
    </>
  ),
});
