"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { ArrowLeft, Phone, MessageCircle, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FaseSelector } from "@/components/pipeline/FaseSelector";
import { ClienteFormSheet } from "@/components/clientes/ClienteFormSheet";
import { InteraccionFormSheet } from "@/components/interacciones/InteraccionFormSheet";
import { RecordatorioFormSheet } from "@/components/recordatorios/RecordatorioFormSheet";
import {
  CANAL_LABEL,
  PRIORIDAD_BADGE,
  PRIORIDAD_LABEL,
  TIPO_INTERACCION_COLOR,
  TIPO_INTERACCION_LABEL,
} from "@/lib/constants";

/**
 * P3 · Ficha de cliente — JOS-11 (F1 + F4 + F6 + F9 + F16 + Mejora 1).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Ficha · Cliente.dc.html
 * (usa las 6 fases de convex/schema.ts, no la taxonomía de la maqueta — ver JOS-11).
 */
export default function FichaClientePage({
  params,
}: {
  params: Promise<{ clienteId: Id<"clientes"> }>;
}) {
  const { clienteId } = use(params);
  const cliente = useQuery(api.clientes.get, { id: clienteId });
  const interacciones = useQuery(api.interacciones.listByCliente, { clienteId });
  const recordatorio = useQuery(api.recordatorios.proximoDeCliente, { clienteId });

  const [editarAbierto, setEditarAbierto] = useState(false);
  const [interaccionAbierta, setInteraccionAbierta] = useState(false);
  const [recordatorioAbierto, setRecordatorioAbierto] = useState(false);

  if (cliente === undefined) return <div className="p-8 text-body-sm text-ink-muted">Cargando…</div>;
  if (cliente === null) return <div className="p-8 text-body-sm text-ink-muted">Cliente no encontrado.</div>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 md:p-8">
      <Link href="/clientes" className="flex items-center gap-1.5 text-body-sm-strong text-ink-brand w-fit">
        <ArrowLeft size={16} /> Clientes
      </Link>

      <div className="flex items-center gap-4">
        <Avatar nombre={cliente.nombre} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge colorClassName={PRIORIDAD_BADGE[cliente.prioridad]}>
              {PRIORIDAD_LABEL[cliente.prioridad]}
            </Badge>
            <h1 className="text-heading-md truncate">{cliente.nombre}</h1>
          </div>
          {cliente.empresa && <p className="text-body-sm text-ink-secondary">{cliente.empresa}</p>}
        </div>
        <Button variant="secondary" size="sm" onClick={() => setEditarAbierto(true)}>
          Editar
        </Button>
      </div>

      <div className="flex gap-2">
        {cliente.telefono && (
          <a href={`tel:${cliente.telefono}`}>
            <Button variant="secondary" size="sm">
              <Phone size={14} /> Llamar
            </Button>
          </a>
        )}
        {cliente.telefono && (
          <a href={`https://wa.me/${cliente.telefono.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">
              <MessageCircle size={14} /> WhatsApp
            </Button>
          </a>
        )}
        {cliente.email && (
          <a href={`mailto:${cliente.email}`}>
            <Button variant="secondary" size="sm">
              <Mail size={14} /> Email
            </Button>
          </a>
        )}
      </div>

      <Card className="flex flex-col gap-1 text-body-sm">
        {cliente.email && <p>{cliente.email}</p>}
        {cliente.telefono && <p>{cliente.telefono}</p>}
        {cliente.canalPreferido && (
          <p className="text-ink-secondary">Canal preferido: {CANAL_LABEL[cliente.canalPreferido]}</p>
        )}
        {cliente.notas && <p className="mt-2 whitespace-pre-wrap text-ink-secondary">{cliente.notas}</p>}
      </Card>

      <section className="flex flex-col gap-2">
        <h2 className="text-heading-sm">Pipeline</h2>
        <FaseSelector clienteId={cliente._id} faseActual={cliente.fasePipeline} />
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-sm">Próximo recordatorio</h2>
          <Button variant="ghost" size="sm" onClick={() => setRecordatorioAbierto(true)}>
            <Plus size={14} /> {recordatorio ? "Editar" : "Añadir"}
          </Button>
        </div>
        {recordatorio ? (
          <Card className="bg-primary-50">
            <p className="text-body-sm-strong">{recordatorio.motivo}</p>
            <p className="text-caption text-ink-muted">{new Date(recordatorio.fecha).toLocaleString("es-ES")}</p>
          </Card>
        ) : (
          <p className="text-body-sm text-ink-muted">Sin recordatorio activo.</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-sm">Historial</h2>
          <Button size="sm" onClick={() => setInteraccionAbierta(true)}>
            <Plus size={14} /> Registrar interacción
          </Button>
        </div>

        {interacciones?.length === 0 && (
          <p className="text-body-sm text-ink-muted">
            Aún no hay interacciones · Registra tu primera llamada, mensaje o email
          </p>
        )}

        <div className="flex flex-col gap-2">
          {interacciones?.map((i) => (
            <div
              key={i._id}
              className="rounded-r-xl border border-border bg-surface p-3.5 shadow-card"
              style={{ borderLeft: `3px solid ${TIPO_INTERACCION_COLOR[i.tipo]}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-body-sm-strong">{TIPO_INTERACCION_LABEL[i.tipo]}</span>
                <span className="text-caption text-ink-muted">{new Date(i.fecha).toLocaleDateString("es-ES")}</span>
              </div>
              <p className="mt-1 text-body-sm text-ink-secondary">{i.quePaso}</p>
              {i.proximoPaso && (
                <p className="mt-2 rounded-md bg-primary-50 px-3 py-2 text-caption text-success-text">
                  PRÓXIMO PASO · {i.proximoPaso}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <ClienteFormSheet open={editarAbierto} onClose={() => setEditarAbierto(false)} cliente={cliente} />
      <InteraccionFormSheet
        open={interaccionAbierta}
        onClose={() => setInteraccionAbierta(false)}
        clienteId={cliente._id}
      />
      <RecordatorioFormSheet
        open={recordatorioAbierto}
        onClose={() => setRecordatorioAbierto(false)}
        clienteId={cliente._id}
        recordatorio={recordatorio ?? undefined}
      />
    </div>
  );
}
