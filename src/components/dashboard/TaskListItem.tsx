import Link from "next/link";
import clsx from "clsx";
import { formatDateLabel } from "@/lib/dates";

export type Tarea = {
  recordatorioId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmpresa?: string;
  motivo: string;
  fecha: string;
  overdue: boolean;
  diasVencido: number;
};

export function TaskListItem({
  tarea,
  onMarkDone,
  pending,
}: {
  tarea: Tarea;
  onMarkDone: () => void;
  pending: boolean;
}) {
  const subtitulo = tarea.clienteEmpresa
    ? `${tarea.clienteNombre} · ${tarea.clienteEmpresa}`
    : tarea.clienteNombre;

  return (
    <div
      className={clsx(
        "flex items-start justify-between gap-3 border-b border-border-subtle p-4",
        tarea.overdue ? "bg-risk-bg" : "bg-surface",
      )}
    >
      <Link
        href={`/clientes/${encodeURIComponent(tarea.clienteId)}`}
        className="min-w-0 flex-1"
      >
        <p className="truncate text-sm font-semibold text-text-primary">
          {tarea.motivo}
        </p>
        <p className="truncate text-xs text-text-secondary">{subtitulo}</p>
        <p
          className={clsx(
            "mt-1 text-xs",
            tarea.overdue ? "text-red-600" : "text-text-tertiary",
          )}
        >
          {formatDateLabel(tarea.overdue, tarea.diasVencido)}
        </p>
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMarkDone();
        }}
        className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-primary-600 disabled:opacity-50"
      >
        Hecho
      </button>
    </div>
  );
}
