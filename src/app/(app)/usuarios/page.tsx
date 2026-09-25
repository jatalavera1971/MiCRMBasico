import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getSesionActual } from "@/lib/session";
import { UsuariosListClient } from "@/components/usuarios/UsuariosListClient";

export const dynamic = "force-dynamic";

// JOS-62 (P9): guard de rol real en servidor — redirige a /inicio ANTES de
// llamar a listarUsuarios, que además está gateada por rol en la propia capa
// Convex (requireRolDuena, defensa en profundidad). Sin página 403 — mismo
// patrón que el resto de guards del repo.
export default async function UsuariosPage() {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/");
  if (sesion.usuario.rol !== "duena") redirect("/inicio");

  const { activos, inactivos } = await fetchQuery(api.usuarios.listarUsuarios, {
    token: sesion.token,
  });

  return (
    <UsuariosListClient
      activosIniciales={activos}
      inactivosIniciales={inactivos}
      usuarioActualId={sesion.usuario.usuarioId}
    />
  );
}
