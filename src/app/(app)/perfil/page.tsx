"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ROL_LABEL } from "@/lib/constants";

/**
 * P10 · Perfil de usuario — JOS-63. Accesible para cualquiera; "Gestión de
 * usuarios" solo aparece si el rol es Dueña.
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Perfil · Usuario.dc.html
 * TODO: bottom sheet "Cambiar contraseña" (requiere resolver el flujo de
 * cambio de contraseña con @convex-dev/auth — ver convex/users.ts).
 */
export default function PerfilPage() {
  const user = useQuery(api.users.current);
  const actualizarNombre = useMutation(api.users.updateName);
  const { signOut } = useAuthActions();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(false);

  if (!user) return <div className="p-8 text-body-sm text-ink-muted">Cargando…</div>;

  async function handleGuardarNombre(e: FormEvent) {
    e.preventDefault();
    await actualizarNombre({ name: nombre });
    setEditando(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar nombre={user.name ?? "?"} size="xl" />
        {editando ? (
          <form onSubmit={handleGuardarNombre} className="flex w-full gap-2">
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
            <Button type="submit" size="sm">
              Guardar
            </Button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setNombre(user.name ?? "");
              setEditando(true);
            }}
            className="text-heading-sm"
          >
            {user.name}
          </button>
        )}
        <p className="text-body-sm text-ink-muted">{user.email}</p>
        {user.role && <p className="text-caption text-ink-brand">{ROL_LABEL[user.role]}</p>}
      </div>

      <Card className="flex flex-col divide-y divide-border p-0">
        <div className="p-4 text-body-sm text-ink-secondary">Cambiar contraseña (próximamente)</div>
        {user.role === "duena" && (
          <Link href="/admin/usuarios" className="p-4 text-body-sm-strong text-ink-brand">
            Gestión de usuarios
          </Link>
        )}
      </Card>

      <Button
        variant="secondary"
        onClick={async () => {
          await signOut();
          router.push("/login");
        }}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
