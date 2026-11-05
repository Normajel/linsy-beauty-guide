import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Camera, MapPin, MessageCircle, Search, Sparkles, Store } from "lucide-react";
import proImg from "@/assets/profesionales.jpg";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORIES, COMMUNES } from "@/lib/catalog";
import { CategoryCard } from "@/components/linsy/CategoryCard";
import { SearchBar } from "@/components/linsy/SearchBar";
import { BusinessCard } from "@/components/linsy/BusinessCard";
import { EmptyState, SectionHeading } from "@/components/linsy/States";
import { backend, type Directory } from "@/lib/linsy-backend";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linsy · Encuentra tu próximo momento de cuidado en la Región de Valparaíso" },
      {
        name: "description",
        content:
          "Busca peluquería, uñas, pestañas, cosmetología, masajes y más por comuna. Contacta directo por WhatsApp.",
      },
      { property: "og:title", content: "Linsy · Encuentra tu próximo momento de cuidado" },
      {
        property: "og:description",
        content: "Profesionales de belleza y cuidado personal en la Región de Valparaíso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FAQ = [
  [
    "¿Linsy cobra a quienes buscan servicios?",
    "No. Buscar y contactar profesionales en Linsy es gratis.",
  ],
  [
    "¿Cómo reservo una hora?",
    "Por ahora coordinas directamente con la profesional por WhatsApp. Linsy no gestiona reservas ni pagos.",
  ],
  [
    "¿Cómo se revisan los perfiles?",
    "Cada negocio pasa por una revisión del equipo de Linsy antes de aparecer públicamente.",
  ],
  [
    "¿Puedo publicar si atiendo a domicilio o en mi casa?",
    "Sí. Puedes indicar si atiendes en local comercial, a domicilio o en un estudio en casa, y decidir si muestras tu dirección.",
  ],
] as const;

const editorial = [
  { slug: "unas", title: "Manicure y uñas", photo: "/editorial/manicure.webp", number: "01" },
  { slug: "peluqueria", title: "Peluquería", photo: "/editorial/peluqueria.webp", number: "02" },
  {
    slug: "cosmetologia",
    title: "Cosmetología facial",
    photo: "/editorial/facial.webp",
    number: "03",
  },
];

function Index() {
  const directory = useQuery({
    queryKey: ["home-professionals"],
    enabled: !!backend,
    queryFn: () => backend!.api<Directory>("directory"),
  });

  return (
    <>
      <section className="editorial-hero">
        <div className="container-linsy editorial-hero-layout">
          <div className="relative z-10 py-8 lg:py-14">
            <p className="editorial-kicker">
              <MapPin aria-hidden size={15} /> Guía local · Región de Valparaíso
            </p>
            <h1 className="editorial-title">
              Tu próximo momento <em>de cuidado.</em>
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground sm:text-lg">
              Descubre servicios de belleza y bienestar cerca de ti. Explora los trabajos de
              profesionales locales y conversa directamente por WhatsApp.
            </p>
            <div className="mt-6">
              <SearchBar prominent />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground">Explora</span>
              {CATEGORIES.filter((c) => ["unas", "pestanas", "masajes"].includes(c.slug)).map(
                (c) => (
                  <Link
                    key={c.slug}
                    to="/explorar"
                    search={{ categoria: c.slug }}
                    className="rounded-full border border-primary/20 bg-card/70 px-3 py-2 font-medium hover:bg-card"
                  >
                    {c.name}
                  </Link>
                ),
              )}
            </div>
          </div>
          <figure className="editorial-hero-photo">
            <img
              src="/editorial/portada.webp"
              alt="Aplicación de una mascarilla facial en un estudio de belleza"
              fetchPriority="high"
              width={1440}
              height={960}
            />
            <figcaption>
              <Sparkles aria-hidden size={16} /> Belleza y bienestar local
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="servicios" className="container-linsy scroll-mt-24 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-4">
          <SectionHeading eyebrow="Explora por servicio" title="¿Qué te gustaría hacer hoy?" />
          <Button asChild variant="outline" className="mb-8">
            <Link to="/categorias">
              Todas las categorías <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
          {editorial.map((item) => (
            <Link
              key={item.slug}
              to="/explorar"
              search={{ categoria: item.slug }}
              className="editorial-service group"
            >
              <img src={item.photo} alt="" width={512} height={768} loading="lazy" />
              <span className="editorial-service-number">{item.number}</span>
              <span className="editorial-service-label">
                {item.title}
                <ArrowUpRight aria-hidden size={22} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-linsy pb-14">
        <SectionHeading eyebrow="Todas las especialidades" title="Encuentra lo que buscas" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-menta/40 py-12 sm:py-16">
        <div className="container-linsy">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Belleza en tu comuna" title="Más cerca de ti">
              Busca servicios donde vives o en la comuna que te acomode.
            </SectionHeading>
            <Button asChild variant="outline" className="mb-8">
              <Link to="/comunas">
                Ver todas las comunas <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COMMUNES.filter((c) =>
              [
                "quilpue",
                "vina-del-mar",
                "villa-alemana",
                "valparaiso",
                "concon",
                "limache",
              ].includes(c.slug),
            ).map((c) => (
              <Link
                key={c.slug}
                to="/explorar"
                search={{ comuna: c.slug }}
                className="flex items-center gap-3 rounded-2xl border bg-card p-5 motion-safe:transition hover:border-primary/50 hover:shadow-soft"
              >
                <span className="rounded-xl bg-menta p-3 text-menta-ink">
                  <MapPin size={20} aria-hidden />
                </span>
                <span className="flex-1 font-semibold">{c.name}</span>
                <ArrowUpRight size={18} aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-directory py-14 sm:py-20">
        <div className="container-linsy">
          <SectionHeading eyebrow="Conoce a los profesionales" title="Talento cerca de ti">
            Explora perfiles publicados, compara servicios y elige con quién conversar.
          </SectionHeading>
          {backend && directory.isPending ? (
            <p role="status">Cargando profesionales…</p>
          ) : directory.isError ? (
            <p role="alert">
              No pudimos cargar los perfiles. Puedes volver a intentarlo desde Explorar.
            </p>
          ) : directory.data?.rows.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {directory.data.rows.slice(0, 3).map((row) => (
                <BusinessCard key={row.business_id} row={row} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Store}
              title="Pronto conocerás a los primeros profesionales"
              action={
                <Button asChild>
                  <Link to="/publicar">Publica tu negocio</Link>
                </Button>
              }
            >
              Los perfiles estarán disponibles aquí una vez aprobados.
            </EmptyState>
          )}
          <Button asChild variant="outline" className="mt-6">
            <Link to="/explorar">
              Abrir el directorio <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-linsy grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <img
          src={proImg}
          alt="Brochas y herramientas en una mesa de trabajo"
          width={1200}
          height={912}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[2rem] object-cover"
        />
        <div>
          <SectionHeading eyebrow="Para profesionales" title="Muéstrales cómo trabajas">
            Publica tus servicios y precios. Agrega fotos de tu espacio y de trabajos que tengas
            autorización para compartir.
          </SectionHeading>
          <ul className="mb-7 space-y-3">
            <li className="flex items-center gap-3">
              <Camera size={20} className="text-primary" aria-hidden /> Una galería en tu ficha
              profesional
            </li>
            <li className="flex items-center gap-3">
              <Search size={20} className="text-primary" aria-hidden /> Presencia en el directorio
              por servicio y comuna
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={20} className="text-primary" aria-hidden /> Consultas directas
              por WhatsApp
            </li>
          </ul>
          <Button asChild>
            <Link to="/publicar">
              Publicar mi negocio <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-linsy grid gap-6 pb-16 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de agendar" />
        <Accordion type="single" collapsible className="rounded-3xl border bg-card px-6">
          {FAQ.map(([q, a], i) => (
            <AccordionItem key={q} value={`f${i}`}>
              <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
