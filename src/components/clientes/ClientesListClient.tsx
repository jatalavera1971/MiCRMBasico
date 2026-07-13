"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewClientDialog } from "./NewClientDialog";
import { PRIORITY_STYLES, type Prioridad } from "./priorityStyles";

type ClienteResumen = {
  _id: Id<"clientes">;
  nombre: string;
  email: string;
  prioridad: Prioridad;
};

export function ClientesListClient({
  clientesIniciales,
}: {
  clientesIniciales: ClienteResumen[];
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreated(id: Id<"clientes">) {
    setDialogOpen(false);
    router.push(`/clientes/${encodeURIComponent(id)}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Clientes</h1>
        <button
          type="button"
          aria-label="Nuevo cliente"
          onClick={() => setDialogOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <p className="mt-2 text-sm text-text-tertiary">
        P2 (Lista de clientes) — fuera de alcance de esta pantalla, solo
        destino de navegación y punto de entrada al alta de cliente (JOS-12).
      </p>

      {clientesIniciales.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Users className="h-6 w-6 text-primary-600" />}
            title="Aún no tienes clientes"
            description="Pulsa el botón + para dar de alta el primero."
          />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border-subtle">
          {clientesIniciales.map((c) => {
            const style = PRIORITY_STYLES[c.prioridad];
            return (
              <li key={c._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {c.nombre}
                  </p>
                  <p className="text-xs text-text-tertiary">{c.email}</p>
                </div>
                <span
                  className="rounded-full px-2 py-1 text-xs font-semibold"
                  style={{ background: style.bg, color: style.text }}
                >
                  {style.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <NewClientDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
