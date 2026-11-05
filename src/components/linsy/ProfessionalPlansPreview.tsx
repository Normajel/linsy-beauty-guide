import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ProfessionalPlansPreview() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Tu crecimiento en Linsy
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">Planes profesionales</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Explora las alternativas para tu negocio. La contratación y los pagos todavía no están
            habilitados.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/planes">Conocer los planes</Link>
        </Button>
      </div>
    </section>
  );
}
