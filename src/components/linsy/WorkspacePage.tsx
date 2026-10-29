import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Heart, Image, LayoutDashboard, ListChecks, Settings, ShieldCheck, Store, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PageHeader } from "./States";
import { ConnectionNotice } from "./ConnectionNotice";

export function WorkspacePage({ admin = false }: { admin?: boolean }) {
  const sections = admin ? [
    { id: "revision", label: "Revisión", icon: ClipboardCheck, title: "Sin perfiles para revisar" },
    { id: "negocios", label: "Negocios", icon: Store, title: "Sin negocios cargados" },
    { id: "reportes", label: "Reportes", icon: ShieldCheck, title: "Sin reportes cargados" },
    { id: "catalogo", label: "Catálogo", icon: Settings, title: "Administración del catálogo pendiente" },
  ] : [
    { id: "resumen", label: "Resumen", icon: LayoutDashboard, title: "Tu negocio aún no está registrado" },
    { id: "servicios", label: "Servicios", icon: ListChecks, title: "Aún no tienes servicios guardados" },
    { id: "fotos", label: "Fotos", icon: Image, title: "Tu galería está vacía" },
    { id: "metricas", label: "Métricas", icon: BarChart3, title: "Aún no hay métricas disponibles" },
  ];
  return <><PageHeader title={admin ? "Administración" : "Mi negocio"}>{admin ? "Revisión y cuidado del directorio Linsy." : "Un espacio para tu trabajo y tu crecimiento."}</PageHeader><div className="container-linsy space-y-8 py-10"><ConnectionNotice /><p className="text-sm text-muted-foreground">{admin ? "Vista pública de diseño, sin información privada ni permisos de administración. El acceso real se habilitará solo para administradores autorizados." : "Vista de prueba sin cuenta conectada. No se muestran datos de ningún negocio."}</p><Tabs defaultValue={sections[0]?.id}><TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1">{sections.map((s) => <TabsTrigger key={s.id} value={s.id} className="gap-2 px-3 py-3"><s.icon className="h-4 w-4" />{s.label}</TabsTrigger>)}</TabsList>{sections.map((s) => <TabsContent key={s.id} value={s.id} className="mt-8"><EmptyState icon={s.icon} title={s.title} action={!admin && s.id !== "metricas" ? <Button asChild><Link to="/publicar">Preparar mi perfil</Link></Button> : undefined}>{admin ? "La revisión y los cambios estarán disponibles después de conectar los datos y verificar el acceso del equipo." : s.id === "metricas" ? "Las visitas y consultas aparecerán cuando tu perfil esté publicado y la medición esté habilitada." : "Puedes preparar un perfil de prueba y revisar cómo se verá antes de habilitar la publicación."}</EmptyState></TabsContent>)}</Tabs>{!admin && <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/favoritos"><Heart />Mis favoritos</Link></Button><Button asChild variant="ghost"><Link to="/ingresar">Iniciar sesión</Link></Button></div>}</div></>;
}