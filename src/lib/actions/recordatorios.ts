"use server";

import { fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { getSesionActual } from "@/lib/session";

const NO_AUTENTICADO = "No autenticado. Vuelve a iniciar sesión.";

function mensajeError(err: unknown, generico: string): string {
  return err instanceof ConvexError ? String(err.data) : generico;
}

export async function crearRecordatorioAction(args: {
  clienteId: Id<"clientes">;
  fecha: string;
  motivo: string;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    const id = await fetchMutation(api.recordatorios.crearRecordatorio, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const, id };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(
        err,
        "No se pudo guardar el recordatorio. Inténtalo de nuevo.",
      ),
    };
  }
}

export async function actualizarRecordatorioAction(args: {
  recordatorioId: Id<"recordatorios">;
  clienteId: Id<"clientes">;
  fecha: string;
  motivo: string;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.recordatorios.actualizarRecordatorio, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(
        err,
        "No se pudo guardar el recordatorio. Inténtalo de nuevo.",
      ),
    };
  }
}

// Usada tanto desde la ficha de cliente (ClienteFichaClient) como desde la
// lista de tareas de Inicio (TaskListClient) — mismo action compartido.
export async function marcarComoHechoAction(args: {
  recordatorioId: Id<"recordatorios">;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.recordatorios.marcarComoHecho, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo marcar como hecho. Inténtalo de nuevo."),
    };
  }
}
