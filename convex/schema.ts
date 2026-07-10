import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Enums fijados por el PRD (CRM-PRD, Notion) — no cambiar sin actualizar
// también src/lib/constants.ts, que espeja estos mismos valores en el cliente.
export const roles = v.union(v.literal("duena"), v.literal("comercial"));

export const estadosUsuario = v.union(
  v.literal("activo"),
  v.literal("inactivo"),
);

export const prioridades = v.union(
  v.literal("alta"),
  v.literal("media"),
  v.literal("baja"),
);

export const canales = v.union(
  v.literal("telefono"),
  v.literal("whatsapp"),
  v.literal("email"),
);

// Seis fases del pipeline — fuente de verdad (PRD sección 9). "inactivo" la
// asigna solo el sistema (7 días sin interacción desde "ganado"), nunca el usuario.
export const fasesPipeline = v.union(
  v.literal("lead"),
  v.literal("interesado"),
  v.literal("presupuesto_enviado"),
  v.literal("ganado"),
  v.literal("inactivo"),
  v.literal("perdido"),
);

export const motivosPerdida = v.union(
  v.literal("precio"),
  v.literal("tiempo_recursos"),
  v.literal("competencia"),
  v.literal("otro"),
);

export const tiposInteraccion = v.union(
  v.literal("llamada"),
  v.literal("email"),
  v.literal("whatsapp"),
);

export const estadosRecordatorio = v.union(
  v.literal("pendiente"),
  v.literal("hecho"),
);

export default defineSchema({
  // authTables aporta las tablas internas de @convex-dev/auth (sesiones,
  // cuentas, tokens de refresco...). Sobreescribimos "users" para añadir los
  // campos propios del CRM (rol, estado) manteniendo los campos que la
  // librería de auth espera encontrar.
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    image: v.optional(v.string()),
    // Campos CRM (PRD sección 9 — Usuario)
    role: v.optional(roles),
    status: v.optional(estadosUsuario),
  }).index("email", ["email"]),

  clientes: defineTable({
    nombre: v.string(),
    empresa: v.optional(v.string()),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    canalPreferido: v.optional(canales),
    prioridad: prioridades,
    notas: v.optional(v.string()),
    fasePipeline: fasesPipeline,
    // F16 — solo aplica si fasePipeline === "perdido" (JOS-64)
    motivoPerdida: v.optional(motivosPerdida),
    motivoPerdidaNotas: v.optional(v.string()),
    fechaPerdida: v.optional(v.number()),
    // Se actualiza automáticamente al registrar una interacción (JOS-18).
    // Es la que determina si un cliente cae en "Clientes inactivos" (P7, +7 días).
    fechaUltimoContacto: v.optional(v.number()),
    creadoPor: v.optional(v.id("users")),
  })
    .index("by_fase", ["fasePipeline"])
    .index("by_prioridad", ["prioridad"])
    .index("by_ultimo_contacto", ["fechaUltimoContacto"])
    .searchIndex("search_nombre", {
      searchField: "nombre",
    }),

  interacciones: defineTable({
    clienteId: v.id("clientes"),
    tipo: tiposInteraccion,
    fecha: v.number(),
    quePaso: v.string(),
    // Ambos van juntos: si hay texto de próximo paso, P5 exige también su
    // fecha para poder crear el Recordatorio automático (PRD sección 9).
    proximoPaso: v.optional(v.string()),
    proximoPasoFecha: v.optional(v.number()),
    // Mostrado en P3 escritorio como "hace 2 días · Carlos M." (PRD sección 9)
    registradoPor: v.id("users"),
  }).index("by_cliente", ["clienteId", "fecha"]),

  recordatorios: defineTable({
    clienteId: v.id("clientes"),
    fecha: v.number(),
    motivo: v.string(),
    estado: estadosRecordatorio,
  })
    .index("by_cliente", ["clienteId"])
    .index("by_estado_fecha", ["estado", "fecha"]),
});
