import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/linsy/AccountPage";

export const Route = createFileRoute("/ingresar")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Linsy" },
      { name: "description", content: "Ingresa a tu cuenta de Linsy." },
      { property: "og:title", content: "Iniciar sesión · Linsy" },
      { property: "og:description", content: "Accede a tu cuenta." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AccountPage mode="login" />,
});
