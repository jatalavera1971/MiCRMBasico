import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

// JOS-60/61: hash de contraseña vía Web Crypto (crypto.subtle, PBKDF2-HMAC-
// SHA256) — sin dependencia npm nueva, Convex corre query/mutation en un
// runtime tipo V8 isolate sin módulos nativos de Node (bcrypt no
// funcionaría ahí). PBKDF2_ITERATIONS fijado tras medir latencia real con
// `npx convex run` (ver informe de implementación) — el objetivo era el
// mayor recuento que completara cómodamente por debajo de ~300-500ms.
const PBKDF2_ITERATIONS = 600_000;
const SALT_BYTES = 16;
const KEY_LENGTH_BITS = 256;
const EMAIL_MAX = 254; // RFC 5321
const PASSWORD_MAX = 200;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días fijos, sin renovación deslizante
const LOCKOUT_MAX_INTENTOS = 10;
const LOCKOUT_VENTANA_MS = 15 * 60 * 1000;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function derivarPbkdf2(
  password: string,
  salt: Uint8Array,
  iteraciones: number,
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: iteraciones, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH_BITS,
  );
  return new Uint8Array(bits);
}

// Comparación sin early-return: recorre todos los bytes siempre, para no
// filtrar por temporización cuántos bytes iniciales coinciden. Best-effort a
// nivel de JS (JIT/GC/red introducen ruido) — no es una garantía formal.
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derivarPbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

// Hash "señuelo" fijo, mismo formato/coste que uno real — usado cuando el
// email no existe, para que verifyPassword tarde lo mismo exista o no la
// cuenta (mitigación de enumeración de usuarios por temporización).
const DUMMY_HASH = `pbkdf2$${PBKDF2_ITERATIONS}$${"00".repeat(SALT_BYTES)}$${"00".repeat(KEY_LENGTH_BITS / 8)}`;

async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const partes = stored.split("$");
  if (partes.length !== 4 || partes[0] !== "pbkdf2") return false;
  const iteraciones = Number(partes[1]);
  const salt = fromHex(partes[2]);
  const esperado = fromHex(partes[3]);
  const real = await derivarPbkdf2(password, salt, iteraciones);
  return constantTimeEqual(real, esperado);
}

const TOKEN_BYTES = 32;
// Longitud exacta de un token real en base64url sin padding: ceil(bytes*4/3).
const TOKEN_LENGTH = Math.ceil((TOKEN_BYTES * 4) / 3);
const TOKEN_RE = /^[A-Za-z0-9_-]+$/;

function generarTokenOpaco(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(TOKEN_BYTES)));
}

// Auditoría (mayor, no bloqueante): logout/obtenerSesionActual (y por tanto
// requireSesion, que usan las 19 funciones de negocio) aceptaban cualquier
// string como token y lo hasheaban sin validar antes — superficie evitable
// para forzar TextEncoder+SHA-256 con strings arbitrariamente grandes desde
// fuera. Un token real tiene longitud y alfabeto fijos (ver generarTokenOpaco);
// cualquier otra cosa se rechaza sin tocar crypto.subtle.
function esTokenValido(token: string): boolean {
  return token.length === TOKEN_LENGTH && TOKEN_RE.test(token);
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return toHex(new Uint8Array(digest));
}

async function registrarIntentoFallido(
  ctx: MutationCtx,
  email: string,
  intentoActual: Doc<"intentos_login"> | null,
  ahora: number,
) {
  if (!intentoActual) {
    await ctx.db.insert("intentos_login", {
      email,
      ventana_inicio: ahora,
      conteo: 1,
    });
    return;
  }
  if (ahora - intentoActual.ventana_inicio >= LOCKOUT_VENTANA_MS) {
    await ctx.db.patch(intentoActual._id, { ventana_inicio: ahora, conteo: 1 });
  } else {
    await ctx.db.patch(intentoActual._id, { conteo: intentoActual.conteo + 1 });
  }
}

type LoginResultado =
  | { ok: true; token: string; usuario: { nombreCompleto: string; rol: string } }
  | { ok: false };

// JOS-60/61: login por email+contraseña. NUNCA lanza ConvexError (corrección
// tras verificación manual, ronda de implementación): Convex revierte TODA la
// transacción de una mutation si lanza, incluidas las escrituras hechas antes
// del throw — un primer diseño que escribía en intentos_login y luego
// lanzaba perdía esa escritura siempre, el contador nunca se persistía
// (comprobado en runtime real: 12 fallos seguidos no dejaban ninguna fila en
// la tabla). La función ahora siempre retorna normalmente (nunca throw), así
// las escrituras de fallo si se cometen de verdad; el wrapper público
// (convex/auth.ts) no necesita reinterpretar nada, el resultado ya es
// {ok:false} tal cual.
//
// Orden de comprobaciones:
// 1) límites duros de longitud, ANTES de tocar intentos_login o calcular
//    ningún hash — sin esto, un atacante puede enviar strings enormes y
//    forzar coste de memoria/CPU antes de llegar al rate-limit.
// 2) lockout por intentos_login (lectura con .first(), ver nota en la propia
//    tabla en schema.ts) — rechaza sin ejecutar PBKDF2 si ya hay 10+ fallos
//    en los últimos 15 minutos para ese email exacto. Best-effort: no
//    protege contra emails rotados/aleatorios (ver README).
// 3) verificación de contraseña, con hash "señuelo" si el email no existe.
// 4) cuenta inexistente, contraseña incorrecta y estado "inactivo" colapsan
//    en el mismo {ok:false} — nunca se distingue cuál falló.
export async function login(
  ctx: MutationCtx,
  args: { email: string; password: string },
): Promise<LoginResultado> {
  const email = args.email.trim().toLowerCase();
  if (
    !email ||
    email.length > EMAIL_MAX ||
    !args.password ||
    args.password.length > PASSWORD_MAX
  ) {
    return { ok: false };
  }

  const ahora = Date.now();
  const intento = await ctx.db
    .query("intentos_login")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();
  if (
    intento &&
    ahora - intento.ventana_inicio < LOCKOUT_VENTANA_MS &&
    intento.conteo >= LOCKOUT_MAX_INTENTOS
  ) {
    return { ok: false };
  }

  const usuario = await ctx.db
    .query("usuarios")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  const passwordOk = await verifyPassword(
    args.password,
    usuario?.password_hash ?? DUMMY_HASH,
  );

  if (!usuario || !passwordOk || usuario.estado === "inactivo") {
    await registrarIntentoFallido(ctx, email, intento, ahora);
    return { ok: false };
  }

  if (intento) {
    await ctx.db.delete(intento._id);
  }

  const token = generarTokenOpaco();
  await ctx.db.insert("sesiones", {
    usuario_id: usuario._id,
    token_hash: await hashToken(token),
    creado_en: ahora,
    expira_en: ahora + SESSION_TTL_MS,
  });

  return {
    ok: true,
    token,
    usuario: { nombreCompleto: usuario.nombre_completo, rol: usuario.rol },
  };
}

export async function logout(ctx: MutationCtx, args: { token: string }) {
  if (!esTokenValido(args.token)) return; // idempotente: token con formato inválido = no-op, igual que uno válido pero ya inexistente
  const tokenHash = await hashToken(args.token);
  const sesion = await ctx.db
    .query("sesiones")
    .withIndex("by_token_hash", (q) => q.eq("token_hash", tokenHash))
    .unique();
  if (sesion) {
    await ctx.db.delete(sesion._id);
  }
}

// Nunca devuelve password_hash. Cuenta "inactivo" revoca el acceso de
// inmediato aunque la sesión siga técnicamente vigente (comprobado en cada
// llamada, no solo al hacer login).
export async function obtenerSesionActual(
  ctx: QueryCtx,
  args: { token: string },
) {
  if (!esTokenValido(args.token)) return null;
  const tokenHash = await hashToken(args.token);
  const sesion = await ctx.db
    .query("sesiones")
    .withIndex("by_token_hash", (q) => q.eq("token_hash", tokenHash))
    .unique();
  if (!sesion || sesion.expira_en < Date.now()) return null;
  const usuario = await ctx.db.get(sesion.usuario_id);
  if (!usuario || usuario.estado === "inactivo") return null;
  return {
    usuarioId: usuario._id,
    nombreCompleto: usuario.nombre_completo,
    email: usuario.email,
    rol: usuario.rol,
  };
}

// Guard común (auditoría, ronda 1 — bloqueante): usado por clientes.ts /
// recordatorios.ts / interacciones.ts / dashboard.ts para exigir sesión
// válida en cada función pública, sin scoping por rol todavía.
export async function requireSesion(ctx: QueryCtx, token: string) {
  const sesion = await obtenerSesionActual(ctx, { token });
  if (!sesion) {
    throw new ConvexError("No autenticado");
  }
  return sesion;
}

// No-op real (decisión del usuario, 2026-07-23): sin proveedor de email
// configurado esta ronda, generar y guardar un token de reseteo real sin
// ningún consumidor sería material sensible innecesario (auditoría, ronda
// 2). El frontend sigue mostrando "Correo enviado" para no romper el flujo
// de UI del diseño — README documenta sin rodeos que esto no hace nada
// server-side todavía.
export async function solicitarResetPassword(
  _ctx: MutationCtx,
  _args: { email: string },
) {
  return;
}

export async function limpiarSesionesExpiradas(ctx: MutationCtx) {
  const expiradas = await ctx.db
    .query("sesiones")
    .withIndex("by_expira_en", (q) => q.lt("expira_en", Date.now()))
    .take(500);
  await Promise.all(expiradas.map((s) => ctx.db.delete(s._id)));
}

export { hashPassword };
