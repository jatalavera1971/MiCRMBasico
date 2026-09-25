import { RotateCcw } from "lucide-react";
import { ROL_LABELS } from "@/lib/usuarioLabels";
import { getInitials, ROL_BADGE_STYLES, type UsuarioResumen } from "./UsuarioRow";

// JOS-62 (P9): fila de la sección "Inactivos" — reutiliza UsuarioResumen tal
// cual (la proyección de listarUsuarios es idéntica para activos e
// inactivos, no hay campo derivado que justifique un tipo propio, a
// diferencia de ClienteInactivo en el dominio clientes).
//
// Deliberadamente SIN botón Editar: mientras está inactiva, la cuenta no
// puede iniciar sesión, así que su nombre/rol son irrelevantes hasta que se
// reactive — si Marta necesita corregir algo, reactiva primero y edita
// después desde "Activos". Evita abrir la combinación "editar un usuario
// inactivo", que el ticket no pide.
export function InactiveUsuarioRow({
  usuario,
  procesando,
  onReactivarClick,
}: {
  usuario: UsuarioResumen;
  procesando: boolean;
  onReactivarClick: (usuario: UsuarioResumen) => void;
}) {
  const rolStyle = ROL_BADGE_STYLES[usuario.rol];
  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5 last:border-b-0 opacity-70">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-border-subtle text-xs font-semibold text-text-tertiary">
        {getInitials(usuario.nombreCompleto)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-text-primary">
            {usuario.nombreCompleto}
          </span>
          <span
            className="shrink-0 rounded-full px-[9px] py-[3px] text-[11px] font-semibold uppercase tracking-wide"
            style={{ background: rolStyle.bg, color: rolStyle.color }}
          >
            {ROL_LABELS[usuario.rol]}
          </span>
        </div>
        <p className="truncate text-xs text-text-tertiary">{usuario.email}</p>
      </div>
      <button
        type="button"
        disabled={procesando}
        onClick={() => onReactivarClick(usuario)}
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-text-secondary disabled:opacity-40"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
        Reactivar
      </button>
    </div>
  );
}
