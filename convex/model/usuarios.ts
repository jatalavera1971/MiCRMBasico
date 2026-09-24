import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

const NOMBRE_MAX = 120;

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

export { validarNombre };
