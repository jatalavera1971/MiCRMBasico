import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  obtenerPendientesHoy,
  obtenerProximoRecordatorio as obtenerProximoRecordatorioModel,
} from "./model/recordatorios";

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md.
export const listarSeguimientosHoy = query({
  args: {},
  handler: async (ctx) => {
    return obtenerPendientesHoy(ctx);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md. JOS-21 (16 jul
// 2026): la ficha (P3) muestra este dato en solo lectura, sin acciones de
// gestión (eso sigue siendo JOS-22, sin construir).
export const obtenerProximoRecordatorio = query({
  args: { clienteId: v.id("clientes") },
  handler: async (ctx, args) => {
    return obtenerProximoRecordatorioModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md. Es la función
// pública más sensible de las cuatro (modifica estado), así que este aviso
// va explícito aquí, no solo en las de solo lectura.
// JOS-24 (F9): marcar un recordatorio como hecho. Genérica y reutilizable desde
// P3 (ficha de cliente) más adelante, no solo desde P1. Idempotente: si ya está
// "hecho", no es un error, simplemente no hace nada. Valida que el recordatorio
// exista; no confía en que el cliente solo envíe ids de tareas visibles.
export const marcarComoHecho = mutation({
  args: { recordatorioId: v.id("recordatorios") },
  handler: async (ctx, { recordatorioId }) => {
    const recordatorio = await ctx.db.get(recordatorioId);
    if (!recordatorio) {
      throw new ConvexError("Recordatorio no encontrado");
    }
    if (recordatorio.estado !== "hecho") {
      await ctx.db.patch(recordatorioId, { estado: "hecho" });
    }
  },
});
