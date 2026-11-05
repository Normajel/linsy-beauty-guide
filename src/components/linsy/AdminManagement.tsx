import { useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMMUNES } from "@/lib/catalog";
import { backend, useLinsySession } from "@/lib/linsy-backend";
import { PageHeader } from "./States";

type Subscription = {
  id: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  commune: string;
  plan: string;
  price_clp: number;
  starts_on: string;
  cancelled_at: string | null;
  next_renewal: string | null;
};
type Payment = {
  id: string;
  business_name: string;
  amount_clp: number;
  paid_on: string;
  next_renewal: string;
  method: string;
  reference: string;
};
type Business = {
  id: string;
  name: string;
  commune: string;
  slot: number | null;
  starts_on: string | null;
  ends_on: string | null;
};
type Management = {
  subscriptions: Subscription[];
  payments: Payment[];
  businesses: Business[];
  today: string;
};
type Section = "Menú" | "Resumen" | "Negocios suscritos" | "Cupos gratis" | "Pagos";
type Filter = "all" | "active" | "renewal" | "pending" | "new";
const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });
const dateLabel = (date: string) => date.split("-").reverse().join("/");
const control = "h-10 w-full rounded-md border bg-background px-3 text-sm";
const panel = "space-y-4 rounded-2xl border bg-card p-5";
const columns = "grid gap-3 sm:grid-cols-2";

function status(s: Subscription, today: string) {
  if (s.cancelled_at) return "Cancelada";
  if (!s.next_renewal) return "Pago pendiente";
  if (s.next_renewal <= today) return "Renovación pendiente";
  if (s.starts_on > today) return "Programada";
  return "Activa";
}

function addDays(today: string, days: number) {
  const day = new Date(`${today}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return day.toISOString().slice(0, 10);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AdminManagement() {
  const { session } = useLinsySession();
  const actor = session?.user.emailVerified ? session.user.id : null;
  const [section, setSection] = useState<Section>("Menú");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [payId, setPayId] = useState("");
  const createId = useRef<string | undefined>(undefined);
  const query = useQuery({
    queryKey: ["linsy-management", actor],
    queryFn: () => backend!.api<Management>("management"),
    enabled: !!backend && !!actor,
    retry: false,
  });

  async function save(path: string, body: unknown, message: string) {
    if (!backend || busy) return false;
    setBusy(true);
    setNotice("");
    setFailed(false);
    try {
      await backend.api(path, body);
      await query.refetch();
      setNotice(message);
      return true;
    } catch (error) {
      setFailed(true);
      setNotice(
        error instanceof Error && error.message === "invalid_payment_dates"
          ? "La fecha de pago no puede ser futura y la próxima renovación debe quedar después del inicio, del pago y del período anterior."
          : error instanceof Error && error.message === "launch_quota_full"
            ? "Ya se asignaron los 20 cupos gratis."
            : error instanceof Error && error.message === "launch_already_assigned"
              ? "Este negocio ya tiene un cupo gratis asignado."
              : "No se pudo guardar el cambio. Revisa los datos e inténtalo nuevamente.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    createId.current ??= crypto.randomUUID();
    if (
      await save(
        "management/subscriptions",
        {
          id: createId.current,
          name: data.get("name"),
          contact: data.get("contact"),
          email: data.get("email"),
          commune: data.get("commune"),
          plan: data.get("plan"),
          price: Number(data.get("price")),
          startsOn: data.get("startsOn"),
        },
        "Suscripción registrada. Quedó pendiente de pago.",
      )
    ) {
      createId.current = undefined;
      form.reset();
    }
  }

  async function payment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (
      await save(
        "management/payments",
        {
          subscription: payId,
          amount: Number(data.get("amount")),
          paidOn: data.get("paidOn"),
          nextRenewal: data.get("nextRenewal"),
          method: data.get("method"),
          reference: data.get("reference"),
        },
        "Pago confirmado y renovación actualizada.",
      )
    ) {
      form.reset();
      setPayId("");
    }
  }

  async function grant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const startsOn = String(data.get("startsOn"));
    const endsOn = String(data.get("endsOn"));
    if (endsOn < startsOn) {
      setFailed(true);
      setNotice("La fecha de término debe ser igual o posterior al inicio.");
      return;
    }
    if (
      await save(
        "management/launch-grants",
        {
          business: data.get("business"),
          startsOn,
          endsOn,
        },
        "Cupo gratis asignado. Puedes verlo en Negocios suscritos.",
      )
    )
      form.reset();
  }

  const data = query.data;
  const free = data?.businesses.filter((business) => business.slot !== null) ?? [];
  const remaining = 20 - free.length;
  const selected = data?.subscriptions.find((s) => s.id === payId);
  const filters = data
    ? {
        all: data.subscriptions,
        active: data.subscriptions.filter((s) => status(s, data.today) === "Activa"),
        renewal: data.subscriptions.filter(
          (s) =>
            !s.cancelled_at &&
            s.next_renewal &&
            s.next_renewal >= data.today &&
            s.next_renewal <= addDays(data.today, 7),
        ),
        pending: data.subscriptions.filter((s) => status(s, data.today).includes("pendiente")),
        new: data.subscriptions.filter((s) => s.starts_on.slice(0, 7) === data.today.slice(0, 7)),
      }
    : null;
  const filteredFree = (key: Filter) =>
    free.filter((b) => {
      if (!data || !b.starts_on || !b.ends_on) return false;
      return (
        key === "all" ||
        (key === "active" && b.starts_on <= data.today && b.ends_on >= data.today) ||
        (key === "new" &&
          b.starts_on <= data.today &&
          b.starts_on.slice(0, 7) === data.today.slice(0, 7))
      );
    });
  const metrics = [
    ["active", "Planes activos"],
    ["renewal", "Renuevan en los próximos 7 días"],
    ["pending", "Pagos o renovaciones pendientes"],
    ["new", "Suscripciones iniciadas este mes"],
  ] as const;
  const changeSection = (next: Section, nextFilter: Filter = "all") => {
    setSection(next);
    window.scrollTo(0, 0);
    setFilter(nextFilter);
    setCancelId(null);
    setNotice("");
  };

  return (
    <>
      <PageHeader title={section === "Menú" ? "Gestión de Linsy" : section} />
      <div className="container-linsy space-y-6 py-8">
        {session === undefined || (actor && query.isPending) ? (
          <p role="status">Cargando gestión…</p>
        ) : !session ? (
          <Link className="text-primary underline" to="/ingresar">
            Iniciar sesión
          </Link>
        ) : !actor || (query.error instanceof Error && query.error.message === "forbidden") ? (
          <p role="alert">Solo administración puede acceder a este panel.</p>
        ) : query.isError ? (
          <p role="alert">No se pudo cargar el panel de gestión.</p>
        ) : (
          data &&
          filters && (
            <>
              {section === "Menú" && (
                <nav className="grid max-w-xl gap-3" aria-label="Menú principal de administración">
                  {(["Resumen", "Negocios suscritos", "Cupos gratis", "Pagos"] as const).map(
                    (tab) => (
                      <Button
                        key={tab}
                        variant="outline"
                        className="justify-start"
                        onClick={() => changeSection(tab)}
                      >
                        {tab}
                        {tab === "Cupos gratis" && ` · ${remaining} de 20 disponibles`}
                      </Button>
                    ),
                  )}
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/administracion">Revisar publicaciones</Link>
                  </Button>
                </nav>
              )}
              {notice && <p role={failed ? "alert" : "status"}>{notice}</p>}
              {section === "Resumen" && (
                <div className="grid max-w-xl gap-3">
                  {metrics.map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      className={`${panel} text-left hover:border-primary`}
                      onClick={() => changeSection("Negocios suscritos", key)}
                    >
                      <p className="text-2xl font-semibold">
                        {filters[key].length + filteredFree(key).length}
                      </p>
                      <p className="text-sm">{label}</p>
                    </button>
                  ))}
                </div>
              )}
              {section === "Cupos gratis" && (
                <section className="space-y-4">
                  <p role="status">
                    {free.length} de 20 cupos asignados · {remaining} disponibles
                  </p>
                  <form className={panel} onSubmit={grant}>
                    <h2 className="text-xl font-semibold">Asignar suscripción gratis</h2>
                    <Field label="Negocio con ficha">
                      <select name="business" className={control} defaultValue="" required>
                        <option value="">Selecciona un negocio</option>
                        {data.businesses
                          .filter((b) => b.slot === null)
                          .map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} · {b.commune}
                            </option>
                          ))}
                      </select>
                    </Field>
                    <div className={columns}>
                      <Field label="Fecha de inicio">
                        <Input name="startsOn" type="date" defaultValue={data.today} required />
                      </Field>
                      <Field label="Fecha de término">
                        <Input name="endsOn" type="date" required />
                      </Field>
                    </div>
                    <Button
                      disabled={busy || !remaining || !data.businesses.some((b) => b.slot === null)}
                    >
                      Asignar cupo gratis
                    </Button>
                  </form>
                  <h2 className="text-xl font-semibold">Cupos asignados</h2>
                  {!free.length && <p>Aún no se han asignado cupos.</p>}
                  {free.map((b) => (
                    <FreeSubscription key={b.id} business={b} today={data.today} />
                  ))}
                </section>
              )}
              {section === "Negocios suscritos" && (
                <>
                  <form onSubmit={create} className={panel}>
                    <h2 className="text-xl font-semibold">Registrar suscripción</h2>
                    <div className={columns}>
                      <Field label="Nombre del negocio">
                        <Input name="name" required maxLength={120} />
                      </Field>
                      <Field label="Persona de contacto">
                        <Input name="contact" required maxLength={120} />
                      </Field>
                      <Field label="Correo de contacto">
                        <Input name="email" type="email" required maxLength={254} />
                      </Field>
                      <Field label="Comuna">
                        <select name="commune" className={control} required defaultValue="">
                          <option value="">Selecciona una comuna</option>
                          {COMMUNES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Plan contratado">
                        <Input name="plan" required maxLength={100} />
                      </Field>
                      <Field label="Precio acordado (CLP)">
                        <Input name="price" type="number" min={1} max={1_000_000_000} required />
                      </Field>
                      <Field label="Fecha de inicio">
                        <Input name="startsOn" type="date" defaultValue={data.today} required />
                      </Field>
                    </div>
                    <Button disabled={busy}>Registrar suscripción</Button>
                  </form>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {metrics.find(([key]) => key === filter)?.[1] ?? "Negocios suscritos"}
                    </h2>
                    {filter !== "all" && (
                      <Button variant="outline" onClick={() => setFilter("all")}>
                        Ver todos
                      </Button>
                    )}
                  </div>
                  {filteredFree(filter).map((b) => (
                    <FreeSubscription key={b.id} business={b} today={data.today} />
                  ))}
                  {!filters[filter].length && !filteredFree(filter).length && (
                    <p>No hay negocios en este listado.</p>
                  )}
                  {filters[filter].map((s) => (
                    <article key={s.id} className={panel}>
                      <h3 className="font-semibold">
                        {s.business_name}{" "}
                        <span className="ml-2 text-sm text-primary">{status(s, data.today)}</span>
                      </h3>
                      <p>
                        {s.plan} · {clp.format(s.price_clp)} · {s.commune}
                      </p>
                      <p className="break-words text-sm">
                        {s.contact_name} · {s.contact_email}
                      </p>
                      <p className="text-sm">
                        Inicio {dateLabel(s.starts_on)}
                        {s.next_renewal && ` · Renovación ${dateLabel(s.next_renewal)}`}
                      </p>
                      {!s.cancelled_at && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setPayId(s.id);
                              changeSection("Pagos");
                            }}
                          >
                            Registrar pago
                          </Button>
                          {cancelId === s.id ? (
                            <>
                              <Button
                                variant="destructive"
                                disabled={busy}
                                onClick={async () => {
                                  if (
                                    await save(
                                      "management/cancel",
                                      { subscription: s.id },
                                      "Suscripción cancelada.",
                                    )
                                  )
                                    setCancelId(null);
                                }}
                              >
                                Confirmar cancelación
                              </Button>
                              <Button variant="ghost" onClick={() => setCancelId(null)}>
                                Volver
                              </Button>
                            </>
                          ) : (
                            <Button variant="ghost" onClick={() => setCancelId(s.id)}>
                              Cancelar suscripción
                            </Button>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </>
              )}
              {section === "Pagos" && (
                <>
                  <form onSubmit={payment} className={panel}>
                    <h2 className="text-xl font-semibold">Confirmar pago recibido</h2>
                    <Field label="Negocio">
                      <select
                        required
                        className={control}
                        value={payId}
                        onChange={(e) => setPayId(e.target.value)}
                      >
                        <option value="">Selecciona una suscripción</option>
                        {data.subscriptions
                          .filter((s) => !s.cancelled_at)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.business_name} · {s.plan}
                            </option>
                          ))}
                      </select>
                    </Field>
                    <div className={columns}>
                      <Field label="Monto recibido (CLP)">
                        <Input
                          key={payId}
                          name="amount"
                          type="number"
                          min={1}
                          max={1_000_000_000}
                          defaultValue={selected?.price_clp}
                          required
                        />
                      </Field>
                      <Field label="Fecha de pago">
                        <Input
                          name="paidOn"
                          type="date"
                          defaultValue={data.today}
                          max={data.today}
                          required
                        />
                      </Field>
                      <Field label="Próxima renovación">
                        <Input
                          name="nextRenewal"
                          type="date"
                          min={
                            selected?.next_renewal ? addDays(selected.next_renewal, 1) : undefined
                          }
                          required
                        />
                      </Field>
                      <Field label="Medio de pago">
                        <select name="method" className={control}>
                          <option value="transferencia">Transferencia</option>
                          <option value="efectivo">Efectivo</option>
                          <option value="otro">Otro</option>
                        </select>
                      </Field>
                      <Field label="Referencia del comprobante (opcional)">
                        <Input name="reference" maxLength={160} />
                      </Field>
                    </div>
                    <Button disabled={busy || !payId}>Confirmar pago</Button>
                  </form>
                  <h2 className="text-xl font-semibold">Historial de pagos</h2>
                  {!data.payments.length && <p>No hay pagos registrados.</p>}
                  {data.payments.map((p) => (
                    <article key={p.id} className={panel}>
                      <h3 className="font-semibold">
                        {p.business_name} · {clp.format(p.amount_clp)}
                      </h3>
                      <p className="text-sm">
                        {dateLabel(p.paid_on)} · {p.method} · Próxima renovación{" "}
                        {dateLabel(p.next_renewal)}
                      </p>
                      {p.reference && (
                        <p className="break-words text-sm">Referencia {p.reference}</p>
                      )}
                    </article>
                  ))}
                </>
              )}
              {section !== "Menú" && (
                <Button variant="outline" onClick={() => changeSection("Menú")}>
                  Volver
                </Button>
              )}
            </>
          )
        )}
      </div>
    </>
  );
}

function FreeSubscription({ business, today }: { business: Business; today: string }) {
  const { slot, starts_on: starts, ends_on: ends } = business;
  if (slot === null || !starts || !ends) return null;
  const label = today < starts ? "Programada" : today > ends ? "Finalizada" : "Activa";
  return (
    <article className={panel}>
      <h3 className="font-semibold">{business.name}</h3>
      <p>
        Gratis de lanzamiento · $0 · Cupo {slot} de 20 · {label}
      </p>
      <p className="text-sm">
        {business.commune} · {dateLabel(starts)} al {dateLabel(ends)}
      </p>
    </article>
  );
}
