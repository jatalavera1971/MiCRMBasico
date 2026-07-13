import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
const INACTIVITY_WINDOW_MS = 7 * DAY_MS;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// JOS-25: clientes con fecha_ultimo_contacto anterior a (hoy - 7 días), ordenados
// por fecha_ultimo_contacto ascendente (más tiempo sin contacto primero = más
// urgente). Los clientes nunca contactados (fecha_ultimo_contacto ausente) NO
// cuentan como inactivos — así lo dice JOS-25 explícitamente ("no tienen
// historial que analizar"). No confiamos solo en el rango del índice para esto:
// filtramos el ausente explícitamente en código.
//
// Proyección explícita (JOS-12, ronda 3 de auditoría): esta query es pública y
// sin auth; ahora que `clientes` tiene email/telefono/prioridad/fecha_alta, hay
// que seguir devolviendo solo lo que consume /inactivos (_id/nombre/empresa/
// fecha_ultimo_contacto), no el documento completo.
export async function listarClientesInactivos(ctx: QueryCtx) {
  const umbral = Date.now() - INACTIVITY_WINDOW_MS;
  const candidatos = await ctx.db
    .query("clientes")
    .withIndex("by_fecha_ultimo_contacto", (q) =>
      q.lt("fecha_ultimo_contacto", umbral),
    )
    .order("asc")
    .collect();
  return candidatos
    .filter((c) => c.fecha_ultimo_contacto !== undefined)
    .map((c) => ({
      _id: c._id,
      nombre: c.nombre,
      empresa: c.empresa,
      fecha_ultimo_contacto: c.fecha_ultimo_contacto,
    }));
}

// JOS-27 (F12) — "Leads activos": clientes en cualquier fase excepto Cerrado.
// Nota (JOS-12, ronda 3 de auditoría): con crearCliente pública y sin rate-limit,
// esta tabla puede crecer sin límite y este collect() se ejecuta en cada visita a
// /inicio. Riesgo de coste aceptado junto con la escritura pública — no se añade
// un contador agregado ni un tope aquí, no se justifica para el volumen del MVP.
export async function contarClientesActivos(ctx: QueryCtx) {
  const todos = await ctx.db.query("clientes").collect();
  return todos.filter((c) => c.fase !== "cerrado").length;
}

// JOS-27 (F12) — "Ventas cerradas": clientes en fase Cerrado.
export async function contarClientesCerrados(ctx: QueryCtx) {
  const cerrados = await ctx.db
    .query("clientes")
    .withIndex("by_fase", (q) => q.eq("fase", "cerrado"))
    .collect();
  return cerrados.length;
}

// JOS-12 (alta de cliente): crea un cliente nuevo en fase "lead". Valida en el
// servidor aunque el formulario ya valide en cliente (defensa en profundidad,
// mismo criterio que marcarComoHecho) — nunca hay que confiar solo en la
// validación del cliente. Límites de longitud (ronda 1 de auditoría): mitigación
// mínima aceptada junto con el riesgo de escritura pública sin rate-limit/auth.
export async function crearCliente(
  ctx: MutationCtx,
  args: {
    nombre: string;
    email: string;
    empresa?: string;
    telefono?: string;
    prioridad: "alta" | "media" | "baja";
  },
) {
  const nombre = args.nombre.trim();
  const email = args.email.trim().toLowerCase();
  const empresa = args.empresa?.trim();
  const telefono = args.telefono?.trim();

  if (!nombre) {
    throw new ConvexError("El nombre es obligatorio");
  }
  if (nombre.length > 120) {
    throw new ConvexError("El nombre no puede superar los 120 caracteres");
  }
  if (!email) {
    throw new ConvexError("El email es obligatorio");
  }
  if (!EMAIL_RE.test(email)) {
    throw new ConvexError("El email no tiene un formato válido");
  }
  if (email.length > 254) {
    throw new ConvexError("El email no puede superar los 254 caracteres");
  }
  if (empresa && empresa.length > 160) {
    throw new ConvexError("La empresa no puede superar los 160 caracteres");
  }
  if (telefono && telefono.length > 40) {
    throw new ConvexError("El teléfono no puede superar los 40 caracteres");
  }

  return ctx.db.insert("clientes", {
    nombre,
    email,
    empresa: empresa || undefined,
    telefono: telefono || undefined,
    prioridad: args.prioridad,
    fase: "lead",
    fecha_alta: Date.now(),
    // fecha_ultimo_contacto se omite a propósito: un alta no es un contacto
    // registrado, sigue "nunca contactado" a efectos de JOS-25.
    // JOS-10: valor de relleno hasta que exista P3/edición para cambiarlo de
    // verdad — mismo criterio que el prototipo, que hardcodea "Email" al crear.
    canal_preferido: "email",
  });
}

// JOS-10/13/45: query real de la pantalla "Clientes" (P2) — el filtrado por
// texto/prioridad y el orden por prioridad+antigüedad de contacto se hacen en
// el cliente (ver ClientesListClient.tsx), aquí solo se acota el volumen y se
// proyecta. Proyección explícita (misma razón que listarClientesInactivos
// arriba): esta query es pública y sin auth, así que solo devuelve los 9 campos
// que P2 consume de verdad — nunca fecha_alta (no se usa aquí), pero SÍ
// telefono/empresa/canal_preferido/fase/fecha_ultimo_contacto, que antes de
// esta pantalla no se exponían. Es un escalón adicional del riesgo de PII ya
// aceptado (ver README) — telefono y fecha_ultimo_contacto (actividad
// comercial) quedan legibles públicamente hasta JOS-60/61, porque JOS-13
// necesita buscar por teléfono y JOS-45 necesita ordenar por último contacto.
// Tope de seguridad `.take(500)`: no es paginación real (JOS-31 sigue
// pendiente) — busca sobre los hasta 500 clientes cargados, no sobre toda la
// tabla; si la tabla supera ese tamaño (posible porque crearCliente es pública
// y sin rate-limit) la búsqueda deja de cubrir el resto sin que se note.
export async function listarClientes(ctx: QueryCtx) {
  const clientes = await ctx.db
    .query("clientes")
    .withIndex("by_fecha_alta")
    .order("desc")
    .take(500);
  return clientes.map((c) => ({
    _id: c._id,
    nombre: c.nombre,
    email: c.email,
    telefono: c.telefono,
    empresa: c.empresa,
    canal_preferido: c.canal_preferido,
    fase: c.fase,
    prioridad: c.prioridad,
    fecha_ultimo_contacto: c.fecha_ultimo_contacto,
  }));
}
