"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { getInitials } from "@/components/clientes/ClienteRow";
import { FASE_LABELS, type Fase } from "@/lib/clienteLabels";
import {
  PRIORITY_STYLES,
  type Prioridad,
  type PrioridadFiltro,
} from "@/components/clientes/priorityStyles";
import { PIPELINE_STYLES } from "@/components/clientes/pipelineStyles";
import { formatFechaCorta } from "@/lib/dates";
import { PipelineFilterSheet } from "./PipelineFilterSheet";

export type ClientePipeline = {
  _id: Id<"clientes">;
  nombre: string;
  empresa?: string;
  prioridad: Prioridad;
  fecha_ultimo_contacto?: number;
};

export type GrupoPipeline = {
  fase: Fase;
  clientes: ClientePipeline[];
};

export type Pipeline = {
  grupos: GrupoPipeline[];
  total: number;
};

const CAP = 500;

// JOS-14 (P6): sigue el prototipo interactivo real (sPipeline() en
// crm-app.js) — decisión confirmada con el usuario: layout único responsive
// (sin columnas independientes por breakpoint), grupos siempre expandidos
// (sin secciones colapsables) y tarjetas que solo navegan a la ficha (el
// cambio de fase se hace desde P3, se refleja aquí al recargar).
export function PipelineBoardClient({ pipeline }: { pipeline: Pipeline }) {
  const [filtro, setFiltro] = useState<PrioridadFiltro>("todas");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const gruposFiltrados = pipeline.grupos.map((g) => ({
    ...g,
    clientes: g.clientes.filter(
      (c) => filtro === "todas" || c.prioridad === filtro,
    ),
  }));
  const fasesVacias = gruposFiltrados.filter((g) => g.clientes.length === 0);

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-4 pt-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Pipeline</h1>
          {/* Total SIN filtrar (igual que totalActive=clients.length del
              prototipo) — el filtro de prioridad no cambia este número, solo
              el grid resumen y los grupos de abajo. */}
          <p className="mt-0.5 text-sm text-text-tertiary">
            {pipeline.total >= CAP
              ? "Mostrando hasta 500 clientes"
              : `${pipeline.total} cliente${pipeline.total === 1 ? "" : "s"} en el pipeline`}
          </p>
        </div>
        <button
          type="button"
          aria-label="Filtrar pipeline"
          onClick={() => setFilterSheetOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary"
        >
          <Filter className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pb-2 pt-4 md:grid-cols-3 lg:grid-cols-6">
        {gruposFiltrados.map((g) => {
          const estilo = PIPELINE_STYLES[g.fase];
          return (
            <div
              key={g.fase}
              className="rounded-[10px] border border-border-subtle bg-bg-app px-3 py-2.5"
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: estilo.dot }}
                />
                <span className="truncate text-xs font-medium text-text-secondary">
                  {FASE_LABELS[g.fase]}
                </span>
              </div>
              <span className="text-lg font-bold text-text-primary">
                {g.clientes.length}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        {gruposFiltrados
          .filter((g) => g.clientes.length > 0)
          .map((g) => {
            const estilo = PIPELINE_STYLES[g.fase];
            return (
              <div key={g.fase}>
                <div className="flex items-center gap-2.5 px-4 pb-2 pt-4">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: estilo.dot }}
                  />
                  <span className="flex-1 text-[13px] font-semibold text-text-secondary">
                    {FASE_LABELS[g.fase]}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: estilo.bg, color: estilo.text }}
                  >
                    {g.clientes.length}
                  </span>
                </div>
                <div className="mx-4 overflow-hidden rounded-xl border border-border-subtle bg-surface">
                  {g.clientes.map((c, i) => {
                    const prioridad = PRIORITY_STYLES[c.prioridad];
                    return (
                      <Link
                        key={c._id}
                        href={`/clientes/${encodeURIComponent(c._id)}`}
                        className={`flex items-center gap-3 px-3.5 py-3 ${
                          i < g.clientes.length - 1
                            ? "border-b border-border-subtle"
                            : ""
                        }`}
                      >
                        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
                          {getInitials(c.nombre)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {c.nombre}
                          </p>
                          <p className="truncate text-xs text-text-tertiary">
                            {c.empresa ?? "sin empresa"}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className="rounded-full px-[7px] py-[2px] text-[11px] font-medium uppercase tracking-wide"
                            style={{ background: prioridad.bg, color: prioridad.text }}
                          >
                            {prioridad.label}
                          </span>
                          <span className="text-[11px] text-text-tertiary">
                            {c.fecha_ultimo_contacto
                              ? formatFechaCorta(c.fecha_ultimo_contacto)
                              : "Sin contacto"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

        {fasesVacias.length > 0 ? (
          <p className="px-4 pb-2 pt-4 text-xs text-text-tertiary">
            {fasesVacias.map((g) => FASE_LABELS[g.fase]).join(" · ")} · Sin
            clientes
          </p>
        ) : null}
      </div>

      <PipelineFilterSheet
        open={filterSheetOpen}
        current={filtro}
        onClose={() => setFilterSheetOpen(false)}
        onSelect={setFiltro}
      />
    </div>
  );
}
