"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { crearInteraccionAction } from "@/lib/actions/interacciones";
import { Field, getInputClassName } from "./ClientFormFields";
import { InteractionTypeSelector } from "./InteractionTypeSelector";
import type { TipoInteraccion } from "@/lib/clienteLabels";
import { fechaInputAEpoch, formatFechaCorta, hoyFechaISO } from "@/lib/dates";

const NOTAS_MAX = 2000;
const PROXIMO_PASO_TEXTO_MAX = 200;

// JOS-18 (P5): bottom sheet de registrar interacción. Los límites de
// longitud/fecha del formulario son solo UX (maxLength/max) — la validación
// real vive en servidor (convex/model/interacciones.ts:validarDatosInteraccion),
// nunca se confía solo en las restricciones del input.
export function RegisterInteractionSheet({
  open,
  clienteId,
  onClose,
  onSaved,
}: {
  open: boolean;
  clienteId: Id<"clientes">;
  onClose: () => void;
  onSaved: (mensaje: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [tipo, setTipo] = useState<TipoInteraccion>("llamada");
  const [notas, setNotas] = useState("");
  const [fecha, setFecha] = useState(hoyFechaISO());
  const [proximoPasoTexto, setProximoPasoTexto] = useState("");
  const [proximoPasoFecha, setProximoPasoFecha] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setTipo("llamada");
      setNotas("");
      setFecha(hoyFechaISO());
      setProximoPasoTexto("");
      setProximoPasoFecha("");
      setError(null);
      // Bug real (revisión 16 jul 2026): tras un guardado con éxito, el
      // padre cierra el sheet (onSaved) pero `guardando` nunca volvía a
      // `false` aquí — al reabrir, el botón se quedaba en "Guardando…"
      // deshabilitado para siempre.
      setGuardando(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function requestClose() {
    if (guardando) return;
    onClose();
  }

  async function handleSubmit() {
    if (!notas.trim() || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      const resultado = await crearInteraccionAction({
        clienteId,
        tipo,
        notas,
        fecha: fechaInputAEpoch(fecha),
        proximoPasoTexto: proximoPasoTexto || undefined,
        proximoPasoFecha: proximoPasoFecha || undefined,
      });
      if (!resultado.ok) {
        setError(resultado.error);
        setGuardando(false);
        return;
      }
      const mensaje =
        resultado.recordatorioCreado && resultado.recordatorioFecha
          ? `Recordatorio creado para el ${formatFechaCorta(resultado.recordatorioFecha)}`
          : "Interacción registrada";
      onSaved(mensaje);
    } catch {
      setError("No se pudo registrar la interacción. Inténtalo de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Registrar interacción"
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
        className="dialog-card-anim flex max-h-[90vh] w-full flex-col rounded-t-xl border border-border bg-surface shadow-lg md:w-[440px] md:rounded-lg"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-text-primary">
            Registrar interacción
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

        <div className="flex-1 overflow-y-auto px-5 pb-2">
          {error ? (
            <p
              className="pb-3 text-sm"
              style={{ color: "var(--color-error-text)" }}
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 pb-4">
            <Field label="Tipo de contacto">
              <InteractionTypeSelector value={tipo} onChange={setTipo} />
            </Field>

            <Field label="¿Qué ha pasado?" required>
              <textarea
                autoFocus
                rows={4}
                maxLength={NOTAS_MAX}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Resumen de la conversación…"
                className={`${getInputClassName(false)} resize-none`}
              />
            </Field>

            <Field label="Fecha" required>
              <input
                type="date"
                value={fecha}
                max={hoyFechaISO()}
                onChange={(e) => setFecha(e.target.value)}
                className={getInputClassName(false)}
              />
            </Field>

            <Field label="Próximo paso — qué hay que hacer (opcional)">
              <input
                type="text"
                maxLength={PROXIMO_PASO_TEXTO_MAX}
                value={proximoPasoTexto}
                onChange={(e) => setProximoPasoTexto(e.target.value)}
                placeholder="p. ej. Llamar para confirmar presupuesto"
                className={getInputClassName(false)}
              />
            </Field>

            <Field label="Próximo paso — cuándo (opcional)">
              <input
                type="date"
                value={proximoPasoFecha}
                onChange={(e) => setProximoPasoFecha(e.target.value)}
                className={getInputClassName(false)}
              />
            </Field>
          </div>
        </div>

        <div className="border-t border-border-subtle px-5 py-4">
          <button
            type="button"
            disabled={!notas.trim() || guardando}
            onClick={handleSubmit}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Registrar interacción"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
