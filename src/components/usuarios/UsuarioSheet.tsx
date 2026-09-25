"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { actualizarUsuarioAction, crearUsuarioAction } from "@/lib/actions/usuarios";
import { AuthInput } from "@/components/auth/AuthInput";
import { FormField, getInputClassName } from "@/components/ui/FormField";
import { ROL_LABELS } from "@/lib/usuarioLabels";
import { ROL_BADGE_STYLES, type UsuarioResumen } from "./UsuarioRow";

const NOMBRE_MAX = 120;
const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200;
// Duplicada a propósito (mismo criterio ya usado en convex/model/usuarios.ts
// y en components/clientes/ClientFormFields.tsx) — no se importa entre
// dominios.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Rol = "duena" | "comercial";
// Orden Comercial→Dueña: refuerza visualmente el principio de menor
// privilegio (default al crear).
const ORDEN_ROLES: Rol[] = ["comercial", "duena"];

function CampoPassword({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <FormField label="Contraseña" required>
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

function RolSelector({
  value,
  onChange,
  comercialDeshabilitado,
}: {
  value: Rol;
  onChange: (rol: Rol) => void;
  comercialDeshabilitado: boolean;
}) {
  return (
    <FormField label="Rol" required>
      <div className="flex gap-2">
        {ORDEN_ROLES.map((rol) => {
          const activo = value === rol;
          const style = ROL_BADGE_STYLES[rol];
          const deshabilitado = rol === "comercial" && comercialDeshabilitado;
          return (
            <button
              key={rol}
              type="button"
              disabled={deshabilitado}
              title={
                deshabilitado
                  ? "No puedes quitarte el rol de Dueña a ti misma"
                  : undefined
              }
              onClick={() => onChange(rol)}
              className="flex-1 rounded-full border py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: activo ? style.bg : "var(--color-border)",
                background: activo ? style.bg : "var(--color-surface)",
                color: activo ? style.color : "var(--color-text-secondary)",
                fontWeight: activo ? 600 : 400,
              }}
            >
              {ROL_LABELS[rol]}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}

// JOS-62 (P9): crear/editar usuario, mismo esqueleto que RecordatorioSheet.tsx/
// EditarNombreSheet.tsx (<dialog> nativo, useEffect sincroniza `open`,
// bloquea cierre mientras guarda). Email fijo en modo editar (texto estático,
// nunca <input disabled>, para que no haya ambigüedad visual sobre si se
// puede tocar). Sin campo de contraseña en editar: no hay "resetear
// contraseña desde Admin" en este ticket — vacío conocido, documentado en
// README, no un bug.
export function UsuarioSheet({
  open,
  modo,
  usuario,
  usuarioActualId,
  onClose,
  onSaved,
}: {
  open: boolean;
  modo: "crear" | "editar";
  usuario: UsuarioResumen | null;
  usuarioActualId: Id<"usuarios">;
  onClose: () => void;
  onSaved: (usuario: UsuarioResumen) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("comercial");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setNombre(usuario?.nombreCompleto ?? "");
      setEmail(usuario?.email ?? "");
      setPassword("");
      setRol(usuario?.rol ?? "comercial");
      setError(null);
      setGuardando(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, usuario]);

  function requestClose() {
    if (guardando) return;
    onClose();
  }

  const puedeEnviar =
    nombre.trim().length > 0 &&
    (modo === "editar" || (email.trim().length > 0 && password.length > 0));

  const editandoPropiaFila = modo === "editar" && usuario?._id === usuarioActualId;

  async function handleSubmit() {
    if (!puedeEnviar || guardando) return;
    setError(null);

    if (nombre.trim().length > NOMBRE_MAX) {
      setError("El nombre no puede superar los 120 caracteres");
      return;
    }

    if (modo === "crear") {
      const emailLimpio = email.trim().toLowerCase();
      if (!EMAIL_RE.test(emailLimpio)) {
        setError("El email no tiene un formato válido");
        return;
      }
      if (emailLimpio.length > EMAIL_MAX) {
        setError("El email no puede superar los 254 caracteres");
        return;
      }
      if (password.length < PASSWORD_MIN) {
        setError("La contraseña debe tener al menos 8 caracteres");
        return;
      }
    }

    setGuardando(true);
    try {
      const result =
        modo === "crear"
          ? await crearUsuarioAction({ nombreCompleto: nombre, email, password, rol })
          : await actualizarUsuarioAction({
              usuarioId: (usuario as UsuarioResumen)._id,
              nombreCompleto: nombre,
              rol,
              // El rol que este formulario tenía cargado al abrirse — el
              // servidor lo compara contra el actual para detectar una
              // edición concurrente de otra administradora (auditoría,
              // ronda 2). `usuario` no cambia mientras el sheet permanece
              // abierto (el padre solo lo reasigna al pulsar "Editar" de
              // nuevo), así que sigue siendo la foto exacta de lo cargado.
              rolConocido: (usuario as UsuarioResumen).rol,
            });
      if (!result.ok) {
        setError(result.error);
        setGuardando(false);
        return;
      }
      onSaved(result.usuario);
    } catch {
      setError("No se pudo guardar. Inténtalo de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={modo === "crear" ? "Añadir usuario" : "Editar usuario"}
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
          <h2 className="text-[17px] font-bold text-text-primary">
            {modo === "crear" ? "Añadir usuario" : "Editar usuario"}
          </h2>
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
            <FormField label="Nombre" required>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={NOMBRE_MAX}
                className={getInputClassName(false)}
              />
            </FormField>

            {modo === "crear" ? (
              <FormField label="Correo electrónico" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={EMAIL_MAX}
                  placeholder="nombre@correo.com"
                  className={getInputClassName(false)}
                />
              </FormField>
            ) : (
              <FormField label="Correo electrónico">
                <p className="rounded-md border border-border-subtle bg-bg-app px-3 py-2 text-sm text-text-secondary">
                  {usuario?.email}
                </p>
                <span className="text-xs text-text-tertiary">
                  El correo no se puede editar desde aquí
                </span>
              </FormField>
            )}

            {modo === "crear" ? (
              <CampoPassword value={password} onChange={setPassword} disabled={guardando} />
            ) : null}

            <RolSelector
              value={rol}
              onChange={setRol}
              comercialDeshabilitado={editandoPropiaFila}
            />
          </div>

          <button
            type="button"
            disabled={!puedeEnviar || guardando}
            onClick={handleSubmit}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando
              ? "Guardando…"
              : modo === "crear"
                ? "Añadir usuario"
                : "Guardar cambios"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
