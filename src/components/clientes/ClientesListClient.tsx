"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Users, X } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewClientDialog } from "./NewClientDialog";
import { ClienteRow, type ClienteListado } from "./ClienteRow";
import { PRIORIDAD_FILTROS, type PrioridadFiltro } from "./priorityStyles";

const PRIORIDAD_ORDEN: Record<PrioridadFiltro, number> = {
  todas: 0,
  alta: 0,
  media: 1,
  baja: 2,
};

// JOS-13: insensible a mayúsculas/tildes. Rango Unicode por código de escape
// (no caracteres literales copiados) para no colar nada invisible.
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const CHIP_LABELS: Record<PrioridadFiltro, string> = {
  todas: "Todas",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export function ClientesListClient({
  clientesIniciales,
}: {
  clientesIniciales: ClienteListado[];
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<PrioridadFiltro>("todas");

  function handleCreated(id: Id<"clientes">) {
    setDialogOpen(false);
    router.push(`/clientes/${encodeURIComponent(id)}`);
  }

  const clientesFiltrados = useMemo(() => {
    const q = normalizar(query.trim());
    const coincideTexto = (c: ClienteListado) =>
      q === "" ||
      normalizar(c.nombre).includes(q) ||
      normalizar(c.email).includes(q) ||
      normalizar(c.telefono ?? "").includes(q);
    const coincideFiltro = (c: ClienteListado) =>
      filtro === "todas" || c.prioridad === filtro;

    // Copia antes de ordenar: no mutar el array recibido por props.
    return [...clientesIniciales]
      .filter((c) => coincideTexto(c) && coincideFiltro(c))
      .sort((a, b) => {
        const porPrioridad = PRIORIDAD_ORDEN[a.prioridad] - PRIORIDAD_ORDEN[b.prioridad];
        if (porPrioridad !== 0) return porPrioridad;
        // JOS-45 no cubre el caso "nunca contactado": se trata como el valor
        // más antiguo posible, así que aparece primero dentro de su grupo de
        // prioridad (son los que más urgentemente necesitan un primer contacto).
        const fechaA = a.fecha_ultimo_contacto ?? -Infinity;
        const fechaB = b.fecha_ultimo_contacto ?? -Infinity;
        return fechaA - fechaB;
      });
  }, [clientesIniciales, query, filtro]);

  const hayBusquedaOFiltroActivo = query !== "" || filtro !== "todas";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Clientes</h1>
        <button
          type="button"
          aria-label="Nuevo cliente"
          onClick={() => setDialogOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono"
          className="w-full rounded-[10px] border border-border bg-bg-app py-2.5 pl-9 pr-9 text-sm text-text-primary focus:outline-none focus:ring-[3px] focus:ring-(--color-focus-ring)"
        />
        {query ? (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {PRIORIDAD_FILTROS.map((key) => {
          const activo = filtro === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFiltro(key)}
              className={
                activo
                  ? "shrink-0 whitespace-nowrap rounded-full border-[1.5px] border-primary-600 bg-primary-50 px-3.5 py-1.5 text-[13px] font-semibold text-primary-700"
                  : "shrink-0 whitespace-nowrap rounded-full border border-border px-3.5 py-1.5 text-[13px] font-normal text-text-secondary"
              }
            >
              {CHIP_LABELS[key]}
            </button>
          );
        })}
      </div>

      {clientesFiltrados.length === 0 ? (
        <div className="mt-6">
          {hayBusquedaOFiltroActivo ? (
            <EmptyState
              icon={<Search className="h-6 w-6 text-primary-600" />}
              title="No se encontró ningún cliente con ese nombre, email o teléfono"
            />
          ) : (
            <EmptyState
              icon={<Users className="h-6 w-6 text-primary-600" />}
              title="Aún no tienes clientes"
              description="Pulsa el botón + para dar de alta el primero."
            />
          )}
        </div>
      ) : (
        <div className="mt-4">
          {clientesFiltrados.map((c) => (
            <ClienteRow key={c._id} cliente={c} />
          ))}
        </div>
      )}

      <NewClientDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
