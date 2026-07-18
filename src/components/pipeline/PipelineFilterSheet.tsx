"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  PRIORITY_STYLES,
  type PrioridadFiltro,
} from "@/components/clientes/priorityStyles";

const OPCIONES: { key: PrioridadFiltro; label: string; desc: string }[] = [
  { key: "todas", label: "Todas las prioridades", desc: "Ver todos los clientes del pipeline" },
  { key: "alta", label: "Alta prioridad", desc: "Solo clientes marcados como Alta" },
  { key: "media", label: "Media prioridad", desc: "Solo clientes marcados como Media" },
  { key: "baja", label: "Baja prioridad", desc: "Solo clientes marcados como Baja" },
];

// JOS-14: bottom sheet de filtro del pipeline (P6) por prioridad. A diferencia
// de PrioritySheet/RecordatorioSheet, aquí no hay paso de confirmación ni
// mutation: es un filtro puramente de cliente, así que tocar una opción aplica
// el filtro y cierra el sheet en el mismo gesto. Sin listener `onClose`
// nativo (a diferencia de ConfirmDialog.tsx): no hace falta distinguir cierre
// programático de cancelación, no hay estado "pendiente de confirmar" que
// proteger de un cierre espurio.
export function PipelineFilterSheet({
  open,
  current,
  onClose,
  onSelect,
}: {
  open: boolean;
  current: PrioridadFiltro;
  onClose: () => void;
  onSelect: (filtro: PrioridadFiltro) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Filtrar pipeline"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 hidden h-screen max-h-none w-screen max-w-none items-end justify-center bg-transparent p-0 open:flex backdrop:bg-black/50 md:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-card-anim w-full rounded-t-xl border border-border bg-surface pb-6 shadow-lg md:w-[380px] md:rounded-lg"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-text-primary">
            Filtrar pipeline
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-text-tertiary"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {OPCIONES.map(({ key, label, desc }) => {
          const active = current === key;
          const prio = key !== "todas" ? PRIORITY_STYLES[key] : null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelect(key);
                onClose();
              }}
              className={`flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[13px] text-left ${
                active ? "bg-primary-50" : ""
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-primary-600 bg-primary-600" : "border-border"
                }`}
              >
                {active ? <span className="h-[7px] w-[7px] rounded-full bg-white" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[15px] font-medium text-text-primary">
                    {label}
                  </span>
                  {prio ? (
                    <span
                      className="rounded-full px-[7px] py-[2px] text-[11px] font-medium uppercase tracking-wide"
                      style={{ background: prio.bg, color: prio.text }}
                    >
                      {prio.label}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-text-tertiary">
                  {desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </dialog>
  );
}
