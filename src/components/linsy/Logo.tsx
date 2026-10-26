import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-baseline gap-1" aria-label="Linsy, ir al inicio">
      <span className="font-display text-2xl font-semibold tracking-tight text-foreground">Linsy</span>
      <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
    </Link>
  );
}
