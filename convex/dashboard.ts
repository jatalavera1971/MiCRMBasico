import { query } from "./_generated/server";

const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * P1 (Inicio) — KPIs de F12 y el conteo para el banner de F11.
 * El umbral de inactividad es 7 días en toda la app (JOS-27: el "+30 días"
 * que aparece en la maqueta de esta pantalla es un error de copy corregido
 * en el PRD, no una regla distinta).
 */
export const resumen = query({
  args: {},
  handler: async (ctx) => {
    const clientes = await ctx.db.query("clientes").collect();
    const limiteInactividad = Date.now() - SIETE_DIAS_MS;

    const leadsActivos = clientes.filter((c) =>
      ["lead", "interesado", "presupuesto_enviado"].includes(c.fasePipeline),
    ).length;

    const ventasCerradas = clientes.filter((c) => c.fasePipeline === "ganado").length;

    const clientesInactivos = clientes.filter(
      (c) =>
        c.fasePipeline !== "perdido" &&
        (!c.fechaUltimoContacto || c.fechaUltimoContacto < limiteInactividad),
    ).length;

    const finDeHoy = new Date();
    finDeHoy.setHours(23, 59, 59, 999);
    const seguimientosHoy = await ctx.db
      .query("recordatorios")
      .withIndex("by_estado_fecha", (q) => q.eq("estado", "pendiente").lte("fecha", finDeHoy.getTime()))
      .collect();

    return {
      leadsActivos,
      ventasCerradas,
      seguimientosHoy: seguimientosHoy.length,
      clientesInactivos,
    };
  },
});
