/**
 * Espejo en el cliente de los enums de convex/schema.ts, con las etiquetas y
 * los colores exactos de design/design.md. Fuente de verdad: CRM-PRD
 * (Notion) sección 9 — Datos. Si cambia un valor aquí, cambia también en el
 * schema de Convex y en el PRD; los tres deben coincidir siempre.
 */

export const FASES_PIPELINE = [
  "lead",
  "interesado",
  "presupuesto_enviado",
  "ganado",
  "inactivo",
  "perdido",
] as const;
export type FasePipeline = (typeof FASES_PIPELINE)[number];

export const FASE_PIPELINE_LABEL: Record<FasePipeline, string> = {
  lead: "Lead",
  interesado: "Interesado",
  presupuesto_enviado: "Presupuesto enviado",
  ganado: "Ganado",
  inactivo: "Inactivo",
  perdido: "Perdido",
};

/** Badge bg + text — nunca uno sin el otro (design.md → Pipeline & Priority Color Pairs). */
export const FASE_PIPELINE_BADGE: Record<FasePipeline, string> = {
  lead: "bg-pipeline-lead-bg text-pipeline-lead-text",
  interesado: "bg-pipeline-interested-bg text-pipeline-interested-text",
  presupuesto_enviado: "bg-pipeline-quote-bg text-pipeline-quote-text",
  ganado: "bg-pipeline-won-bg text-pipeline-won-text",
  inactivo: "bg-pipeline-inactive-bg text-pipeline-inactive-text",
  perdido: "bg-pipeline-lost-bg text-pipeline-lost-text",
};

/** Fases que Carlos/Marta pueden elegir a mano. "inactivo" la asigna el sistema. */
export const FASES_PIPELINE_SELECCIONABLES = FASES_PIPELINE.filter(
  (f) => f !== "inactivo",
);

export const PRIORIDADES = ["alta", "media", "baja"] as const;
export type Prioridad = (typeof PRIORIDADES)[number];

export const PRIORIDAD_LABEL: Record<Prioridad, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const PRIORIDAD_BADGE: Record<Prioridad, string> = {
  alta: "bg-priority-high-bg text-priority-high-text",
  media: "bg-priority-medium-bg text-priority-medium-text",
  baja: "bg-priority-low-bg text-priority-low-text",
};

export const CANALES = ["telefono", "whatsapp", "email"] as const;
export type Canal = (typeof CANALES)[number];

export const CANAL_LABEL: Record<Canal, string> = {
  telefono: "Teléfono",
  whatsapp: "WhatsApp",
  email: "Email",
};

export const TIPOS_INTERACCION = ["llamada", "email", "whatsapp"] as const;
export type TipoInteraccion = (typeof TIPOS_INTERACCION)[number];

export const TIPO_INTERACCION_LABEL: Record<TipoInteraccion, string> = {
  llamada: "Llamada",
  email: "Email",
  whatsapp: "WhatsApp",
};

/** Colores de borde por canal — design.md → Interaction Card (hardcoded en v1.0). */
export const TIPO_INTERACCION_COLOR: Record<TipoInteraccion, string> = {
  llamada: "#3B82F6",
  whatsapp: "#25D366",
  email: "#A8A29E", // ink-muted
};

export const MOTIVOS_PERDIDA = ["precio", "tiempo_recursos", "competencia", "otro"] as const;
export type MotivoPerdida = (typeof MOTIVOS_PERDIDA)[number];

export const MOTIVO_PERDIDA_LABEL: Record<MotivoPerdida, string> = {
  precio: "Precio",
  tiempo_recursos: "Tiempo / recursos",
  competencia: "Competencia",
  otro: "Otro",
};

export const ROLES = ["duena", "comercial"] as const;
export type Rol = (typeof ROLES)[number];

export const ROL_LABEL: Record<Rol, string> = {
  duena: "Dueña",
  comercial: "Comercial",
};

/** Umbral único de inactividad en toda la app — PRD sección 7 (P1/P7) y 9. */
export const DIAS_INACTIVIDAD = 7;
