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
  Plus,
  type LucideIcon,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { getInitials, type ClienteListado } from "./ClienteRow";
import {
  CANAL_LABELS,
  FASES,
  FASE_LABELS,
  TIPO_INTERACCION_LABELS,
  type CanalPreferido,
  type TipoInteraccion,
} from "@/lib/clienteLabels";
import { formatFechaCorta, formatFechaRecordatorio } from "@/lib/dates";
import { PRIORITY_STYLES, type Prioridad } from "./priorityStyles";
import { PrioritySheet } from "./PrioritySheet";
import { ClientMenuSheet } from "./ClientMenuSheet";
import { RegisterInteractionSheet } from "./RegisterInteractionSheet";
import { RecordatorioSheet, type RecordatorioEditable } from "./RecordatorioSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// JOS-11 (Fase 2): solo canal preferido es editable desde aquí (F1). Pipeline
// (F6/JOS-15) sigue reservado, es de Fase 3.
const CANAL_BOTONES = [
  { key: "telefono", label: "Llamar", icon: Phone },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "email", label: "Email", icon: Mail },
  { key: "reunion", label: "Reunión", icon: Calendar },
] as const;

// JOS-19: mismos 4 iconos que CANAL_BOTONES/InteractionTypeSelector, para
// cada fila del historial.
const TIPO_INTERACCION_ICONOS: Record<TipoInteraccion, LucideIcon> = {
  llamada: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  reunion: Calendar,
};

export type Interaccion = {
  _id: string;
  tipo: TipoInteraccion;
  notas: string;
  fecha: number;
  proximo_paso_texto?: string;
  proximo_paso_fecha?: string;
};

export type RecordatorioPendiente = {
  _id: Id<"recordatorios">;
  motivo: string;
  fecha: string;
  overdue: boolean;
  diasVencido: number;
};

export function ClienteFichaClient({
  cliente: clienteInicial,
  interacciones,
  recordatoriosPendientes,
}: {
  cliente: ClienteListado;
  interacciones: Interaccion[];
  recordatoriosPendientes: RecordatorioPendiente[];
}) {
  const router = useRouter();
  const [cliente, setCliente] = useState(clienteInicial);
  const [clienteSincronizado, setClienteSincronizado] = useState(clienteInicial);
  const [toast, setToast] = useState<string | null>(null);
  const [prioritySheetOpen, setPrioritySheetOpen] = useState(false);
  const [savingPrioridad, setSavingPrioridad] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [registerSheetOpen, setRegisterSheetOpen] = useState(false);
  const [historialExpandido, setHistorialExpandido] = useState(false);
  const [recordatorioSheetOpen, setRecordatorioSheetOpen] = useState(false);
  const [recordatorioEditando, setRecordatorioEditando] =
    useState<RecordatorioEditable | null>(null);
  const [recordatoriosExpandido, setRecordatoriosExpandido] = useState(false);
  const [confirmHechoTarget, setConfirmHechoTarget] =
    useState<RecordatorioPendiente | null>(null);
  const actualizarCanalPreferido = useMutation(api.clientes.actualizarCanalPreferido);
  const actualizarPrioridad = useMutation(api.clientes.actualizarPrioridad);
  const eliminarCliente = useMutation(api.clientes.eliminarCliente);
  const marcarComoHecho = useMutation(api.recordatorios.marcarComoHecho);

  // Decisión 19 (plan JOS-18/19/20/21): useState(clienteInicial) solo toma el
  // valor inicial una vez — sin esto, un router.refresh() que traiga un
  // fecha_ultimo_contacto nuevo (tras registrar una interacción) no se
  // reflejaría aquí. Se ajusta DURANTE el render (patrón "Adjusting state
  // when a prop changes" de React), no en un useEffect, para no disparar un
  // render en cascada. interacciones/recordatoriosPendientes NO se copian a
  // estado local a propósito: se renderizan directo desde las props, así que
  // un router.refresh() ya las actualiza sin este problema.
  if (clienteInicial !== clienteSincronizado) {
    setClienteSincronizado(clienteInicial);
    setCliente(clienteInicial);
  }

  const prioridad = PRIORITY_STYLES[cliente.prioridad];
  const faseIdx = FASES.indexOf(cliente.fase);
  const historialAMostrar =
    interacciones.length > 10 && !historialExpandido
      ? interacciones.slice(0, 5)
      : interacciones;
  // JOS-22: recordatoriosPendientes ya viene ordenado asc por fecha desde el
  // backend (índice by_cliente_estado_fecha) — "el más próximo" es
  // simplemente el primero; el resto solo se muestra si se expande.
  const [proximoRecordatorio, ...otrosRecordatorios] = recordatoriosPendientes;

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

  // JOS-18/20/21 (decisión 8/14 del plan): toast → cerrar sheet → refresh, en
  // vez de parchear localmente interacciones/fecha_ultimo_contacto/próximo
  // recordatorio — router.refresh() reejecuta el Server Component y trae los
  // 3 datos ya consistentes desde el servidor.
  function handleInteraccionSaved(mensaje: string) {
    setRegisterSheetOpen(false);
    setToast(mensaje);
    router.refresh();
  }

  // JOS-22: mismo patrón toast → cerrar sheet → refresh que la interacción.
  function handleRecordatorioSaved(mensaje: string) {
    setRecordatorioSheetOpen(false);
    setToast(mensaje);
    router.refresh();
  }

  function handleAbrirCrearRecordatorio() {
    setRecordatorioEditando(null);
    setRecordatorioSheetOpen(true);
  }

  function handleAbrirEditarRecordatorio(r: RecordatorioPendiente) {
    setRecordatorioEditando({ _id: r._id, fecha: r.fecha, motivo: r.motivo });
    setRecordatorioSheetOpen(true);
  }

  async function handleConfirmHecho() {
    if (!confirmHechoTarget) return;
    const target = confirmHechoTarget;
    setConfirmHechoTarget(null);
    try {
      await marcarComoHecho({ recordatorioId: target._id });
      setToast("Recordatorio completado");
      router.refresh();
    } catch {
      setToast("No se pudo marcar como hecho. Inténtalo de nuevo.");
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

      {/* Próximo recordatorio (JOS-22) */}
      <div className="bg-surface px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Próximo recordatorio
          </span>
          {!proximoRecordatorio ? (
            <button
              type="button"
              onClick={handleAbrirCrearRecordatorio}
              className="flex items-center gap-1 rounded-md border border-primary-600 px-2.5 py-1 text-xs font-medium text-primary-600"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Añadir
            </button>
          ) : null}
        </div>
        {!proximoRecordatorio ? (
          <div className="rounded-[10px] border border-border-subtle bg-bg-app px-3.5 py-3 text-sm text-text-tertiary">
            Sin recordatorios pendientes
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <RecordatorioRow
              recordatorio={proximoRecordatorio}
              onMarkDone={() => setConfirmHechoTarget(proximoRecordatorio)}
              onEdit={() => handleAbrirEditarRecordatorio(proximoRecordatorio)}
            />
            {otrosRecordatorios.length > 0 ? (
              <>
                {recordatoriosExpandido
                  ? otrosRecordatorios.map((r) => (
                      <RecordatorioRow
                        key={r._id}
                        recordatorio={r}
                        onMarkDone={() => setConfirmHechoTarget(r)}
                        onEdit={() => handleAbrirEditarRecordatorio(r)}
                      />
                    ))
                  : null}
                <button
                  type="button"
                  onClick={() => setRecordatoriosExpandido((v) => !v)}
                  className="self-center py-1 text-sm font-medium text-primary-600"
                >
                  {recordatoriosExpandido
                    ? "Ver menos"
                    : `Ver todos (${recordatoriosPendientes.length})`}
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <div className="h-2 bg-bg-app" />

      {/* Historial (JOS-19) */}
      <div className="bg-surface px-4 pb-3 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Historial
          </span>
          <button
            type="button"
            onClick={() => setRegisterSheetOpen(true)}
            className="flex items-center gap-1 rounded-md border border-primary-600 px-2.5 py-1 text-xs font-medium text-primary-600"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Registrar
          </button>
        </div>
        {interacciones.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-6 w-6 text-primary-600" strokeWidth={1.5} />}
            title="Aún no hay interacciones registradas."
            description="Toca el botón para anotar la primera conversación."
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {historialAMostrar.map((interaccion) => (
              <InteraccionRow key={interaccion._id} interaccion={interaccion} />
            ))}
            {interacciones.length > 10 && !historialExpandido ? (
              <button
                type="button"
                onClick={() => setHistorialExpandido(true)}
                className="self-center py-1 text-sm font-medium text-primary-600"
              >
                Ver todas ({interacciones.length})
              </button>
            ) : null}
          </div>
        )}
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
        onRegisterInteraction={() => {
          setMenuOpen(false);
          setRegisterSheetOpen(true);
        }}
        onAddRecordatorio={() => {
          setMenuOpen(false);
          handleAbrirCrearRecordatorio();
        }}
        onShare={handleCompartir}
        onDeleteRequest={() => {
          setMenuOpen(false);
          setConfirmDeleteOpen(true);
        }}
      />

      <RegisterInteractionSheet
        open={registerSheetOpen}
        clienteId={cliente._id}
        onClose={() => setRegisterSheetOpen(false)}
        onSaved={handleInteraccionSaved}
      />

      <RecordatorioSheet
        open={recordatorioSheetOpen}
        clienteId={cliente._id}
        recordatorio={recordatorioEditando}
        onClose={() => setRecordatorioSheetOpen(false)}
        onSaved={handleRecordatorioSaved}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title={`¿Eliminar a ${cliente.nombre}?`}
        description="Esta acción no se puede deshacer. Se eliminará el cliente y sus recordatorios e interacciones asociadas."
        confirmLabel="Sí, eliminar cliente"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />

      <ConfirmDialog
        open={confirmHechoTarget !== null}
        title="¿Marcar como hecho?"
        description={confirmHechoTarget?.motivo}
        confirmLabel="Marcar como hecho"
        onConfirm={handleConfirmHecho}
        onCancel={() => setConfirmHechoTarget(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function RecordatorioRow({
  recordatorio,
  onMarkDone,
  onEdit,
}: {
  recordatorio: RecordatorioPendiente;
  onMarkDone: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={`rounded-[10px] px-3.5 py-3 ${
        recordatorio.overdue ? "bg-risk-bg" : "border border-border-subtle bg-bg-app"
      }`}
    >
      <p className="text-sm font-medium text-text-primary">
        {recordatorio.motivo}
      </p>
      <p
        className={`mt-1 text-xs ${
          recordatorio.overdue ? "text-red-600" : "text-text-tertiary"
        }`}
      >
        {formatFechaRecordatorio(
          recordatorio.fecha,
          recordatorio.overdue,
          recordatorio.diasVencido,
        )}
      </p>
      <div className="mt-2.5 flex gap-4">
        <button
          type="button"
          onClick={onMarkDone}
          className="text-xs font-medium text-primary-600"
        >
          Marcar como hecho
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-text-secondary"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

function InteraccionRow({ interaccion }: { interaccion: Interaccion }) {
  const Icon = TIPO_INTERACCION_ICONOS[interaccion.tipo];
  return (
    <div className="flex gap-2.5 rounded-[10px] border border-border-subtle bg-bg-app px-3.5 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-text-primary">
            {TIPO_INTERACCION_LABELS[interaccion.tipo]}
          </span>
          <span className="shrink-0 text-xs text-text-tertiary">
            {formatFechaCorta(interaccion.fecha)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          {interaccion.notas}
        </p>
        {interaccion.proximo_paso_texto ? (
          <p className="mt-1.5 text-xs text-primary-600">
            Próximo paso: {interaccion.proximo_paso_texto}
            {interaccion.proximo_paso_fecha
              ? ` · ${formatFechaCorta(interaccion.proximo_paso_fecha)}`
              : ""}
          </p>
        ) : null}
      </div>
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
