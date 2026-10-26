import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck, Eye, MessageCircle, MessagesSquare, Search, Send, Sparkles, Store, UserRoundPen,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import proImg from "@/assets/profesionales.jpg";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SearchBar } from "@/components/linsy/SearchBar";
import { CategoryCard } from "@/components/linsy/CategoryCard";
import { EmptyState, SectionHeading } from "@/components/linsy/States";
import { CATEGORIES } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linsy · Encuentra tu próximo momento de cuidado en la Región de Valparaíso" },
      { name: "description", content: "Busca peluquería, uñas, pestañas, cosmetología, masajes y más por comuna. Contacta directo por WhatsApp." },
      { property: "og:title", content: "Linsy · Encuentra tu próximo momento de cuidado" },
      { property: "og:description", content: "Profesionales de belleza y cuidado personal en la Región de Valparaíso." },
    ],
  }),
  component: Index,
});

const FAQ = [
  ["¿Linsy cobra a quienes buscan servicios?", "No. Buscar y contactar profesionales en Linsy es gratis."],
  ["¿Cómo reservo una hora?", "Por ahora coordinas directamente con la profesional por WhatsApp. Linsy no gestiona reservas ni pagos."],
  ["¿Cómo se revisan los perfiles?", "Cada negocio pasa por una revisión del equipo de Linsy antes de aparecer públicamente."],
  ["¿Puedo publicar si atiendo a domicilio o en mi casa?", "Sí. Puedes indicar si atiendes en local comercial, a domicilio o en un estudio en casa, y decidir si muestras tu dirección."],
] as const;

function Index() {
  return (
    <>
      {/* Portada */}
      <section className="relative overflow-hidden bg-hero">
        <div className="container-linsy grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 text-xs font-semibold text-rosa-ink">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Región de Valparaíso
            </p>
            <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Encuentra tu próximo momento de cuidado con <span className="italic text-primary">Linsy</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Profesionales de belleza y cuidado personal cerca de ti. Compara servicios y escríbeles directo por WhatsApp.
            </p>
            <div className="mt-8"><SearchBar /></div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">¿Tienes un emprendimiento?</span>
              <Button asChild variant="plum" size="sm"><Link to="/publicar">Publica tu negocio</Link></Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img src={heroImg} alt="Estudio de belleza luminoso con mesa de manicure y flores" width={1600} height={1008}
              className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-lift" />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container-linsy py-16 sm:py-20">
        <SectionHeading eyebrow="Categorías" title="¿Qué te quieres regalar hoy?" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </section>

      {/* Destacados */}
      <section className="container-linsy pb-16">
        <SectionHeading eyebrow="Destacados" title="Profesionales destacados" />
        <EmptyState icon={Store} title="Muy pronto, las primeras profesionales"
          action={<Button asChild><Link to="/publicar">Sé de las primeras en publicar</Link></Button>}>
          Linsy está comenzando. Aquí aparecerán los perfiles revisados y aprobados por nuestro equipo.
        </EmptyState>
      </section>

      {/* Cómo funciona */}
      <section className="bg-card py-16 sm:py-20">
        <div className="container-linsy grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Para clientes" title="Cómo funciona" />
            <Steps steps={[
              [Search, "Busca", "Por servicio, comuna o cerca de ti."],
              [Eye, "Compara", "Revisa servicios, precios publicados y modalidad de atención."],
              [MessageCircle, "Escribe", "Consulta o pide una hora directo por WhatsApp."],
            ]} />
          </div>
          <div>
            <SectionHeading eyebrow="Para profesionales" title="Publica en tres pasos" />
            <Steps steps={[
              [UserRoundPen, "Crea tu perfil", "Agrega tus servicios, precios y fotos de tus trabajos."],
              [BadgeCheck, "Revisión", "Nuestro equipo revisa tu perfil antes de publicarlo."],
              [Send, "Recibe consultas", "Las personas te escriben directo a tu WhatsApp."],
            ]} />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="container-linsy grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <img src={proImg} alt="Manos de una profesional ordenando brochas junto a un celular y una agenda" width={1200} height={912}
          loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft" />
        <div>
          <SectionHeading eyebrow="Beneficios" title="Tu negocio, más fácil de encontrar" />
          <ul className="space-y-4">
            {[
              ["Una vitrina propia", "Perfil con tus servicios, precios y galería de trabajos."],
              ["Te encuentran por comuna", "Aparece cuando buscan tu servicio cerca."],
              ["Contacto directo", "Sin intermediarios: las consultas llegan a tu WhatsApp."],
              ["Tú controlas tu privacidad", "Decide si muestras tu dirección exacta o solo tu comuna."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${["bg-rosa text-rosa-ink", "bg-menta text-menta-ink", "bg-lila text-lila-ink", "bg-durazno text-durazno-ink"][i]}`}>{i + 1}</span>
                <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Opiniones */}
      <section className="container-linsy pb-16">
        <SectionHeading eyebrow="Opiniones" title="Lo que dicen de Linsy" />
        <EmptyState icon={MessagesSquare} title="Aún no hay opiniones">
          Solo mostraremos opiniones reales y verificables. Cuando existan, las verás aquí.
        </EmptyState>
      </section>

      {/* FAQ */}
      <section className="container-linsy grid gap-8 pb-16 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
        <Accordion type="single" collapsible className="rounded-3xl bg-card px-6 shadow-soft">
          {FAQ.map(([q, a], i) => (
            <AccordionItem key={q} value={`f${i}`}>
              <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA final */}
      <section className="container-linsy">
        <div className="rounded-[2.5rem] bg-plum px-6 py-14 text-center text-plum-foreground sm:px-12">
          <h2 className="text-3xl font-semibold sm:text-4xl">Publica tu negocio en Linsy</h2>
          <p className="mx-auto mt-3 max-w-lg opacity-80">Muestra tu trabajo a personas que buscan tu servicio en tu comuna.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/publicar">Quiero publicar</Link></Button>
        </div>
      </section>
    </>
  );
}

type Step = [typeof Search, string, string];
function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-5">
      {steps.map(([Icon, t, d]) => (
        <li key={t} className="flex gap-4 rounded-2xl bg-background p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
        </li>
      ))}
    </ol>
  );
}
