export type Prioridad = "alta" | "media" | "baja";

// JOS-42/JOS-43: colores verificados en _ds_ref/tokens/colors.css:45-51 y en
// priorityStyle() de crm-app.js. Un solo mapa reutilizado por el selector
// segmentado de NewClientDialog y por la píldora de prioridad de la lista.
export const PRIORITY_STYLES: Record<
  Prioridad,
  { bg: string; text: string; label: string }
> = {
  alta: {
    bg: "var(--color-priority-high-bg)",
    text: "var(--color-priority-high-text)",
    label: "Alta",
  },
  media: {
    bg: "var(--color-priority-medium-bg)",
    text: "var(--color-priority-medium-text)",
    label: "Media",
  },
  baja: {
    bg: "var(--color-priority-low-bg)",
    text: "var(--color-priority-low-text)",
    label: "Baja",
  },
};

export const PRIORIDADES: Prioridad[] = ["alta", "media", "baja"];
