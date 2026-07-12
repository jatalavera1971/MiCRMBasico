import type { QueryCtx } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;

// Convex corre en UTC — "hoy" se calcula en UTC, no en hora de Madrid. Puede
// haber un desfase de un día alrededor de medianoche. Limitación conocida del
// MVP, no se resuelve con una librería de timezone ahora (ver plan JOS-23/27).
function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function diasEntre(desde: string, hasta: string): number {
  const desdeMs = Date.parse(desde + "T00:00:00Z");
  const hastaMs = Date.parse(hasta + "T00:00:00Z");
  return Math.round((hastaMs - desdeMs) / DAY_MS);
}

// Orden de la lista de tareas del día (JOS-23): vencidos de más antiguo a más
// reciente, después los de hoy. Función nombrada aparte para poder anteponerle
// luego el criterio de prioridad de JOS-46 sin tocar quien la llama.
export function compareSeguimientos(
  a: { fecha: string },
  b: { fecha: string },
): number {
  return a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0;
}

// JOS-23 (F10): recordatorios pendientes con fecha <= hoy, con datos de cliente
// ya unidos y overdue/diasVencido calculados. El copy exacto ("Hoy" / "Vencido
// hace X días") se compone en el frontend a partir de estos datos estructurados.
export async function obtenerPendientesHoy(ctx: QueryCtx) {
  const hoy = hoyISO();
  const pendientes = await ctx.db
    .query("recordatorios")
    .withIndex("by_estado_fecha", (q) =>
      q.eq("estado", "pendiente").lte("fecha", hoy),
    )
    .collect();

  const conCliente = await Promise.all(
    pendientes.map(async (r) => {
      const cliente = await ctx.db.get(r.cliente_id);
      const overdue = r.fecha < hoy;
      return {
        recordatorioId: r._id,
        clienteId: r.cliente_id,
        clienteNombre: cliente?.nombre ?? "Cliente eliminado",
        clienteEmpresa: cliente?.empresa,
        motivo: r.motivo,
        fecha: r.fecha,
        overdue,
        diasVencido: overdue ? diasEntre(r.fecha, hoy) : 0,
      };
    }),
  );

  return conCliente.sort(compareSeguimientos);
}
