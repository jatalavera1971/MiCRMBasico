import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

/** F10 — lista de tareas del día (P1): recordatorios pendientes con fecha <= hoy. */
export const listTareasDelDia = query({
  args: {},
  handler: async (ctx) => {
    const finDeHoy = new Date();
    finDeHoy.setHours(23, 59, 59, 999);
    const recordatorios = await ctx.db
      .query("recordatorios")
      .withIndex("by_estado_fecha", (q) => q.eq("estado", "pendiente").lte("fecha", finDeHoy.getTime()))
      .collect();

    // Se enriquece con el cliente y su prioridad para poder ordenar por ella
    // en la pantalla (F10: "ordenado por prioridad", Mejora 1).
    const conCliente = await Promise.all(
      recordatorios.map(async (r) => ({ ...r, cliente: await ctx.db.get(r.clienteId) })),
    );
    const orden = { alta: 0, media: 1, baja: 2 } as const;
    return conCliente.sort((a, b) => {
      const pa = a.cliente ? orden[a.cliente.prioridad] : 3;
      const pb = b.cliente ? orden[b.cliente.prioridad] : 3;
      return pa - pb || a.fecha - b.fecha;
    });
  },
});

/** P3 — próximo recordatorio pendiente de un cliente concreto. */
export const proximoDeCliente = query({
  args: { clienteId: v.id("clientes") },
  handler: async (ctx, { clienteId }) => {
    const recordatorios = await ctx.db
      .query("recordatorios")
      .withIndex("by_cliente", (q) => q.eq("clienteId", clienteId))
      .filter((q) => q.eq(q.field("estado"), "pendiente"))
      .collect();
    return recordatorios.sort((a, b) => a.fecha - b.fecha)[0] ?? null;
  },
});

/** F9 — crear/editar recordatorio manual desde P3 (bottom sheet "F9 · Recordatorio"). */
export const create = mutation({
  args: { clienteId: v.id("clientes"), fecha: v.number(), motivo: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("No autenticado");
    return await ctx.db.insert("recordatorios", { ...args, estado: "pendiente" });
  },
});

export const update = mutation({
  args: { id: v.id("recordatorios"), fecha: v.number(), motivo: v.string() },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

/** F9 — marcar como hecho, desde P1 o P3. */
export const marcarHecho = mutation({
  args: { id: v.id("recordatorios") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { estado: "hecho" });
  },
});

export const remove = mutation({
  args: { id: v.id("recordatorios") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
