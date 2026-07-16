"use client";

import { Calendar, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import {
  TIPOS_INTERACCION,
  TIPO_INTERACCION_LABELS,
  type TipoInteraccion,
} from "@/lib/clienteLabels";

// JOS-18: mismos 4 iconos que CANAL_BOTONES de ClienteFichaClient.tsx —
// tipo de interacción y canal preferido comparten las 4 opciones/iconos
// aunque sean conceptos distintos (ver src/lib/clienteLabels.ts).
const ICONOS: Record<TipoInteraccion, LucideIcon> = {
  llamada: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  reunion: Calendar,
};

// Selector de tipo de contacto del formulario P5 (JOS-18): grid grande y
// fácil de tocar con el pulgar, no un dropdown pequeño (lo pide el issue
// explícitamente).
export function InteractionTypeSelector({
  value,
  onChange,
}: {
  value: TipoInteraccion;
  onChange: (value: TipoInteraccion) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {TIPOS_INTERACCION.map((tipo) => {
        const Icon = ICONOS[tipo];
        const active = value === tipo;
        return (
          <button
            key={tipo}
            type="button"
            onClick={() => onChange(tipo)}
            className={`flex h-14 flex-col items-center justify-center gap-1 rounded-[10px] border px-1 ${
              active
                ? "border-[#BBF7D0] bg-primary-50 text-primary-600"
                : "border-border bg-surface text-text-secondary"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span className="text-[11px] font-medium leading-none">
              {TIPO_INTERACCION_LABELS[tipo]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
