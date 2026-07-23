import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getSesionActual } from "@/lib/session";
import { Greeting } from "@/components/dashboard/Greeting";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { InactivityBanner } from "@/components/dashboard/InactivityBanner";
import { TaskListSection } from "@/components/dashboard/TaskListSection";

// JOS-27: P1 carga una vez por visita, sin realtime — no useQuery reactivo.
export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/"); // defensivo — el layout ya garantiza esto, cache() lo hace barato

  const [resumen, tareas] = await Promise.all([
    fetchQuery(api.dashboard.obtenerResumen, { token: sesion.token }),
    fetchQuery(api.recordatorios.listarSeguimientosHoy, { token: sesion.token }),
  ]);

  return (
    <div className="pb-6">
      <Greeting nombre={sesion.usuario.nombreCompleto} />
      <KpiRow
        leadsActivos={resumen.leadsActivos}
        ventasCerradas={resumen.ventasCerradas}
        seguimientosHoy={resumen.seguimientosHoy}
      />
      <InactivityBanner count={resumen.clientesInactivosCount} />
      <TaskListSection tareas={tareas} />
    </div>
  );
}
