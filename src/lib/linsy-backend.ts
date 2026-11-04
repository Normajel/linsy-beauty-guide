import { createClient, type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const url = import.meta.env["VITE_SUPABASE_URL"];
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
export const backend = url && key ? createClient(url, key) : null;
let passwordRecovery = false;
if (typeof window !== "undefined") {
  backend?.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") passwordRecovery = true;
    if (event === "SIGNED_OUT" || event === "USER_UPDATED") passwordRecovery = false;
  });
}
export const photosBucket = "linsy-business-images";
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

export const revisionFields =
  "id,business_id,status,name,description,category,commune,modality,whatsapp,services,photos,review_reason";

export function useLinsySession() {
  const [session, setSession] = useState<Session | null | undefined>(backend ? undefined : null);
  const [recovering, setRecovering] = useState(passwordRecovery);
  useEffect(() => {
    const subscription = backend?.auth.onAuthStateChange((event, value) => {
      setSession(value);
      setRecovering(event === "PASSWORD_RECOVERY" || passwordRecovery);
    });
    return () => subscription?.data.subscription.unsubscribe();
  }, []);
  return { session, recovering };
}

export async function signedPhotos(paths: string[]) {
  if (!backend || !paths.length) return [];
  const { data, error } = await backend.storage.from(photosBucket).createSignedUrls(paths, 300);
  if (error) throw error;
  return (data ?? []).flatMap((item) =>
    item.signedUrl && item.path
      ? [{ url: item.signedUrl, name: "Foto del negocio", path: item.path }]
      : [],
  );
}

export function whatsappLink(profile: Revision, quote = false) {
  const message = quote
    ? `Hola, encontré a ${profile.name} en Linsy y quisiera pedir una cotización.`
    : `Hola, encontré a ${profile.name} en Linsy y quisiera consultar por sus servicios.`;
  return `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message)}`;
}
