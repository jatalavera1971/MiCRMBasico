import type { ReactNode } from "react";
import { PRIORIDADES, PRIORITY_STYLES, type Prioridad } from "./priorityStyles";

// JOS-11: extraído de NewClientDialog.tsx (alta) para compartirlo con
// EditClientForm.tsx (edición) sin duplicar campos/validación — mismo
// contenido/comportamiento que tenía NewClientDialog.tsx, solo movido.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getInputClassName(hasError: boolean) {
  const base =
    "w-full rounded-md border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-[3px]";
  return hasError
    ? `${base} border-(--color-error-text) focus:ring-(--color-error-text)/30`
    : `${base} border-border focus:ring-(--color-focus-ring)`;
}

export function Field({
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

export function PrioritySelector({
  value,
  onChange,
}: {
  value: Prioridad;
  onChange: (value: Prioridad) => void;
}) {
  return (
    <div className="flex gap-2">
      {PRIORIDADES.map((key) => {
        const style = PRIORITY_STYLES[key];
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex-1 rounded-full border py-2 text-sm"
            style={{
              borderColor: active ? style.text : "var(--color-border)",
              background: active ? style.bg : "var(--color-surface)",
              color: active ? style.text : "var(--color-text-secondary)",
              fontWeight: active ? 600 : 400,
            }}
          >
            {style.label}
          </button>
        );
      })}
    </div>
  );
}
