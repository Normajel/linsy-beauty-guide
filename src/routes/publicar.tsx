import { createFileRoute } from "@tanstack/react-router";
import { BusinessEditor } from "@/components/linsy/BusinessEditor";

export const Route = createFileRoute("/publicar")({
  head: () => ({
    meta: [
      { title: "Publica tu negocio de belleza · Linsy" },
      { name: "description", content: "Publica tu emprendimiento de belleza en Linsy y recibe consultas por WhatsApp." },
      { property: "og:title", content: "Publica tu negocio · Linsy" },
      { property: "og:description", content: "Muestra tus servicios a personas de tu comuna." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusinessEditor,
});
