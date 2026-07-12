// ⚠️ Borra TODOS los clientes y recordatorios existentes en este deployment antes
// de sembrar los de demo — no ejecutar contra un deployment con datos reales que
// se quieran conservar. Idempotente a propósito: correrla 1 o 10 veces da el mismo
// dataset determinista, para que KPIs/inactivos/recordatorios no se dupliquen entre
// corridas de verificación.
import { internalMutation } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgoMs(days: number): number {
  return Date.now() - days * DAY_MS;
}

function daysAgoISO(days: number): string {
  return new Date(daysAgoMs(days)).toISOString().slice(0, 10);
}

export const seedDemoData = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const doc of await ctx.db.query("recordatorios").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query("clientes").collect()) {
      await ctx.db.delete(doc._id);
    }

    const anaId = await ctx.db.insert("clientes", {
      nombre: "Ana García",
      empresa: "Mipymes SL",
      fase: "lead",
      fecha_ultimo_contacto: daysAgoMs(1),
    });
    const pedroId = await ctx.db.insert("clientes", {
      nombre: "Pedro Mora",
      empresa: "TechCorp SA",
      fase: "cualificacion",
      fecha_ultimo_contacto: daysAgoMs(2),
    });
    const sofiaId = await ctx.db.insert("clientes", {
      nombre: "Sofía Blanco",
      empresa: "Creativa IO",
      fase: "propuesta_enviada",
      fecha_ultimo_contacto: daysAgoMs(3),
    });
    const carlosId = await ctx.db.insert("clientes", {
      nombre: "Carlos Ruiz",
      empresa: "Ruiz Asociados",
      fase: "negociacion",
      fecha_ultimo_contacto: daysAgoMs(10),
    });
    const lauraId = await ctx.db.insert("clientes", {
      nombre: "Laura Jiménez",
      empresa: "Estudio Diseño",
      fase: "cerrado",
      fecha_ultimo_contacto: daysAgoMs(20),
    });
    await ctx.db.insert("clientes", {
      nombre: "Miguel Torres",
      empresa: "Agencia Digital",
      fase: "cerrado",
      // fecha_ultimo_contacto omitido a propósito: nunca contactado, no debe
      // aparecer como inactivo (JOS-25).
    });

    await ctx.db.insert("recordatorios", {
      cliente_id: anaId,
      motivo: "Llamar para confirmar presupuesto",
      fecha: daysAgoISO(2),
      estado: "pendiente",
    });
    await ctx.db.insert("recordatorios", {
      cliente_id: pedroId,
      motivo: "Enviar propuesta actualizada",
      fecha: daysAgoISO(1),
      estado: "pendiente",
    });
    await ctx.db.insert("recordatorios", {
      cliente_id: sofiaId,
      motivo: "Seguimiento de propuesta enviada",
      fecha: daysAgoISO(0),
      estado: "pendiente",
    });
    await ctx.db.insert("recordatorios", {
      cliente_id: carlosId,
      motivo: "Cerrar condiciones de negociación",
      fecha: daysAgoISO(0),
      estado: "pendiente",
    });
    await ctx.db.insert("recordatorios", {
      cliente_id: lauraId,
      motivo: "Enviar factura final",
      fecha: daysAgoISO(3),
      estado: "hecho",
    });
  },
});
