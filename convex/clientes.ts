import { query } from "./_generated/server";
import { listarClientesInactivos as listarClientesInactivosModel } from "./model/clientes";

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md.
export const listarClientesInactivos = query({
  args: {},
  handler: async (ctx) => {
    return listarClientesInactivosModel(ctx);
  },
});
