import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, ImagePlus, Plus, Trash2, Store, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, COMMUNES } from "@/lib/catalog";
import { ConnectionNotice } from "./ConnectionNotice";
import { PageHeader } from "./States";

type Service = { id: number; name: string; price: string };
type Photo = { url: string; name: string };
export function BusinessEditor() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [commune, setCommune] = useState("");
  const [mode, setMode] = useState("local");
  const [services, setServices] = useState<Service[]>([{ id: 0, name: "", price: "" }]);
  const nextId = useRef(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const urls = useRef<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => () => urls.current.forEach((url) => URL.revokeObjectURL(url)), []);
  const canPreview = name.trim() && category && commune;
  function updateService(id: number, key: "name" | "price", value: string) {
    setServices((current) => current.map((s) => s.id === id ? { ...s, [key]: value } : s));
  }
  return <>
    <PageHeader title="Publica tu negocio">Tu talento merece su propio espacio.</PageHeader>
    <div className="container-linsy grid gap-10 py-10 lg:grid-cols-[1fr_280px]">
      <div className="min-w-0 space-y-8">
        <ConnectionNotice />
        <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); if (canPreview) setPreview(true); }}>
          <fieldset className="space-y-5"><legend className="mb-4 text-2xl font-semibold font-display">1. Tu negocio</legend>
            <div className="space-y-2"><label htmlFor="business-name" className="text-sm font-semibold">Nombre del negocio *</label><Input id="business-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="space-y-2"><label htmlFor="description" className="text-sm font-semibold">Sobre tu trabajo</label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
            <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><label htmlFor="category" className="text-sm font-semibold">Categoría *</label><Select value={category} onValueChange={setCategory}><SelectTrigger id="category"><SelectValue placeholder="Elige una categoría" /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><label htmlFor="commune" className="text-sm font-semibold">Comuna *</label><Select value={commune} onValueChange={setCommune}><SelectTrigger id="commune"><SelectValue placeholder="Elige tu comuna" /></SelectTrigger><SelectContent>{COMMUNES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent></Select></div></div>
          </fieldset>
          <fieldset className="space-y-5 border-t pt-8"><legend className="text-2xl font-semibold font-display">2. Atención y contacto</legend>
            <div className="flex flex-wrap gap-4">{[["local", "Local comercial"], ["domicilio", "A domicilio"], ["casa", "Estudio en casa"]].map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm"><input type="radio" name="modalidad" checked={mode === value} onChange={() => setMode(value)} className="accent-primary" />{label}</label>)}</div>
            <div className="space-y-2"><label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp</label><Input id="whatsapp" type="tel" placeholder="+56 9" autoComplete="off" /></div>
            <div className="space-y-2"><label htmlFor="address" className="text-sm font-semibold">Dirección (opcional)</label><Input id="address" autoComplete="off" /></div>
            <p className="text-sm text-muted-foreground">Esta vista previa muestra solo tu comuna, no tu dirección ni tu teléfono.</p>
          </fieldset>
          <fieldset className="space-y-4 border-t pt-8"><legend className="text-2xl font-semibold font-display">3. Servicios y precios</legend>
            {services.map((s, i) => <div key={s.id} className="grid grid-cols-[1fr_40px] items-end gap-3 sm:grid-cols-[1fr_150px_40px]"><div className="space-y-2"><label htmlFor={`service-${s.id}`} className="text-sm font-semibold">Servicio {i + 1}</label><Input id={`service-${s.id}`} value={s.name} onChange={(e) => updateService(s.id, "name", e.target.value)} /></div><div className="col-start-1 space-y-2 sm:col-start-auto"><label htmlFor={`price-${s.id}`} className="text-sm font-semibold">Desde (CLP)</label><Input id={`price-${s.id}`} type="number" min="0" step="1" value={s.price} onChange={(e) => updateService(s.id, "price", e.target.value)} placeholder="Consultar precio" /></div><Button type="button" variant="ghost" size="icon" aria-label={`Eliminar servicio ${i + 1}`} onClick={() => setServices((current) => current.filter((item) => item.id !== s.id))}><Trash2 /></Button></div>)}
            <Button type="button" variant="outline" onClick={() => setServices((current) => [...current, { id: nextId.current++, name: "", price: "" }])}><Plus />Agregar servicio</Button>
          </fieldset>
          <fieldset className="space-y-4 border-t pt-8"><legend className="text-2xl font-semibold font-display">4. Fotos de tu trabajo</legend>
            <p className="text-sm text-muted-foreground">Usa fotografías propias y con autorización de las personas que aparecen.</p>
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-input bg-card px-5 py-8 text-sm font-semibold focus-within:ring-2 focus-within:ring-ring"><ImagePlus className="h-5 w-5 text-primary" />Elegir fotos<input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" aria-label="Elegir fotos" onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.some((f) => !["image/jpeg", "image/png", "image/webp"].includes(f.type))) { setError("Elige imágenes JPG, PNG o WebP."); return; }
              setError("");
              const added = files.map((f) => { const url = URL.createObjectURL(f); urls.current.push(url); return { url, name: f.name }; });
              setPhotos((current) => [...current, ...added]); e.target.value = "";
            }} /></label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{photos.map((photo) => <div key={photo.url} className="relative"><img src={photo.url} alt={photo.name} className="aspect-square w-full rounded-lg object-cover" /><Button type="button" variant="secondary" size="icon" className="absolute right-2 top-2" aria-label={`Quitar foto ${photo.name}`} onClick={() => { URL.revokeObjectURL(photo.url); urls.current = urls.current.filter((u) => u !== photo.url); setPhotos((current) => current.filter((p) => p.url !== photo.url)); }}><Trash2 /></Button></div>)}</div>
          </fieldset>
          <div className="flex flex-wrap gap-3 border-t pt-6"><Button type="submit" variant="outline" disabled={!canPreview}><Eye />Vista previa</Button><Button disabled>Guardar borrador</Button><Button disabled variant="secondary">Enviar a revisión</Button></div>
        </form>
      </div>
      <aside className="space-y-5 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"><Store className="h-8 w-8 text-primary" /><h2 className="text-2xl font-semibold">Mi espacio profesional</h2><p className="text-sm text-muted-foreground">Tu perfil comienza como borrador. Solo aparecerá en el directorio después de ser aprobado.</p><Button asChild variant="outline" className="w-full"><Link to="/mi-negocio">Ver mi panel</Link></Button><Button asChild variant="ghost" className="w-full"><Link to="/registrarse">Crear cuenta profesional</Link></Button></aside>
    </div>
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>Vista previa de prueba</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">No guardada · No publicada</p><h2 className="break-words text-3xl font-semibold">{name}</h2><p className="text-sm text-primary">{CATEGORIES.find((c) => c.slug === category)?.name}</p><p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" />{COMMUNES.find((c) => c.slug === commune)?.name} · {mode === "local" ? "Local comercial" : mode === "casa" ? "Estudio en casa" : "A domicilio"}</p><p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{description}</p>{photos.length > 0 && <div className="grid grid-cols-2 gap-3">{photos.map((p) => <img key={p.url} src={p.url} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />)}</div>}<h3 className="text-xl font-semibold">Servicios</h3>{services.filter((s) => s.name.trim()).map((s) => <div key={s.id} className="flex justify-between gap-4 border-b py-3 text-sm"><span className="min-w-0 break-words">{s.name}</span><span className="shrink-0 font-semibold">{s.price ? `Desde $${Number(s.price).toLocaleString("es-CL")}` : "Consultar precio"}</span></div>)}<Button disabled>Contactar por WhatsApp</Button></DialogContent></Dialog>
  </>;
}