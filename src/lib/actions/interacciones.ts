"use server";

import { fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { getSesionActual } from "@/lib/session";

const NO_AUTENTICADO = "No autenticado. Vuelve a iniciar sesión.";

export async function crearInteraccionAction(args: {
  clienteId: Id<"clientes">;
  tipo: "llamada" | "email" | "whatsapp" | "reunion";
  notas: string;
  fecha: number;
  proximoPasoTexto?: string;
  proximoPasoFecha?: string;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    const resultado = await fetchMutation(api.interacciones.crearInteraccion, {
      ...args,
      token: sesion.token,
    });
    return {
      ok: true as const,
      recordatorioCreado: resultado.recordatorioCreado,
      recordatorioFecha: resultado.recordatorioFecha,
    };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof ConvexError
          ? String(err.data)
          : "No se pudo registrar la interacción. Inténtalo de nuevo.",
    };
  }
}
