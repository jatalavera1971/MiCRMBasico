"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type RecordatorioExistente = { _id: Id<"recordatorios">; fecha: number; motivo: string };

/**
 * F9 · Recordatorio (crear/editar) — bottom sheet independiente lanzado
 * desde P3, sin ruta propia (PRD sección 8).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/F9 · Recordatorio.dc.html
 * TODO: los chips rápidos (Hoy / Mañana / En 3 días / En 1 semana) del
 * diseño — de momento solo el date-time picker nativo.
 */
export function RecordatorioFormSheet({
  open,
  onClose,
  clienteId,
  recordatorio,
}: {
  open: boolean;
  onClose: () => void;
  clienteId: Id<"clientes">;
  recordatorio?: RecordatorioExistente;
}) {
  const crear = useMutation(api.recordatorios.create);
  const actualizar = useMutation(api.recordatorios.update);
  const eliminar = useMutation(api.recordatorios.remove);

  const [motivo, setMotivo] = useState(recordatorio?.motivo ?? "");
  const [fecha, setFecha] = useState(
    recordatorio ? new Date(recordatorio.fecha).toISOString().slice(0, 16) : "",
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fechaMs = new Date(fecha).getTime();
      if (recordatorio) {
        await actualizar({ id: recordatorio._id, fecha: fechaMs, motivo });
      } else {
        await crear({ clienteId, fecha: fechaMs, motivo });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={recordatorio ? "Editar recordatorio" : "Nuevo recordatorio"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="¿Qué tienes que hacer?"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="¿Cuándo?"
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          {recordatorio ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={async () => {
                await eliminar({ id: recordatorio._id });
                onClose();
              }}
            >
              Eliminar recordatorio
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || !motivo || !fecha}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </Sheet>
  );
}
