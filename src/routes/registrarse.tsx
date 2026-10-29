import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/linsy/AccountPage";

export const Route = createFileRoute("/registrarse")({
  head: () => ({
    meta: [
      { title: "Crear cuenta · Linsy" },
      { name: "description", content: "Crea tu cuenta en Linsy como cliente o profesional." },
      { property: "og:title", content: "Crear cuenta · Linsy" },
      { property: "og:description", content: "Regístrate en Linsy." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AccountPage mode="register" />,
});
