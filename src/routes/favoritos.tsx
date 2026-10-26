import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/linsy/ComingSoon";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Mis favoritos · Linsy" },
      { name: "description", content: "Guarda tus profesionales favoritas en Linsy." },
      { property: "og:title", content: "Favoritos · Linsy" },
      { property: "og:description", content: "Tu lista personal de profesionales." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ComingSoon title="Favoritos" description="Pronto podrás crear una cuenta y guardar a tus profesionales favoritas en una lista personal." />
  ),
});
