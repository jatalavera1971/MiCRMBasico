import { TaskListClient } from "./TaskListClient";
import type { Tarea } from "./TaskListItem";

export function TaskListSection({ tareas }: { tareas: Tarea[] }) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 px-4 pb-2">
        <h2 className="text-sm font-semibold text-text-secondary">Hoy</h2>
        {tareas.length > 0 ? (
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600">
            {tareas.length}
          </span>
        ) : null}
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <TaskListClient tareasIniciales={tareas} />
      </div>
    </section>
  );
}
