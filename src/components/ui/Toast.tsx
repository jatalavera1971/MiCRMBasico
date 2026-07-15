"use client";

import { useEffect } from "react";

// JOS-11/JOS-44: feedback transitorio simple (canal preferido, prioridad,
// compartir ficha, eliminar cliente, guardar edición). Sin Context/Provider:
// se monta localmente en cada pantalla que lo necesite.
export function Toast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[76px] z-50 flex justify-center px-4 md:bottom-6"
    >
      <div className="pointer-events-auto rounded-full bg-text-primary px-4 py-2 text-sm font-medium text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
