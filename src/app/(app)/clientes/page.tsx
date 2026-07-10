"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Plus, Search } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ClienteFormSheet } from "@/components/clientes/ClienteFormSheet";
import { FASE_PIPELINE_BADGE, FASE_PIPELINE_LABEL, PRIORIDAD_BADGE, PRIORIDAD_LABEL } from "@/lib/constants";

/**
 * P2 · Lista de clientes — JOS-10 (F1 + F2).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Clientes · Lista.dc.html
 */
export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [nuevoAbierto, setNuevoAbierto] = useState(false);
  const clientes = useQuery(api.clientes.list, { busqueda: busqueda || undefined });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-heading-lg">Clientes</h1>
        <button
          type="button"
          onClick={() => setNuevoAbierto(true)}
          aria-label="Nuevo cliente"
          className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-on shadow-card hover:bg-primary-hover"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, empresa, email o teléfono"
          className="h-9 w-full rounded-pill border border-border bg-surface-subtle pl-10 pr-4 text-body-sm outline-none focus:border-border-brand"
        />
      </div>

      {clientes?.length === 0 && (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          {busqueda ? "No encontramos a nadie con ese criterio." : "Aún no tienes clientes · Empieza añadiendo tu primer cliente"}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {clientes?.map((c) => (
          <Link key={c._id} href={`/clientes/${c._id}`}>
            <Card className="flex h-16 items-center gap-3">
              <Avatar nombre={c.nombre} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge colorClassName={PRIORIDAD_BADGE[c.prioridad]}>{PRIORIDAD_LABEL[c.prioridad]}</Badge>
                  <span className="text-body-sm-strong truncate">{c.nombre}</span>
                </div>
                {c.empresa && <p className="text-caption text-ink-muted truncate">{c.empresa}</p>}
              </div>
              <Badge colorClassName={FASE_PIPELINE_BADGE[c.fasePipeline]}>
                {FASE_PIPELINE_LABEL[c.fasePipeline]}
              </Badge>
            </Card>
          </Link>
        ))}
      </div>

      <ClienteFormSheet open={nuevoAbierto} onClose={() => setNuevoAbierto(false)} />
    </div>
  );
}
