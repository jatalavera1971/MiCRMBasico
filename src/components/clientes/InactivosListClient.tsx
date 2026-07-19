"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { CheckCircle2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { InactiveClienteRow, type ClienteInactivo } from "./InactiveClienteRow";

// JOS-26: límite de renderizado, no de datos — duplicado a propósito aquí, no
// importado de convex/model/clientes.ts (un Client Component no debe importar
// del paquete de funciones de Convex). Mismo criterio que
// PipelineBoardClient.tsx. La query sigue leyendo TODOS los clientes
// inactivos (ver comentario en convex/model/clientes.ts); esto solo acota
// cuántas filas se pintan en el DOM.
const CLIENTES_INACTIVOS_CAP = 500;

export function InactivosListClient({
  clientesIniciales,
}: {
  clientesIniciales: ClienteInactivo[];
}) {
  // JOS-26 (auditoría del plan): el estado guarda SIEMPRE la lista completa,
  // nunca un slice ya recortado — si se guardara solo el slice de 500 y se
  // reactivaran esas 500 filas, el EmptyState aparecería aunque quedaran
  // inactivos reales ocultos por el cap (falso vacío). El slice de
  // renderizado se recalcula en cada render a partir de esta lista completa.
  const [clientes, setClientes] = useState(clientesIniciales);
  const [confirmTarget, setConfirmTarget] = useState<ClienteInactivo | null>(
    null,
  );
  const [reactivandoId, setReactivandoId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const reactivar = useMutation(api.clientes.reactivar);

  const visibles = clientes.slice(0, CLIENTES_INACTIVOS_CAP);

  async function handleConfirmReactivar() {
    const target = confirmTarget;
    if (!target || reactivandoId) return;
    setConfirmTarget(null);
    setReactivandoId(target._id);
    try {
      await reactivar({ clienteId: target._id });
      setClientes((prev) => prev.filter((c) => c._id !== target._id));
      setToast(`${target.nombre} marcado como activo`);
    } catch {
      // El backend rechaza reactivar si el cliente ya no es inactivo (p. ej.
      // alguien registró una interacción mientras el diálogo estaba abierto)
      // — la fila sigue visible localmente, así que el copy pide recargar.
      setToast(
        "No se pudo reactivar — puede que ya no esté inactivo. Recarga la página.",
      );
    } finally {
      setReactivandoId(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-text-primary">
        Clientes inactivos
      </h1>
      <p className="mt-1 text-sm text-text-tertiary">
        Sin contacto en +7 días · ordenados por urgencia
      </p>

      {clientes.length > CLIENTES_INACTIVOS_CAP ? (
        <p className="mt-2 text-xs text-text-tertiary">
          Mostrando hasta {CLIENTES_INACTIVOS_CAP} clientes
        </p>
      ) : null}

      {clientes.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<CheckCircle2 className="h-6 w-6 text-primary-600" />}
            title="Sin clientes inactivos"
            description="Todos los clientes están activos"
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {visibles.map((c) => (
            <InactiveClienteRow
              key={c._id}
              cliente={c}
              reactivando={reactivandoId === c._id}
              onReactivarClick={setConfirmTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        title={`¿Reactivar a ${confirmTarget?.nombre}?`}
        description="El cliente saldrá de la lista de inactivos. Asegúrate de registrar una interacción o añadir un recordatorio."
        confirmLabel="Sí, reactivar cliente"
        onConfirm={handleConfirmReactivar}
        onCancel={() => setConfirmTarget(null)}
      />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
