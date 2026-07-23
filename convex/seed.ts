// ⚠️ Borra TODOS los clientes, recordatorios e interacciones existentes en este
// deployment antes de sembrar los de demo — no ejecutar contra un deployment con
// datos reales que se quieran conservar. Idempotente a propósito: correrla 1 o 10
// veces da el mismo dataset determinista, para que KPIs/inactivos/recordatorios no
// se dupliquen entre corridas de verificación.
import { internalMutation } from "./_generated/server";
import { hashPassword } from "./model/auth";

const DAY_MS = 24 * 60 * 60 * 1000;

// JOS-60: contraseña de desarrollo compartida por los 2 usuarios demo —
// documentada también en README.md. Única forma de aprovisionar cuentas
// mientras no exista JOS-62 (P9, alta de usuarios) — validar duplicados de
// email en altas reales es responsabilidad de ese ticket, este seed siempre
// parte de una tabla vacía.
const DEV_PASSWORD = "DevVibe2026!";

function daysAgoMs(days: number): number {
  return Date.now() - days * DAY_MS;
}

function daysAgoISO(days: number): string {
  return new Date(daysAgoMs(days)).toISOString().slice(0, 10);
}

export const seedDemoData = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const doc of await ctx.db.query("interacciones").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query("recordatorios").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query("clientes").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query("intentos_login").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query("sesiones").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of await ctx.db.query("usuarios").collect()) {
      await ctx.db.delete(doc._id);
    }

    const anaId = await ctx.db.insert("clientes", {
      nombre: "Ana García",
      empresa: "Mipymes SL",
      fase: "lead",
      fecha_ultimo_contacto: daysAgoMs(1),
      email: "ana.garcia@example.com",
      prioridad: "alta",
      fecha_alta: daysAgoMs(15),
      canal_preferido: "telefono",
    });
    const pedroId = await ctx.db.insert("clientes", {
      nombre: "Pedro Mora",
      empresa: "TechCorp SA",
      fase: "cualificacion",
      fecha_ultimo_contacto: daysAgoMs(2),
      email: "pedro.mora@example.com",
      prioridad: "media",
      fecha_alta: daysAgoMs(20),
      canal_preferido: "whatsapp",
    });
    const sofiaId = await ctx.db.insert("clientes", {
      nombre: "Sofía Blanco",
      empresa: "Creativa IO",
      fase: "propuesta_enviada",
      fecha_ultimo_contacto: daysAgoMs(3),
      email: "sofia.blanco@example.com",
      prioridad: "alta",
      fecha_alta: daysAgoMs(10),
      canal_preferido: "email",
    });
    const carlosId = await ctx.db.insert("clientes", {
      nombre: "Carlos Ruiz",
      empresa: "Ruiz Asociados",
      fase: "negociacion",
      fecha_ultimo_contacto: daysAgoMs(10),
      email: "carlos.ruiz@example.com",
      prioridad: "media",
      fecha_alta: daysAgoMs(25),
      canal_preferido: "reunion",
    });
    const lauraId = await ctx.db.insert("clientes", {
      nombre: "Laura Jiménez",
      empresa: "Estudio Diseño",
      fase: "cerrado",
      fecha_ultimo_contacto: daysAgoMs(20),
      email: "laura.jimenez@example.com",
      prioridad: "baja",
      fecha_alta: daysAgoMs(40),
      canal_preferido: "telefono",
    });
    await ctx.db.insert("clientes", {
      nombre: "Miguel Torres",
      empresa: "Agencia Digital",
      fase: "cerrado",
      // fecha_ultimo_contacto omitido a propósito: nunca contactado, no debe
      // aparecer como inactivo (JOS-25).
      email: "miguel.torres@example.com",
      prioridad: "baja",
      fecha_alta: daysAgoMs(30),
      canal_preferido: "whatsapp",
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

    // JOS-60: 2 usuarios demo, únicas cuentas existentes al no haber P9 (JOS-62)
    // todavía. Nombres deliberadamente distintos de los clientes demo de arriba,
    // para no confundir un usuario con un cliente en el mismo dataset.
    const passwordHash = await hashPassword(DEV_PASSWORD);
    await ctx.db.insert("usuarios", {
      nombre_completo: "Marta Aguilar",
      email: "marta@vibecrm.dev",
      password_hash: passwordHash,
      rol: "duena",
      estado: "activo",
      fecha_alta: Date.now(),
    });
    await ctx.db.insert("usuarios", {
      nombre_completo: "Diego Romero",
      email: "diego@vibecrm.dev",
      password_hash: passwordHash,
      rol: "comercial",
      estado: "activo",
      fecha_alta: Date.now(),
    });
  },
});
