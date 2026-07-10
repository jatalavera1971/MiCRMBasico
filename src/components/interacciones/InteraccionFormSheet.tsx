"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TIPOS_INTERACCION, TIPO_INTERACCION_LABEL, type TipoInteraccion } from "@/lib/constants";

/**
 * P5 · Registrar interacción — JOS-18 (F4). Debe poder completarse en <30s.
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/P5 · Registrar Interacción.dc.html
 */
export function InteraccionFormSheet({
  open,
  onClose,
  clienteId,
}: {
  open: boolean;
  onClose: () => void;
  clienteId: Id<"clientes">;
}) {
  const crear = useMutation(api.interacciones.create);

  const [tipo, setTipo] = useState<TipoInteraccion>("llamada");
  const [quePaso, setQuePaso] = useState("");
  const [conProximoPaso, setConProximoPaso] = useState(false);
  const [proximoPaso, setProximoPaso] = useState("");
  const [proximoPasoFecha, setProximoPasoFecha] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await crear({
        clienteId,
        tipo,
        fecha: Date.now(),
        quePaso,
        proximoPaso: conProximoPaso ? proximoPaso : undefined,
        proximoPasoFecha:
          conProximoPaso && proximoPasoFecha ? new Date(proximoPasoFecha).getTime() : undefined,
      });
      setQuePaso("");
      setConProximoPaso(false);
      setProximoPaso("");
      setProximoPasoFecha("");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Registrar interacción">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          {TIPOS_INTERACCION.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={
                "flex-1 rounded-md border py-2.5 text-body-sm " +
                (tipo === t ? "border-primary bg-primary text-primary-on" : "border-border text-ink-secondary")
              }
            >
              {TIPO_INTERACCION_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="que-paso" className="text-label text-ink-secondary">
            ¿Qué pasó?
          </label>
          <textarea
            id="que-paso"
            autoFocus
            required
            value={quePaso}
            onChange={(e) => setQuePaso(e.target.value)}
            rows={4}
            className="rounded-md border border-border bg-surface p-3 text-body-sm outline-none focus:border-2 focus:border-border-brand"
          />
        </div>

        <label className="flex items-center gap-2 text-body-sm">
          <input
            type="checkbox"
            checked={conProximoPaso}
            onChange={(e) => setConProximoPaso(e.target.checked)}
          />
          Programar próximo paso
        </label>

        {conProximoPaso && (
          <>
            <Input label="¿Qué hacer?" value={proximoPaso} onChange={(e) => setProximoPaso(e.target.value)} required />
            <Input
              label="¿Cuándo?"
              type="datetime-local"
              value={proximoPasoFecha}
              onChange={(e) => setProximoPasoFecha(e.target.value)}
              required
            />
            <p className="text-caption text-ink-muted">
              Al guardar, se creará un recordatorio automático para esta fecha.
            </p>
          </>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving || !quePaso}>
            Guardar
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
