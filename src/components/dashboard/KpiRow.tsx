import { Calendar, CheckCircle2, Users } from "lucide-react";
import { KpiCard } from "./KpiCard";

export function KpiRow({
  leadsActivos,
  ventasCerradas,
  seguimientosHoy,
}: {
  leadsActivos: number;
  ventasCerradas: number;
  seguimientosHoy: number;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto p-4">
      <KpiCard
        value={leadsActivos}
        label="Leads activos"
        icon={Users}
        iconBgClassName="bg-[#DBEAFE]"
        iconColorClassName="text-[#1D4ED8]"
      />
      <KpiCard
        value={ventasCerradas}
        label="Ventas cerradas"
        icon={CheckCircle2}
        iconBgClassName="bg-primary-50"
        iconColorClassName="text-primary-600"
      />
      <KpiCard
        value={seguimientosHoy}
        label="Seguimientos hoy"
        icon={Calendar}
        iconBgClassName="bg-[#FEF3C7]"
        iconColorClassName="text-[#B45309]"
      />
    </div>
  );
}
