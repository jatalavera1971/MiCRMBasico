"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Mail,
  MessageCircle,
  MoreVertical,
  Phone,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { getInitials, type ClienteListado } from "./ClienteRow";
import { CANAL_LABELS, FASES, FASE_LABELS, type CanalPreferido } from "@/lib/clienteLabels";
import { PRIORITY_STYLES, type Prioridad } from "./priorityStyles";
import { PrioritySheet } from "./PrioritySheet";
import { ClientMenuSheet } from "./ClientMenuSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// JOS-11 (Fase 2): solo canal preferido es editable desde aquí (F1). Pipeline
// (F6/JOS-15), próximo recordatorio (F9/JOS-22) e historial (F4/JOS-19) son
// de fases posteriores — se reserva el espacio visual, sin datos ni acciones.
const CANAL_BOTONES = [
  { key: "telefono", label: "Llamar", icon: Phone },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "email", label: "Email", icon: Mail },
  { key: "reunion", label: "Reunión", icon: Calendar },
] as const;

export function ClienteFichaClient({
  cliente: clienteInicial,
}: {
  cliente: ClienteListado;
}) {
  const router = useRouter();
  const [cliente, setCliente] = useState(clienteInicial);
  const [toast, setToast] = useState<string | null>(null);
  const [prioritySheetOpen, setPrioritySheetOpen] = useState(false);
  const [savingPrioridad, setSavingPrioridad] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const actualizarCanalPreferido = useMutation(api.clientes.actualizarCanalPreferido);
  const actualizarPrioridad = useMutation(api.clientes.actualizarPrioridad);
  const eliminarCliente = useMutation(api.clientes.eliminarCliente);

  const prioridad = PRIORITY_STYLES[cliente.prioridad];
  const faseIdx = FASES.indexOf(cliente.fase);

  function handleVolver() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/clientes");
    }
  }

  async function handleCanalClick(key: CanalPreferido, label: string) {
    if (cliente.canal_preferido === key) return;
    const anterior = cliente.canal_preferido;
    setCliente((c) => ({ ...c, canal_preferido: key }));
    try {
      await actualizarCanalPreferido({ clienteId: cliente._id, canal_preferido: key });
      setToast(`Canal preferido: ${label}`);
    } catch {
      setCliente((c) => ({ ...c, canal_preferido: anterior }));
      setToast("No se pudo actualizar el canal preferido. Inténtalo de nuevo.");
    }
  }

  async function handleConfirmPrioridad(nueva: Prioridad) {
    if (nueva === cliente.prioridad) {
      setPrioritySheetOpen(false);
      return;
    }
    setSavingPrioridad(true);
    try {
      await actualizarPrioridad({ clienteId: cliente._id, prioridad: nueva });
      setCliente((c) => ({ ...c, prioridad: nueva }));
      setToast("Prioridad actualizada");
      setPrioritySheetOpen(false);
    } catch {
      setToast("No se pudo actualizar la prioridad. Inténtalo de nuevo.");
    } finally {
      setSavingPrioridad(false);
    }
  }

  async function handleCompartir() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast("Enlace copiado al portapapeles");
    } catch {
      setToast("No se pudo copiar el enlace");
    }
    setMenuOpen(false);
  }

  async function handleConfirmDelete() {
    setConfirmDeleteOpen(false);
    setDeleting(true);
    try {
      await eliminarCliente({ clienteId: cliente._id });
      setToast("Cliente eliminado");
      // Breve delay para que el toast sea visible antes de navegar fuera de
      // esta pantalla; router.refresh() evita servir /clientes cacheado.
      setTimeout(() => {
        router.refresh();
        router.push("/clientes");
      }, 700);
    } catch {
      setDeleting(false);
      setToast("No se pudo eliminar el cliente. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="min-h-full bg-bg-app pb-6">
      {/* Barra superior */}
      <div className="flex h-11 items-center justify-between border-b border-border-subtle bg-surface px-3">
        <button
          type="button"
          onClick={handleVolver}
          className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary-600"
        >
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
          Volver
        </button>
        <button
          type="button"
          aria-label="Más opciones"
          disabled={deleting}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center text-text-secondary disabled:opacity-40"
        >
          <MoreVertical className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Cabecera */}
      <div className="bg-surface px-4 pb-4 pt-5">
        <div className="mb-4 flex items-center gap-3.5">
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-base font-semibold text-primary-600">
            {getInitials(cliente.nombre)}
          </span>
          <div>
            <h1 className="mb-2 text-xl font-bold tracking-tight text-text-primary">
              {cliente.nombre}
            </h1>
            <button
              type="button"
              onClick={() => setPrioritySheetOpen(true)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide"
              style={{ background: prioridad.bg, color: prioridad.text }}
            >
              {prioridad.label}
              <ChevronDown className="h-2.5 w-2.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {CANAL_BOTONES.map(({ key, label, icon: Icon }) => {
            const active = cliente.canal_preferido === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCanalClick(key, label)}
                className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-[10px] border px-1 ${
                  active
                    ? "border-[#BBF7D0] bg-primary-50 text-primary-600"
                    : "border-border bg-surface text-text-secondary"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                <span className="text-[10px] font-medium leading-none">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-2 bg-bg-app" />

      {/* Datos de contacto */}
      <div className="bg-surface px-4 py-4">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Datos de contacto
          </span>
          <Link
            href={`/clientes/${encodeURIComponent(cliente._id)}/editar`}
            className="text-sm font-medium text-primary-600"
          >
            Editar
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <ContactRow icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}>
            <a href={`mailto:${cliente.email}`} className="text-sm text-text-primary">
              {cliente.email}
            </a>
          </ContactRow>
          <ContactRow icon={<Building2 className="h-4 w-4" strokeWidth={1.5} />}>
            <span className="text-sm text-text-primary">
              {cliente.empresa ?? "—"}
            </span>
          </ContactRow>
          <ContactRow icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}>
            {cliente.telefono ? (
              <a href={`tel:${cliente.telefono}`} className="text-sm text-text-primary">
                {cliente.telefono}
              </a>
            ) : (
              <span className="text-sm text-text-primary">—</span>
            )}
          </ContactRow>
          <ContactRow
            icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
            highlighted
          >
            <span className="mb-0.5 block text-[11px] text-text-tertiary">
              Canal preferido
            </span>
            <span className="text-sm font-medium text-primary-600">
              {cliente.canal_preferido
                ? CANAL_LABELS[cliente.canal_preferido]
                : "—"}
            </span>
          </ContactRow>
        </div>
      </div>

      <div className="h-2 bg-bg-app" />

      {/* Pipeline — reservado (F6/JOS-15, Fase 3): solo lectura, sin onClick */}
      <div className="bg-surface px-4 py-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Pipeline
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {FASE_LABELS[cliente.fase]}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FASES.map((fase, i) => {
            const done = i < faseIdx;
            const active = i === faseIdx;
            return (
              <span
                key={fase}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs ${
                  active
                    ? "bg-primary-600 font-semibold text-white"
                    : done
                      ? "border border-[#BBF7D0] bg-primary-50 text-primary-600"
                      : "border border-border text-text-tertiary"
                }`}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={2} /> : null}
                {FASE_LABELS[fase]}
              </span>
            );
          })}
        </div>
      </div>

      <div className="h-2 bg-bg-app" />

      {/* Próximo recordatorio — reservado (F9/JOS-22, Fase 5): sin fetch, sin acciones */}
      <div className="bg-surface px-4 py-4">
        <span className="mb-3 block text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
          Próximo recordatorio
        </span>
        <div className="rounded-[10px] border border-border-subtle bg-bg-app px-3.5 py-3 text-sm text-text-tertiary">
          Disponible próximamente
        </div>
      </div>

      <div className="h-2 bg-bg-app" />

      {/* Historial — reservado (F4/JOS-19, Fase 4): sin fetch, sin acciones */}
      <div className="bg-surface px-4 pb-2 pt-4">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
          Historial
        </span>
        <EmptyState
          icon={<Clock className="h-6 w-6 text-primary-600" strokeWidth={1.5} />}
          title="El historial de interacciones estará disponible próximamente"
        />
      </div>

      <PrioritySheet
        open={prioritySheetOpen}
        current={cliente.prioridad}
        saving={savingPrioridad}
        onCancel={() => setPrioritySheetOpen(false)}
        onConfirm={handleConfirmPrioridad}
      />

      <ClientMenuSheet
        open={menuOpen}
        nombre={cliente.nombre}
        empresa={cliente.empresa}
        editHref={`/clientes/${encodeURIComponent(cliente._id)}/editar`}
        onClose={() => setMenuOpen(false)}
        onShare={handleCompartir}
        onDeleteRequest={() => {
          setMenuOpen(false);
          setConfirmDeleteOpen(true);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title={`¿Eliminar a ${cliente.nombre}?`}
        description="Esta acción no se puede deshacer. Se eliminará el cliente y sus recordatorios asociados."
        confirmLabel="Sí, eliminar cliente"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function ContactRow({
  icon,
  highlighted,
  children,
}: {
  icon: React.ReactNode;
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          highlighted ? "bg-primary-50 text-primary-600" : "bg-border-subtle text-text-secondary"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
