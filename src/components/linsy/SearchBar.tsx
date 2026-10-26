import { useNavigate } from "@tanstack/react-router";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { COMMUNES } from "@/lib/catalog";

export function SearchBar({ initialQ = "", initialComuna = "" }: { initialQ?: string; initialComuna?: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQ);
  const [comuna, setComuna] = useState(initialComuna);
  const [askGeo, setAskGeo] = useState(false);
  const [locating, setLocating] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    navigate({
      to: "/explorar",
      search: { q: q.trim().slice(0, 80) || undefined, comuna: comuna || undefined },
    });
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      toast.error("Tu navegador no permite compartir la ubicación.");
      setAskGeo(false);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setAskGeo(false);
        navigate({ to: "/explorar", search: { q: q.trim() || undefined, cerca: true } });
      },
      () => {
        setLocating(false);
        setAskGeo(false);
        toast.error("No pudimos obtener tu ubicación. Puedes elegir tu comuna en su lugar.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <>
      <form onSubmit={submit} role="search" className="rounded-3xl bg-card p-3 shadow-lift sm:p-4">
        <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
          <label className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="sr-only">Servicio</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              maxLength={80}
              placeholder="¿Qué servicio buscas? Ej: lifting, kapping"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
            <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="sr-only">Comuna</span>
            <select
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            >
              <option value="">Todas las comunas</option>
              {COMMUNES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <Button type="submit" size="lg" className="h-auto min-h-12">Buscar profesionales</Button>
        </div>
        <button
          type="button"
          onClick={() => setAskGeo(true)}
          className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:bg-accent"
        >
          <LocateFixed className="h-4 w-4" aria-hidden /> Cerca de mí
        </button>
      </form>

      <Dialog open={askGeo} onOpenChange={setAskGeo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Usar tu ubicación?</DialogTitle>
            <DialogDescription>
              La usaremos solo en este momento para ordenar a las profesionales por cercanía.
              No la guardamos ni la compartimos. Puedes elegir tu comuna en su lugar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAskGeo(false)}>Ahora no</Button>
            <Button onClick={requestLocation} disabled={locating}>
              {locating ? "Buscando ubicación…" : "Permitir ubicación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
