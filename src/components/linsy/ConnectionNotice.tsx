import { Info } from "lucide-react";

export function ConnectionNotice({ account = false }: { account?: boolean }) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-lg border border-border bg-durazno p-4 text-sm text-durazno-ink"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p>
        {account
          ? "Las cuentas aún no están habilitadas. No ingreses una contraseña real."
          : "Vista de prueba. Los cambios no se guardan ni se publican y se pierden al salir de esta página."}
      </p>
    </div>
  );
}
