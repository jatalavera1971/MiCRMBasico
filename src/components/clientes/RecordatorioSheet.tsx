"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Field, getInputClassName } from "./ClientFormFields";
import { hoyFechaISO, sumarDiasFechaISO } from "@/lib/dates";

const MOTIVO_MAX = 200;

const ATAJOS = [
  { label: "Hoy", dias: 0 },
  { label: "Mañana", dias: 1 },
  { label: "En 3 días", dias: 3 },
  { label: "En 1 semana", dias: 7 },
] as const;

export type RecordatorioEditable = {
  _id: Id<"recordatorios">;
  fecha: string;
  motivo: string;
};

// JOS-22: bottom sheet único para crear y editar un recordatorio manual — el
// modo lo determina si se pasa `recordatorio` (editar, precarga fecha/motivo)
// o no (crear, por defecto "hoy" + motivo vacío). `clienteId` es una prop
// propia, siempre la del cliente de la ficha actualmente abierta — nunca se
// deriva de `recordatorio` (que a propósito no lleva cliente_id en su tipo),
// para no arriesgar un cliente stale si el sheet cambiara de recordatorio
// sin desmontarse.
export function RecordatorioSheet({
  open,
  clienteId,
  recordatorio,
  onClose,
  onSaved,
}: {
  open: boolean;
  clienteId: Id<"clientes">;
  recordatorio: RecordatorioEditable | null;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const crearRecordatorio = useMutation(api.recordatorios.crearRecordatorio);
  const actualizarRecordatorio = useMutation(
    api.recordatorios.actualizarRecordatorio,
  );

  const [fecha, setFecha] = useState(hoyFechaISO());
  const [motivo, setMotivo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editando = recordatorio !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setFecha(recordatorio?.fecha ?? hoyFechaISO());
      setMotivo(recordatorio?.motivo ?? "");
      setError(null);
      setGuardando(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, recordatorio]);

  function requestClose() {
    if (guardando) return;
    onClose();
  }

  async function handleSubmit() {
    if (!motivo.trim() || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      if (editando) {
        await actualizarRecordatorio({
          recordatorioId: recordatorio._id,
          clienteId,
          fecha,
          motivo,
        });
        onSaved("Recordatorio actualizado");
      } else {
        await crearRecordatorio({ clienteId, fecha, motivo });
        onSaved("Recordatorio creado");
      }
    } catch (err) {
      const mensaje =
        err instanceof ConvexError
          ? String(err.data)
          : "No se pudo guardar el recordatorio. Inténtalo de nuevo.";
      setError(mensaje);
      setGuardando(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={editando ? "Editar recordatorio" : "Añadir recordatorio"}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="m-0 hidden h-screen max-h-none w-screen max-w-none items-end justify-center bg-transparent p-0 open:flex backdrop:bg-black/50 md:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-card-anim w-full rounded-t-xl border border-border bg-surface pb-5 shadow-lg md:w-[420px] md:rounded-lg"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-text-primary">
            {editando ? "Editar recordatorio" : "Añadir recordatorio"}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={guardando}
            onClick={requestClose}
            className="flex h-8 w-8 items-center justify-center text-text-tertiary disabled:opacity-40"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-5">
          {error ? (
            <p
              className="pb-3 text-sm"
              style={{ color: "var(--color-error-text)" }}
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 pb-4">
            <Field label="Fecha" required>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {ATAJOS.map(({ label, dias }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFecha(sumarDiasFechaISO(dias))}
                    className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-text-secondary"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={getInputClassName(false)}
              />
            </Field>

            <Field label="Motivo" required>
              <input
                type="text"
                maxLength={MOTIVO_MAX}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="p. ej. Llamar para confirmar presupuesto"
                className={getInputClassName(false)}
              />
            </Field>
          </div>

          <button
            type="button"
            disabled={!motivo.trim() || guardando}
            onClick={handleSubmit}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando
              ? "Guardando…"
              : editando
                ? "Guardar cambios"
                : "Añadir recordatorio"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
