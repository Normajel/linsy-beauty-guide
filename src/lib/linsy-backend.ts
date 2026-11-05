import { createAuthClient } from "@neon/auth";
import { BetterAuthReactAdapter } from "@neon/auth/react/adapters";

export const modalities = {
  local: "Local comercial",
  domicilio: "A domicilio",
  casa: "Estudio en casa",
};

export type Revision = {
  id: string;
  business_id: string;
  status: "draft" | "pending" | "approved" | "rejected" | "archived";
  name: string;
  description: string;
  category: string;
  commune: string;
  modality: keyof typeof modalities;
  whatsapp: string;
  services: { name: string; price: number | null }[];
  photos: string[];
  review_reason: string | null;
};

export type Workspace = {
  role: "admin" | "professional";
  id?: string;
  approved?: Revision;
  working?: Revision;
};
export type Directory = {
  count: number;
  rows: (Pick<
    Revision,
    "business_id" | "name" | "description" | "category" | "commune" | "modality"
  > & { cover_photo?: string | null })[];
};
export type Moderation = {
  queue: Revision[];
  reports: { id: string; business_id: string; reason: string; created_at: string }[];
};

async function api<T>(path: string, body?: unknown): Promise<T> {
  const options: RequestInit =
    body === undefined
      ? {}
      : body instanceof File
        ? { method: "POST", body }
        : {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          };
  const result = await fetch(`/api/linsy/${path}`, options);
  if (!result.ok) {
    const data = await result.json().catch(() => null);
    throw new Error(data?.code ?? "backend_error");
  }
  return result.json();
}

export const backend = import.meta.env["VITE_NEON_AUTH_URL"] ? { api } : null;

const auth =
  typeof window !== "undefined" && backend
    ? createAuthClient(new URL("/api/auth", window.location.origin).href, {
        adapter: BetterAuthReactAdapter(),
      })
    : createAuthClient("https://localhost.invalid/api/auth", { adapter: BetterAuthReactAdapter() });

export const linsyAuth = auth;

export function useLinsySession() {
  const result = auth.useSession();
  return { session: backend && result.isPending ? undefined : (result.data ?? null) };
}

export function signedPhotos(paths: string[]) {
  return paths.map((path) => ({
    url: `/api/linsy/photos/${encodeURIComponent(path)}`,
    name: "Foto del negocio",
    path,
  }));
}

export function whatsappLink(profile: Revision, quote = false) {
  const message = quote
    ? `Hola, encontré a ${profile.name} en Linsy y quisiera pedir una cotización.`
    : `Hola, encontré a ${profile.name} en Linsy y quisiera consultar por sus servicios.`;
  return `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message)}`;
}
