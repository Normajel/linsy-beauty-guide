import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/catalog";
import { Logo } from "./Logo";

const navLink = "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
const activeProps = { className: "text-foreground" };

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-linsy flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          <Link to="/" className={navLink} activeProps={activeProps} activeOptions={{ exact: true }}>Inicio</Link>
          <Link to="/explorar" className={navLink} activeProps={activeProps}>Explorar</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className={`${navLink} inline-flex items-center gap-1`}>
              Categorías <ChevronDown className="h-4 w-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {CATEGORIES.map((c) => (
                <DropdownMenuItem key={c.slug} asChild>
                  <Link to="/explorar" search={{ categoria: c.slug }}>
                    <c.icon className="h-4 w-4" aria-hidden /> {c.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/categorias">Ver todas</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/comunas" className={navLink} activeProps={activeProps}>Comunas</Link>
          <Link to="/favoritos" className={`${navLink} inline-flex items-center gap-1`} activeProps={activeProps}>
            <Heart className="h-4 w-4" aria-hidden /> Favoritos
          </Link>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm"><Link to="/ingresar">Iniciar sesión</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/registrarse">Registrarse</Link></Button>
          <Button asChild size="sm"><Link to="/publicar">Publicar mi negocio</Link></Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
            <SheetHeader><SheetTitle className="font-display text-2xl">Linsy</SheetTitle></SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-4 pb-8" aria-label="Menú móvil" onClick={() => setOpen(false)}>
              {[
                { to: "/", label: "Inicio" },
                { to: "/explorar", label: "Explorar profesionales" },
                { to: "/comunas", label: "Comunas" },
                { to: "/favoritos", label: "Favoritos" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="rounded-xl px-3 py-3 font-medium hover:bg-accent">{l.label}</Link>
              ))}
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categorías</p>
              <div className="grid grid-cols-1 gap-1">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} to="/explorar" search={{ categoria: c.slug }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-accent">
                    <c.icon className="h-4 w-4 text-primary" aria-hidden /> {c.name}
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild><Link to="/publicar">Publicar mi negocio</Link></Button>
                <Button asChild variant="outline"><Link to="/registrarse">Registrarse</Link></Button>
                <Button asChild variant="ghost"><Link to="/ingresar">Iniciar sesión</Link></Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
