import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
// Margen para "no futuro": absorbe el desfase entre el "hoy" del navegador
// (zona local del usuario) y el reloj UTC del servidor — mismo tipo de
// limitación ya documentada y aceptada en convex/model/recordatorios.ts
// (hoyISO()), no se resuelve timezone de forma exacta aquí tampoco.
const FUTURE_TOLERANCE_MS = DAY_MS;
// Margen para el límite inferior (fecha >= fecha_alta): fecha_alta es un
// instante exacto (Date.now() en crearCliente), pero la fecha de la
// interacción se normaliza a medianoche LOCAL del día elegido (ver
// src/lib/dates.ts:fechaInputAEpoch). Sin este margen, un cliente creado hoy
// a las 15:00 no podría registrar una interacción con la fecha por defecto
// "hoy" (medianoche de hoy es anterior a las 15:00 de hoy) — bug real
// encontrado en revisión (16 jul 2026). El margen de 24h asegura que
// cualquier hora del mismo día de alta (o del día siguiente) sea válida.
const PAST_ALTA_TOLERANCE_MS = DAY_MS;
const NOTAS_MAX = 2000;
const PROXIMO_PASO_TEXTO_MAX = 200;
const FECHA_ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const LISTAR_CAP = 500;

function esFechaCalendarioReal(y: number, m: number, d: number): boolean {
  const fecha = new Date(y, m - 1, d);
  return (
    fecha.getFullYear() === y &&
    fecha.getMonth() === m - 1 &&
    fecha.getDate() === d
  );
}

// Valida y normaliza los datos de una interacción nueva. Nunca confiar solo
// en las restricciones del formulario en cliente (maxLength / max del
// <input type="date">) — defensa en profundidad, mismo criterio que
// validarDatosContacto en model/clientes.ts.
//
// Normalización primero, validación después: proximoPasoTexto/proximoPasoFecha
// vacíos ("" tras trim) se tratan igual que "no proporcionado" (undefined),
// para que las 4 combinaciones de "próximo paso" (texto+fecha, solo texto,
// solo fecha, ninguno) se comporten igual sin importar cómo el frontend
// serialice un campo vacío.
function validarDatosInteraccion(args: {
  clienteFechaAlta: number;
  notas: string;
  fecha: number;
  proximoPasoTexto?: string;
  proximoPasoFecha?: string;
}) {
  const notas = args.notas.trim();
  if (!notas) {
    throw new ConvexError("Las notas son obligatorias");
  }
  if (notas.length > NOTAS_MAX) {
    throw new ConvexError(
      `Las notas no pueden superar los ${NOTAS_MAX} caracteres`,
    );
  }

  if (!Number.isFinite(args.fecha)) {
    throw new ConvexError("La fecha de la interacción no es válida");
  }
  if (args.fecha > Date.now() + FUTURE_TOLERANCE_MS) {
    throw new ConvexError("La fecha de la interacción no puede ser futura");
  }
  if (args.fecha < args.clienteFechaAlta - PAST_ALTA_TOLERANCE_MS) {
    throw new ConvexError(
      "La fecha de la interacción no puede ser anterior al alta del cliente",
    );
  }

  const proximoPasoTextoTrim = args.proximoPasoTexto?.trim();
  const proximoPasoTexto = proximoPasoTextoTrim || undefined;
  if (proximoPasoTexto && proximoPasoTexto.length > PROXIMO_PASO_TEXTO_MAX) {
    throw new ConvexError(
      `El próximo paso no puede superar los ${PROXIMO_PASO_TEXTO_MAX} caracteres`,
    );
  }

  const proximoPasoFechaTrim = args.proximoPasoFecha?.trim();
  const proximoPasoFecha = proximoPasoFechaTrim || undefined;
  if (proximoPasoFecha) {
    if (!FECHA_ISO_RE.test(proximoPasoFecha)) {
      throw new ConvexError(
        "La fecha del próximo paso no tiene el formato YYYY-MM-DD",
      );
    }
    const [y, m, d] = proximoPasoFecha.split("-").map(Number);
    if (!esFechaCalendarioReal(y, m, d)) {
      throw new ConvexError("La fecha del próximo paso no es una fecha real");
    }
  }

  return { notas, proximoPasoTexto, proximoPasoFecha };
}

// JOS-18/20/21: crea una interacción, actualiza fecha_ultimo_contacto (solo
// si avanza) y, si "próximo paso" trae texto Y fecha, crea un recordatorio
// automático. Devuelve si se creó el recordatorio y su fecha, para que el
// frontend sepa qué toast mostrar ("Recordatorio creado para el..." vs.
// "Interacción registrada").
export async function crearInteraccion(
  ctx: MutationCtx,
  args: {
    clienteId: Id<"clientes">;
    tipo: "llamada" | "email" | "whatsapp" | "reunion";
    notas: string;
    fecha: number;
    proximoPasoTexto?: string;
    proximoPasoFecha?: string;
  },
) {
  const cliente = await ctx.db.get(args.clienteId);
  if (!cliente) {
    throw new ConvexError("Cliente no encontrado");
  }

  const datos = validarDatosInteraccion({
    clienteFechaAlta: cliente.fecha_alta,
    notas: args.notas,
    fecha: args.fecha,
    proximoPasoTexto: args.proximoPasoTexto,
    proximoPasoFecha: args.proximoPasoFecha,
  });

  const interaccionId = await ctx.db.insert("interacciones", {
    cliente_id: args.clienteId,
    tipo: args.tipo,
    notas: datos.notas,
    fecha: args.fecha,
    proximo_paso_texto: datos.proximoPasoTexto,
    proximo_paso_fecha: datos.proximoPasoFecha,
  });

  // JOS-20: fecha_ultimo_contacto solo avanza, nunca retrocede.
  if (
    !cliente.fecha_ultimo_contacto ||
    args.fecha > cliente.fecha_ultimo_contacto
  ) {
    await ctx.db.patch(args.clienteId, { fecha_ultimo_contacto: args.fecha });
  }

  // JOS-21: recordatorio automático solo si AMBOS (texto y fecha) están
  // presentes — si solo hay uno de los dos, se guarda en la interacción pero
  // no dispara la automatización.
  let recordatorioCreado = false;
  let recordatorioFecha: string | undefined;
  if (datos.proximoPasoTexto && datos.proximoPasoFecha) {
    await ctx.db.insert("recordatorios", {
      cliente_id: args.clienteId,
      motivo: datos.proximoPasoTexto,
      fecha: datos.proximoPasoFecha,
      estado: "pendiente",
    });
    recordatorioCreado = true;
    recordatorioFecha = datos.proximoPasoFecha;
  }

  return { interaccionId, recordatorioCreado, recordatorioFecha };
}

// JOS-19: historial de un cliente, más reciente primero. `.order("desc")`
// ANTES de `.take(500)` es imprescindible: sin él, Convex recorre el índice
// en orden ascendente por defecto (equivalente a _creationTime ascendente,
// ya que el índice solo indexa cliente_id) y un cliente con más de 500 filas
// perdería bajo el cap las interacciones más NUEVAS, no las más viejas —
// especialmente relevante porque la escritura es pública sin auth. Con
// "desc" se toman las 500 filas creadas más recientemente; dentro de ese
// conjunto ya acotado se ordena en memoria por `fecha` (fecha real de la
// interacción, que puede estar retro-fechada) y, en empate del mismo día,
// por `_creationTime` como desempate estable — sin necesidad de un campo
// `created_at` nuevo.
export async function listarInteracciones(
  ctx: QueryCtx,
  args: { clienteId: Id<"clientes"> },
) {
  const interacciones = await ctx.db
    .query("interacciones")
    .withIndex("by_cliente_id", (q) => q.eq("cliente_id", args.clienteId))
    .order("desc")
    .take(LISTAR_CAP);

  return interacciones
    .sort((a, b) => {
      if (a.fecha !== b.fecha) return b.fecha - a.fecha;
      return b._creationTime - a._creationTime;
    })
    .map((i) => ({
      _id: i._id,
      tipo: i.tipo,
      notas: i.notas,
      fecha: i.fecha,
      proximo_paso_texto: i.proximo_paso_texto,
      proximo_paso_fecha: i.proximo_paso_fecha,
    }));
}
