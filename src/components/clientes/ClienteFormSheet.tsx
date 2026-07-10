"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  CANALES,
  CANAL_LABEL,
  PRIORIDADES,
  PRIORIDAD_LABEL,
  type Canal,
  type Prioridad,
} from "@/lib/constants";

type ClienteExistente = {
  _id: Id<"clientes">;
  nombre: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  canalPreferido?: Canal;
  prioridad: Prioridad;
  notas?: string;
};

/**
 * P4 · Nuevo cliente / Editar cliente — JOS-12.
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Formulario · Nuevo-Editar Cliente.dc.html
 * Nombre es el único campo obligatorio (PRD sección 9).
 */
export function ClienteFormSheet({
  open,
  onClose,
  cliente,
}: {
  open: boolean;
  onClose: () => void;
  /** Si se pasa, el formulario edita ese cliente; si no, crea uno nuevo. */
  cliente?: ClienteExistente;
}) {
  const router = useRouter();
  const crear = useMutation(api.clientes.create);
  const actualizar = useMutation(api.clientes.update);

  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [empresa, setEmpresa] = useState(cliente?.empresa ?? "");
  const [email, setEmail] = useState(cliente?.email ?? "");
  const [telefono, setTelefono] = useState(cliente?.telefono ?? "");
  const [canalPreferido, setCanalPreferido] = useState<Canal | undefined>(cliente?.canalPreferido);
  const [prioridad, setPrioridad] = useState<Prioridad>(cliente?.prioridad ?? "media");
  const [notas, setNotas] = useState(cliente?.notas ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Añade el nombre del cliente para continuar");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (cliente) {
        await actualizar({
          id: cliente._id,
          nombre,
          empresa: empresa || undefined,
          email: email || undefined,
          telefono: telefono || undefined,
          canalPreferido,
          prioridad,
          notas: notas || undefined,
        });
        onClose();
      } else {
        const id = await crear({
          nombre,
          empresa: empresa || undefined,
          email: email || undefined,
          telefono: telefono || undefined,
          canalPreferido,
          prioridad,
          notas: notas || undefined,
        });
        onClose();
        router.push(`/clientes/${id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={cliente ? "Editar cliente" : "Nuevo cliente"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} error={error ?? undefined} required autoFocus />
        <Input label="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Teléfono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <span className="text-label text-ink-secondary">Canal preferido</span>
          <div className="flex gap-2">
            {CANALES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCanalPreferido(c)}
                className={
                  "rounded-md border px-3 py-1.5 text-body-sm " +
                  (canalPreferido === c
                    ? "border-primary bg-primary text-primary-on"
                    : "border-border text-ink-secondary")
                }
              >
                {CANAL_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-label text-ink-secondary">Prioridad</span>
          <div className="flex gap-2">
            {PRIORIDADES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrioridad(p)}
                className={
                  "rounded-md border px-3 py-1.5 text-body-sm " +
                  (prioridad === p
                    ? "border-primary bg-primary text-primary-on"
                    : "border-border text-ink-secondary")
                }
              >
                {PRIORIDAD_LABEL[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notas" className="text-label text-ink-secondary">
            Notas
          </label>
          <textarea
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            className="rounded-md border border-border bg-surface p-3 text-body-sm outline-none focus:border-2 focus:border-border-brand"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
