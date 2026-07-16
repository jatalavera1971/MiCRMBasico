import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  crearInteraccion as crearInteraccionModel,
  listarInteracciones as listarInteraccionesModel,
} from "./model/interacciones";

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md. JOS-18/19/20/21
// (16 jul 2026): primera función pública que escribe texto libre sobre las
// conversaciones con un cliente (hasta ahora solo había PII de contacto) —
// riesgo ampliado aceptado explícitamente el 16 jul 2026, mitigado con
// límites de longitud y validación de fechas server-side (ver
// convex/model/interacciones.ts:validarDatosInteraccion — nunca confiar solo
// en el maxLength/max del formulario en cliente).
export const crearInteraccion = mutation({
  args: {
    clienteId: v.id("clientes"),
    tipo: v.union(
      v.literal("llamada"),
      v.literal("email"),
      v.literal("whatsapp"),
      v.literal("reunion"),
    ),
    notas: v.string(),
    fecha: v.number(),
    proximoPasoTexto: v.optional(v.string()),
    proximoPasoFecha: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return crearInteraccionModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md. Mismo riesgo
// ampliado que crearInteraccion (16 jul 2026): cualquiera con la URL de la
// app y el id de un cliente (ya público hoy vía listarClientes) puede leer
// las notas de texto libre de sus interacciones. Cap `.take(500)` y orden
// por _creationTime desc ya aplicados dentro del modelo — ver
// convex/model/interacciones.ts:listarInteracciones.
export const listarInteracciones = query({
  args: { clienteId: v.id("clientes") },
  handler: async (ctx, args) => {
    return listarInteraccionesModel(ctx, args);
  },
});
