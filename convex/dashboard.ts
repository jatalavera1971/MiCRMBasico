import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireSesion as requireSesionModel } from "./model/auth";
import {
  contarClientesActivos,
  contarClientesCerrados,
  listarClientesInactivos,
} from "./model/clientes";
import { obtenerPendientesHoy } from "./model/recordatorios";

// JOS-27 (F12): un solo round-trip que agrega los 3 KPIs + el conteo de
// inactivos para el banner. P1 carga esto una vez por visita, sin realtime.
// JOS-60/61 (23 jul 2026): exige ahora `token` de sesión válido
// (requireSesionModel) — ver la misma nota en convex/clientes.ts.
export const obtenerResumen = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSesionModel(ctx, args.token);
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
