"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cambiarPasswordAction } from "@/components/auth/actions";
import { AuthInput } from "@/components/auth/AuthInput";
import { FormField } from "@/components/ui/FormField";

const PASSWORD_MIN = 8;
// Mismo tope que PASSWORD_MAX en convex/model/auth.ts — evita que el usuario
// escriba (o pegue) algo que el servidor va a rechazar de todos modos
// (auditoría del código, ronda 1).
const PASSWORD_MAX = 200;

function CampoPassword({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <FormField label={label} required>
      <AuthInput
        type={mostrar ? "text" : "password"}
        value={value}
        disabled={disabled}
        maxLength={PASSWORD_MAX}
        onChange={(e) => onChange(e.target.value)}
        rightElement={
          <button
            type="button"
            aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setMostrar((v) => !v)}
            className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-text-tertiary"
          >
            {mostrar ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        }
      />
    </FormField>
  );
}

// JOS-63 (Perfil): mismo esqueleto de sheet que EditarNombreSheet/
// RecordatorioSheet. "Las contraseñas no coinciden" es la ÚNICA validación
// exclusivamente cliente (auditoría del plan) — el servidor nunca recibe el
// campo "repetir", solo passwordActual/passwordNueva. El mínimo de 8
// caracteres también se comprueba aquí para feedback inmediato, pero
// cambiarPasswordAction/cambiarPassword lo vuelven a exigir server-side.
export function CambiarPasswordSheet({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setPasswordActual("");
      setPasswordNueva("");
      setRepetirPassword("");
      setError(null);
      setGuardando(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function requestClose() {
    if (guardando) return;
    onClose();
  }

  const puedeEnviar =
    passwordActual.length > 0 && passwordNueva.length > 0 && repetirPassword.length > 0;

  async function handleSubmit() {
    if (!puedeEnviar || guardando) return;
    setError(null);

    if (passwordNueva.length < PASSWORD_MIN) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (passwordNueva !== repetirPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setGuardando(true);
    try {
      const result = await cambiarPasswordAction({ passwordActual, passwordNueva });
      if (!result.ok) {
        setError(result.error);
        setGuardando(false);
        return;
      }
      onSaved();
    } catch {
      setError("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Cambiar contraseña"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="m-0 hidden h-screen max-h-none w-screen max-w-none items-end justify-center bg-transparent p-0 open:flex backdrop:bg-black/50 md:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-card-anim w-full rounded-t-xl border border-border bg-surface pb-5 shadow-lg md:w-[420px] md:rounded-lg"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-text-primary">Cambiar contraseña</h2>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={guardando}
            onClick={requestClose}
            className="flex h-8 w-8 items-center justify-center text-text-tertiary disabled:opacity-40"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-5">
          {error ? (
            <p className="pb-3 text-sm" style={{ color: "var(--color-error-text)" }}>
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 pb-4">
            <CampoPassword
              label="Contraseña actual"
              value={passwordActual}
              onChange={setPasswordActual}
              disabled={guardando}
            />
            <CampoPassword
              label="Nueva contraseña"
              value={passwordNueva}
              onChange={setPasswordNueva}
              disabled={guardando}
            />
            <CampoPassword
              label="Repetir nueva contraseña"
              value={repetirPassword}
              onChange={setRepetirPassword}
              disabled={guardando}
            />
          </div>

          <button
            type="button"
            disabled={!puedeEnviar || guardando}
            onClick={handleSubmit}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar contraseña"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
