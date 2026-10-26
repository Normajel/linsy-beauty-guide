import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/linsy/ComingSoon";

export const Route = createFileRoute("/registrarse")({
  head: () => ({
    meta: [
      { title: "Crear cuenta · Linsy" },
      { name: "description", content: "Crea tu cuenta en Linsy como cliente o profesional." },
      { property: "og:title", content: "Crear cuenta · Linsy" },
      { property: "og:description", content: "Regístrate en Linsy." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Crear cuenta" description="El registro estará disponible en la próxima etapa. Podrás elegir entre cuenta de cliente o de profesional." />,
});
