import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-linsy grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Profesionales y emprendimientos de belleza y cuidado personal en la Región de Valparaíso.
          </p>
        </div>
        <FooterCol title="Explorar" links={[["/explorar", "Profesionales"], ["/categorias", "Categorías"], ["/comunas", "Comunas"]]} />
        <FooterCol title="Profesionales" links={[["/publicar", "Publicar mi negocio"], ["/mi-negocio", "Mi negocio"], ["/ingresar", "Iniciar sesión"], ["/administracion", "Administración · vista de prueba"]]} />
        <FooterCol title="Legal" links={[["/privacidad", "Privacidad"], ["/terminos", "Términos de uso"]]} />
      </div>
      <div className="border-t border-border">
        <p className="container-linsy py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Linsy · Hecho en la Región de Valparaíso, Chile.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-3 font-sans text-sm font-semibold">{title}</h3>
      <ul className="space-y-2">
        {links.map(([to, label]) => (
          <li key={to}><Link to={to} className="text-sm text-muted-foreground hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
