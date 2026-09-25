import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { hashPassword } from "./auth";

const NOMBRE_MAX = 120;
const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
// Mismo valor que PASSWORD_MAX en model/auth.ts, duplicado localmente —
// mismo criterio de pequeña duplicación por archivo ya usado en el repo
// (EMAIL_RE también se duplica aquí en vez de importarse de clientes.ts).
const PASSWORD_MAX = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Rol = Doc<"usuarios">["rol"];
type Estado = Doc<"usuarios">["estado"];

// Proyección pública del dominio usuarios — NUNCA password_hash ni
// fecha_alta. nombreCompleto en camelCase (no nombre_completo): consistente
// con el resto de este dominio (obtenerSesionActual/actualizarNombrePropio
// en model/auth.ts ya proyectan así), aunque sea distinto del snake_case que
// mantiene el dominio clientes — son dominios separados, no hace falta que
// coincidan entre sí.
export type UsuarioResumen = {
  _id: Id<"usuarios">;
  nombreCompleto: string;
  email: string;
  rol: Rol;
  estado: Estado;
};

function proyectar(u: Doc<"usuarios">): UsuarioResumen {
  return {
    _id: u._id,
    nombreCompleto: u.nombre_completo,
    email: u.email,
    rol: u.rol,
    estado: u.estado,
  };
}

// Compartida con las mutations de administración de JOS-62 (crearUsuarioAdmin/
// actualizarUsuario) — mismo criterio que validarDatosContacto en
// convex/model/clientes.ts.
function validarNombre(nombre: string): string {
  const limpio = nombre.trim();
  if (!limpio) {
    throw new ConvexError("El nombre es obligatorio");
  }
  if (limpio.length > NOMBRE_MAX) {
    throw new ConvexError("El nombre no puede superar los 120 caracteres");
  }
  return limpio;
}

// JOS-62: mismas 3 validaciones que validarDatosContacto en model/clientes.ts
// para email — obligatorio, formato, longitud. Antes de comprobar
// disponibilidad: no tiene sentido consultar el índice por un valor que ni
// siquiera es un email válido.
function normalizarEmail(email: string): string {
  const limpio = email.trim().toLowerCase();
  if (!limpio) {
    throw new ConvexError("El email es obligatorio");
  }
  if (!EMAIL_RE.test(limpio)) {
    throw new ConvexError("El email no tiene un formato válido");
  }
  if (limpio.length > EMAIL_MAX) {
    throw new ConvexError("El email no puede superar los 254 caracteres");
  }
  return limpio;
}

// Mismos mensajes que cambiarPassword en model/auth.ts, para copy
// consistente entre Perfil y Admin.
function validarPasswordNueva(password: string): void {
  if (!password) {
    throw new ConvexError("La contraseña es obligatoria");
  }
  if (password.length < PASSWORD_MIN) {
    throw new ConvexError("La contraseña debe tener al menos 8 caracteres");
  }
  if (password.length > PASSWORD_MAX) {
    throw new ConvexError("La contraseña no puede superar los 200 caracteres");
  }
}

async function verificarEmailDisponible(
  ctx: MutationCtx,
  email: string,
): Promise<void> {
  // .first(), NO .unique() — defensivo, mismo criterio que intentos_login
  // (ver comentario en schema.ts): un duplicado externo no debe poder
  // romper esta comprobación con un error de runtime feo.
  const existente = await ctx.db
    .query("usuarios")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();
  if (existente) {
    throw new ConvexError("Ya existe un usuario con este email");
  }
}

// JOS-63 (Perfil): editar el nombre propio. Deliberadamente separada de
// actualizarUsuario (JOS-62, admin) — no acepta `rol` como argumento, así la
// ruta de escalada de privilegios ni existe en el código.
export async function actualizarNombrePropio(
  ctx: MutationCtx,
  args: { usuarioId: Id<"usuarios">; nombreCompleto: string },
): Promise<void> {
  const usuario = await ctx.db.get(args.usuarioId);
  if (!usuario) {
    throw new ConvexError("Usuario no encontrado");
  }
  const nombre_completo = validarNombre(args.nombreCompleto);
  await ctx.db.patch(args.usuarioId, { nombre_completo });
}

// JOS-62 (P9): alta de usuario desde el formulario de admin — sin invitación
// por email (decisión del usuario humano: no hay proveedor de email
// configurado en este proyecto). Orden de comprobaciones: formato/longitud
// primero (nombre, email, contraseña — todo barato), unicidad de email
// después (una lectura indexada), hashPassword AL FINAL (PBKDF2 600.000
// iteraciones, ~300-500ms) — mismo criterio de "barato antes que caro" que
// ya usa login. Devuelve el UsuarioResumen completo ya normalizado (no solo
// el id): el caller nunca debe reconstruir el email/nombre normalizados a
// partir del formulario — el servidor es la única fuente de verdad de cómo
// quedaron guardados de verdad.
export async function crearUsuarioAdmin(
  ctx: MutationCtx,
  args: { nombreCompleto: string; email: string; password: string; rol: Rol },
): Promise<UsuarioResumen> {
  const nombre_completo = validarNombre(args.nombreCompleto);
  const email = normalizarEmail(args.email);
  validarPasswordNueva(args.password);
  await verificarEmailDisponible(ctx, email);
  const password_hash = await hashPassword(args.password);

  const _id = await ctx.db.insert("usuarios", {
    nombre_completo,
    email,
    password_hash,
    rol: args.rol,
    estado: "activo",
    fecha_alta: Date.now(),
  });
  return { _id, nombreCompleto: nombre_completo, email, rol: args.rol, estado: "activo" };
}

// JOS-62: edición de nombre/rol por la Dueña. NUNCA acepta email (fijo tras
// el alta) ni password (no hay "resetear contraseña desde Admin" en este
// ticket — vacío conocido, documentado en README). `usuarioIdSesion` viene
// EXCLUSIVAMENTE del resultado de requireRolDuena en el wrapper público
// (convex/usuarios.ts) — nunca forma parte de los argumentos que declara esa
// mutation, así que un caller no puede aportarlo ni eludir el candado de
// abajo. Devuelve el UsuarioResumen actualizado, mismo motivo que
// crearUsuarioAdmin.
//
// Guard de concurrencia optimista sobre `rol` (hallazgo de auditoría, ronda
// 2 — escritura perdida): el sheet de edición siempre reenvía el rol que
// tenía cargado al abrirse, así que si otra administradora cambia el rol de
// este mismo usuario mientras el formulario sigue abierto, guardar
// "solo el nombre" reenviaría igualmente el rol ya obsoleto y lo
// restauraría sin que nadie lo pidiera explícitamente (ej.: A abre la ficha
// de un Dueña, B la degrada a Comercial, A guarda un cambio de nombre → sin
// este guard, restauraría el rol Dueña sin querer). `rolConocido` es el rol
// que el cliente tenía cargado al abrir el formulario; si ya no coincide
// con el de la base de datos, se rechaza en vez de sobrescribir a ciegas —
// exige recargar y decidir de nuevo con el dato real.
export async function actualizarUsuario(
  ctx: MutationCtx,
  args: {
    usuarioId: Id<"usuarios">;
    nombreCompleto: string;
    rol: Rol;
    rolConocido: Rol;
    usuarioIdSesion: Id<"usuarios">;
  },
): Promise<UsuarioResumen> {
  const usuario = await ctx.db.get(args.usuarioId);
  if (!usuario) {
    throw new ConvexError("Usuario no encontrado");
  }
  if (usuario.rol !== args.rolConocido) {
    throw new ConvexError(
      "Este usuario ha cambiado desde que abriste este formulario. Recarga e inténtalo de nuevo.",
    );
  }
  const nombre_completo = validarNombre(args.nombreCompleto);
  if (
    args.usuarioId === args.usuarioIdSesion &&
    usuario.rol === "duena" &&
    args.rol !== "duena"
  ) {
    throw new ConvexError("No puedes quitarte a ti misma el rol de Dueña");
  }
  await ctx.db.patch(args.usuarioId, { nombre_completo, rol: args.rol });
  return {
    _id: args.usuarioId,
    nombreCompleto: nombre_completo,
    email: usuario.email,
    rol: args.rol,
    estado: usuario.estado,
  };
}

// Cap de limpieza física — mismo valor que limpiarSesionesExpiradas
// (convex/model/auth.ts) sobre la misma tabla, bounded para que la
// operación quepa siempre en una única transacción. IMPORTANTE (auditoría
// del código, ronda 4): esto ya NO es el mecanismo que garantiza que una
// sesión antigua deje de funcionar — eso lo hace sesion_valida_desde en
// obtenerSesionActual (ver convex/model/auth.ts), una comprobación lógica
// en O(1) que no depende de haber borrado ninguna fila. El borrado físico de
// abajo es solo limpieza de almacenamiento: con volumen alto puede dejar
// filas sueltas sin importancia real (ya inválidas igualmente por la marca),
// que se acaban limpiando por `limpiarSesionesExpiradas` cuando expiren.
const SESIONES_BORRADAS_MAX = 500;

async function borrarSesionesDeUsuario(
  ctx: MutationCtx,
  usuarioId: Id<"usuarios">,
): Promise<void> {
  const sesiones = await ctx.db
    .query("sesiones")
    .withIndex("by_usuario_id", (q) => q.eq("usuario_id", usuarioId))
    .take(SESIONES_BORRADAS_MAX);
  await Promise.all(sesiones.map((s) => ctx.db.delete(s._id)));
}

// JOS-62: desactivación. `usuarioIdSesion` viene exclusivamente de
// requireRolDuena, mismo motivo que en actualizarUsuario — el candado de
// abajo no es eludible aportando un usuarioIdSesion distinto desde fuera,
// porque el caller no puede tocar ese valor en absoluto.
//
// CRÍTICO (auditoría del código, ronda 4 — bloqueante, corrige un fix
// anterior insuficiente): fijar solo `sesion_valida_desde` a `Date.now()` ya
// invalida TODAS las sesiones existentes de golpe, sin importar cuántas
// sean — obtenerSesionActual rechaza cualquier sesión con creado_en anterior
// a esta marca, exista o no todavía su fila. El borrado físico (acotado)
// que sigue es solo limpieza, no la garantía de seguridad: un intento
// anterior dependía de borrar todas las filas en dos pasadas de 500 (aquí y
// en reactivarUsuario), y con más de 1000 sesiones vigentes dejaba un resto
// que "resucitaba" al reactivar — ese contraejemplo ya no aplica, porque
// reactivar nunca toca sesion_valida_desde (ver abajo).
export async function desactivarUsuario(
  ctx: MutationCtx,
  args: { usuarioId: Id<"usuarios">; usuarioIdSesion: Id<"usuarios"> },
): Promise<void> {
  const usuario = await ctx.db.get(args.usuarioId);
  if (!usuario) {
    throw new ConvexError("Usuario no encontrado");
  }
  if (args.usuarioId === args.usuarioIdSesion) {
    throw new ConvexError("No puedes desactivar tu propia cuenta");
  }
  if (usuario.estado === "inactivo") {
    throw new ConvexError("Este usuario ya está inactivo");
  }
  await ctx.db.patch(args.usuarioId, {
    estado: "inactivo",
    sesion_valida_desde: Date.now(),
  });
  await borrarSesionesDeUsuario(ctx, args.usuarioId);
}

// JOS-62: reactivación. Deliberadamente NO toca `sesion_valida_desde` — esa
// marca se queda fijada en el momento de la desactivación para siempre,
// así que cualquier sesión emitida ANTES de esa desactivación sigue
// rechazada aunque la cuenta vuelva a estar activa, sin importar si su fila
// física llegó a borrarse o no. Solo un login nuevo (que crea una sesión con
// creado_en posterior) vuelve a funcionar. El borrado físico que sigue es
// limpieza de las filas ya inválidas, no una segunda garantía de seguridad.
export async function reactivarUsuario(
  ctx: MutationCtx,
  args: { usuarioId: Id<"usuarios"> },
): Promise<void> {
  const usuario = await ctx.db.get(args.usuarioId);
  if (!usuario) {
    throw new ConvexError("Usuario no encontrado");
  }
  if (usuario.estado === "activo") {
    throw new ConvexError("Este usuario ya está activo");
  }
  await ctx.db.patch(args.usuarioId, { estado: "activo" });
  await borrarSesionesDeUsuario(ctx, args.usuarioId);
}

// JOS-62: agrupado y ordenado (localeCompare "es") en servidor, mismo
// patrón que obtenerPipeline en model/clientes.ts. Sin .take(): la tabla
// usuarios es intrínsecamente pequeña (a diferencia de clientes), un
// .collect() completo es aceptable.
export async function listarUsuarios(
  ctx: QueryCtx,
): Promise<{ activos: UsuarioResumen[]; inactivos: UsuarioResumen[] }> {
  const usuarios = await ctx.db.query("usuarios").collect();
  const porNombre = (a: UsuarioResumen, b: UsuarioResumen) =>
    a.nombreCompleto.localeCompare(b.nombreCompleto, "es");

  const activos = usuarios
    .filter((u) => u.estado === "activo")
    .map(proyectar)
    .sort(porNombre);
  const inactivos = usuarios
    .filter((u) => u.estado === "inactivo")
    .map(proyectar)
    .sort(porNombre);

  return { activos, inactivos };
}

export { validarNombre };
