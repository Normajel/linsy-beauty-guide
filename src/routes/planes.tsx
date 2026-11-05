import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/linsy/States";
import { pageMeta } from "@/lib/page-meta";

type Plan = {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice?: number;
  highlight?: boolean;
  trial?: string;
  benefits: string[];
  includes?: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    description: "Todo lo esencial para empezar a mostrar tu trabajo.",
    monthlyPrice: 5990,
    trial: "21 días gratis",
    benefits: [
      "Perfil y micrositio profesional dentro de Linsy",
      "Hasta 5 personas, cada una con su horario y servicios",
      "Publica hasta 5 servicios",
      "Galería de hasta 50 fotos y 5 minutos de video",
      "Recibe solicitudes de hora y confirma cada cita",
      "Ficha en el directorio de tu comuna cuando esté habilitado",
      "Historial de clientes y citas en un solo lugar",
      "Consentimientos firmados guardados en la ficha del cliente",
      "Registro diario de caja, ocupación y reportes",
      "Reseñas verificadas después de citas cumplidas",
      "Agenda sincronizada con Google, iPhone y Outlook",
      "Soporte por correo",
    ],
  },
  {
    name: "Pro",
    description: "Más orden para un negocio que ya está creciendo.",
    monthlyPrice: 9990,
    annualPrice: 95900,
    includes: "Todo lo incluido en Starter, más:",
    benefits: [
      "Hasta 10 personas atendiendo y 10 servicios publicados",
      "Galería de hasta 300 fotos y 30 minutos de video",
      "Recibe abonos para reservar, directo a tu cuenta y sin comisión",
      "Ofrece gift cards y recibe consultas de quienes quieren regalarlas",
      "Lleva el inventario de tus insumos y recibe avisos de stock bajo",
      "Calcula costos y márgenes de cada servicio al cerrar una cita",
      "Controla lo que ganas con productos para llevar",
      "Soporte por Instagram",
    ],
  },
  {
    name: "Business",
    description: "Herramientas para coordinar a todo tu equipo.",
    monthlyPrice: 14990,
    annualPrice: 143900,
    includes: "Todo lo incluido en Pro, más:",
    benefits: [
      "Personas atendiendo y servicios publicados sin límite",
      "Galería de hasta 1.000 fotos y 100 minutos de video",
      "Revisa cuánto factura cada persona y calcula tus comisiones",
      "Envía recordatorios automáticos por WhatsApp",
      "Distintivo Business en el directorio de tu comuna",
      "Publica historias que aparecen por 24 horas y luego desaparecen",
    ],
  },
  {
    name: "Max",
    description: "Más visibilidad y espacio para mostrar tu trabajo.",
    monthlyPrice: 29990,
    annualPrice: 287900,
    highlight: true,
    includes: "Todo lo incluido en Business, más:",
    benefits: [
      "Galería de hasta 3.000 fotos y 300 minutos de video",
      "Distintivo Max con mayor presencia en el directorio",
      "Carrusel de fotos en tu ficha",
      "Soporte prioritario",
    ],
  },
  {
    name: "Ultra",
    description: "Una vitrina digital completa para tu marca.",
    monthlyPrice: 49990,
    annualPrice: 479900,
    includes: "Todo lo incluido en Max, más:",
    benefits: [
      "Galería de hasta 10.000 fotos y 1.000 minutos de video",
      "Mayor visibilidad entre los perfiles de tu comuna y categoría",
      "Marco animado para destacar tu perfil",
      "Dominio propio registrado y pagado por Linsy",
      "Soporte preferencial",
    ],
  },
];

const clp = new Intl.NumberFormat("es-CL");

export const Route = createFileRoute("/planes")({
  head: () =>
    pageMeta(
      "Planes para profesionales",
      "Conoce las alternativas para organizar y dar visibilidad a tu negocio en Linsy.",
    ),
  component: PlansPage,
});

function PlansPage() {
  return (
    <>
      <PageHeader title="Planes para tu negocio">
        Herramientas para cada etapa de tu trabajo, desde tu primera vitrina hasta una marca que
        sigue creciendo.
      </PageHeader>
      <section className="container-linsy py-10 sm:py-14">
        <SectionHeading eyebrow="Crece a tu ritmo" title="Un espacio para tu siguiente paso">
          Revisa qué incluye cada alternativa. Los precios están expresados en pesos chilenos.
        </SectionHeading>
        <div className="mb-7 rounded-2xl border border-primary/20 bg-rosa/60 p-4 text-sm text-rosa-ink">
          Precios y beneficios de referencia; su disponibilidad se habilitará progresivamente. La
          contratación todavía no está disponible, así que por ahora no se activan pagos ni
          suscripciones.
        </div>
        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-card p-5 shadow-soft sm:p-6 ${plan.highlight ? "border-primary/50 ring-1 ring-primary/20" : "border-border/70"}`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {index === 0 ? "Para comenzar" : index < 3 ? "Para crecer" : "Para destacar"}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold">{plan.name}</h2>
                </div>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${plan.highlight ? "bg-primary text-primary-foreground" : "bg-lila text-lila-ink"}`}
                  aria-hidden
                >
                  {index === 4 ? <Crown className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                </span>
              </div>
              <p className="min-h-12 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5 border-y border-border/70 py-4">
                <p className="font-display text-3xl font-semibold">
                  ${clp.format(plan.monthlyPrice)}
                  <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
                    / mes
                  </span>
                </p>
                {plan.annualPrice ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    ${clp.format(plan.annualPrice)} al año
                  </p>
                ) : (
                  <p className="mt-1 text-sm font-medium text-primary">{plan.trial}</p>
                )}
              </div>
              <p className="mt-5 text-sm font-semibold">
                {plan.includes ?? "Tu vitrina profesional:"}
              </p>
              <ul className="mt-3 flex-1 space-y-3">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-menta-ink"
                      aria-hidden
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" disabled aria-describedby="plan-availability">
                Próximamente
              </Button>
            </article>
          ))}
        </div>
        <p id="plan-availability" className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes un perfil?{" "}
          <Link className="font-semibold text-primary underline" to="/mi-negocio">
            Revisa tus opciones en Mi negocio
          </Link>
          .
        </p>
      </section>
    </>
  );
}
