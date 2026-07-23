import { notFound, redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "../../../../../../convex/_generated/api";
import { getSesionActual } from "@/lib/session";
import type { ClienteListado } from "@/components/clientes/ClienteRow";
import { EditClientForm } from "@/components/clientes/EditClientForm";

export const dynamic = "force-dynamic";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/");

  const { clienteId } = await params;

  let cliente: ClienteListado;
  try {
    cliente = await fetchQuery(api.clientes.obtenerCliente, {
      clienteId,
      token: sesion.token,
    });
  } catch (err) {
    // Mismo manejo preciso que la ficha (src/app/(app)/clientes/[clienteId]/page.tsx):
    // solo "Cliente no encontrado" es un 404, cualquier otro fallo se relanza.
    if (err instanceof ConvexError && err.data === "Cliente no encontrado") {
      notFound();
    }
    throw err;
  }

  return <EditClientForm cliente={cliente} />;
}
