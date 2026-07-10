import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { roles } from "./schema";

/** Usuario autenticado actual, o null si no hay sesión (P10, guardas de P9). */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

async function requireDuena(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("No autenticado");
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "duena") {
    throw new Error("Solo el rol Dueña puede acceder a esta función");
  }
  return user;
}

/** Lista de usuarios para P9 (Admin — Usuarios y roles). Solo Dueña. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireDuena(ctx);
    return await ctx.db.query("users").collect();
  },
});

/** P10 — editar el propio nombre. */
export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("No autenticado");
    await ctx.db.patch(userId, { name });
  },
});

/** P9 — editar el rol de otro usuario. Solo Dueña. */
export const updateRole = mutation({
  args: { id: v.id("users"), role: roles },
  handler: async (ctx, { id, role }) => {
    await requireDuena(ctx);
    await ctx.db.patch(id, { role });
  },
});

/**
 * P9 — desactivar/reactivar una cuenta. Solo Dueña, y nunca sobre su propia
 * cuenta (regla del PRD: "Marta no puede desactivar su propia cuenta").
 */
export const setStatus = mutation({
  args: { id: v.id("users"), status: v.union(v.literal("activo"), v.literal("inactivo")) },
  handler: async (ctx, { id, status }) => {
    const duena = await requireDuena(ctx);
    if (duena._id === id) {
      throw new Error("No puedes desactivar tu propia cuenta");
    }
    await ctx.db.patch(id, { status });
  },
});

/**
 * TODO (JOS-60/JOS-62): alta de un usuario nuevo por invitación por email.
 * Falta decidir el proveedor de envío de emails y la estrategia de token de
 * invitación de un solo uso antes de implementar esto — no forma parte del
 * andamiaje inicial. De momento solo se deja la firma prevista:
 *
 * export const invite = mutation({
 *   args: { name: v.string(), email: v.string(), role: roles },
 *   handler: async (ctx, args) => { ... },
 * });
 */
