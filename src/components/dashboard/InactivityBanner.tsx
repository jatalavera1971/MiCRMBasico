import Link from "next/link";
import { AlertTriangle } from "lucide-react";

// F11: solo visible si hay clientes inactivos; si count===0 se omite del DOM
// (no display:none) — la ausencia del banner es ya la información, replicando
// la regla del prototipo de referencia.
export function InactivityBanner({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <Link
      href="/inactivos"
      className="mx-4 flex items-center justify-between gap-3 rounded-lg border border-warning-border bg-warning-bg px-3.5 py-2.5"
    >
      <div className="flex min-w-0 items-center gap-2">
        <AlertTriangle
          className="h-4 w-4 shrink-0 text-[#B45309]"
          strokeWidth={1.5}
        />
        <span className="truncate text-sm text-warning-text">
          {count} {count === 1 ? "cliente lleva" : "clientes llevan"} más de 7
          días sin contacto
        </span>
      </div>
      <span className="shrink-0 text-sm font-medium text-[#B45309]">
        Ver →
      </span>
    </Link>
  );
}
