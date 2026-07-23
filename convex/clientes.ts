import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSesion as requireSesionModel } from "./model/auth";
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
  reactivar as reactivarModel,
} from "./model/clientes";

// JOS-60/61 (23 jul 2026): todas las funciones de este archivo exigen ahora
// `token` de sesión válido (requireSesionModel, ver convex/model/auth.ts) —
// cierra el riesgo "pública y sin autenticación" que llevaban desde el
// despliegue inicial (2026-07-12). Sin scoping por rol todavía (cualquier
// usuario autenticado, Dueña o Comercial, puede llamar cualquiera de estas
// funciones) — ver README.md para el detalle completo del riesgo residual.

// JOS-26 (19 jul 2026) amplió la proyección: además de
// `_id/nombre/empresa/fecha_ultimo_contacto` también expone `prioridad` y
// `diasSinContacto`. Sin cap: lee todos los clientes inactivos existentes
// (ver convex/model/clientes.ts), el límite de 500 filas visibles es solo de
// renderizado en el frontend.
export const listarClientesInactivos = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return listarClientesInactivosModel(ctx);
  },
});

// JOS-26 (P7, "Reactivar"): actualiza fecha_ultimo_contacto a la hora actual
// SIN crear un registro de interacción — deliberadamente distinta de
// crearInteraccion. Valida server-side que el cliente siga siendo inactivo
// antes de aplicar el cambio (ver convex/model/clientes.ts:reactivar).
export const reactivar = mutation({
  args: { clienteId: v.id("clientes"), token: v.string() },
  handler: async (ctx, { clienteId, token }) => {
    await requireSesionModel(ctx, token);
    return reactivarModel(ctx, { clienteId });
  },
});

// Primera función pública que CREA filas nuevas — riesgo de spam/PII falsa
// mitigado con límites de longitud server-side (ver convex/model/clientes.ts).
export const crearCliente = mutation({
  args: {
    nombre: v.string(),
    email: v.string(),
    empresa: v.optional(v.string()),
    telefono: v.optional(v.string()),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return crearClienteModel(ctx, args);
  },
});

// JOS-10/13/45 (13 jul 2026) ampliaron su proyección: además de
// `nombre`/`email`/`prioridad` también expone `telefono`, `empresa`,
// `canal_preferido`, `fase` y `fecha_ultimo_contacto`. Proyecta solo esos 9
// campos, nunca el documento completo. Cap `.take(500)`, no paginación real
// (ver convex/model/clientes.ts).
export const listarClientes = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return listarClientesModel(ctx);
  },
});

// `clienteId` es v.string() a propósito, no v.id("clientes") (ver
// convex/model/clientes.ts:obtenerCliente) para que un id con formato
// inválido no falle en la validación de argumentos del SDK antes del handler.
export const obtenerCliente = query({
  args: { clienteId: v.string(), token: v.string() },
  handler: async (ctx, { clienteId, token }) => {
    await requireSesionModel(ctx, token);
    return obtenerClienteModel(ctx, { clienteId });
  },
});

// JOS-11/P4 (edición, 15 jul 2026): mutation capaz de MODIFICAR datos ya
// existentes de cualquier cliente.
export const actualizarCliente = mutation({
  args: {
    clienteId: v.id("clientes"),
    nombre: v.string(),
    email: v.string(),
    empresa: v.optional(v.string()),
    telefono: v.optional(v.string()),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return actualizarClienteModel(ctx, args);
  },
});

// Edición rápida de grano fino (JOS-11, selector de 4 botones de la ficha).
export const actualizarCanalPreferido = mutation({
  args: {
    clienteId: v.id("clientes"),
    canal_preferido: v.union(
      v.literal("telefono"),
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("reunion"),
    ),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return actualizarCanalPreferidoModel(ctx, args);
  },
});

// Edición rápida de grano fino (JOS-44, bottom sheet de prioridad de la ficha).
export const actualizarPrioridad = mutation({
  args: {
    clienteId: v.id("clientes"),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return actualizarPrioridadModel(ctx, args);
  },
});

// Edición rápida de grano fino (JOS-14/15, chips de fase de la ficha/pipeline).
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
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return actualizarFaseModel(ctx, args);
  },
});

// JOS-14 (vista Pipeline P6): agrupa clientes por fase con una proyección
// propia y mínima (sin email/telefono/canal_preferido). Mismo cap `.take(500)`
// ya documentado en listarClientes.
export const obtenerPipeline = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return obtenerPipelineModel(ctx);
  },
});

// JOS-11 (15 jul 2026): mutation capaz de BORRAR datos reales de forma
// permanente y en cascada (el cliente y sus recordatorios/interacciones).
export const eliminarCliente = mutation({
  args: { clienteId: v.id("clientes"), token: v.string() },
  handler: async (ctx, { clienteId, token }) => {
    await requireSesionModel(ctx, token);
    return eliminarClienteModel(ctx, { clienteId });
  },
});
