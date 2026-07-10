"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PRIORIDAD_BADGE, PRIORIDAD_LABEL } from "@/lib/constants";

/**
 * P1 · Inicio / Dashboard — JOS-27 (F10 + F11 + F12).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Dashboard · Inicio.dc.html
 * (el banner de la maqueta dice "+30 días"; el umbral real es 7, ver JOS-27).
 */
export default function InicioPage() {
  const resumen = useQuery(api.dashboard.resumen);
  const tareas = useQuery(api.recordatorios.listTareasDelDia);
  const marcarHecho = useMutation(api.recordatorios.marcarHecho);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:p-8">
      <h1 className="text-heading-lg">Buenos días</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="flex h-20 flex-col justify-center gap-1">
          <span className="text-data-value">{resumen?.leadsActivos ?? "—"}</span>
          <span className="text-caption text-ink-muted">Leads activos</span>
        </Card>
        <Card className="flex h-20 flex-col justify-center gap-1">
          <span className="text-data-value">{resumen?.ventasCerradas ?? "—"}</span>
          <span className="text-caption text-ink-muted">Ventas cerradas</span>
        </Card>
        <Card className="flex h-20 flex-col justify-center gap-1">
          <span className="text-data-value">{resumen?.seguimientosHoy ?? "—"}</span>
          <span className="text-caption text-ink-muted">Seguimientos hoy</span>
        </Card>
      </div>

      {resumen && resumen.clientesInactivos > 0 && (
        <Link
          href="/clientes/inactivos"
          className="flex h-12 items-center gap-3 rounded-md border border-warning-border bg-warning-bg px-3.5 text-body-sm text-warning-text"
        >
          <AlertTriangle size={18} className="shrink-0 text-warning" />
          <span className="flex-1">
            {resumen.clientesInactivos} cliente{resumen.clientesInactivos === 1 ? "" : "s"} llevan más de 7
            días sin contacto
          </span>
          <span className="text-body-sm-strong">Ver →</span>
        </Link>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-heading-sm">Tareas de hoy</h2>

        {tareas?.length === 0 && (
          <p className="text-body-sm text-ink-muted">Sin tareas para hoy. ¡Todo hecho!</p>
        )}

        {tareas?.map((tarea) =>
          tarea.cliente ? (
            <Card key={tarea._id} className="flex items-center gap-3">
              <Link
                href={`/clientes/${tarea.clienteId}`}
                className="flex flex-1 items-center gap-3 min-w-0"
              >
                <Badge colorClassName={PRIORIDAD_BADGE[tarea.cliente.prioridad]}>
                  {PRIORIDAD_LABEL[tarea.cliente.prioridad]}
                </Badge>
                <div className="min-w-0">
                  <p className="text-body-sm-strong truncate">{tarea.cliente.nombre}</p>
                  <p className="text-caption text-ink-muted truncate">{tarea.motivo}</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  marcarHecho({ id: tarea._id });
                }}
              >
                <CheckCircle2 size={16} /> Hecho
              </Button>
            </Card>
          ) : null,
        )}
      </section>
    </div>
  );
}
