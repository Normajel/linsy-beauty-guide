import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/linsy/WorkspacePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/mi-negocio")({
  head: () => pageMeta("Mi negocio", "Espacio profesional de Linsy: perfil, servicios, fotos y métricas.", true),
  component: () => <WorkspacePage />,
});