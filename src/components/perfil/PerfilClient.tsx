"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { ChevronRight, KeyRound, LogOut, Mail, User, Users } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { logoutAction } from "@/components/auth/actions";
import { ROL_LABELS } from "@/lib/usuarioLabels";
import { Toast } from "@/components/ui/Toast";
import { EditarNombreSheet } from "./EditarNombreSheet";
import { CambiarPasswordSheet } from "./CambiarPasswordSheet";

type Usuario = {
  usuarioId: Id<"usuarios">;
  nombreCompleto: string;
  email: string;
  rol: "duena" | "comercial";
};

// Duplicado a propósito, no importado de components/clientes/ClienteRow.tsx
// (mismo criterio que AuthInput.tsx: Perfil es una pantalla fundacional, no
// depende del dominio de clientes).
function getInitials(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).slice(0, 2);
  return palabras.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function SeccionTitulo({ children }: { children: string }) {
  return (
    <h2 className="px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
      {children}
    </h2>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  onClick,
  href,
  danger,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  value?: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}) {
  const clickable = Boolean(onClick || href);
  const className = `flex w-full items-center gap-3 border-b border-border-subtle px-4 py-3.5 text-left last:border-b-0 ${clickable ? "cursor-pointer" : ""}`;

  const contenido = (
    <>
      <div
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: danger ? "var(--color-risk-bg)" : "var(--color-border-subtle)" }}
      >
        <Icon
          className="h-4 w-4"
          strokeWidth={1.5}
          style={{ color: danger ? "var(--color-error-text)" : "var(--color-text-secondary)" }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {value ? (
          <>
            <span className="text-[11px] text-text-tertiary">{label}</span>
            <span className="truncate text-sm font-medium text-text-primary">{value}</span>
          </>
        ) : (
          <span
            className="text-sm font-medium"
            style={{ color: danger ? "var(--color-error-text)" : "var(--color-text-primary)" }}
          >
            {label}
          </span>
        )}
      </div>
      {clickable && !danger ? (
        <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {contenido}
      </Link>
    );
  }
  if (onClick) {
    // Botón nativo, NO <div role="button" tabIndex={0}> (auditoría del
    // código, ronda 1): role/tabIndex por sí solos dan foco pero no activan
    // con Enter/Espacio — hay que implementarlo a mano, o usar el elemento
    // que ya lo hace de serie. <button> también recupera la accesibilidad
    // que tenía el botón nativo de "Cerrar sesión" antes de este cambio.
    return (
      <button type="button" onClick={onClick} className={className}>
        {contenido}
      </button>
    );
  }
  return <div className={className}>{contenido}</div>;
}

// JOS-63 (P10): layout inspirado en sPerfil() del prototipo (tarjeta de
// identidad + secciones Cuenta/Equipo/Sesión), pero con comportamiento real
// detrás — el prototipo solo lanzaba toasts ("Próximamente") sin lógica.
export function PerfilClient({ usuario }: { usuario: Usuario }) {
  const [nombreCompleto, setNombreCompleto] = useState(usuario.nombreCompleto);
  const [toast, setToast] = useState<string | null>(null);
  const [nombreOpen, setNombreOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="pb-6">
      <div className="flex flex-col items-center gap-1 border-b border-border-subtle bg-surface px-4 py-6">
        <div
          className="mb-1 flex h-16 w-16 items-center justify-center rounded-full text-[22px] font-bold"
          style={{ background: "var(--color-primary-50)", color: "var(--color-primary-600)" }}
        >
          {getInitials(nombreCompleto)}
        </div>
        <span className="text-lg font-bold text-text-primary">{nombreCompleto}</span>
        <span className="text-[13px] text-text-tertiary">{usuario.email}</span>
        <span className="mt-1 rounded-full bg-border-subtle px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          {ROL_LABELS[usuario.rol]}
        </span>
      </div>

      <SeccionTitulo>Cuenta</SeccionTitulo>
      <div className="border-y border-border-subtle bg-surface">
        <Row icon={User} label="Nombre" value={nombreCompleto} onClick={() => setNombreOpen(true)} />
        <Row icon={Mail} label="Correo electrónico" value={usuario.email} />
        <Row icon={KeyRound} label="Cambiar contraseña" onClick={() => setPasswordOpen(true)} />
      </div>

      {usuario.rol === "duena" ? (
        <>
          <SeccionTitulo>Equipo</SeccionTitulo>
          <div className="border-y border-border-subtle bg-surface">
            <Row icon={Users} label="Usuarios y roles" href="/usuarios" />
          </div>
        </>
      ) : null}

      <SeccionTitulo>Sesión</SeccionTitulo>
      <div className="border-y border-border-subtle bg-surface">
        <Row
          icon={LogOut}
          label="Cerrar sesión"
          danger
          onClick={async () => {
            await logoutAction();
            window.location.href = "/";
          }}
        />
      </div>

      <EditarNombreSheet
        open={nombreOpen}
        nombreActual={nombreCompleto}
        onClose={() => setNombreOpen(false)}
        onSaved={(nuevoNombre) => {
          setNombreCompleto(nuevoNombre);
          setNombreOpen(false);
          setToast("Nombre actualizado");
        }}
      />
      <CambiarPasswordSheet
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSaved={() => {
          setPasswordOpen(false);
          setToast("Contraseña actualizada");
        }}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
