import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getSesionActual } from "@/lib/session";
import { ClientesListClient } from "@/components/clientes/ClientesListClient";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/");

  const clientes = await fetchQuery(api.clientes.listarClientes, {
    token: sesion.token,
  });

  return <ClientesListClient clientesIniciales={clientes} />;
}
