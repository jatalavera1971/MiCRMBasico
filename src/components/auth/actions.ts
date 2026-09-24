"use server";

import { cookies } from "next/headers";
import { fetchMutation } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  getSesionActual,
} from "@/lib/session";

const MENSAJE_LOGIN_INVALIDO =
  "Correo o contraseña incorrectos. Inténtalo de nuevo.";
const NO_AUTENTICADO = "No autenticado. Vuelve a iniciar sesión.";

// Nota (verificación manual, ronda de implementación): `auth.login` ya NUNCA
// lanza para credenciales inválidas/lockout — devuelve {ok:false} normal
// (ver convex/model/auth.ts para el porqué: una mutation que escribe en
// intentos_login y luego lanza pierde esa escritura por el rollback
// transaccional de Convex). El try/catch de aquí solo cubre fallos
// verdaderamente inesperados (red, Convex caído) — nunca se loguea
// contraseña, token ni cookie, pase lo que pase.
export async function loginAction(email: string, password: string) {
  try {
    const resultado = await fetchMutation(api.auth.login, { email, password });
    if (!resultado.ok) {
      return { ok: false as const, error: MENSAJE_LOGIN_INVALIDO };
    }
    const store = await cookies();
    store.set(SESSION_COOKIE_NAME, resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return { ok: true as const };
  } catch (err) {
    console.error(
      "Error inesperado en login:",
      err instanceof Error ? err.message : String(err),
    );
    return { ok: false as const, error: MENSAJE_LOGIN_INVALIDO };
  }
}

export async function logoutAction() {
  const sesion = await getSesionActual();
  const store = await cookies();
  if (sesion) {
    await fetchMutation(api.auth.logout, { token: sesion.token }).catch(
      (err) => {
        console.error(
          "Error al invalidar sesión en logout:",
          err instanceof Error ? err.message : String(err),
        );
      },
    );
  }
  store.delete(SESSION_COOKIE_NAME);
}

// JOS-63 (Perfil): editar el nombre propio. Patrón estándar try/catch +
// ConvexError, igual que el resto de Server Actions del repo — a diferencia
// de cambiarPasswordAction, esta mutation sí lanza para sus fallos de
// negocio (no tiene ningún contador que proteger de un rollback).
export async function actualizarNombrePropioAction(nombreCompleto: string) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    await fetchMutation(api.usuarios.actualizarNombrePropio, {
      nombreCompleto,
      token: sesion.token,
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof ConvexError
          ? String(err.data)
          : "No se pudo actualizar el nombre. Inténtalo de nuevo.",
    };
  }
}

// JOS-63 (Perfil): cambiar contraseña. A diferencia del resto de Server
// Actions, `api.auth.cambiarPassword` NUNCA lanza para un fallo de negocio
// esperado (contraseña actual incorrecta, lockout, nueva demasiado corta) —
// mismo contrato que `api.auth.login` (ver convex/model/auth.ts) — así que
// hay que comprobar `resultado.ok` explícitamente, igual que loginAction. El
// try/catch de aquí solo cubre fallos de infraestructura (red, Convex caído).
export async function cambiarPasswordAction(args: {
  passwordActual: string;
  passwordNueva: string;
}) {
  const sesion = await getSesionActual();
  if (!sesion) return { ok: false as const, error: NO_AUTENTICADO };
  try {
    // Payload construido explícitamente, NUNCA `...args` (auditoría del
    // código, ronda 1): `args` no se valida en runtime (los tipos de
    // TypeScript se borran al compilar), así que un caller que se salte el
    // tipado podría colar un campo extra. Convex rechaza el campo extra con
    // ArgumentValidationError, pero ese error incluye el objeto completo
    // recibido — incluidas ambas contraseñas y el token — en su mensaje
    // (comprobado empíricamente contra este mismo deployment). Construir el
    // payload campo a campo cierra la vía, pase lo que pase con `args`.
    const resultado = await fetchMutation(api.auth.cambiarPassword, {
      passwordActual: args.passwordActual,
      passwordNueva: args.passwordNueva,
      token: sesion.token,
    });
    if (!resultado.ok) {
      return { ok: false as const, error: resultado.error };
    }
    return { ok: true as const };
  } catch {
    // Nunca se loguea el mensaje del error aquí (a diferencia de loginAction):
    // por el mismo motivo de arriba, no hay garantía de qué pueda contener
    // — ni siquiera el nombre de la clase del error, solo un aviso fijo sin
    // contenido dinámico.
    console.error("Error inesperado en cambiarPassword");
    return {
      ok: false as const,
      error: "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
    };
  }
}

export async function solicitarResetAction(email: string) {
  try {
    await fetchMutation(api.auth.solicitarResetPassword, { email });
  } catch (err) {
    // No-op real server-side (ver convex/model/auth.ts) — un fallo aquí es
    // siempre un error de red/infra, nunca una validación de negocio. Se
    // registra solo para diagnóstico, la UI trata éxito y error por igual
    // (ver ForgotPasswordSheet: distinguir visualmente filtraría si el email
    // existe o no).
    console.error(
      "Error inesperado en solicitarResetPassword:",
      err instanceof Error ? err.message : String(err),
    );
  }
}
