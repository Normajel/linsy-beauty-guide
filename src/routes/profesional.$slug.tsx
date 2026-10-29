import { createFileRoute, Link } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/linsy/States";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/profesional/$slug")({
  head: () => pageMeta("Perfil no disponible", "Este perfil profesional todavía no está disponible en Linsy.", true),
  component: () => <><PageHeader title="Perfil no disponible" /><div className="container-linsy py-10"><EmptyState icon={Store} title="No hay un perfil publicado en este enlace" action={<Button asChild><Link to="/explorar">Explorar profesionales</Link></Button>}>Solo aparecerán perfiles reales, revisados y aprobados. Puedes preparar una vista previa desde Publicar mi negocio.</EmptyState></div></>,
});