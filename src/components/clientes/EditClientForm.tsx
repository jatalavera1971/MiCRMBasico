"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { actualizarClienteAction } from "@/lib/actions/clientes";
import type { ClienteListado } from "./ClienteRow";
import { EMAIL_RE, Field, getInputClassName, PrioritySelector } from "./ClientFormFields";
import { Toast } from "@/components/ui/Toast";

// JOS-11/P4 edición (diferida de JOS-12): pantalla completa, no overlay (ver
// decisión del plan — JOS-12 y el prototipo real, sFormEdit(), coinciden en
// que es pantalla completa; la nota genérica de JOS-11 sobre "overlay/modal"
// queda resuelta a favor de estas dos fuentes más específicas). Cancelar y
// guardar-con-éxito navegan siempre a la ficha directamente (no router.back()).
export function EditClientForm({ cliente }: { cliente: ClienteListado }) {
  const router = useRouter();
  const fichaHref = `/clientes/${encodeURIComponent(cliente._id)}`;

  const [form, setForm] = useState({
    nombre: cliente.nombre,
    email: cliente.email,
    empresa: cliente.empresa ?? "",
    telefono: cliente.telefono ?? "",
    prioridad: cliente.prioridad,
  });
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState<{
    nombre?: string;
    email?: string;
    general?: string;
  }>({});
  const [toast, setToast] = useState<string | null>(null);

  function handleCancelar() {
    if (guardando) return;
    router.push(fichaHref);
  }

  // Validar-al-enviar, sin canSave que deshabilite "Guardar" preventivamente
  // — mismo criterio que NewClientDialog.tsx real (no el que su ticket
  // original describía).
  async function handleGuardar(e?: FormEvent) {
    e?.preventDefault();
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
      const result = await actualizarClienteAction({
        clienteId: cliente._id,
        nombre,
        email,
        empresa: form.empresa.trim() || undefined,
        telefono: form.telefono.trim() || undefined,
        prioridad: form.prioridad,
      });
      if (!result.ok) {
        setErrors({ general: result.error });
        setGuardando(false);
        return;
      }
      setToast("Cambios guardados");
      setTimeout(() => {
        router.refresh();
        router.push(fichaHref);
      }, 700);
    } catch {
      setErrors({
        general: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      });
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-full bg-bg-app">
      <div className="flex h-[52px] items-center justify-between border-b border-border-subtle bg-surface px-2">
        <button
          type="button"
          aria-label="Volver sin guardar"
          disabled={guardando}
          onClick={handleCancelar}
          className="flex h-11 w-11 items-center justify-center text-primary-600 disabled:opacity-40"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <span className="flex-1 text-center text-base font-bold text-text-primary">
          Editar cliente
        </span>
        <button
          type="button"
          disabled={guardando}
          onClick={() => handleGuardar()}
          className="px-3 text-sm font-semibold text-primary-600 disabled:text-text-tertiary"
        >
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>

      {errors.general ? (
        <p className="px-4 pt-3 text-sm" style={{ color: "var(--color-error-text)" }}>
          {errors.general}
        </p>
      ) : null}

      <form onSubmit={handleGuardar} className="flex flex-col gap-4 px-4 py-5">
        <Field label="Nombre" error={errors.nombre}>
          <input
            type="text"
            maxLength={120}
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            className={getInputClassName(Boolean(errors.nombre))}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            maxLength={254}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={getInputClassName(Boolean(errors.email))}
          />
        </Field>

        <Field label="Empresa">
          <input
            type="text"
            maxLength={160}
            value={form.empresa}
            onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
            className={getInputClassName(false)}
          />
        </Field>

        <Field label="Teléfono">
          <input
            type="tel"
            maxLength={40}
            value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            className={getInputClassName(false)}
          />
        </Field>

        <Field label="Prioridad">
          <PrioritySelector
            value={form.prioridad}
            onChange={(prioridad) => setForm((f) => ({ ...f, prioridad }))}
          />
        </Field>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 flex h-11 items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
