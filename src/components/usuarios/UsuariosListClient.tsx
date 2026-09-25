"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { desactivarUsuarioAction, reactivarUsuarioAction } from "@/lib/actions/usuarios";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { UsuarioRow, type UsuarioResumen } from "./UsuarioRow";
import { InactiveUsuarioRow } from "./InactiveUsuarioRow";
import { UsuarioSheet } from "./UsuarioSheet";

function porNombre(a: UsuarioResumen, b: UsuarioResumen) {
  return a.nombreCompleto.localeCompare(b.nombreCompleto, "es");
}

type SheetState = { modo: "crear" } | { modo: "editar"; usuario: UsuarioResumen } | null;
type ConfirmState =
  | { tipo: "desactivar"; usuario: UsuarioResumen }
  | { tipo: "reactivar"; usuario: UsuarioResumen }
  | null;

// JOS-62 (P9): pantalla de administración de usuarios, solo para rol "duena"
// (guard real en page.tsx). Estado local mutado tras cada acción, sin
// recargar — crear/editar usan el UsuarioResumen que devuelve el propio
// servidor (nunca reconstruido del formulario: el servidor es la única
// fuente de verdad de cómo quedó normalizado el email/nombre).
export function UsuariosListClient({
  activosIniciales,
  inactivosIniciales,
  usuarioActualId,
}: {
  activosIniciales: UsuarioResumen[];
  inactivosIniciales: UsuarioResumen[];
  usuarioActualId: Id<"usuarios">;
}) {
  const router = useRouter();

  const [activos, setActivos] = useState(activosIniciales);
  const [inactivos, setInactivos] = useState(inactivosIniciales);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [confirmAccion, setConfirmAccion] = useState<ConfirmState>(null);
  // Reentrada: ConfirmDialog no tiene guard propio (confirmado leyendo el
  // componente) — mismo patrón ya probado en InactivosListClient.tsx.
  const [procesandoId, setProcesandoId] = useState<Id<"usuarios"> | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleVolver() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/perfil"); // único punto de entrada real a esta pantalla
    }
  }

  function handleSaved(usuario: UsuarioResumen) {
    const esEdicion = activos.some((u) => u._id === usuario._id);
    setActivos((prev) => {
      const siguiente = esEdicion
        ? prev.map((u) => (u._id === usuario._id ? usuario : u))
        : [...prev, usuario];
      return siguiente.sort(porNombre);
    });
    setSheet(null);
    setToast(esEdicion ? `${usuario.nombreCompleto} actualizado` : `${usuario.nombreCompleto} añadido`);
  }

  async function handleConfirmAccion() {
    if (!confirmAccion) return;
    const { tipo, usuario } = confirmAccion;
    setConfirmAccion(null);
    setProcesandoId(usuario._id);
    try {
      const result =
        tipo === "desactivar"
          ? await desactivarUsuarioAction({ usuarioId: usuario._id })
          : await reactivarUsuarioAction({ usuarioId: usuario._id });
      if (!result.ok) {
        setToast(result.error);
        return;
      }
      if (tipo === "desactivar") {
        setActivos((prev) => prev.filter((u) => u._id !== usuario._id));
        setInactivos((prev) =>
          [...prev, { ...usuario, estado: "inactivo" as const }].sort(porNombre),
        );
        setToast(`${usuario.nombreCompleto} desactivado`);
      } else {
        setInactivos((prev) => prev.filter((u) => u._id !== usuario._id));
        setActivos((prev) =>
          [...prev, { ...usuario, estado: "activo" as const }].sort(porNombre),
        );
        setToast(`${usuario.nombreCompleto} reactivado`);
      }
    } finally {
      setProcesandoId(null);
    }
  }

  return (
    <div className="pb-6">
      <div className="flex h-[52px] items-center gap-2 border-b border-border-subtle bg-surface px-3">
        <button
          type="button"
          aria-label="Volver"
          onClick={handleVolver}
          className="flex h-11 w-11 items-center justify-center text-primary-600"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <h1 className="flex-1 text-base font-bold text-text-primary">Usuarios y roles</h1>
        <button
          type="button"
          onClick={() => setSheet({ modo: "crear" })}
          className="flex h-[34px] items-center gap-1.5 rounded-md bg-primary-600 px-3.5 text-[13px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Añadir
        </button>
      </div>

      <h2 className="px-4 pb-1.5 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
        Activos · {activos.length}
      </h2>
      <div className="border-y border-border-subtle bg-surface">
        {activos.map((u) => (
          <UsuarioRow
            key={u._id}
            usuario={u}
            esUsuarioActual={u._id === usuarioActualId}
            procesando={procesandoId === u._id}
            onEditarClick={(usuario) => setSheet({ modo: "editar", usuario })}
            onDesactivarClick={(usuario) => setConfirmAccion({ tipo: "desactivar", usuario })}
          />
        ))}
      </div>

      {inactivos.length > 0 ? (
        <details className="mt-2">
          <summary className="cursor-pointer px-4 pb-1.5 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Inactivos · {inactivos.length}
          </summary>
          <div className="border-y border-border-subtle bg-surface">
            {inactivos.map((u) => (
              <InactiveUsuarioRow
                key={u._id}
                usuario={u}
                procesando={procesandoId === u._id}
                onReactivarClick={(usuario) => setConfirmAccion({ tipo: "reactivar", usuario })}
              />
            ))}
          </div>
        </details>
      ) : null}

      <div className="m-4 flex flex-col items-center gap-2.5 rounded-xl border border-border bg-surface px-5 py-5 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border-subtle">
          <UserPlus className="h-5 w-5 text-text-tertiary" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-medium text-text-secondary">Invitar a un compañero</span>
        <span className="max-w-[200px] text-[13px] text-text-tertiary">
          Añade más miembros a tu equipo de ventas
        </span>
        <button
          type="button"
          onClick={() => setSheet({ modo: "crear" })}
          className="mt-1 flex items-center gap-1.5 rounded-md border px-3 py-2 text-[13px] font-medium text-primary-600"
          style={{ background: "var(--color-primary-50)", borderColor: "var(--color-border)" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Enviar invitación
        </button>
      </div>

      <UsuarioSheet
        open={sheet !== null}
        modo={sheet?.modo ?? "crear"}
        usuario={sheet?.modo === "editar" ? sheet.usuario : null}
        usuarioActualId={usuarioActualId}
        onClose={() => setSheet(null)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={confirmAccion !== null}
        title={
          confirmAccion
            ? `¿${confirmAccion.tipo === "desactivar" ? "Desactivar" : "Reactivar"} a ${confirmAccion.usuario.nombreCompleto}?`
            : ""
        }
        description={
          confirmAccion?.tipo === "desactivar"
            ? "Perderá acceso a la aplicación de inmediato y se cerrarán todas sus sesiones activas. Podrás reactivarlo cuando quieras."
            : "Recuperará el acceso a la aplicación con su contraseña actual."
        }
        confirmLabel={
          confirmAccion?.tipo === "desactivar" ? "Sí, desactivar usuario" : "Sí, reactivar usuario"
        }
        onConfirm={handleConfirmAccion}
        onCancel={() => setConfirmAccion(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
