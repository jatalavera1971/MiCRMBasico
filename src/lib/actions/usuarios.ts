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

type Rol = "duena" | "comercial";

// Payload construido campo a campo, NUNCA {...args, token} (auditoría de
// JOS-63, ronda 1): args maneja una contraseña en texto plano, y un caller
// que se salte el tipado de TypeScript (se borra en runtime) podría colar un
// campo extra — el ArgumentValidationError de Convex por campo extra incluye
// el objeto COMPLETO recibido, token incluido, en su mensaje. Ningún catch de
// este archivo loguea nada: no hace falta ningún diagnóstico aquí, así se
// evita de raíz el riesgo de filtrar algo sensible por logs.
export async function crearUsuarioAction(args: {
  nombreCompleto: string;
  email: string;
  password: string;
  rol: Rol;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    const usuario = await fetchMutation(api.usuarios.crearUsuarioAdmin, {
      nombreCompleto: args.nombreCompleto,
      email: args.email,
      password: args.password,
      rol: args.rol,
      token: sesion.token,
    });
    return { ok: true as const, usuario };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo crear el usuario. Inténtalo de nuevo."),
    };
  }
}

// `rolConocido` es el rol que el formulario tenía cargado al abrirse — el
// servidor lo compara contra el rol actual en base de datos antes de
// guardar, para detectar una edición concurrente de rol (auditoría, ronda 2:
// ver convex/model/usuarios.ts:actualizarUsuario).
export async function actualizarUsuarioAction(args: {
  usuarioId: Id<"usuarios">;
  nombreCompleto: string;
  rol: Rol;
  rolConocido: Rol;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    const usuario = await fetchMutation(api.usuarios.actualizarUsuario, {
      usuarioId: args.usuarioId,
      nombreCompleto: args.nombreCompleto,
      rol: args.rol,
      rolConocido: args.rolConocido,
      token: sesion.token,
    });
    return { ok: true as const, usuario };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudieron guardar los cambios. Inténtalo de nuevo."),
    };
  }
}

export async function desactivarUsuarioAction(args: { usuarioId: Id<"usuarios"> }) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.usuarios.desactivarUsuario, {
      usuarioId: args.usuarioId,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo desactivar el usuario. Inténtalo de nuevo."),
    };
  }
}

export async function reactivarUsuarioAction(args: { usuarioId: Id<"usuarios"> }) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.usuarios.reactivarUsuario, {
      usuarioId: args.usuarioId,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: mensajeError(err, "No se pudo reactivar el usuario. Inténtalo de nuevo."),
    };
  }
}
