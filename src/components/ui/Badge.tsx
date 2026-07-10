import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * design.md → badge-base: siempre bg+text como pareja, 11px/500 uppercase,
 * pill. Pasa las clases de color (p.ej. desde FASE_PIPELINE_BADGE o
 * PRIORIDAD_BADGE en src/lib/constants.ts) por `colorClassName`.
 */
export function Badge({
  className,
  colorClassName,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { colorClassName: string }) {
  return (
    <span
      className={cn(
        "text-badge inline-flex items-center rounded-pill px-2.5 py-[3px]",
        colorClassName,
        className,
      )}
      {...props}
    />
  );
}
