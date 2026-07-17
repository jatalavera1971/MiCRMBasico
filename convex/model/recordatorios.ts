import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { esFechaISOValida } from "./validacionFechas";

const DAY_MS = 24 * 60 * 60 * 1000;
// JOS-21 (16 jul 2026): crearInteraccion puede crear recordatorios públicos y
// sin autenticación vía "próximo paso"; JOS-22 (17 jul 2026) añade además
// crearRecordatorio, una segunda vía de escritura pública directa — antes de
// JOS-21 esta tabla solo crecía por seeds internos, nunca por una mutation
// pública, así que un .collect() sin tope aquí no era explotable. Mismo tipo
// de mitigación ya aceptado en listarClientes (convex/model/clientes.ts): no
// es paginación real, acota el coste de la consulta ante un posible ataque
// de volumen; si el total de pendientes supera este tope, deja de cubrir el
// resto sin que se note.
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

const MOTIVO_MAX = 200;

// Valida motivo (recortado, obligatorio, máx 200 — mismo límite que
// proximo_paso_texto en interacciones.ts, mismo campo conceptualmente) y
// fecha (YYYY-MM-DD, formato + calendario reales vía validacionFechas.ts).
// Sin restricción de pasado/futuro a propósito (decisión de producto
// explícita, no un descuido): un recordatorio manual puede crearse ya
// vencido, p. ej. para registrar un seguimiento que debería haberse hecho
// antes — mismo criterio ya usado para proximo_paso_fecha en interacciones.ts.
function validarDatosRecordatorio(args: { fecha: string; motivo: string }) {
  const motivo = args.motivo.trim();
  if (!motivo) {
    throw new ConvexError("El motivo es obligatorio");
  }
  if (motivo.length > MOTIVO_MAX) {
    throw new ConvexError(
      `El motivo no puede superar los ${MOTIVO_MAX} caracteres`,
    );
  }
  if (!esFechaISOValida(args.fecha)) {
    throw new ConvexError(
      "La fecha no tiene un formato o calendario válidos (YYYY-MM-DD)",
    );
  }
  return { motivo };
}

// JOS-22: crea un recordatorio manual desde la ficha (P3), sin pasar por una
// interacción. No toca cliente.fecha_ultimo_contacto — programar un
// seguimiento futuro no es un contacto real (eso es JOS-20, exclusivo de
// crearInteraccion).
export async function crearRecordatorio(
  ctx: MutationCtx,
  args: { clienteId: Id<"clientes">; fecha: string; motivo: string },
) {
  const cliente = await ctx.db.get(args.clienteId);
  if (!cliente) {
    throw new ConvexError("Cliente no encontrado");
  }
  const { motivo } = validarDatosRecordatorio(args);
  return ctx.db.insert("recordatorios", {
    cliente_id: args.clienteId,
    motivo,
    fecha: args.fecha,
    estado: "pendiente",
  });
}

// JOS-22: edita fecha/motivo de un recordatorio ya existente desde la ficha.
// Orden de validación deliberado: (1) existe; (2) pertenece al cliente de la
// ficha desde la que se edita — mitigación de CONTRATO, no un control de
// autorización real: sin autenticación, cualquiera que conozca ambos ids
// podría seguir editándolo; deja el contrato listo para cuando exista auth
// real (JOS-60/61); (3) sigue pendiente (uno ya "hecho" no se edita desde
// aquí ni conociendo su id — JOS-22 solo describe gestión de pendientes);
// (4) fecha/motivo válidos.
export async function actualizarRecordatorio(
  ctx: MutationCtx,
  args: {
    recordatorioId: Id<"recordatorios">;
    clienteId: Id<"clientes">;
    fecha: string;
    motivo: string;
  },
) {
  const recordatorio = await ctx.db.get(args.recordatorioId);
  if (!recordatorio) {
    throw new ConvexError("Recordatorio no encontrado");
  }
  if (recordatorio.cliente_id !== args.clienteId) {
    throw new ConvexError("Este recordatorio no pertenece a este cliente");
  }
  if (recordatorio.estado !== "pendiente") {
    throw new ConvexError("Solo se pueden editar recordatorios pendientes");
  }
  const { motivo } = validarDatosRecordatorio(args);
  await ctx.db.patch(args.recordatorioId, { fecha: args.fecha, motivo });
}

// JOS-22: recordatorios pendientes de un cliente, ordenados por fecha real
// (más próximo/vencido primero) — "el más próximo" es simplemente el primer
// elemento de esta lista. Usa el índice compuesto by_cliente_estado_fecha
// (cliente_id, estado, fecha): el propio índice ya entrega el orden correcto
// para ese cliente/estado (ascendente por fecha es el orden por defecto de
// Convex sobre el campo no fijado por `.eq()`), así que `.take(CAP)`
// conserva de verdad los pendientes MÁS PRÓXIMOS — a diferencia de
// by_cliente_id (que solo ordena por _creationTime), este cap no puede
// perder los más urgentes de un cliente con muchas filas. Sin reordenar
// nada en memoria.
export async function listarRecordatoriosPendientes(
  ctx: QueryCtx,
  args: { clienteId: Id<"clientes"> },
) {
  const hoy = hoyISO();
  const recordatorios = await ctx.db
    .query("recordatorios")
    .withIndex("by_cliente_estado_fecha", (q) =>
      q.eq("cliente_id", args.clienteId).eq("estado", "pendiente"),
    )
    .take(RECORDATORIOS_CAP);

  return recordatorios.map((r) => {
    const overdue = r.fecha < hoy;
    return {
      _id: r._id,
      motivo: r.motivo,
      fecha: r.fecha,
      overdue,
      diasVencido: overdue ? diasEntre(r.fecha, hoy) : 0,
    };
  });
}
