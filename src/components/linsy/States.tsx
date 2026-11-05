import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/70 px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lila text-lila-ink">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {children && (
        <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{children}</div>
      )}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-muted-foreground">{children}</p>}
    </div>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="editorial-page-header border-b border-border/60">
      <div className="container-linsy py-11 sm:py-16">
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
