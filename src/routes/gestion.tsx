import { createFileRoute } from "@tanstack/react-router";
import { AdminManagement } from "@/components/linsy/AdminManagement";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/gestion")({
  head: () => pageMeta("Gestión de Linsy", "Panel privado de suscripciones y pagos.", true),
  component: AdminManagement,
});
