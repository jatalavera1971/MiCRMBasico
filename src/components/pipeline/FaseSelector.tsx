"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { MotivoPerdidaDialog } from "./MotivoPerdidaDialog";
import { FASES_PIPELINE_SELECCIONABLES, FASE_PIPELINE_LABEL, type FasePipeline, type MotivoPerdida } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Selector de fase reutilizado en P3 (Ficha) y P6 (Pipeline) — JOS-11/JOS-14.
 * "Inactivo" no aparece como opción: la asigna el sistema (JOS-25).
 */
export function FaseSelector({ clienteId, faseActual }: { clienteId: Id<"clientes">; faseActual: FasePipeline }) {
  const cambiarFase = useMutation(api.clientes.cambiarFase);
  const [pendiente, setPendiente] = useState<FasePipeline | null>(null);

  async function elegir(fase: FasePipeline) {
    if (fase === faseActual) return;
    if (fase === "perdido") {
      setPendiente(fase);
      return;
    }
    await cambiarFase({ id: clienteId, fasePipeline: fase });
  }

  async function confirmarPerdido(motivoPerdida: MotivoPerdida, motivoPerdidaNotas?: string) {
    await cambiarFase({ id: clienteId, fasePipeline: "perdido", motivoPerdida, motivoPerdidaNotas });
    setPendiente(null);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {FASES_PIPELINE_SELECCIONABLES.map((fase) => (
          <button
            key={fase}
            type="button"
            onClick={() => elegir(fase)}
            className={cn(
              "rounded-pill border px-3 py-1.5 text-body-sm-strong",
              fase === faseActual
                ? "border-primary bg-primary text-primary-on"
                : fase === "perdido"
                  ? "border-error-border bg-error-bg text-error-text"
                  : "border-border text-ink-secondary",
            )}
          >
            {FASE_PIPELINE_LABEL[fase]}
          </button>
        ))}
      </div>

      <MotivoPerdidaDialog
        open={pendiente === "perdido"}
        onClose={() => setPendiente(null)}
        onConfirm={confirmarPerdido}
      />
    </>
  );
}
