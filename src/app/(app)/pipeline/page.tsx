"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FaseSelector } from "@/components/pipeline/FaseSelector";
import {
  FASES_PIPELINE,
  FASE_PIPELINE_LABEL,
  PRIORIDAD_BADGE,
  PRIORIDAD_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * P6 · Pipeline (Kanban) — JOS-14 (F6). Seis fases, "Inactivo" solo la
 * asigna el sistema. "Perdido" se ve atenuado (design.md).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Pipeline · Kanban.dc.html
 */
export default function PipelinePage() {
  const clientes = useQuery(api.clientes.listPorFase);
  const [moviendo, setMoviendo] = useState<Id<"clientes"> | null>(null);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-heading-lg mb-4">Pipeline</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {FASES_PIPELINE.map((fase) => {
          const clientesFase = clientes?.filter((c) => c.fasePipeline === fase) ?? [];
          return (
            <div
              key={fase}
              className={cn(
                "flex w-[240px] shrink-0 flex-col gap-2 rounded-lg p-2",
                fase === "inactivo" && "bg-warning-bg",
              )}
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-overline text-ink-muted">{FASE_PIPELINE_LABEL[fase]}</span>
                <span className="text-caption text-ink-muted">{clientesFase.length}</span>
              </div>

              {clientesFase.map((c) => (
                <div key={c._id} className={cn(fase === "perdido" && "opacity-60")}>
                  <Card className="flex w-[224px] flex-col gap-1.5 p-3">
                    <div className="flex items-center justify-between">
                      <Badge colorClassName={PRIORIDAD_BADGE[c.prioridad]}>
                        {PRIORIDAD_LABEL[c.prioridad]}
                      </Badge>
                    </div>
                    <Link href={`/clientes/${c._id}`} className="text-body-sm-strong truncate">
                      {c.nombre}
                    </Link>
                    <span className="text-caption text-ink-muted">
                      {c.fechaUltimoContacto
                        ? new Date(c.fechaUltimoContacto).toLocaleDateString("es-ES")
                        : "Sin contacto"}
                    </span>
                    {fase !== "inactivo" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 self-start px-0"
                        onClick={() => setMoviendo(moviendo === c._id ? null : c._id)}
                      >
                        Cambiar fase
                      </Button>
                    )}
                    {moviendo === c._id && (
                      <div className="mt-1">
                        <FaseSelector clienteId={c._id} faseActual={c.fasePipeline} />
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
