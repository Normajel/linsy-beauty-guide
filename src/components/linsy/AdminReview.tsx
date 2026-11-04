import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { backend, revisionFields, useLinsySession, type Revision } from "@/lib/linsy-backend";
import { PublishedBusiness } from "./PublishedBusiness";
import { PageHeader } from "./States";
import { WorkspacePage } from "./WorkspacePage";

export function AdminReview() {
  const { session } = useLinsySession();
  const user = session?.user.id;
  const query = useQuery({
    queryKey: ["linsy-moderation", user],
    enabled: !!user && !!backend,
    queryFn: async () => {
      const access = await backend!.rpc("linsy_is_admin");
      if (access.error) throw access.error;
      if (!access.data) return null;
      const [queue, reports] = await Promise.all([
        backend!
          .from("business_revisions")
          .select(revisionFields)
          .eq("status", "pending")
          .order("name"),
        backend!
          .from("reports")
          .select("id,business_id,reason,created_at")
          .order("created_at", { ascending: false }),
      ]);
      if (queue.error) throw queue.error;
      if (reports.error) throw reports.error;
      return { queue: queue.data as Revision[], reports: reports.data };
    },
  });

  if (!backend) return <WorkspacePage admin />;
  return (
    <>
      <PageHeader title="Administración" />
      <div className="container-linsy space-y-6 py-10">
        {session === undefined || (user && query.isPending) ? (
          <p role="status">Verificando acceso…</p>
        ) : !user ? (
          <Link className="text-primary underline" to="/ingresar">
            Inicia sesión
          </Link>
        ) : query.isError ? (
          <p role="alert">No pudimos cargar las revisiones.</p>
        ) : !query.data ? (
          <p role="alert">Esta sección requiere permisos de administración.</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Pendientes de revisión</h2>
            {!query.data.queue.length && <p>No hay negocios pendientes.</p>}
            {query.data.queue.map((profile) => (
              <ReviewCard key={profile.id} profile={profile} onReviewed={() => query.refetch()} />
            ))}
            <h2 className="text-2xl font-semibold">Reportes de perfiles</h2>
            {!query.data.reports.length && <p>No hay reportes.</p>}
            {query.data.reports.map((report) => (
              <article key={report.id} className="space-y-2 rounded-xl border bg-card p-4">
                <Link
                  className="text-primary underline"
                  to="/profesional/$slug"
                  params={{ slug: report.business_id }}
                >
                  Ver perfil reportado
                </Link>
                <p className="whitespace-pre-wrap break-words">{report.reason}</p>
              </article>
            ))}
          </>
        )}
      </div>
    </>
  );
}

function ReviewCard({
  profile,
  onReviewed,
}: {
  profile: Revision;
  onReviewed: () => Promise<unknown>;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function review(approve: boolean) {
    if (busy || !backend || (!approve && !reason.trim())) return;
    setError("");
    setBusy(true);
    try {
      const result = await backend.rpc("linsy_review", {
        revision_id: profile.id,
        approve,
        reason,
      });
      if (result.error) throw result.error;
      await onReviewed();
    } catch {
      setError(
        "No pudimos registrar la decisión. Actualiza el panel si otra persona ya revisó el perfil.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="space-y-4 rounded-xl border bg-card p-5">
      <h3 className="text-2xl font-semibold">{profile.name}</h3>
      <PublishedBusiness profile={profile} />
      <p>WhatsApp que se publicará · +{profile.whatsapp}</p>
      <label className="block space-y-2">
        <span>Motivo de corrección</span>
        <Textarea
          value={reason}
          maxLength={500}
          disabled={busy}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <Button disabled={busy} onClick={() => void review(true)}>
          Aprobar publicación
        </Button>
        <Button
          disabled={busy || !reason.trim()}
          variant="outline"
          onClick={() => void review(false)}
        >
          Solicitar correcciones
        </Button>
      </div>
      {error && <p role="alert">{error}</p>}
    </article>
  );
}
