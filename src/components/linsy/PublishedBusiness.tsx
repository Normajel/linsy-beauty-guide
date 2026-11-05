import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { findCategory, findCommune } from "@/lib/catalog";
import { modalities, signedPhotos, whatsappLink, type Revision } from "@/lib/linsy-backend";

export function PublishedBusiness({
  profile,
  publicView = false,
}: {
  profile: Revision;
  publicView?: boolean;
}) {
  const photos = useQuery({
    queryKey: ["business-photos", profile.id, profile.photos],
    enabled: profile.photos.length > 0,
    queryFn: () => signedPhotos(profile.photos),
    staleTime: 240000,
  });
  return (
    <div className="space-y-5 break-words">
      <p className="text-muted-foreground">
        {findCategory(profile.category)?.name} · {findCommune(profile.commune)?.name} ·{" "}
        {modalities[profile.modality]}
      </p>
      <p className="whitespace-pre-wrap">{profile.description}</p>
      {photos.isError && <p role="alert">No pudimos cargar las fotos.</p>}
      {!!photos.data?.length && (
        <section aria-label="Galería de trabajos" className="space-y-3">
          <h3 className="text-2xl font-semibold">Galería de trabajos</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.data.map((photo, index) => (
              <Dialog key={photo.path}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Ampliar foto ${index + 1}`}
                    className="group overflow-hidden rounded-2xl bg-accent first:col-span-2"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogTitle>
                    Foto {index + 1} de {profile.name}
                  </DialogTitle>
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="max-h-[72dvh] w-full rounded-xl object-contain"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      )}
      <h3 className="text-xl font-semibold">Servicios</h3>
      <ul className="space-y-2">
        {profile.services.map((service, index) => (
          <li key={index} className="flex justify-between gap-4 rounded-xl border bg-card p-4">
            <span>{service.name}</span>
            <span>
              {service.price === null
                ? "Consultar precio"
                : `Desde $${service.price.toLocaleString("es-CL")}`}
            </span>
          </li>
        ))}
      </ul>
      {publicView && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={whatsappLink(profile)} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={whatsappLink(profile, true)} target="_blank" rel="noopener noreferrer">
              Pedir cotización
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
