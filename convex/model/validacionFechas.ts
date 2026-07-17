// Compartido por interacciones.ts (proximo_paso_fecha) y recordatorios.ts
// (fecha) — extraído en JOS-22 para no duplicar la misma validación en dos
// sitios. Nunca confiar solo en el `<input type="date">` del cliente.
const FECHA_ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function esFechaCalendarioReal(y: number, m: number, d: number): boolean {
  const fecha = new Date(y, m - 1, d);
  return (
    fecha.getFullYear() === y &&
    fecha.getMonth() === m - 1 &&
    fecha.getDate() === d
  );
}

// Formato estricto YYYY-MM-DD Y fecha de calendario real (rechaza p. ej.
// "2026-02-30", que pasaría un regex ingenuo pero no existe).
export function esFechaISOValida(fecha: string): boolean {
  if (!FECHA_ISO_RE.test(fecha)) {
    return false;
  }
  const [y, m, d] = fecha.split("-").map(Number);
  return esFechaCalendarioReal(y, m, d);
}
