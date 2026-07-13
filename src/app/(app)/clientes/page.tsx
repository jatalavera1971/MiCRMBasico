import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { ClientesListClient } from "@/components/clientes/ClientesListClient";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await fetchQuery(api.clientes.listarClientes, {});

  return <ClientesListClient clientesIniciales={clientes} />;
}
