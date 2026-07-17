import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "../../../../../convex/_generated/api";
import type { ClienteListado } from "@/components/clientes/ClienteRow";
import { ClienteFichaClient } from "@/components/clientes/ClienteFichaClient";

export const dynamic = "force-dynamic";

export default async function FichaClientePage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const { clienteId } = await params;

  let cliente: ClienteListado;
  try {
    cliente = await fetchQuery(api.clientes.obtenerCliente, { clienteId });
  } catch (err) {
    // Solo el caso de negocio esperado ("Cliente no encontrado" — id con
    // formato inválido o cliente inexistente, ver convex/model/clientes.ts:
    // obtenerCliente) se convierte en 404. Cualquier otro fallo (caída de
    // Convex, error interno) se relanza y llega al error boundary genérico
    // de Next.js — nunca se disfraza de "no encontrado".
    if (err instanceof ConvexError && err.data === "Cliente no encontrado") {
      notFound();
    }
    throw err;
  }

  // Decisión 13 (plan JOS-18/19/20/21): solo se lanzan en paralelo una vez el
  // cliente existe de verdad — listarInteracciones/listarRecordatoriosPendientes
  // toman v.id("clientes") validado (cliente._id), no el clienteId crudo de
  // la URL.
  const [interacciones, recordatoriosPendientes] = await Promise.all([
    fetchQuery(api.interacciones.listarInteracciones, { clienteId: cliente._id }),
    fetchQuery(api.recordatorios.listarRecordatoriosPendientes, { clienteId: cliente._id }),
  ]);

  return (
    <ClienteFichaClient
      cliente={cliente}
      interacciones={interacciones}
      recordatoriosPendientes={recordatoriosPendientes}
    />
  );
}
