import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { canales, fasesPipeline, motivosPerdida, prioridades } from "./schema";

async function requireUserId(ctx: { auth: unknown }) {
  const userId = await getAuthUserId(ctx as Parameters<typeof getAuthUserId>[0]);
  if (userId === null) throw new Error("No autenticado");
  return userId;
}

/**
 * P2 (Lista de clientes). `busqueda` filtra por nombre vía search index;
 * empresa/email/teléfono (F2) se pueden añadir como índices adicionales
 * cuando se construya la pantalla si el search index de nombre no basta.
 */
export const list = query({
  args: {
    busqueda: v.optional(v.string()),
    prioridad: v.optional(prioridades),
  },
  handler: async (ctx, { busqueda, prioridad }) => {
    let clientes = busqueda
      ? await ctx.db
          .query("clientes")
          .withSearchIndex("search_nombre", (q) => q.search("nombre", busqueda))
          .collect()
      : await ctx.db.query("clientes").order("desc").collect();

    if (prioridad) {
      clientes = clientes.filter((c) => c.prioridad === prioridad);
    }
    return clientes;
  },
});

/** P7 (Clientes inactivos) — más de 7 días sin `fechaUltimoContacto`, o sin ninguna. */
export const listInactivos = query({
  args: {},
  handler: async (ctx) => {
    const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;
    const limite = Date.now() - SIETE_DIAS_MS;
    const clientes = await ctx.db.query("clientes").collect();
    return clientes
      .filter(
        (c) => c.fasePipeline !== "perdido" && (!c.fechaUltimoContacto || c.fechaUltimoContacto < limite),
      )
      .sort((a, b) => (a.fechaUltimoContacto ?? 0) - (b.fechaUltimoContacto ?? 0));
  },
});

/** P6 (Pipeline) — todos los clientes agrupados por fase en el cliente. */
export const listPorFase = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clientes").collect();
  },
});

/** P3 (Ficha de cliente). */
export const get = query({
  args: { id: v.id("clientes") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/** P4 (Nuevo cliente). Nombre es el único campo obligatorio (PRD sección 9). */
export const create = mutation({
  args: {
    nombre: v.string(),
    empresa: v.optional(v.string()),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    canalPreferido: v.optional(canales),
    prioridad: v.optional(prioridades),
    notas: v.optional(v.string()),
    fasePipeline: v.optional(fasesPipeline),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    if (args.fasePipeline === "inactivo") {
      throw new Error('La fase "Inactivo" la asigna el sistema, no se puede elegir al crear');
    }
    return await ctx.db.insert("clientes", {
      nombre: args.nombre,
      empresa: args.empresa,
      email: args.email,
      telefono: args.telefono,
      canalPreferido: args.canalPreferido,
      prioridad: args.prioridad ?? "media",
      notas: args.notas,
      fasePipeline: args.fasePipeline ?? "lead",
      creadoPor: userId,
    });
  },
});

/** P4 (Editar cliente). */
export const update = mutation({
  args: {
    id: v.id("clientes"),
    nombre: v.optional(v.string()),
    empresa: v.optional(v.string()),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    canalPreferido: v.optional(canales),
    prioridad: v.optional(prioridades),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUserId(ctx);
    await ctx.db.patch(id, patch);
  },
});

/**
 * Cambiar la fase del pipeline (P3, P6). "Inactivo" no es asignable a mano.
 * Si la nueva fase es "perdido", exige motivo (F16 / JOS-64) salvo que ya
 * venga informado por el diálogo obligatorio del cliente.
 */
export const cambiarFase = mutation({
  args: {
    id: v.id("clientes"),
    fasePipeline: fasesPipeline,
    motivoPerdida: v.optional(motivosPerdida),
    motivoPerdidaNotas: v.optional(v.string()),
  },
  handler: async (ctx, { id, fasePipeline, motivoPerdida, motivoPerdidaNotas }) => {
    await requireUserId(ctx);

    if (fasePipeline === "inactivo") {
      throw new Error('La fase "Inactivo" la asigna el sistema automáticamente');
    }

    const cliente = await ctx.db.get(id);
    if (!cliente) throw new Error("Cliente no encontrado");
    if (cliente.fasePipeline === "perdido" && fasePipeline === "inactivo") {
      throw new Error('Un cliente "Perdido" no puede pasar a "Inactivo"');
    }

    if (fasePipeline === "perdido") {
      if (!motivoPerdida) {
        throw new Error("F16: hay que indicar el motivo antes de marcar como Perdido");
      }
      await ctx.db.patch(id, {
        fasePipeline,
        motivoPerdida,
        motivoPerdidaNotas,
        fechaPerdida: Date.now(),
      });
      return;
    }

    await ctx.db.patch(id, {
      fasePipeline,
      motivoPerdida: undefined,
      motivoPerdidaNotas: undefined,
      fechaPerdida: undefined,
    });
  },
});
