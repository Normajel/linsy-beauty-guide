// Catálogo base. En la etapa 2 pasa a la base de datos y será administrable.
import {
  Scissors, Sparkles, Eye, Brush, Hand, Palette, Feather, Leaf, HeartHandshake, Flower2, Gem,
  type LucideIcon,
} from "lucide-react";

export type Tone = "rosa" | "lila" | "durazno" | "menta";

export interface Category {
  slug: string;
  name: string;
  short: string;
  icon: LucideIcon;
  tone: Tone;
}

export const CATEGORIES: Category[] = [
  { slug: "peluqueria", name: "Peluquería", short: "Cortes, color y peinados", icon: Scissors, tone: "rosa" },
  { slug: "cosmetologia", name: "Cosmetología y faciales", short: "Limpiezas y tratamientos", icon: Sparkles, tone: "menta" },
  { slug: "pestanas", name: "Pestañas y lashistas", short: "Extensiones y lifting", icon: Eye, tone: "lila" },
  { slug: "barberia", name: "Barbería", short: "Cortes, barba y degradados", icon: Brush, tone: "durazno" },
  { slug: "unas", name: "Manicure y uñas", short: "Esmaltado, kapping y más", icon: Hand, tone: "rosa" },
  { slug: "maquillaje", name: "Maquillaje", short: "Social y profesional", icon: Palette, tone: "lila" },
  { slug: "cejas", name: "Diseño de cejas", short: "Perfilado y laminado", icon: Feather, tone: "durazno" },
  { slug: "depilacion", name: "Depilación", short: "Cera, hilo y más", icon: Leaf, tone: "menta" },
  { slug: "masajes", name: "Masajes", short: "Relajación y descontracturantes", icon: HeartHandshake, tone: "menta" },
  { slug: "corporales", name: "Tratamientos corporales", short: "Reductivos y reafirmantes", icon: Flower2, tone: "rosa" },
  { slug: "novias-eventos", name: "Novias y eventos", short: "Para tu día especial", icon: Gem, tone: "lila" },
];

export const TONE_CLASSES: Record<Tone, string> = {
  rosa: "bg-rosa text-rosa-ink",
  lila: "bg-lila text-lila-ink",
  durazno: "bg-durazno text-durazno-ink",
  menta: "bg-menta text-menta-ink",
};

export interface Commune {
  slug: string;
  name: string;
  province: string;
}

const C = (name: string, province: string): Commune => ({ slug: slugify(name), name, province });

// Las 38 comunas de la Región de Valparaíso.
export const COMMUNES: Commune[] = [
  C("Valparaíso", "Valparaíso"), C("Viña del Mar", "Valparaíso"), C("Concón", "Valparaíso"),
  C("Quintero", "Valparaíso"), C("Puchuncaví", "Valparaíso"), C("Casablanca", "Valparaíso"),
  C("Juan Fernández", "Valparaíso"),
  C("Quilpué", "Marga Marga"), C("Villa Alemana", "Marga Marga"), C("Limache", "Marga Marga"), C("Olmué", "Marga Marga"),
  C("Quillota", "Quillota"), C("La Calera", "Quillota"), C("Hijuelas", "Quillota"), C("La Cruz", "Quillota"), C("Nogales", "Quillota"),
  C("San Antonio", "San Antonio"), C("Cartagena", "San Antonio"), C("El Quisco", "San Antonio"), C("El Tabo", "San Antonio"),
  C("Algarrobo", "San Antonio"), C("Santo Domingo", "San Antonio"),
  C("San Felipe", "San Felipe de Aconcagua"), C("Llaillay", "San Felipe de Aconcagua"), C("Catemu", "San Felipe de Aconcagua"),
  C("Panquehue", "San Felipe de Aconcagua"), C("Putaendo", "San Felipe de Aconcagua"), C("Santa María", "San Felipe de Aconcagua"),
  C("Los Andes", "Los Andes"), C("Calle Larga", "Los Andes"), C("Rinconada", "Los Andes"), C("San Esteban", "Los Andes"),
  C("La Ligua", "Petorca"), C("Cabildo", "Petorca"), C("Papudo", "Petorca"), C("Petorca", "Petorca"), C("Zapallar", "Petorca"),
  C("Isla de Pascua", "Isla de Pascua"),
];

export function normalizeText(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function slugify(s: string): string {
  return normalizeText(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const findCategory = (slug?: string) => CATEGORIES.find((c) => c.slug === slug);
export const findCommune = (slug?: string) => COMMUNES.find((c) => c.slug === slug);
