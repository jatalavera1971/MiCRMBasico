import { Pencil, UserX } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { ROL_LABELS } from "@/lib/usuarioLabels";

export type UsuarioResumen = {
  _id: Id<"usuarios">;
  nombreCompleto: string;
  email: string;
  rol: "duena" | "comercial";
  estado: "activo" | "inactivo";
};

// Duplicado a propósito, no importado de components/clientes/ClienteRow.tsx
// (mismo criterio que PerfilClient.tsx: Usuarios es una pantalla fundacional
// del dominio de cuentas, no depende del dominio de clientes).
export function getInitials(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).slice(0, 2);
  return palabras.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export const ROL_BADGE_STYLES: Record<"duena" | "comercial", { bg: string; color: string }> = {
  duena: { bg: "var(--color-primary-600)", color: "#FFFFFF" },
  comercial: { bg: "var(--color-border-subtle)", color: "var(--color-role-comercial-text)" },
};

function RolBadge({ rol }: { rol: "duena" | "comercial" }) {
  const style = ROL_BADGE_STYLES[rol];
  return (
    <span
      className="shrink-0 rounded-full px-[9px] py-[3px] text-[11px] font-semibold uppercase tracking-wide"
      style={{ background: style.bg, color: style.color }}
    >
      {ROL_LABELS[rol]}
    </span>
  );
}

// JOS-62 (P9): fila de la lista de usuarios activos. Ambos botones son
// <button type="button"> nativos, NUNCA <div onClick role="button"> — mismo
// hallazgo de auditoría ya corregido en PerfilClient.tsx (role/tabIndex por
// sí solos no activan con Enter/Espacio).
export function UsuarioRow({
  usuario,
  esUsuarioActual,
  procesando,
  onEditarClick,
  onDesactivarClick,
}: {
  usuario: UsuarioResumen;
  esUsuarioActual: boolean;
  procesando: boolean;
  onEditarClick: (usuario: UsuarioResumen) => void;
  onDesactivarClick: (usuario: UsuarioResumen) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
        {getInitials(usuario.nombreCompleto)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-text-primary">
            {usuario.nombreCompleto}
          </span>
          <RolBadge rol={usuario.rol} />
          {esUsuarioActual ? (
            <span className="shrink-0 text-xs text-text-tertiary">(tú)</span>
          ) : null}
        </div>
        <p className="truncate text-xs text-text-tertiary">{usuario.email}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Editar a ${usuario.nombreCompleto}`}
          disabled={procesando}
          onClick={() => onEditarClick(usuario)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary disabled:opacity-40"
        >
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </button>
        {/* Oculto por completo (no solo deshabilitado) en la propia fila —
            evita un botón fantasma que nunca se puede usar, el backend
            (desactivarUsuario) también lo rechaza igual como defensa real. */}
        {esUsuarioActual ? null : (
          <button
            type="button"
            aria-label={`Desactivar a ${usuario.nombreCompleto}`}
            disabled={procesando}
            onClick={() => onDesactivarClick(usuario)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary disabled:opacity-40"
          >
            <UserX className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
