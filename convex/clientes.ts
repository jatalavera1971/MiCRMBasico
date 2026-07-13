import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  crearCliente as crearClienteModel,
  listarClientes as listarClientesModel,
  listarClientesInactivos as listarClientesInactivosModel,
} from "./model/clientes";

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md.
export const listarClientesInactivos = query({
  args: {},
  handler: async (ctx) => {
    return listarClientesInactivosModel(ctx);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. Es la primera función pública
// que CREA filas nuevas (hasta ahora solo había lecturas + un toggle de estado) —
// riesgo de spam/PII falsa aceptado explícitamente el 2026-07-13, con límites de
// longitud server-side (ver convex/model/clientes.ts) como única mitigación.
export const crearCliente = mutation({
  args: {
    nombre: v.string(),
    email: v.string(),
    empresa: v.optional(v.string()),
    telefono: v.optional(v.string()),
    prioridad: v.union(v.literal("alta"), v.literal("media"), v.literal("baja")),
  },
  handler: async (ctx, args) => {
    return crearClienteModel(ctx, args);
  },
});

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo aceptado
// explícitamente desde 2026-07-12 — ver README.md. JOS-10/13/45 (13 jul 2026)
// ampliaron su proyección: además de `nombre`/`email`/`prioridad` ahora también
// expone `telefono`, `empresa`, `canal_preferido`, `fase` y `fecha_ultimo_contacto`
// (necesarios para buscar/mostrar/ordenar en la pantalla "Clientes") — sigue
// proyectando solo esos 9 campos, nunca el documento completo, pero ya no son
// "solo 4 campos". La búsqueda de texto que consume esta query en el frontend
// solo cubre los hasta 500 clientes que devuelve `.take(500)`, no toda la tabla
// (ver convex/model/clientes.ts).
export const listarClientes = query({
  args: {},
  handler: async (ctx) => {
    return listarClientesModel(ctx);
  },
});
