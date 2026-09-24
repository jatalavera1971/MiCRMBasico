"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { actualizarNombrePropioAction } from "@/components/auth/actions";
import { FormField, getInputClassName } from "@/components/ui/FormField";

// JOS-63 (Perfil): mismo esqueleto que RecordatorioSheet.tsx (dialog nativo,
// useEffect sincroniza `open`, bloquea cierre mientras guarda), un único campo.
export function EditarNombreSheet({
  open,
  nombreActual,
  onClose,
  onSaved,
}: {
  open: boolean;
  nombreActual: string;
  onClose: () => void;
  onSaved: (nuevoNombre: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [nombre, setNombre] = useState(nombreActual);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setNombre(nombreActual);
      setError(null);
      setGuardando(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, nombreActual]);

  function requestClose() {
    if (guardando) return;
    onClose();
  }

  async function handleSubmit() {
    if (!nombre.trim() || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      const result = await actualizarNombrePropioAction(nombre);
      if (!result.ok) {
        setError(result.error);
        setGuardando(false);
        return;
      }
      onSaved(nombre.trim());
    } catch {
      setError("No se pudo actualizar el nombre. Inténtalo de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Editar nombre"
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
          <h2 className="text-[17px] font-bold text-text-primary">Editar nombre</h2>
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
            <p className="pb-3 text-sm" style={{ color: "var(--color-error-text)" }}>
              {error}
            </p>
          ) : null}

          <div className="pb-4">
            <FormField label="Nombre" required>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={120}
                className={getInputClassName(false)}
              />
            </FormField>
          </div>

          <button
            type="button"
            disabled={!nombre.trim() || guardando}
            onClick={handleSubmit}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
