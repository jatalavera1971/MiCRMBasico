import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { CANAL_LABELS, FASE_LABELS, type CanalPreferido, type Fase } from "@/lib/clienteLabels";
import { PRIORITY_STYLES, type Prioridad } from "./priorityStyles";

export type ClienteListado = {
  _id: Id<"clientes">;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  canal_preferido?: CanalPreferido;
  fase: Fase;
  prioridad: Prioridad;
  fecha_ultimo_contacto?: number;
};

function getInitials(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).slice(0, 2);
  return palabras.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function ClienteRow({ cliente }: { cliente: ClienteListado }) {
  const prioridad = PRIORITY_STYLES[cliente.prioridad];

  return (
    <Link
      href={`/clientes/${encodeURIComponent(cliente._id)}`}
      className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5 last:border-b-0"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
        {getInitials(cliente.nombre)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className="shrink-0 rounded-full px-[7px] py-[2px] text-[11px] font-medium uppercase tracking-wide"
            style={{ background: prioridad.bg, color: prioridad.text }}
          >
            {prioridad.label}
          </span>
          <span className="truncate text-sm font-semibold text-text-primary">
            {cliente.nombre}
          </span>
        </div>
        <p className="truncate text-xs text-text-tertiary">
          {cliente.empresa ?? "sin empresa"}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-[3px]">
        <span className="text-xs font-medium text-text-secondary">
          {cliente.canal_preferido ? CANAL_LABELS[cliente.canal_preferido] : "—"}
        </span>
        <span className="text-[11px] text-text-tertiary">
          {FASE_LABELS[cliente.fase]}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
    </Link>
  );
}
