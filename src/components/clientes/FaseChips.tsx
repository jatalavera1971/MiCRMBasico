import { Check } from "lucide-react";
import { FASES, FASE_LABELS, type Fase } from "@/lib/clienteLabels";

// JOS-14/15: chips de fase del pipeline, compartidos entre la ficha (P3,
// editable) y — en el futuro, si se necesitara modo lectura — cualquier otro
// sitio. Sin `onSelect` reproduce byte a byte el bloque solo-lectura que ya
// existía en ClienteFichaClient (sin regresión visual); con `onSelect`, cada
// chip pasa a ser un botón que dispara el cambio de fase al instante.
export function FaseChips({
  fase,
  onSelect,
  disabled,
}: {
  fase: Fase;
  onSelect?: (fase: Fase) => void;
  disabled?: boolean;
}) {
  const faseIdx = FASES.indexOf(fase);

  return (
    <div className="flex flex-wrap gap-1.5">
      {FASES.map((f, i) => {
        const done = i < faseIdx;
        const active = i === faseIdx;
        const className = `inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs ${
          active
            ? "bg-primary-600 font-semibold text-white"
            : done
              ? "border border-[#BBF7D0] bg-primary-50 text-primary-600"
              : "border border-border text-text-tertiary"
        }${onSelect ? " disabled:opacity-60" : ""}`;

        if (!onSelect) {
          return (
            <span key={f} className={className}>
              {done ? <Check className="h-3 w-3" strokeWidth={2} /> : null}
              {FASE_LABELS[f]}
            </span>
          );
        }

        return (
          <button
            key={f}
            type="button"
            disabled={disabled}
            aria-current={active ? "step" : undefined}
            onClick={() => onSelect(f)}
            className={className}
          >
            {done ? <Check className="h-3 w-3" strokeWidth={2} /> : null}
            {FASE_LABELS[f]}
          </button>
        );
      })}
    </div>
  );
}
