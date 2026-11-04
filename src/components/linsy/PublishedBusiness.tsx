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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.data.map((photo) => (
            <img
              key={photo.path}
              src={photo.url}
              alt={photo.name}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}
      <h3 className="text-xl font-semibold">Servicios</h3>
      <ul className="space-y-2">
        {profile.services.map((service, index) => (
          <li key={index} className="flex justify-between gap-4 border-b pb-2">
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
