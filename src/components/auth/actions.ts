"use server";

import { cookies } from "next/headers";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  getSesionActual,
} from "@/lib/session";

const MENSAJE_LOGIN_INVALIDO =
  "Correo o contraseña incorrectos. Inténtalo de nuevo.";

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
