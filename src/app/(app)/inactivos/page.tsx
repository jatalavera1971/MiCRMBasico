import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const dynamic = "force-dynamic";

export default async function InactivosPage() {
  const clientes = await fetchQuery(api.clientes.listarClientesInactivos, {});

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-text-primary">
        Clientes inactivos
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        P7 (Lista de clientes inactivos) — fuera de alcance de esta pantalla,
        solo destino de navegación desde el banner de P1. Datos reales sin
        estilo:
      </p>
      <ul className="mt-4 list-disc pl-5 text-sm">
        {clientes.map((c) => (
          <li key={c._id}>
            {c.nombre} ({c.empresa ?? "sin empresa"}) — último contacto:{" "}
            {new Date(c.fecha_ultimo_contacto!).toISOString().slice(0, 10)}
          </li>
        ))}
      </ul>
    </div>
  );
}
