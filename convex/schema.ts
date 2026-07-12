import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clientes: defineTable({
    nombre: v.string(),
    empresa: v.optional(v.string()),
    fase: v.union(
      v.literal("lead"),
      v.literal("cualificacion"),
      v.literal("primera_llamada"),
      v.literal("propuesta_enviada"),
      v.literal("negociacion"),
      v.literal("cerrado"),
    ),
    // undefined = nunca contactado. Ver convex/model/clientes.ts: listarClientesInactivos
    // excluye estos clientes explícitamente en código (JOS-25), no confía en el índice.
    fecha_ultimo_contacto: v.optional(v.number()),
  })
    .index("by_fase", ["fase"])
    .index("by_fecha_ultimo_contacto", ["fecha_ultimo_contacto"]),

  recordatorios: defineTable({
    cliente_id: v.id("clientes"),
    motivo: v.string(),
    // Fecha sin hora (YYYY-MM-DD): JOS-23 solo pide granularidad de día ("Hoy"/"Vencido hace X días").
    fecha: v.string(),
    estado: v.union(v.literal("pendiente"), v.literal("hecho")),
  }).index("by_estado_fecha", ["estado", "fecha"]),
});
