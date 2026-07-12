import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Greeting } from "@/components/dashboard/Greeting";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { InactivityBanner } from "@/components/dashboard/InactivityBanner";
import { TaskListSection } from "@/components/dashboard/TaskListSection";

// JOS-27: P1 carga una vez por visita, sin realtime — no useQuery reactivo.
export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const [resumen, tareas] = await Promise.all([
    fetchQuery(api.dashboard.obtenerResumen, {}),
    fetchQuery(api.recordatorios.listarSeguimientosHoy, {}),
  ]);

  return (
    <div className="pb-6">
      <Greeting />
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
