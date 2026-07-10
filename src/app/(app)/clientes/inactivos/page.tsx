"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { DIAS_INACTIVIDAD } from "@/lib/constants";

/**
 * P7 · Clientes inactivos — JOS-26 (F11). Sin acceso directo desde la nav
 * principal: se llega desde la alerta de P1 o un filtro en P2.
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Clientes · Inactivos.dc.html
 */
export default function ClientesInactivosPage() {
  const clientes = useQuery(api.clientes.listInactivos);

  // Inicializador perezoso de useState: captura el instante de montaje una
  // sola vez, sin leer Date.now() de forma impura en cada render.
  const [ahora] = useState(() => Date.now());

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 md:p-8">
      <Link href="/inicio" className="flex items-center gap-1.5 text-body-sm-strong text-ink-brand w-fit">
        <ArrowLeft size={16} /> Inicio
      </Link>
      <h1 className="text-heading-lg">Clientes inactivos</h1>

      {clientes?.length === 0 && (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          Todo al día · Todos tus clientes tienen actividad en los últimos {DIAS_INACTIVIDAD} días.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {clientes?.map((c) => {
          const dias = c.fechaUltimoContacto
            ? Math.floor((ahora - c.fechaUltimoContacto) / (24 * 60 * 60 * 1000))
            : null;
          return (
            <Link key={c._id} href={`/clientes/${c._id}`}>
              <Card className="bg-risk-bg border-risk-border">
                <p className="text-body-sm-strong">{c.nombre}</p>
                {c.empresa && <p className="text-caption text-ink-muted">{c.empresa}</p>}
                <p className="mt-1 text-caption text-error-text">
                  {dias === null ? "Sin contacto registrado" : `${dias} días sin contacto`}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
