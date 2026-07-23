import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  limpiarSesionesExpiradas as limpiarSesionesExpiradasModel,
  login as loginModel,
  logout as logoutModel,
  obtenerSesionActual as obtenerSesionActualModel,
  solicitarResetPassword as solicitarResetPasswordModel,
} from "./model/auth";

// Pública por necesidad: es la puerta de entrada (JOS-60/61), no puede exigir
// sesión para autenticar. Rate-limit best-effort por email exacto dentro del
// model (10 intentos/15min) — no protege contra emails rotados/aleatorios ni
// ataques distribuidos por IP (ver README). Nunca loguear email/password en
// caso de error — solo el mensaje del error capturado, si acaso, nunca aquí
// (el error ya es un ConvexError con mensaje genérico fijo).
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    return loginModel(ctx, args);
  },
});

// Solo puede invalidar la sesión cuyo token EXACTO recibe (32 bytes
// aleatorios, nunca expuestos salvo en la cookie httpOnly) — no permite
// cerrar la sesión de otro usuario sin conocer su token. Idempotente.
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return logoutModel(ctx, args);
  },
});

// Pública por necesidad: fetchQuery desde Next.js (src/lib/session.ts) solo
// puede invocar funciones públicas, nunca internalQuery. Segura por el mismo
// modelo de confianza que una cookie de sesión normal: sin el token real (alta
// entropía, solo vive en la cookie httpOnly) no se obtiene nada.
export const obtenerSesionActual = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return obtenerSesionActualModel(ctx, args);
  },
});

// No-op real esta ronda (ver convex/model/auth.ts) — decisión explícita del
// usuario de diferir el envío real de email de recuperación de contraseña.
export const solicitarResetPassword = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return solicitarResetPasswordModel(ctx, args);
  },
});

// Interna, invocada solo desde convex/crons.ts (job diario) — nunca pública.
export const limpiarSesionesExpiradas = internalMutation({
  args: {},
  handler: async (ctx) => {
    return limpiarSesionesExpiradasModel(ctx);
  },
});
