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

// JOS-11: orden real del pipeline, para pintar los chips de fase de la ficha
// en modo solo-lectura (F6/JOS-15, cambio de fase, es de Fase 3 — no se
// implementa todavía, solo se reserva el espacio visual con datos reales).
export const FASES: Fase[] = [
  "lead",
  "cualificacion",
  "primera_llamada",
  "propuesta_enviada",
  "negociacion",
  "cerrado",
];

export const CANAL_LABELS: Record<CanalPreferido, string> = {
  telefono: "Teléfono",
  whatsapp: "WhatsApp",
  email: "Email",
  reunion: "Reunión",
};

// JOS-18: tipo de interacción — comparte las 4 opciones/iconos de
// canal_preferido, pero es una unión propia y semánticamente distinta: una
// es la preferencia declarada del cliente, la otra es lo que realmente
// ocurrió en una interacción concreta.
export type TipoInteraccion = Doc<"interacciones">["tipo"];

export const TIPO_INTERACCION_LABELS: Record<TipoInteraccion, string> = {
  llamada: "Llamada",
  email: "Email",
  whatsapp: "WhatsApp",
  reunion: "Reunión",
};

export const TIPOS_INTERACCION: TipoInteraccion[] = [
  "llamada",
  "email",
  "whatsapp",
  "reunion",
];
