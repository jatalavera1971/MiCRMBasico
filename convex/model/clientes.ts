import type { QueryCtx } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
const INACTIVITY_WINDOW_MS = 7 * DAY_MS;

// JOS-25: clientes con fecha_ultimo_contacto anterior a (hoy - 7 días), ordenados
// por fecha_ultimo_contacto ascendente (más tiempo sin contacto primero = más
// urgente). Los clientes nunca contactados (fecha_ultimo_contacto ausente) NO
// cuentan como inactivos — así lo dice JOS-25 explícitamente ("no tienen
// historial que analizar"). No confiamos solo en el rango del índice para esto:
// filtramos el ausente explícitamente en código.
export async function listarClientesInactivos(ctx: QueryCtx) {
  const umbral = Date.now() - INACTIVITY_WINDOW_MS;
  const candidatos = await ctx.db
    .query("clientes")
    .withIndex("by_fecha_ultimo_contacto", (q) =>
      q.lt("fecha_ultimo_contacto", umbral),
    )
    .order("asc")
    .collect();
  return candidatos.filter((c) => c.fecha_ultimo_contacto !== undefined);
}

// JOS-27 (F12) — "Leads activos": clientes en cualquier fase excepto Cerrado.
export async function contarClientesActivos(ctx: QueryCtx) {
  const todos = await ctx.db.query("clientes").collect();
  return todos.filter((c) => c.fase !== "cerrado").length;
}

// JOS-27 (F12) — "Ventas cerradas": clientes en fase Cerrado.
export async function contarClientesCerrados(ctx: QueryCtx) {
  const cerrados = await ctx.db
    .query("clientes")
    .withIndex("by_fase", (q) => q.eq("fase", "cerrado"))
    .collect();
  return cerrados.length;
}
