import type { Fase } from "@/lib/clienteLabels";

// JOS-14: colores verificados en el array SCLR de sPipeline() en crm-app.js
// (fuente de verdad ejecutada, mismo criterio que priorityStyles.ts) — se
// ignora _ds_ref/tokens/colors.css, que define un set distinto sin
// correspondencia 1:1 con las 6 fases reales. Un solo mapa reutilizado por el
// grid resumen y las cabeceras de grupo de la vista Pipeline (P6).
export const PIPELINE_STYLES: Record<
  Fase,
  { dot: string; bg: string; text: string }
> = {
  lead: {
    dot: "var(--color-pipeline-lead-dot)",
    bg: "var(--color-pipeline-lead-bg)",
    text: "var(--color-pipeline-lead-text)",
  },
  cualificacion: {
    dot: "var(--color-pipeline-cualificacion-dot)",
    bg: "var(--color-pipeline-cualificacion-bg)",
    text: "var(--color-pipeline-cualificacion-text)",
  },
  primera_llamada: {
    dot: "var(--color-pipeline-primera_llamada-dot)",
    bg: "var(--color-pipeline-primera_llamada-bg)",
    text: "var(--color-pipeline-primera_llamada-text)",
  },
  propuesta_enviada: {
    dot: "var(--color-pipeline-propuesta_enviada-dot)",
    bg: "var(--color-pipeline-propuesta_enviada-bg)",
    text: "var(--color-pipeline-propuesta_enviada-text)",
  },
  negociacion: {
    dot: "var(--color-pipeline-negociacion-dot)",
    bg: "var(--color-pipeline-negociacion-bg)",
    text: "var(--color-pipeline-negociacion-text)",
  },
  cerrado: {
    dot: "var(--color-pipeline-cerrado-dot)",
    bg: "var(--color-pipeline-cerrado-bg)",
    text: "var(--color-pipeline-cerrado-text)",
  },
};
