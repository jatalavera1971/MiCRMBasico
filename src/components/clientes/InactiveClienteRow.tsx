import Link from "next/link";
import type { Id } from "../../../convex/_generated/dataModel";
import { getInitials } from "./ClienteRow";
import { PRIORITY_STYLES, type Prioridad } from "./priorityStyles";

export type ClienteInactivo = {
  _id: Id<"clientes">;
  nombre: string;
  empresa?: string;
  prioridad: Prioridad;
  diasSinContacto: number;
};

// JOS-26: el <Link> envuelve solo el bloque de datos (avatar/nombre/empresa),
// nunca los botones — anidar <button> dentro de <Link>/<a> es HTML inválido y
// puede disparar una navegación accidental al pulsar "Reactivar" (bloqueante
// detectado en la auditoría del plan). "Contactar" es un <Link> hermano, no
// anidado; "Reactivar" es un <button> hermano, fuera de cualquier <Link>.
export function InactiveClienteRow({
  cliente,
  reactivando,
  onReactivarClick,
}: {
  cliente: ClienteInactivo;
  reactivando: boolean;
  onReactivarClick: (cliente: ClienteInactivo) => void;
}) {
  const prioridad = PRIORITY_STYLES[cliente.prioridad];
  const href = `/clientes/${encodeURIComponent(cliente._id)}`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle px-4 py-3.5">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
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
      </Link>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-text-tertiary">
          {cliente.diasSinContacto} día{cliente.diasSinContacto === 1 ? "" : "s"}
        </span>
        <div className="flex gap-2">
          <Link
            href={href}
            className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-secondary"
          >
            Contactar
          </Link>
          <button
            type="button"
            disabled={reactivando}
            onClick={() => onReactivarClick(cliente)}
            className="rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 disabled:opacity-50"
          >
            {reactivando ? "Reactivando…" : "Reactivar"}
          </button>
        </div>
      </div>
    </div>
  );
}
