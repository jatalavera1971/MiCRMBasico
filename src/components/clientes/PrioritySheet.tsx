"use client";

import { useEffect, useRef, useState } from "react";
import { PRIORIDADES, PRIORITY_STYLES, type Prioridad } from "./priorityStyles";

// JOS-44: a diferencia del selector de canal preferido (instantáneo), aquí la
// selección requiere confirmar/cancelar explícitamente.
const DESCRIPCIONES: Record<Prioridad, string> = {
  alta: "Seguimiento inmediato requerido",
  media: "Seguimiento planificado esta semana",
  baja: "Sin urgencia, puede esperar",
};

export function PrioritySheet({
  open,
  current,
  saving,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  current: Prioridad;
  saving: boolean;
  onCancel: () => void;
  onConfirm: (prioridad: Prioridad) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Prioridad>(current);
  const titleId = "priority-sheet-title";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setSelected(current);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, current]);

  function requestCancel() {
    if (saving) return;
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        requestCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestCancel();
      }}
      className="m-0 hidden h-screen max-h-none w-screen max-w-none items-end justify-center bg-transparent p-0 open:flex backdrop:bg-black/50 md:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-card-anim w-full rounded-t-xl border border-border bg-surface pb-5 shadow-lg md:w-[420px] md:rounded-lg"
      >
        <h2 id={titleId} className="px-5 pb-2 pt-4 text-[17px] font-bold text-text-primary">
          Cambiar prioridad
        </h2>
        <div>
          {PRIORIDADES.map((key) => {
            const style = PRIORITY_STYLES[key];
            const active = selected === key;
            return (
              <button
                key={key}
                type="button"
                disabled={saving}
                onClick={() => setSelected(key)}
                className={`flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[15px] text-left disabled:opacity-60 ${
                  active ? "bg-primary-50" : "bg-surface"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-primary-600 bg-primary-600" : "border-border"
                  }`}
                >
                  {active ? (
                    <span className="h-[7px] w-[7px] rounded-full bg-white" />
                  ) : null}
                </span>
                <div className="flex-1">
                  <span
                    className="mb-1 inline-block rounded-full px-2 py-[3px] text-[11px] font-medium uppercase tracking-wide"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {style.label}
                  </span>
                  <p className="text-[13px] text-text-secondary">{DESCRIPCIONES[key]}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2.5 px-5">
          <button
            type="button"
            disabled={saving}
            onClick={requestCancel}
            className="flex-1 rounded-md border border-border py-[11px] text-sm font-medium text-text-secondary disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onConfirm(selected)}
            className="flex-1 rounded-md bg-primary-600 py-[11px] text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
