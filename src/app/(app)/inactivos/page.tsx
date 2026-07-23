import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getSesionActual } from "@/lib/session";
import { InactivosListClient } from "@/components/clientes/InactivosListClient";

export const dynamic = "force-dynamic";

export default async function InactivosPage() {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/");

  const clientes = await fetchQuery(api.clientes.listarClientesInactivos, {
    token: sesion.token,
  });

  return <InactivosListClient clientesIniciales={clientes} />;
}
