import { Link } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "./States";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="container-linsy py-12">
        <EmptyState
          icon={Hourglass}
          title="Esta sección aún está en construcción"
          action={
            <>
              <Button asChild>
                <Link to="/explorar">Explorar profesionales</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </>
          }
        >
          {description}
        </EmptyState>
      </div>
    </>
  );
}
