import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  actualizarCanalPreferido as actualizarCanalPreferidoModel,
  actualizarCliente as actualizarClienteModel,
  actualizarFase as actualizarFaseModel,
  actualizarPrioridad as actualizarPrioridadModel,
  crearCliente as crearClienteModel,
  eliminarCliente as eliminarClienteModel,
  listarClientes as listarClientesModel,
  listarClientesInactivos as listarClientesInactivosModel,
  obtenerCliente as obtenerClienteModel,
  obtenerPipeline as obtenerPipelineModel,
} from "./model/clientes";

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md.
export const listarClientesInactivos = query({
  args: {},
  handler: async (ctx) => {
    return listarClientesInactivosModel(ctx);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. Es la primera función pública
// que CREA filas nuevas (hasta ahora solo había lecturas + un toggle de estado) —
// riesgo de spam/PII falsa aceptado explícitamente el 2026-07-13, con límites de
// longitud server-side (ver convex/model/clientes.ts) como única mitigación.
export const crearCliente = mutation({
  args: {
    nombre: v.string(),
    email: v.string(),
    empresa: v.optional(v.string()),
    telefono: v.optional(v.string()),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
  },
  handler: async (ctx, args) => {
    return crearClienteModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. JOS-10/13/45 (13 jul 2026)
// ampliaron su proyección: además de `nombre`/`email`/`prioridad` ahora también
// expone `telefono`, `empresa`, `canal_preferido`, `fase` y `fecha_ultimo_contacto`
// (necesarios para buscar/mostrar/ordenar en la pantalla "Clientes") — sigue
// proyectando solo esos 9 campos, nunca el documento completo, pero ya no son
// "solo 4 campos". La búsqueda de texto que consume esta query en el frontend
// solo cubre los hasta 500 clientes que devuelve `.take(500)`, no toda la tabla
// (ver convex/model/clientes.ts).
export const listarClientes = query({
  args: {},
  handler: async (ctx) => {
    return listarClientesModel(ctx);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. `clienteId` es v.string()
// a propósito, no v.id("clientes") (ver convex/model/clientes.ts:obtenerCliente)
// para que un id con formato inválido no falle en la validación de argumentos
// del SDK antes de llegar al handler.
export const obtenerCliente = query({
  args: { clienteId: v.string() },
  handler: async (ctx, { clienteId }) => {
    return obtenerClienteModel(ctx, { clienteId });
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. JOS-11/P4 (edición, 15 jul
// 2026): primera mutation pública capaz de MODIFICAR datos ya existentes de
// cualquier cliente (hasta ahora solo se podía crear/leer/marcar recordatorios
// hechos) — riesgo ampliado aceptado explícitamente el 15 jul 2026.
export const actualizarCliente = mutation({
  args: {
    clienteId: v.id("clientes"),
    nombre: v.string(),
    email: v.string(),
    empresa: v.optional(v.string()),
    telefono: v.optional(v.string()),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
  },
  handler: async (ctx, args) => {
    return actualizarClienteModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. Edición rápida de grano fino
// (JOS-11, selector de 4 botones de la ficha) — mismo riesgo ampliado de
// actualizarCliente, aceptado explícitamente el 15 jul 2026.
export const actualizarCanalPreferido = mutation({
  args: {
    clienteId: v.id("clientes"),
    canal_preferido: v.union(
      v.literal("telefono"),
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("reunion"),
    ),
  },
  handler: async (ctx, args) => {
    return actualizarCanalPreferidoModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. Edición rápida de grano fino
// (JOS-44, bottom sheet de prioridad de la ficha) — mismo riesgo ampliado de
// actualizarCliente, aceptado explícitamente el 15 jul 2026.
export const actualizarPrioridad = mutation({
  args: {
    clienteId: v.id("clientes"),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
  },
  handler: async (ctx, args) => {
    return actualizarPrioridadModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. Edición rápida de grano fino
// (JOS-14/15, chips de fase de la ficha/pipeline) — mismo riesgo ampliado de
// actualizarCliente, aceptado explícitamente el 17 jul 2026.
export const actualizarFase = mutation({
  args: {
    clienteId: v.id("clientes"),
    fase: v.union(
      v.literal("lead"),
      v.literal("cualificacion"),
      v.literal("primera_llamada"),
      v.literal("propuesta_enviada"),
      v.literal("negociacion"),
      v.literal("cerrado"),
    ),
  },
  handler: async (ctx, args) => {
    return actualizarFaseModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. JOS-14 (vista Pipeline P6):
// agrupa clientes por fase con una proyección propia y mínima (sin email/
// telefono/canal_preferido, que P6 no consume) — no amplía superficie de
// lectura respecto a listarClientes, la reduce para este endpoint concreto.
// Mismo cap `.take(500)` ya documentado en listarClientes: `total` es la suma
// de filas cargadas, no un conteo real si se supera el cap.
export const obtenerPipeline = query({
  args: {},
  handler: async (ctx) => {
    return obtenerPipelineModel(ctx);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. JOS-11 (15 jul 2026): primera
// mutation pública capaz de BORRAR datos reales de forma permanente y en
// cascada (el cliente y sus recordatorios) — riesgo ampliado aceptado
// explícitamente el 15 jul 2026, mayor que crear/leer/actualizar.
export const eliminarCliente = mutation({
  args: { clienteId: v.id("clientes") },
  handler: async (ctx, { clienteId }) => {
    return eliminarClienteModel(ctx, { clienteId });
  },
});
