"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { marcarComoHechoAction } from "@/lib/actions/recordatorios";
import { TaskListItem, type Tarea } from "./TaskListItem";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { compararTareas } from "@/lib/dates";

export function TaskListClient({
  tareasIniciales,
}: {
  tareasIniciales: Tarea[];
}) {
  const router = useRouter();
  const [tareas, setTareas] = useState(tareasIniciales);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmTarea, setConfirmTarea] = useState<Tarea | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function confirmarHecho() {
    if (!confirmTarea) return;
    const tarea = confirmTarea;
    setConfirmTarea(null);
    setPendingId(tarea.recordatorioId);
    setError(null);
    // Optimista: la quitamos ya de la lista visible.
    setTareas((prev) =>
      prev.filter((t) => t.recordatorioId !== tarea.recordatorioId),
    );
    try {
      const result = await marcarComoHechoAction({
        recordatorioId: tarea.recordatorioId as Id<"recordatorios">,
      });
      if (!result.ok) throw new Error(result.error);
      // Resincroniza KPIs/banner (obtenerResumen) con el backend.
      router.refresh();
    } catch {
      // Rollback: si falla, la volvemos a insertar.
      setTareas((prev) => [...prev, tarea].sort(compararTareas));
      setError("No se pudo marcar como hecho. Inténtalo de nuevo.");
    } finally {
      setPendingId(null);
    }
  }

  if (tareas.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 className="h-6 w-6 text-primary-600" />}
        title="No tienes seguimientos pendientes para hoy. ¡Buen trabajo!"
      />
    );
  }

  return (
    <div>
      {error ? (
        <p className="px-4 pt-2 text-xs text-red-600">{error}</p>
      ) : null}
      {tareas.map((tarea) => (
        <TaskListItem
          key={tarea.recordatorioId}
          tarea={tarea}
          pending={pendingId === tarea.recordatorioId}
          onMarkDone={() => setConfirmTarea(tarea)}
        />
      ))}
      <ConfirmDialog
        open={confirmTarea !== null}
        title="¿Marcar como hecho?"
        description={confirmTarea?.motivo}
        confirmLabel="Marcar como hecho"
        onConfirm={confirmarHecho}
        onCancel={() => setConfirmTarea(null)}
      />
    </div>
  );
}
