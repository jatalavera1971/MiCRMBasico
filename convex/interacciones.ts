import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSesion as requireSesionModel } from "./model/auth";
import {
  crearInteraccion as crearInteraccionModel,
  listarInteracciones as listarInteraccionesModel,
} from "./model/interacciones";

// JOS-60/61 (23 jul 2026): ambas funciones exigen ahora `token` de sesión
// válido (requireSesionModel) — ver la misma nota en convex/clientes.ts y el
// detalle del riesgo residual en README.md.

// JOS-18/19/20/21 (16 jul 2026): escribe texto libre sobre las conversaciones
// con un cliente — límites de longitud y validación de fechas server-side
// (ver convex/model/interacciones.ts:validarDatosInteraccion).
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
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return crearInteraccionModel(ctx, args);
  },
});

// Cap `.take(500)` y orden por _creationTime desc ya aplicados dentro del
// modelo — ver convex/model/interacciones.ts:listarInteracciones.
export const listarInteracciones = query({
  args: { clienteId: v.id("clientes"), token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
    return listarInteraccionesModel(ctx, { clienteId: args.clienteId });
  },
});
