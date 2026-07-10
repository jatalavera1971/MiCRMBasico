"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ROL_LABEL } from "@/lib/constants";

/**
 * P9 · Admin — Usuarios y roles — JOS-62. Solo Dueña (la propia query
 * `users.list` en Convex ya lo exige server-side, ver convex/users.ts).
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Admin · Usuarios y Roles.dc.html
 * TODO: bottom sheet "Nuevo usuario" — bloqueado por el flujo de invitación
 * por email (ver TODO en convex/users.ts).
 */
export default function AdminUsuariosPage() {
  const usuarios = useQuery(api.users.list);
  const setStatus = useMutation(api.users.setStatus);
  const usuarioActual = useQuery(api.users.current);

  if (usuarios === undefined) return <div className="p-8 text-body-sm text-ink-muted">Cargando…</div>;

  const activos = usuarios.filter((u) => u.status !== "inactivo");
  const inactivos = usuarios.filter((u) => u.status === "inactivo");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-lg">Usuarios y roles</h1>
        <Button size="sm" disabled title="Pendiente: flujo de invitación por email (ver convex/users.ts)">
          Nuevo usuario
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {activos.map((u) => (
          <Card key={u._id} className="flex items-center gap-3">
            <Avatar nombre={u.name ?? "?"} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-body-sm-strong truncate">{u.name}</p>
              <p className="text-caption text-ink-muted truncate">{u.email}</p>
            </div>
            {u.role && (
              <Badge colorClassName="bg-primary-50 text-ink-brand border border-primary-200">
                {ROL_LABEL[u.role]}
              </Badge>
            )}
            {u.role !== "duena" && u._id !== usuarioActual?._id && (
              <Button variant="ghost" size="sm" onClick={() => setStatus({ id: u._id, status: "inactivo" })}>
                Desactivar
              </Button>
            )}
          </Card>
        ))}
      </div>

      {inactivos.length > 0 && (
        <details className="flex flex-col gap-2">
          <summary className="text-label text-ink-muted cursor-pointer">
            Inactivos ({inactivos.length})
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            {inactivos.map((u) => (
              <Card key={u._id} className="flex items-center gap-3 opacity-60">
                <Avatar nombre={u.name ?? "?"} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm-strong truncate">{u.name}</p>
                  <p className="text-caption text-ink-muted truncate">{u.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStatus({ id: u._id, status: "activo" })}>
                  Reactivar
                </Button>
              </Card>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
