import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { InactivosListClient } from "@/components/clientes/InactivosListClient";

export const dynamic = "force-dynamic";

export default async function InactivosPage() {
  const clientes = await fetchQuery(api.clientes.listarClientesInactivos, {});

  return <InactivosListClient clientesIniciales={clientes} />;
}
