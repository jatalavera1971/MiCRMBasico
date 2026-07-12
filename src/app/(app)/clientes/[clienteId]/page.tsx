export default async function FichaClientePage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const { clienteId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-text-primary">
        Ficha de cliente
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        P3 (Ficha de cliente) — fuera de alcance de esta pantalla, solo
        destino de navegación desde la lista de tareas del día. Cliente:{" "}
        {clienteId}
      </p>
    </div>
  );
}
