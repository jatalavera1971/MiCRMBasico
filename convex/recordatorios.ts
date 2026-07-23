import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSesion as requireSesionModel } from "./model/auth";
import {
  actualizarRecordatorio as actualizarRecordatorioModel,
  crearRecordatorio as crearRecordatorioModel,
  listarRecordatoriosPendientes as listarRecordatoriosPendientesModel,
  obtenerPendientesHoy,
} from "./model/recordatorios";

// JOS-60/61 (23 jul 2026): todas las funciones de este archivo exigen ahora
// `token` de sesión válido (requireSesionModel) — ver la misma nota en
// convex/clientes.ts y el detalle del riesgo residual en README.md.

export const listarSeguimientosHoy = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return obtenerPendientesHoy(ctx);
  },
});

// JOS-22 (17 jul 2026): lista completa de recordatorios pendientes de un
// cliente, para la sección "Próximo recordatorio" (el primero) y su "Ver
// todos" (el resto).
export const listarRecordatoriosPendientes = query({
  args: { clienteId: v.id("clientes"), token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return listarRecordatoriosPendientesModel(ctx, {
      clienteId: args.clienteId,
    });
  },
});

// JOS-22 (17 jul 2026): crea un recordatorio directamente desde la ficha, sin
// pasar por una interacción — límites de longitud/fecha server-side (ver
// convex/model/recordatorios.ts:validarDatosRecordatorio).
export const crearRecordatorio = mutation({
  args: {
    clienteId: v.id("clientes"),
    fecha: v.string(),
    motivo: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return crearRecordatorioModel(ctx, args);
  },
});

// JOS-22 (17 jul 2026): edita fecha/motivo de un recordatorio pendiente ya
// existente. Exige `clienteId` además de `recordatorioId` para verificar
// pertenencia en servidor.
export const actualizarRecordatorio = mutation({
  args: {
    recordatorioId: v.id("recordatorios"),
    clienteId: v.id("clientes"),
    fecha: v.string(),
    motivo: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return actualizarRecordatorioModel(ctx, args);
  },
});

// JOS-24 (F9): marcar un recordatorio como hecho. Idempotente: si ya está
// "hecho", no es un error, simplemente no hace nada.
export const marcarComoHecho = mutation({
  args: { recordatorioId: v.id("recordatorios"), token: v.string() },
  handler: async (ctx, { recordatorioId, token }) => {
    await requireSesionModel(ctx, token);
    const recordatorio = await ctx.db.get(recordatorioId);
    if (!recordatorio) {
      throw new ConvexError("Recordatorio no encontrado");
    }
    if (recordatorio.estado !== "hecho") {
      await ctx.db.patch(recordatorioId, { estado: "hecho" });
    }
  },
});
