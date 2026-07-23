"use server";

import { fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { getSesionActual } from "@/lib/session";

const NO_AUTENTICADO = "No autenticado. Vuelve a iniciar sesión.";

type Prioridad = "alta" | "media" | "baja";
type CanalPreferido = "telefono" | "whatsapp" | "email" | "reunion";
type Fase =
  | "lead"
  | "cualificacion"
  | "primera_llamada"
  | "propuesta_enviada"
  | "negociacion"
  | "cerrado";

function mensajeError(err: unknown, generico: string): string {
  return err instanceof ConvexError ? String(err.data) : generico;
}

export async function crearClienteAction(args: {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  prioridad: Prioridad;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    const id = await fetchMutation(api.clientes.crearCliente, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const, id };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo crear el cliente. Inténtalo de nuevo."),
    };
  }
}

export async function actualizarClienteAction(args: {
  clienteId: Id<"clientes">;
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  prioridad: Prioridad;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.clientes.actualizarCliente, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(
        err,
        "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      ),
    };
  }
}

export async function actualizarCanalPreferidoAction(args: {
  clienteId: Id<"clientes">;
  canal_preferido: CanalPreferido;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.clientes.actualizarCanalPreferido, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(
        err,
        "No se pudo actualizar el canal preferido. Inténtalo de nuevo.",
      ),
    };
  }
}

export async function actualizarPrioridadAction(args: {
  clienteId: Id<"clientes">;
  prioridad: Prioridad;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.clientes.actualizarPrioridad, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(
        err,
        "No se pudo actualizar la prioridad. Inténtalo de nuevo.",
      ),
    };
  }
}

export async function actualizarFaseAction(args: {
  clienteId: Id<"clientes">;
  fase: Fase;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.clientes.actualizarFase, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo actualizar la fase. Inténtalo de nuevo."),
    };
  }
}

export async function eliminarClienteAction(args: { clienteId: Id<"clientes"> }) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.clientes.eliminarCliente, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo eliminar el cliente. Inténtalo de nuevo."),
    };
  }
}

export async function reactivarAction(args: { clienteId: Id<"clientes"> }) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.clientes.reactivar, {
      ...args,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(
        err,
        "No se pudo reactivar — puede que ya no esté inactivo. Recarga la página.",
      ),
    };
  }
}
