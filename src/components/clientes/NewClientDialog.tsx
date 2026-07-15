"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  EMAIL_RE,
  Field,
  getInputClassName,
  PrioritySelector,
} from "./ClientFormFields";
import type { Prioridad } from "./priorityStyles";

const initialState = {
  nombre: "",
  email: "",
  empresa: "",
  telefono: "",
  prioridad: "media" as Prioridad,
};

export function NewClientDialog({
  open,
  onCancel,
  onCreated,
}: {
  open: boolean;
  onCancel: () => void;
  onCreated: (id: Id<"clientes">) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const crearCliente = useMutation(api.clientes.crearCliente);

  const [form, setForm] = useState(initialState);
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState<{
    nombre?: string;
    email?: string;
    general?: string;
  }>({});

  const titleId = "new-client-dialog-title";
  const generalErrorId = "new-client-dialog-general-error";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setForm(initialState);
      setErrors({});
      setGuardando(false);
      dialog.showModal();
      nombreRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function requestCancel() {
    if (guardando) return;
    onCancel();
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    const nombre = form.nombre.trim();
    const email = form.email.trim();

    const fieldErrors: typeof errors = {};
    if (!nombre) {
      fieldErrors.nombre = "El nombre es obligatorio";
    }
    if (!email) {
      fieldErrors.email = "El email es obligatorio";
    } else if (!EMAIL_RE.test(email)) {
      fieldErrors.email = "El email no tiene un formato válido";
    }
    if (fieldErrors.nombre || fieldErrors.email) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setGuardando(true);
    try {
      const id = await crearCliente({
        nombre,
        email,
        empresa: form.empresa.trim() || undefined,
        telefono: form.telefono.trim() || undefined,
        prioridad: form.prioridad,
      });
      onCreated(id);
    } catch (err) {
      const message =
        err instanceof ConvexError
          ? String(err.data)
          : "No se pudo crear el cliente. Inténtalo de nuevo.";
      setErrors({ general: message });
      setGuardando(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={errors.general ? generalErrorId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        requestCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestCancel();
      }}
      className="m-0 hidden h-screen max-h-none w-screen max-w-none items-end justify-center bg-transparent p-0 open:flex backdrop:bg-black/50 md:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-card-anim w-full rounded-t-xl border border-border bg-surface p-5 shadow-lg md:w-[420px] md:rounded-lg"
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-base font-semibold text-text-primary">
            Nuevo cliente
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={guardando}
            onClick={requestCancel}
            className="text-text-tertiary disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {errors.general ? (
          <p
            id={generalErrorId}
            className="mt-3 text-sm"
            style={{ color: "var(--color-error-text)" }}
          >
            {errors.general}
          </p>
        ) : null}

        <form onSubmit={handleGuardar} className="mt-4 flex flex-col gap-4">
          <Field label="Nombre" required error={errors.nombre}>
            <input
              ref={nombreRef}
              type="text"
              maxLength={120}
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: María García"
              className={getInputClassName(Boolean(errors.nombre))}
            />
          </Field>

          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              maxLength={254}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="maria@empresa.com"
              className={getInputClassName(Boolean(errors.email))}
            />
          </Field>

          <Field label="Empresa">
            <input
              type="text"
              maxLength={160}
              value={form.empresa}
              onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
              placeholder="Nombre de la empresa"
              className={getInputClassName(false)}
            />
          </Field>

          <Field label="Teléfono">
            <input
              type="tel"
              maxLength={40}
              value={form.telefono}
              onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
              placeholder="+34 600 000 000"
              className={getInputClassName(false)}
            />
          </Field>

          <Field label="Prioridad">
            <PrioritySelector
              value={form.prioridad}
              onChange={(prioridad) => setForm((f) => ({ ...f, prioridad }))}
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              disabled={guardando}
              onClick={requestCancel}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-secondary disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {guardando ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
