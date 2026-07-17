"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CalendarPlus, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import { getInitials } from "./ClienteRow";

// JOS-11/JOS-18/JOS-22: menú "···" de la ficha. "Registrar interacción"
// (JOS-18, 16 jul 2026) y "Añadir recordatorio" (JOS-22, 17 jul 2026) se
// añadieron cuando sus tareas respectivas se construyeron — hasta entonces
// quedaban fuera a propósito porque ninguna existía todavía.
export function ClientMenuSheet({
  open,
  nombre,
  empresa,
  editHref,
  onClose,
  onRegisterInteraction,
  onAddRecordatorio,
  onShare,
  onDeleteRequest,
}: {
  open: boolean;
  nombre: string;
  empresa?: string;
  editHref: string;
  onClose: () => void;
  onRegisterInteraction: () => void;
  onAddRecordatorio: () => void;
  onShare: () => void;
  onDeleteRequest: () => void;
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
      aria-label="Más opciones"
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
        <div className="flex items-center gap-3 px-5 pb-1 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
            {getInitials(nombre)}
          </span>
          <div className="min-w-0">
            <span className="block truncate text-[15px] font-bold text-text-primary">
              {nombre}
            </span>
            <span className="block truncate text-xs text-text-tertiary">
              {empresa ?? "sin empresa"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRegisterInteraction}
          className="flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[15px] text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-border-subtle">
            <Plus className="h-[17px] w-[17px] text-text-secondary" strokeWidth={1.5} />
          </span>
          <span className="text-[15px] font-medium text-text-primary">
            Registrar interacción
          </span>
        </button>

        <button
          type="button"
          onClick={onAddRecordatorio}
          className="flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[15px] text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-border-subtle">
            <CalendarPlus className="h-[17px] w-[17px] text-text-secondary" strokeWidth={1.5} />
          </span>
          <span className="text-[15px] font-medium text-text-primary">
            Añadir recordatorio
          </span>
        </button>

        <Link
          href={editHref}
          onClick={onClose}
          className="flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[15px] text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-border-subtle">
            <Pencil className="h-[17px] w-[17px] text-text-secondary" strokeWidth={1.5} />
          </span>
          <span className="text-[15px] font-medium text-text-primary">Editar cliente</span>
        </Link>

        <button
          type="button"
          onClick={onShare}
          className="flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[15px] text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-border-subtle">
            <Share2 className="h-[17px] w-[17px] text-text-secondary" strokeWidth={1.5} />
          </span>
          <span className="text-[15px] font-medium text-text-primary">Compartir ficha</span>
        </button>

        <button
          type="button"
          onClick={onDeleteRequest}
          className="flex w-full items-center gap-3.5 border-t border-border-subtle px-5 py-[15px] text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-risk-bg">
            <Trash2
              className="h-[17px] w-[17px]"
              style={{ color: "var(--color-error-text)" }}
              strokeWidth={1.5}
            />
          </span>
          <span className="text-[15px] font-medium" style={{ color: "var(--color-error-text)" }}>
            Eliminar cliente
          </span>
        </button>
      </div>
    </dialog>
  );
}
