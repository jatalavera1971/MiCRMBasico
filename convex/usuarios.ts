import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireSesion as requireSesionModel } from "./model/auth";
import { actualizarNombrePropio as actualizarNombrePropioModel } from "./model/usuarios";

// JOS-63: self-service — solo exige sesión (no rol). Deliberadamente no
// acepta `usuarioId` como argumento: el objetivo siempre es la propia
// sesión, nunca uno elegido por quien llama (evita cualquier IDOR aquí).
export const actualizarNombrePropio = mutation({
  args: { nombreCompleto: v.string(), token: v.string() },
  handler: async (ctx, { nombreCompleto, token }) => {
    const sesion = await requireSesionModel(ctx, token);
    return actualizarNombrePropioModel(ctx, {
      usuarioId: sesion.usuarioId,
      nombreCompleto,
    });
  },
});
