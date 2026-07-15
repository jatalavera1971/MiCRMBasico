"use client";

import { useEffect, useRef } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  // JOS-11 (15 jul 2026): el <dialog> nativo emite "close" en CUALQUIER cierre,
  // incluido el programático que dispara el useEffect de abajo cuando `open`
  // pasa a false tras un onConfirm exitoso — sin este ref, onCancel se
  // disparaba también en ese caso (espurio). Solo se marca justo antes de
  // llamar a onConfirm; onClose lo consume una vez y no llama a onCancel.
  const confirmedRef = useRef(false);
  const titleId = "confirm-dialog-title";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      confirmRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      className="m-auto w-[min(360px,90vw)] rounded-lg border border-border bg-surface p-0 shadow-md backdrop:bg-black/40"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClose={() => {
        if (confirmedRef.current) {
          confirmedRef.current = false;
          return;
        }
        onCancel();
      }}
    >
      <div className="p-5">
        <h2 id={titleId} className="text-base font-semibold text-text-primary">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-secondary"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => {
              confirmedRef.current = true;
              onConfirm();
            }}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
