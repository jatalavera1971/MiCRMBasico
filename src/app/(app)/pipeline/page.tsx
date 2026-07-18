import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { PipelineBoardClient } from "@/components/pipeline/PipelineBoardClient";

// JOS-14: P6 carga una vez por visita, sin realtime — mismo criterio que
// inicio/page.tsx y clientes/page.tsx.
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const pipeline = await fetchQuery(api.clientes.obtenerPipeline, {});
  return <PipelineBoardClient pipeline={pipeline} />;
}
