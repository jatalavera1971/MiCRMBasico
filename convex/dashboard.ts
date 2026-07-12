import { query } from "./_generated/server";
import {
  contarClientesActivos,
  contarClientesCerrados,
  listarClientesInactivos,
} from "./model/clientes";
import { obtenerPendientesHoy } from "./model/recordatorios";

// JOS-27 (F12): un solo round-trip que agrega los 3 KPIs + el conteo de
// inactivos para el banner. P1 carga esto una vez por visita, sin realtime.
// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. Desplegada igualmente en Railway con este riesgo
// aceptado explícitamente desde 2026-07-12 — ver README.md.
export const obtenerResumen = query({
  args: {},
  handler: async (ctx) => {
    const [leadsActivos, ventasCerradas, pendientesHoy, inactivos] =
      await Promise.all([
        contarClientesActivos(ctx),
        contarClientesCerrados(ctx),
        obtenerPendientesHoy(ctx),
        listarClientesInactivos(ctx),
      ]);
    return {
      leadsActivos,
      ventasCerradas,
      seguimientosHoy: pendientesHoy.length,
      clientesInactivosCount: inactivos.length,
    };
  },
});
