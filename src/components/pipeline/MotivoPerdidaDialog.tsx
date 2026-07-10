"use client";

import { useState, type FormEvent } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { MOTIVOS_PERDIDA, MOTIVO_PERDIDA_LABEL, type MotivoPerdida } from "@/lib/constants";

/**
 * F16 · Motivo de pérdida — JOS-64. Diálogo obligatorio al mover un cliente
 * a "Perdido" desde P3 o P6; cancelar no cambia la fase (ver
 * convex/clientes.ts::cambiarFase, que rechaza el cambio sin motivo).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Ficha · Cliente.dc.html,
 * sección "Diálogo · Fase Perdido".
 */
export function MotivoPerdidaDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo: MotivoPerdida, notas?: string) => void | Promise<void>;
}) {
  const [motivo, setMotivo] = useState<MotivoPerdida | null>(null);
  const [notas, setNotas] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!motivo) return;
    await onConfirm(motivo, notas || undefined);
    setMotivo(null);
    setNotas("");
  }

  return (
    <Sheet open={open} onClose={onClose} title="Cambiar fase a Perdido">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-body-sm text-ink-secondary">¿Cuál fue el motivo principal?</p>
        <div className="flex flex-col gap-2">
          {MOTIVOS_PERDIDA.map((m) => (
            <label
              key={m}
              className={
                "flex cursor-pointer items-center gap-3 rounded-md border px-3.5 py-3 " +
                (motivo === m ? "border-primary bg-primary-50" : "border-border")
              }
            >
              <input
                type="radio"
                name="motivo-perdida"
                checked={motivo === m}
                onChange={() => setMotivo(m)}
              />
              <span className="text-body-sm-strong">{MOTIVO_PERDIDA_LABEL[m]}</span>
            </label>
          ))}
        </div>
        {motivo === "otro" && (
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Cuéntanos qué pasó"
            rows={2}
            className="rounded-md border border-border bg-surface p-3 text-body-sm outline-none focus:border-2 focus:border-border-brand"
          />
        )}
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="destructive" disabled={!motivo}>
            Confirmar
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
