import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { TONE_CLASSES, type Category } from "@/lib/catalog";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      to="/explorar"
      search={{ categoria: category.slug }}
      className="group flex flex-col justify-between gap-6 rounded-3xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_CLASSES[category.tone]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </div>
      <div>
        <h3 className="font-sans text-base font-semibold">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{category.short}</p>
      </div>
    </Link>
  );
}
