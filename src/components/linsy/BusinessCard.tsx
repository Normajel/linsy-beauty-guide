import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Store } from "lucide-react";
import { findCategory, findCommune } from "@/lib/catalog";
import { modalities, signedPhotos, type Directory } from "@/lib/linsy-backend";

export function BusinessCard({ row }: { row: Directory["rows"][number] }) {
  const cover = row.cover_photo ? signedPhotos([row.cover_photo])[0] : undefined;
  return (
    <Link
      to="/profesional/$slug"
      params={{ slug: row.business_id }}
      className="editorial-business group"
    >
      <div className="editorial-business-cover">
        {cover ? (
          <img
            src={cover.url}
            alt={`Trabajo de ${row.name}`}
            width={480}
            height={300}
            loading="lazy"
          />
        ) : (
          <Store size={36} aria-hidden />
        )}
      </div>
      <div className="space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {findCategory(row.category)?.name}
        </p>
        <h2 className="flex items-start justify-between gap-2 text-2xl font-semibold">
          <span className="min-w-0 break-words">{row.name}</span>
          <ArrowUpRight size={21} className="shrink-0 text-primary" aria-hidden />
        </h2>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={15} aria-hidden /> {findCommune(row.commune)?.name} ·{" "}
          {modalities[row.modality]}
        </p>
        {row.description && (
          <p className="line-clamp-2 break-words text-sm text-muted-foreground">
            {row.description}
          </p>
        )}
      </div>
    </Link>
  );
}
