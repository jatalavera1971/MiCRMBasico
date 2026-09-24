import { redirect } from "next/navigation";
import { getSesionActual } from "@/lib/session";
import { PerfilClient } from "@/components/perfil/PerfilClient";

export const dynamic = "force-dynamic";

// JOS-63 (P10): sin fetchQuery adicional — sesion.usuario ya trae
// nombreCompleto/email/rol (ver src/lib/session.ts).
export default async function PerfilPage() {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/");

  return <PerfilClient usuario={sesion.usuario} />;
}
