import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Store } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/linsy/States";
import { PublishedBusiness } from "@/components/linsy/PublishedBusiness";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { pageMeta } from "@/lib/page-meta";
import { backend, useLinsySession, type Revision } from "@/lib/linsy-backend";

export const Route = createFileRoute("/profesional/$slug")({
  head: () =>
    pageMeta("Perfil profesional", "Conoce los servicios de belleza publicados en Linsy.", true),
  component: ProfessionalProfile,
});

function ProfessionalProfile() {
  const { slug } = Route.useParams();
  const valid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(slug);
  const query = useQuery({
    queryKey: ["public-profile", slug],
    enabled: !!backend && valid,
    queryFn: () => backend!.api<Revision | null>(`profile/${slug}`),
  });

  if (backend && valid && query.isPending)
    return (
      <p className="container-linsy py-10" role="status">
        Cargando perfil…
      </p>
    );
  if (query.isError)
    return (
      <p className="container-linsy py-10" role="alert">
        No pudimos consultar este perfil.
      </p>
    );
  const profile = query.data;
  if (!profile)
    return (
      <>
        <PageHeader title="Perfil no disponible" />
        <div className="container-linsy py-10">
          <EmptyState
            icon={Store}
            title="No hay un perfil publicado en este enlace"
            action={
              <Button asChild>
                <Link to="/explorar">Explorar profesionales</Link>
              </Button>
            }
          >
            Aquí aparecen los perfiles revisados y aprobados.
          </EmptyState>
        </div>
      </>
    );
  return (
    <>
      <PageHeader title={profile.name} />
      <div className="container-linsy max-w-4xl space-y-8 py-10">
        <PublishedBusiness profile={profile} publicView />
        <ReportForm key={slug} businessId={slug} />
      </div>
    </>
  );
}

function ReportForm({ businessId }: { businessId: string }) {
  const { session } = useLinsySession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function report(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!backend || !session || busy) return;
    const reason = String(new FormData(event.currentTarget).get("reason")).trim();
    if (reason.length < 10) {
      setMessage("Describe el problema en al menos 10 caracteres.");
      return;
    }
    setBusy(true);
    try {
      await backend.api("report", { business: businessId, reason });
      setMessage("Tu reporte fue enviado a administración.");
    } catch (error) {
      setMessage(
        error instanceof Error && error.message === "already_reported_or_unavailable"
          ? "Este perfil ya fue reportado por tu cuenta o dejó de estar disponible."
          : "No pudimos enviar tu reporte. Comprueba que hayas confirmado tu correo.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="border-t pt-4">
      <summary className="cursor-pointer text-sm font-medium text-primary">
        Reportar este perfil
      </summary>
      {session === undefined ? (
        <p role="status">Comprobando sesión…</p>
      ) : !session ? (
        <Link className="text-primary underline" to="/ingresar">
          Inicia sesión para enviar un reporte
        </Link>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={report}>
          <label className="block space-y-2">
            <span>Motivo del reporte</span>
            <Textarea name="reason" required minLength={10} maxLength={500} />
          </label>
          <Button disabled={busy} variant="outline">
            Enviar reporte
          </Button>
          {message && <p role="status">{message}</p>}
        </form>
      )}
    </details>
  );
}
