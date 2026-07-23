import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// JOS-60: sesiones expiradas se acumulan indefinidamente si no se limpian
// (sin renovación deslizante, cada login deja una fila que solo caduca, nunca
// se reescribe). Acotado a 500 filas/ejecución (ver limpiarSesionesExpiradas)
// — margen amplio para el volumen esperado de este MVP.
crons.daily(
  "limpiar sesiones expiradas",
  { hourUTC: 3, minuteUTC: 0 },
  internal.auth.limpiarSesionesExpiradas,
);

export default crons;
