import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/linsy/ComingSoon";

export const Route = createFileRoute("/ingresar")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Linsy" },
      { name: "description", content: "Ingresa a tu cuenta de Linsy." },
      { property: "og:title", content: "Iniciar sesión · Linsy" },
      { property: "og:description", content: "Accede a tu cuenta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Iniciar sesión" description="Las cuentas estarán disponibles en la próxima etapa. Mientras tanto puedes explorar sin registrarte." />,
});
