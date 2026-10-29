import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/linsy/WorkspacePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/administracion")({
  head: () => pageMeta("Administración", "Espacio de revisión y administración de Linsy.", true),
  component: () => <WorkspacePage admin />,
});