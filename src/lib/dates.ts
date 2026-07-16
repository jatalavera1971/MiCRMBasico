// JOS-23: copy de la fecha de un recordatorio de P1 (listarSeguimientosHoy),
// que solo devuelve recordatorios con fecha <= hoy — ahí "no vencido" implica
// siempre "es hoy", de ahí el atajo. La lógica de "hoy"/"vencido" vive en
// Convex (convex/model/recordatorios.ts) en UTC — mismo límite conocido
// (desfase de un día alrededor de medianoche en horario de Madrid) aplica aquí,
// ya que este componente solo formatea overdue/diasVencido, no los recalcula.
export function formatDateLabel(overdue: boolean, diasVencido: number): string {
  if (!overdue) return "Hoy";
  return `Vencido hace ${diasVencido} día${diasVencido === 1 ? "" : "s"}`;
}

// JOS-21: próximo recordatorio de la ficha (obtenerProximoRecordatorio), a
// diferencia de formatDateLabel de arriba, NO está filtrado a fecha <= hoy —
// puede ser un recordatorio futuro, así que "no vencido" no implica "hoy".
// Se distingue explícitamente: vencido → mismo copy que P1; hoy → "Hoy";
// futuro → fecha corta legible.
export function formatFechaRecordatorio(
  fecha: string,
  overdue: boolean,
  diasVencido: number,
): string {
  if (overdue) {
    return `Vencido hace ${diasVencido} día${diasVencido === 1 ? "" : "s"}`;
  }
  if (fecha === hoyFechaISO()) {
    return "Hoy";
  }
  return formatFechaCorta(fecha);
}

// Espejo en cliente de convex/model/recordatorios.ts:compareSeguimientos — solo
// se usa para reinsertar una tarea en su sitio tras un rollback optimista fallido
// en TaskListClient, no para el orden inicial (ese ya viene ordenado del backend).
export function compararTareas(a: { fecha: string }, b: { fecha: string }): number {
  return a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0;
}

const MESES_ABREV = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

// JOS-18/19/21: fecha corta legible ("20 jul 2026"), a partir de epoch ms
// (interacciones.fecha) o de un string YYYY-MM-DD (recordatorios.fecha,
// proximo_paso_fecha) — usada en el historial, el toast de recordatorio
// automático y el próximo recordatorio de la ficha. El string ISO se parsea
// SIN sufijo de zona ("T00:00:00", no "Z") para que se interprete como
// medianoche LOCAL, igual que fechaInputAEpoch de abajo — evita el desfase
// de día que da new Date(stringISO) al interpretarlo como UTC.
export function formatFechaCorta(input: number | string): string {
  const fecha =
    typeof input === "number" ? new Date(input) : new Date(`${input}T00:00:00`);
  return `${fecha.getDate()} ${MESES_ABREV[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

// "Hoy" en formato YYYY-MM-DD, en la ZONA LOCAL del navegador — para el
// atributo `max` del selector de fecha de la interacción (JOS-20). A
// diferencia de hoyISO() en convex/model/recordatorios.ts (que corre en UTC
// en el servidor, donde no hay zona real del usuario), aquí sí importa la
// zona local: es una restricción de UX en el propio formulario.
export function hoyFechaISO(): string {
  const hoy = new Date();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mm}-${dd}`;
}

// Convierte el valor de un <input type="date"> (YYYY-MM-DD) a epoch ms de
// medianoche LOCAL. Nunca `new Date(stringISO)`: JS lo interpreta como UTC y
// puede desfasar el día cerca de medianoche (decisión 18 del plan JOS-18).
export function fechaInputAEpoch(value: string): number {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}
