import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/linsy/ComingSoon";

export const Route = createFileRoute("/publicar")({
  head: () => ({
    meta: [
      { title: "Publica tu negocio de belleza · Linsy" },
      { name: "description", content: "Publica tu emprendimiento de belleza en Linsy y recibe consultas por WhatsApp." },
      { property: "og:title", content: "Publica tu negocio · Linsy" },
      { property: "og:description", content: "Muestra tus servicios a personas de tu comuna." },
    ],
  }),
  component: () => (
    <ComingSoon title="Publica tu negocio" description="Estamos preparando el registro para profesionales. Muy pronto podrás crear tu perfil, agregar servicios y enviarlo a revisión." />
  ),
});
