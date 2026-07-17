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
    // JOS-12 (alta de cliente): email normalizado a minúsculas en el servidor.
    email: v.string(),
    telefono: v.optional(v.string()),
    // JOS-42/JOS-43: prioridad obligatoria, default "media" fijado en la mutation crearCliente.
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
    // Epoch ms, asignado por el servidor al crear (crearCliente). No editable por el cliente.
    fecha_alta: v.number(),
    // JOS-10: opcional a propósito, no obligatorio. crearCliente fija "email" por
    // defecto en cada alta nueva, pero no hay forma de cambiarlo hasta que exista
    // P3/edición — y no se puede asumir que todos los documentos existentes (dev
    // o prod) ya lo tengan, así que un valor obligatorio rompería el push del schema.
    canal_preferido: v.optional(
      v.union(
        v.literal("telefono"),
        v.literal("whatsapp"),
        v.literal("email"),
        v.literal("reunion"),
      ),
    ),
  })
    .index("by_fase", ["fase"])
    .index("by_fecha_ultimo_contacto", ["fecha_ultimo_contacto"])
    .index("by_fecha_alta", ["fecha_alta"]),

  recordatorios: defineTable({
    cliente_id: v.id("clientes"),
    motivo: v.string(),
    // Fecha sin hora (YYYY-MM-DD): JOS-23 solo pide granularidad de día ("Hoy"/"Vencido hace X días").
    fecha: v.string(),
    estado: v.union(v.literal("pendiente"), v.literal("hecho")),
  })
    .index("by_estado_fecha", ["estado", "fecha"])
    // JOS-11: soporta el borrado en cascada de eliminarCliente sin collect()
    // sobre toda la tabla (necesita TODOS los recordatorios del cliente,
    // independientemente del estado) — no puede sustituirse por el índice de
    // abajo, que ya viene filtrado por estado.
    .index("by_cliente_id", ["cliente_id"])
    // JOS-22: recordatorios pendientes de un cliente ordenados por fecha real
    // (no por _creationTime como daría by_cliente_id) — necesario para que
    // listarRecordatoriosPendientes pueda acotar con `.take()` sin arriesgarse
    // a perder los más próximos/vencidos de un cliente con muchas filas.
    .index("by_cliente_estado_fecha", ["cliente_id", "estado", "fecha"]),

  // JOS-18/19/20/21 (F4): registro inmutable de una interacción con un
  // cliente. `fecha` es epoch ms (no string YYYY-MM-DD como en recordatorios)
  // para poder compararla numéricamente contra clientes.fecha_ultimo_contacto
  // sin parsear — ver convex/model/interacciones.ts:crearInteraccion.
  interacciones: defineTable({
    cliente_id: v.id("clientes"),
    tipo: v.union(
      v.literal("llamada"),
      v.literal("email"),
      v.literal("whatsapp"),
      v.literal("reunion"),
    ),
    notas: v.string(),
    // Fecha REAL de la interacción (puede ser pasada), no la de creación del
    // registro (_creationTime) — JOS-20 lo exige explícitamente.
    fecha: v.number(),
    // "Próximo paso" (JOS-21): ambos opcionales de forma independiente; solo
    // si los dos están presentes se crea un recordatorio automático. Se
    // normalizan a undefined si llegan como "" — ver validarDatosInteraccion.
    proximo_paso_texto: v.optional(v.string()),
    // YYYY-MM-DD, mismo formato que recordatorios.fecha (se copia tal cual
    // al crear el recordatorio automático, sin conversión).
    proximo_paso_fecha: v.optional(v.string()),
  }).index("by_cliente_id", ["cliente_id"]),
});
