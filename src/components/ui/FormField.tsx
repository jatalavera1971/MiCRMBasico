import type { ReactNode } from "react";

// Primitiva neutral, sin dominio — Perfil/Usuarios no dependen de
// components/clientes/ClientFormFields.tsx (mismo criterio ya usado por
// AuthInput.tsx: "Login es una pantalla fundacional: no debe depender de
// components/clientes/"). Equivalente a Field/getInputClassName de ese
// archivo, duplicado aquí a propósito.
export function getInputClassName(hasError: boolean) {
  const base =
    "w-full rounded-md border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-[3px]";
  return hasError
    ? `${base} border-(--color-error-text) focus:ring-(--color-error-text)/30`
    : `${base} border-border focus:ring-(--color-focus-ring)`;
}

export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[13px] font-medium text-text-secondary">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {error ? (
        <span className="text-xs" style={{ color: "var(--color-error-text)" }}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
