import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/linsy/AccountPage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/recuperar-contrasena")({
  head: () => pageMeta("Recuperar contraseña", "Recupera el acceso a tu cuenta de Linsy.", true),
  component: () => <AccountPage mode="recover" />,
});
