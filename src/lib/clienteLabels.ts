import type { Doc } from "../../convex/_generated/dataModel";

export type Fase = Doc<"clientes">["fase"];
// canal_preferido es opcional en el schema (JOS-10), así que su tipo incluye
// `undefined` — se excluye aquí para poder usarlo como clave de un Record; el
// caso `undefined` se gestiona en el punto de uso ("—"), no en este mapa.
export type CanalPreferido = NonNullable<Doc<"clientes">["canal_preferido"]>;

export const FASE_LABELS: Record<Fase, string> = {
  lead: "Lead",
  cualificacion: "Cualificación",
  primera_llamada: "Primera llamada",
  propuesta_enviada: "Propuesta enviada",
  negociacion: "Negociación",
  cerrado: "Cerrado",
};

export const CANAL_LABELS: Record<CanalPreferido, string> = {
  telefono: "Teléfono",
  whatsapp: "WhatsApp",
  email: "Email",
  reunion: "Reunión",
};
