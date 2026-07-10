"use client";

import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * design.md → modal / bottom-sheet: overlay + panel centrado (o desde abajo
 * en móvil). Se simplifica a un modal centrado único por ahora — separar en
 * variante bottom-sheet real cuando se construya cada pantalla en detalle.
 * Usado por P4, P5, F9 y el diálogo de motivo de pérdida (F16), todos
 * definidos en el PRD como overlays sobre la pantalla actual, nunca rutas
 * propias.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={cn(
          "flex max-h-[90vh] w-full max-w-[480px] flex-col gap-4 overflow-y-auto rounded-xl bg-surface p-6 shadow-modal",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-heading-md">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-subtle"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
