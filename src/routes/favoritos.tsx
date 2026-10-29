import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/linsy/States";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Mis favoritos · Linsy" },
      { name: "description", content: "Guarda tus profesionales favoritas en Linsy." },
      { property: "og:title", content: "Favoritos · Linsy" },
      { property: "og:description", content: "Tu lista personal de profesionales." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <><PageHeader title="Mis favoritos">El talento local que quieres volver a encontrar.</PageHeader><div className="container-linsy py-10"><EmptyState icon={Heart} title="Tus favoritos tendrán un lugar aquí" action={<><Button asChild><Link to="/explorar">Explorar profesionales</Link></Button><Button asChild variant="outline"><Link to="/ingresar">Iniciar sesión</Link></Button></>}>Aún no hay una cuenta conectada. Cuando se habiliten las cuentas podrás guardar perfiles reales en tu lista personal.</EmptyState></div></>
  ),
});
