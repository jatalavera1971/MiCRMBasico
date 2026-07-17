import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  actualizarRecordatorio as actualizarRecordatorioModel,
  crearRecordatorio as crearRecordatorioModel,
  listarRecordatoriosPendientes as listarRecordatoriosPendientesModel,
  obtenerPendientesHoy,
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
// aceptado explícitamente desde 2026-07-12 — ver README.md. JOS-22 (17 jul
// 2026): lista completa de recordatorios pendientes de un cliente, para la
// sección "Próximo recordatorio" (el primero) y su "Ver todos" (el resto) —
// sustituye a la anterior obtenerProximoRecordatorio (JOS-21), que solo
// devolvía uno.
export const listarRecordatoriosPendientes = query({
  args: { clienteId: v.id("clientes") },
  handler: async (ctx, args) => {
    return listarRecordatoriosPendientesModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md. JOS-22 (17 jul
// 2026): primera mutation pública que CREA un recordatorio directamente
// desde la ficha, sin pasar por una interacción (hasta ahora solo existía el
// efecto automático de crearInteraccion) — riesgo ampliado aceptado
// explícitamente el 17 jul 2026, con límites de longitud/fecha server-side
// (ver convex/model/recordatorios.ts:validarDatosRecordatorio).
export const crearRecordatorio = mutation({
  args: { clienteId: v.id("clientes"), fecha: v.string(), motivo: v.string() },
  handler: async (ctx, args) => {
    return crearRecordatorioModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md. JOS-22 (17 jul
// 2026): edita fecha/motivo de un recordatorio pendiente ya existente. Exige
// `clienteId` además de `recordatorioId` para verificar pertenencia en
// servidor — mitigación de contrato, no un control de autorización real (sin
// auth, cualquiera que conozca ambos ids podría seguir editando).
export const actualizarRecordatorio = mutation({
  args: {
    recordatorioId: v.id("recordatorios"),
    clienteId: v.id("clientes"),
    fecha: v.string(),
    motivo: v.string(),
  },
  handler: async (ctx, args) => {
    return actualizarRecordatorioModel(ctx, args);
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
