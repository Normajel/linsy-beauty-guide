import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  backend,
  type Workspace,
  signedPhotos,
  useLinsySession,
  type Revision,
} from "@/lib/linsy-backend";
import { BusinessEditor } from "./BusinessEditor";
import { ProfessionalPlansPreview } from "./ProfessionalPlansPreview";
import { WorkspacePage } from "./WorkspacePage";
import { PageHeader } from "./States";

export function BusinessWorkspace({ preview = false }: { preview?: boolean }) {
  const { session } = useLinsySession();
  const user = session?.user.id;
  const [editing, setEditing] = useState(false);
  useEffect(() => setEditing(false), [user]);
  const query = useQuery({
    queryKey: ["business-workspace", user],
    enabled: !!backend && !!user && !!session?.user.emailVerified,
    queryFn: async () => {
      const data = await backend!.api<Workspace>("workspace");
      return { ...data, photos: signedPhotos((data.working ?? data.approved)?.photos ?? []) };
    },
  });
  if (!backend) return preview ? <BusinessEditor /> : <WorkspacePage />;
  if (session === undefined || (user && session.user.emailVerified && query.isPending))
    return (
      <p className="container-linsy py-10" role="status">
        Cargando tu cuenta…
      </p>
    );
  if (query.isError)
    return (
      <p className="container-linsy py-10" role="alert">
        No pudimos cargar tu negocio. Intenta recargar la página.
      </p>
    );
  const data = query.data;
  const canEdit = !!data?.role && data.working?.status !== "pending";
  if (user && data && canEdit && (editing || preview)) {
    return (
      <BusinessEditor
        key={user}
        connection={{
          working: data.working,
          initial: data.working ?? data.approved,
          photos: data.photos,
          onSaved: async (submitted) => {
            await query.refetch();
            if (submitted) setEditing(false);
          },
        }}
      />
    );
  }
  return (
    <>
      <PageHeader title="Mi cuenta" />
      <div className="container-linsy space-y-4 py-10">
        {!user ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/ingresar">Iniciar sesión</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/registrarse">Crear cuenta profesional</Link>
            </Button>
          </div>
        ) : (
          <>
            {!session.user.emailVerified && (
              <p>Confirma tu correo para habilitar la publicación de negocios.</p>
            )}
            {data?.working?.status === "pending" && <p>Tu perfil está en revisión.</p>}
            {data?.working?.status === "rejected" && (
              <p>Correcciones solicitadas. {data.working.review_reason}</p>
            )}
            {data?.approved && (
              <p>
                <Link
                  className="text-primary underline"
                  to="/profesional/$slug"
                  params={{ slug: data.approved.business_id }}
                >
                  Ver el perfil publicado
                </Link>
              </p>
            )}
            {data?.role === "professional" && (
              <ProfessionalPlansPreview />
            )}
            {canEdit && (
              <Button onClick={() => setEditing(true)}>
                {data?.id ? "Editar mi negocio" : "Crear mi negocio"}
              </Button>
            )}
            {data?.role === "admin" && (
              <>
                <Button asChild>
                  <Link to="/gestion">Gestionar suscripciones y pagos</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/administracion">Revisar publicaciones</Link>
                </Button>
              </>
            )}
            <Button asChild variant="ghost">
              <Link to="/ingresar">Gestionar sesión</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
