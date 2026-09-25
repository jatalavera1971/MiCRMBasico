import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRolDuena, requireSesion as requireSesionModel } from "./model/auth";
import {
  actualizarNombrePropio as actualizarNombrePropioModel,
  actualizarUsuario as actualizarUsuarioModel,
  crearUsuarioAdmin as crearUsuarioAdminModel,
  desactivarUsuario as desactivarUsuarioModel,
  listarUsuarios as listarUsuariosModel,
  reactivarUsuario as reactivarUsuarioModel,
} from "./model/usuarios";

const ROL = v.union(v.literal("duena"), v.literal("comercial"));

// JOS-62: gateada por rol Dueña — solo Marta ve /usuarios, así que la query
// de carga también debe estar cerrada, no solo la UI.
export const listarUsuarios = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireRolDuena(ctx, token);
    return listarUsuariosModel(ctx);
  },
});

export const crearUsuarioAdmin = mutation({
  args: {
    nombreCompleto: v.string(),
    email: v.string(),
    password: v.string(),
    rol: ROL,
    token: v.string(),
  },
  handler: async (ctx, { token, ...args }) => {
    await requireRolDuena(ctx, token);
    return crearUsuarioAdminModel(ctx, args);
  },
});

// `usuarioIdSesion` NO forma parte de los argumentos públicos de esta
// mutation (auditoría del plan) — viene exclusivamente del resultado de
// requireRolDuena, así que quien llama no puede aportar un valor propio ni
// eludir el candado de "no puedes quitarte a ti misma el rol de Dueña" en
// actualizarUsuarioModel.
export const actualizarUsuario = mutation({
  args: {
    usuarioId: v.id("usuarios"),
    nombreCompleto: v.string(),
    rol: ROL,
    rolConocido: ROL,
    token: v.string(),
  },
  handler: async (ctx, { token, ...args }) => {
    const sesion = await requireRolDuena(ctx, token);
    return actualizarUsuarioModel(ctx, { ...args, usuarioIdSesion: sesion.usuarioId });
  },
});

// Mismo motivo que actualizarUsuario: usuarioIdSesion nunca es un argumento
// público, siempre viene de requireRolDuena — el candado de autodesactivación
// no es eludible desde fuera.
export const desactivarUsuario = mutation({
  args: { usuarioId: v.id("usuarios"), token: v.string() },
  handler: async (ctx, { usuarioId, token }) => {
    const sesion = await requireRolDuena(ctx, token);
    return desactivarUsuarioModel(ctx, { usuarioId, usuarioIdSesion: sesion.usuarioId });
  },
});

export const reactivarUsuario = mutation({
  args: { usuarioId: v.id("usuarios"), token: v.string() },
  handler: async (ctx, { usuarioId, token }) => {
    await requireRolDuena(ctx, token);
    return reactivarUsuarioModel(ctx, { usuarioId });
  },
});

// JOS-63: self-service — solo exige sesión (no rol). Deliberadamente no
// acepta `usuarioId` como argumento: el objetivo siempre es la propia
// sesión, nunca uno elegido por quien llama (evita cualquier IDOR aquí).
export const actualizarNombrePropio = mutation({
  args: { nombreCompleto: v.string(), token: v.string() },
  handler: async (ctx, { nombreCompleto, token }) => {
    const sesion = await requireSesionModel(ctx, token);
    return actualizarNombrePropioModel(ctx, {
      usuarioId: sesion.usuarioId,
      nombreCompleto,
    });
  },
});
