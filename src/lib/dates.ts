// JOS-23: copy de la fecha de un recordatorio. La lógica de "hoy"/"vencido" vive
// en Convex (convex/model/recordatorios.ts) en UTC — mismo límite conocido
// (desfase de un día alrededor de medianoche en horario de Madrid) aplica aquí,
// ya que este componente solo formatea overdue/diasVencido, no los recalcula.
export function formatDateLabel(overdue: boolean, diasVencido: number): string {
  if (!overdue) return "Hoy";
  return `Vencido hace ${diasVencido} día${diasVencido === 1 ? "" : "s"}`;
}

// Espejo en cliente de convex/model/recordatorios.ts:compareSeguimientos — solo
// se usa para reinsertar una tarea en su sitio tras un rollback optimista fallido
// en TaskListClient, no para el orden inicial (ese ya viene ordenado del backend).
export function compararTareas(a: { fecha: string }, b: { fecha: string }): number {
  return a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0;
}
