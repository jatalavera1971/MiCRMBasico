import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { tiposInteraccion } from "./schema";

/** Historial de interacciones de un cliente, más recientes primero (P3). */
export const listByCliente = query({
  args: { clienteId: v.id("clientes") },
  handler: async (ctx, { clienteId }) => {
    return await ctx.db
      .query("interacciones")
      .withIndex("by_cliente", (q) => q.eq("clienteId", clienteId))
      .order("desc")
      .collect();
  },
});

/**
 * P5 (Registrar interacción). Al guardar (PRD sección 9 / JOS-18):
 * 1. Crea la interacción.
 * 2. Actualiza `fechaUltimoContacto` del cliente.
 * 3. Si el cliente estaba "inactivo", vuelve a "ganado".
 * 4. Si hay próximo paso con fecha, crea el Recordatorio automáticamente.
 */
export const create = mutation({
  args: {
    clienteId: v.id("clientes"),
    tipo: tiposInteraccion,
    fecha: v.number(),
    quePaso: v.string(),
    proximoPaso: v.optional(v.string()),
    proximoPasoFecha: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("No autenticado");

    const interaccionId = await ctx.db.insert("interacciones", {
      clienteId: args.clienteId,
      tipo: args.tipo,
      fecha: args.fecha,
      quePaso: args.quePaso,
      proximoPaso: args.proximoPaso,
      proximoPasoFecha: args.proximoPasoFecha,
      registradoPor: userId,
    });

    const cliente = await ctx.db.get(args.clienteId);
    if (cliente) {
      await ctx.db.patch(args.clienteId, {
        fechaUltimoContacto: args.fecha,
        fasePipeline: cliente.fasePipeline === "inactivo" ? "ganado" : cliente.fasePipeline,
      });
    }

    if (args.proximoPaso && args.proximoPasoFecha) {
      await ctx.db.insert("recordatorios", {
        clienteId: args.clienteId,
        fecha: args.proximoPasoFecha,
        motivo: args.proximoPaso,
        estado: "pendiente",
      });
    }

    return interaccionId;
  },
});
