import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
// JOS-21 (16 jul 2026): crearInteraccion puede crear recordatorios públicos y
// sin autenticación vía "próximo paso" — antes de esto, esta tabla solo
// crecía por seeds internos, nunca por una mutation pública, así que un
// .collect() sin tope aquí no era explotable. Mismo tipo de mitigación ya
// aceptado en listarClientes (convex/model/clientes.ts): no es paginación
// real, acota el coste de la consulta ante un posible ataque de volumen; si
// el total de pendientes supera este tope, deja de cubrir el resto sin que
// se note.
const RECORDATORIOS_CAP = 500;

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
    .take(RECORDATORIOS_CAP);

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

// JOS-21/ficha (F9, solo lectura — el CRUD manual completo sigue siendo
// JOS-22, sin construir): recordatorio pendiente más próximo de un cliente
// concreto, o null si no tiene ninguno. Reutiliza el índice by_cliente_id ya
// existente (JOS-11), sin necesidad de uno nuevo.
export async function obtenerProximoRecordatorio(
  ctx: QueryCtx,
  args: { clienteId: Id<"clientes"> },
) {
  const hoy = hoyISO();
  const recordatorios = await ctx.db
    .query("recordatorios")
    .withIndex("by_cliente_id", (q) => q.eq("cliente_id", args.clienteId))
    .take(RECORDATORIOS_CAP);

  const pendientes = recordatorios.filter((r) => r.estado === "pendiente");
  if (pendientes.length === 0) {
    return null;
  }

  const proximo = pendientes.reduce((min, r) =>
    r.fecha < min.fecha ? r : min,
  );
  const overdue = proximo.fecha < hoy;
  return {
    motivo: proximo.motivo,
    fecha: proximo.fecha,
    overdue,
    diasVencido: overdue ? diasEntre(proximo.fecha, hoy) : 0,
  };
}
